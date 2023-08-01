import ToDollars from './im/carat'
import GetMostAffordableNode from './im/nodeCosts'

// 8 nodes, level 100, -$3.5m
// 8 nodes, level 200, -$173m
// 8 nodes, level 200, ram 16, -$178m
// 8 nodes, level 200, ram 64, -$207m
// 8 nodes, level 200, ram 64, 8 cores, -$304m

// 20 nodes, level 200, ram 64, 16 cores. -$6.5b





export async function main(ns) {

	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");
	ns.tprint(`Activating Hacknet program ${(ns.args.length > 0 ? ns.args[0] : "default")}`);
	let arg = ns.args[0];
	let number = ns.args[1];
	let count = 8;
	function GetMaxAmount(arg, goAllTheWay) {
		const theMaxLevel = 200;
		const theMaxRam = 64;
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

	

	if (arg == "help") {
		ns.tprint(`
	net.js [arg] [number]
		if arg is Number
			focus on buying X nodes
		if arg is "max"
			focus on buying max nodes and then fully upgrade them 200/16/8
		if arg is "o" or "owned"
			limit yourself to owned nodes and upgrade to level N. If N is not provided, default to full upgrade.
		if arg is l/r/c
			focus on l/r/c and upgrade to level N. If N is not provided, default to full upgrade.

		`);
		return;
	}

	// if the argument is a number, focus on buying that many nodes
	if (!isNaN(arg)) {
		await PurchaseNodes(ns, arg);
		if (number == "max") {
			await UpgradeNodes(ns, arg, "l", GetMaxAmount("l", true));
			await UpgradeNodes(ns, arg, "r", GetMaxAmount("r", true));
			await UpgradeNodes(ns, arg, "c", GetMaxAmount("c", true));
		}
		ns.tprint(`net.js ended.`)
		return;
	}

	// if (["node", "nodes"].includes(arg)) {
	// 	const i = GetMostAffordableNode(ns);
	// 	if (i == undefined) {
	// 		ns.tprint(`MostAffordableNode is undefined.`)
	// 		ns.tprint(`net.js ended.`)
	// 		return;
	// 	}
	// 	ns.tprint(`Most affordable node index is ${i}.`)
	// 	await PurchaseNodes(ns, i);
	// 	return;
	// }


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




	let ownedNodes = ns.hacknet.numNodes();
	if (arg == "o" || arg == "owned") {
		count = ownedNodes;
	}
	else if (ownedNodes < count) {
		await PurchaseNodes(ns, count);
	}
	else
		count = ownedNodes;

	if (!isValidAction(arg)) {
		await UpgradeNodes(ns, count, "l", 100);
	} else {
		await UpgradeNodes(ns, count, arg, number ?? GetMaxAmount(arg));
	}


	// // UPGRADE RAM
	// if (ns.args[0] == "r") {
	// 	await UpgradeRam(ns, cnt, maxRam);
	// }

	// // UPGRADE CORES
	// if (ns.args[0] == "c") {
	// 	await UpgradeCores(ns, cnt, maxCores);
	// }


	ns.tprint(`net.js ended.`)

}
function myMoney(ns) {
	return ns.getServerMoneyAvailable("home");
}

function isValidAction(action) {
	return action == "l" || action == "r" || action == "c";
}

async function PurchaseNodes(ns, numberOfNodes) {
	ns.tprint(`Purchasing ${numberOfNodes} nodes...`)
	let res = null;

	while (ns.hacknet.numNodes() < numberOfNodes) {
		res = ns.hacknet.purchaseNode();
		if (res != -1) {
			ns.print("Purchased hacknet Node with index " + res);
		}
		await ns.sleep(1000);
	};

	ns.tprint("All " + numberOfNodes + " nodes purchased")
}

async function UpgradeNodes(ns, numberOfNodes, arg, maxAmount) {
	ns.print(`UpgradeNodes(ns, numOfNodes: ${numberOfNodes}, arg: ${arg}, maxAmt: ${maxAmount})`);
	let levels = [];
	function IsStillUpgradingB(levels, numberOfNodes, maxLevel, arg) {
		const allNodesMaxLevel = numberOfNodes * maxLevel;
		const allNodesCurrentLevel = levels.reduce((a, b) => a + b, 0);

		ns.print(`${allNodesMaxLevel} ${allNodesCurrentLevel}`);
		return allNodesCurrentLevel < allNodesMaxLevel;
	}
	function IsStillUpgrading(levels, numberOfNodes, maxLevel, arg) {
		let remainingLevels = levels.filter(f => { return f < maxLevel });
		let allNodesMaxLevel = remainingLevels.length * maxLevel;
		let allNodesCurrentLevel = remainingLevels.reduce((a, b) => a + b, 0);

		ns.print(`${remainingLevels.length} ${allNodesMaxLevel} ${allNodesCurrentLevel}`);
		return allNodesCurrentLevel < allNodesMaxLevel;
	}


	for (var i = 0; i < numberOfNodes; i++) {
		levels.push(GetNodeArg(ns.hacknet.getNodeStats(i), arg));
	}

	while (IsStillUpgrading(levels, numberOfNodes, maxAmount, arg)) {
		let ex = 0;
		const maxEx = 9999;
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
				throw "Blagh"
				await ns.sleep(30);
				break;
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
			if (ex > maxEx) {
				ns.tprint(`error ${i} ${cost} ${GetNodeArg(ns.hacknet.getNodeStats(i), arg)} ${maxAmount}`);
				break;
			}
		}
	}
	ns.tprint(`All ${numberOfNodes} nodes upgraded to ${maxAmount}`);
}

function GetNodeArg(node, arg) {
	if (false) { }
	else if (arg == "l")
		return node.level;
	else if (arg == "r")
		return node.ram;
	else if (arg == "c")
		return node.cores;

	throw (`error -> GetNodeArg(i: ${node}, arg: ${arg})`);
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
