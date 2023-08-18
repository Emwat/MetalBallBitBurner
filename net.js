import ToDollars from './im/carat'
import GetMostAffordableNode from './im/nodeCosts'

// 8 nodes, level 100, -$3.5m
// 8 nodes, level 200, -$173m
// 8 nodes, level 200, ram 16, -$178m
// 8 nodes, level 200, ram 64, -$207m
// 8 nodes, level 200, ram 64, 8 cores, -$304m

// 20 nodes, level 200, ram 64, 16 cores. -$6.5b


// c argument fails rn 08/05/2023 08:47 AM

let numberOfNodes = 0;
let fs = 0;
let failSafeCap = 999;

// let lrc = {
// 	l : {
// 		text: "level",
// 		med: 100,
// 		max: 200,
// 		cost: "getLevelUpgradeCost",
// 		upgrade: "upgradeLevel"
// 	},
// 	r : {
// 		text: "ram",
// 		med: 64,
// 		max: 8192,
// 		cost: "getRamUpgradeCost",
// 		upgrade: "upgradeRam"
// 	},
// 	c : {
// 		text: "core",
// 		med: 8,
// 		max: 8,
// 		cost: "getCoreUpgradeCost",
// 		upgrade: "upgradeCore",
// 	}, 
// }

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");
	ns.tprint(`Activating Hacknet program ${(ns.args.length > 0 ? ns.args[0] : "default")}`);

	numberOfNodes = ns.hacknet.numNodes();

	if (ns.args.length == 0 || ns.args[0] == "help") {
		ns.tprint(`
		[n/node/nodes] [X]>> buy until you reach X nodes
			run net.js n 4
		maxout >> focus on buying max nodes and then fully upgrade them 200/16/8
			run net.js maxout
		[l/r/c] [X/max] >> focus on l/r/c and upgrade to level X.
			run net.js l 100
			run net.js r 8

		`);
		return;
	}

	let indexN = Math.max(
		ns.args.indexOf("n"),
		ns.args.indexOf("node"),
		ns.args.indexOf("nodes")
	);
	if (indexN > -1) {
		let number = ns.args[indexN + 1];
		// if (number == "max")
		// 	await PurchaseNodes(ns, numberOfNodes);
		// else
		await PurchaseNodes(ns, number);
		numberOfNodes = ns.hacknet.numNodes();

	}

	let actions = "lrc".split("");
	for (let i = 0; i < ns.args.length; i++) {
		let action = ns.args[i];
		if (!actions.includes(action))
			continue;
		let index = ns.args.indexOf(action);
		if (index > -1) {
			let number = ns.args[index + 1];
			if (!number)
				continue;
			if (number == "max")
				await UpgradeNodes(ns, action, GetMaxAmount("l", true));
			else
				await UpgradeNodes(ns, action, number);
		}
	}

	ns.tprint(`net.js ended.`)
}

function myMoney(ns) {
	return ns.getServerMoneyAvailable("home");
}

/** @param {NS} ns */
async function PurchaseNodes(ns, numberOfNodesToBuy) {
	ns.tprint(`Purchasing ${numberOfNodesToBuy} nodes...`)

	while (ns.hacknet.numNodes() < numberOfNodesToBuy) {
		fs++; if (fs >= failSafeCap) { FailSafely(ns); break; }
		let newNodeIndex = ns.hacknet.purchaseNode();
		if (newNodeIndex != -1) {
			ns.print("Purchased hacknet Node with index " + newNodeIndex);
		}

		if (myMoney(ns) < ns.hacknet.getPurchaseNodeCost())
			await ns.sleep(6000 * 60);
	};

	ns.tprint("All " + numberOfNodesToBuy + " nodes purchased")
}

/** @param {NS} ns */
async function UpgradeNodes(ns, arg, maxAmount) {
	ns.print(`UpgradeNodes(ns, numOfNodes: ${numberOfNodes}, arg: ${arg}, maxAmt: ${maxAmount})`);
	let levels = [];
	function IsStillUpgrading() {
		for (let i = 0; i < levels.length; i++) {
			if (levels[i] < maxAmount) {
				return true;
			}
		}
		return false;
	}

	for (var i = 0; i < numberOfNodes; i++) {
		levels.push(GetNodeArg(ns.hacknet.getNodeStats(i), arg));
	}

	let ex = 0;
	const failSafe = 999;
	while (IsStillUpgrading(maxAmount)) {
		ex++;
		if (ex > failSafe) {
			ns.tprint({ error: "IsStillUpgrading", levels, numberOfNodes, maxAmount });
			break;
		}
		for (var i = 0; i < numberOfNodes; i++) {
			let waitTime = 3000;

			if (GetNodeArg(ns.hacknet.getNodeStats(i), arg) >= maxAmount) {
				//await ns.sleep(30);
				continue;
			}

			const cost = GetUpgradeCost(ns, i, arg);

			if (cost == 0 || !isFinite(cost)) {
				ns.tprint(`error -> Cost: ${cost}` +
					` -> UpgradeNodes(ns, ${numberOfNodes}, ${arg}, ${maxAmount})`)
				throw "Blagh";
			}

			if (myMoney(ns) > cost && DoUpgrade(ns, i, arg)) {
				ns.print(`Node ${i} is now at ${arg} ${GetNodeArg(ns.hacknet.getNodeStats(i), arg)}`);
				levels[i] = GetNodeArg(ns.hacknet.getNodeStats(i), arg);
				waitTime = 0;
			} else {
				ns.print(`home: ${ToDollars(myMoney(ns))} / ${i} ${arg} cost: ${ToDollars(cost)}`)
			}

			await ns.sleep(waitTime);

			ex++;
			if (ex > failSafe) {
				ns.tprint(`error ${i} ${cost} ${GetNodeArg(ns.hacknet.getNodeStats(i), arg)} ${maxAmount}`);
				break;
			}
		}
	}
	ns.tprint(`All ${numberOfNodes} nodes upgraded to ${maxAmount} ${GetNodeText(arg)}`);
}

function GetNodeArg(node, arg) {
	if (false) { }
	else if (arg == "l")
		return node.level;
	else if (arg == "r")
		return node.ram;
	else if (arg == "c")
		return node.cores;

	throw (`error -> GetNodeArg(node: ${node}, arg: ${arg})`);
}

function GetNodeText(arg) {
	if (false) { }
	else if (arg == "l")
		return "level";
	else if (arg == "r")
		return "ram";
	else if (arg == "c")
		return "cores";

	throw (`error -> GetNodeText(arg: ${arg})`);
}

function GetUpgradeCost(ns, i, arg) {
	if (false) { }
	else if (arg == "l")
		return ns.hacknet.getLevelUpgradeCost(i, 1);
	else if (arg == "r")
		return ns.hacknet.getRamUpgradeCost(i, 1);
	else if (arg == "c")
		return ns.hacknet.getCoreUpgradeCost(i, 1);

	throw (`error -> GetUpgradeCost(ns, i: ${i}, arg: ${arg})`);
}

function DoUpgrade(ns, i, arg) {
	if (false) { }
	else if (arg == "l")
		return ns.hacknet.upgradeLevel(i, 1);
	else if (arg == "r")
		return ns.hacknet.upgradeRam(i, 1);
	else if (arg == "c")
		return ns.hacknet.upgradeCore(i, 1);

	throw (`error -> DoUpgrade(ns, i: ${i}, arg: ${arg})`);
}

function GetMaxAmount(arg, goAllTheWay) {
	const theMaxLevel = 200;
	const theMaxRam = 64; //or 8192?
	const theMaxCores = 16;

	let maxLevel = 200;
	let maxRam = 16;
	let maxCores = 8;

	if (goAllTheWay) {
		maxLevel = theMaxLevel;
		maxRam = theMaxRam;
		maxCores = theMaxCores;
	}

	if (false) { }
	else if (arg == "l")
		return maxLevel;
	else if (arg == "r")
		return maxRam;
	else if (arg == "c")
		return maxCores;

	throw (`error -> GetMaxAmount(arg: ${arg})`);
}

/** @param {NS} ns */
async function BuyMaxNodes(arg) {

	if (arg == "max") {
		const i = GetMostAffordableNode(ns);
		if (i == undefined) {
			ns.tprint(`MostAffordableNode is undefined.`)
			ns.tprint(`net.js ended.`)
			return;
		}
		ns.tprint(`Most affordable node index is ${i}.`)
		await PurchaseNodes(ns, i);
		await UpgradeNodes(ns, i, "l", GetMaxAmount("l", true));
		await UpgradeNodes(ns, i, "r", GetMaxAmount("r", true));
		await UpgradeNodes(ns, i, "c", GetMaxAmount("c", true));
		ns.tprint(`net.js ended.`)
		return;
	}
}

function FailSafely(ns, location) {
	ns.tprint({ loc: location, error: "Failed safely." });
}