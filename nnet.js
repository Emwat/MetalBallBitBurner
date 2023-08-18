
// cost, incrementCost, Name
class HashFeature {
	constructor(cost, incrementCost, hasSecondArg, name) {
		this.cost = cost;
		this.incrementCost = incrementCost;
		this.hasSecondArg = hasSecondArg;
		this.upgradeName = name;
	}
}


let upgrades = [
	new HashFeature(4, 0, false, "Sell for Money")
	, new HashFeature(50, 50, true, "Reduce Minimum Security")
	, new HashFeature(50, 50, true, "Increase Maximum Money")
	, new HashFeature(50, 50, false, "Improve Gym Training")
	, new HashFeature(100, 50, false, "Improve Studying")
	, new HashFeature(100, 100, false, "Sell for Corporation Funds")
	, new HashFeature(200, 100, false, "Exchange for Corporation Research")
	, new HashFeature(250, 250, false, "Exchange for Bladeburner Rank")
	, new HashFeature(250, 250, false, "Exchange for Bladeburner SP")
	// , [200, 200, false, "Generate Coding Contract"]
	// , [400,, true, "Company Favor"]
];

let collections = {
	bb: ["Exchange for Bladeburner Rank", "Exchange for Bladeburner SP"],
	bit: ["Reduce Minimum Security", "Increase Maximum Money"],
	bcc: ["Sell for Corporation Funds", "Exchange for Corporation Research"]
}

const waitTime = 1000 * 7;

/** @param {NS} ns */
export async function main(ns) {
	let arg0 = ns.args[0];
	let arg1 = ns.args[1];



	// ns.tprint(ns.hacknet.getHashUpgrades());
	if (!arg0) {
		ns.tprint(`No arguments applied. Acceptable arguments are

		#### BATCH
	bm >> Sell for Money

	bb >> Exchange for Bladeburner Rank, Exchange for Bladeburner SP
	bit [server] >> Reduce Minimum Security and Increase Maximum Money
	bcc >> "Sell for Corporation Funds", "Exchange for Corporation Research"
	bh [server] >> Reduce Minimum Security
	bo [server] >> Increase Maximum Money
	bc >> Sell for Corporation Funds
	bg >> Improve Gym Training
	bs >> Improve Studying
	k >> kill all scripts on hacknet servers
`)
	}
	else if (arg0 == "bit") { await BatchHash(ns, collections[arg0], arg1); }
	else if (collections[arg0]) { await BatchHash(ns, collections[arg0]); }
	else if (arg0 == "bm") { await BatchHash(ns, "Sell for Money"); }
	else if (arg0 == "bg") { await BatchHash(ns, "Improve Gym Training"); }
	else if (arg0 == "bs") { await BatchHash(ns, "Improve Studying"); }
	else if (arg0 == "bh") { await BatchHash(ns, "Reduce Minimum Security", arg1); }
	else if (arg0 == "bo") { await BatchHash(ns, "Increase Maximum Money", arg1); }
	else if (arg0 == "bc") { await BatchHash(ns, "Sell for Corporation Funds", arg1); }
	else if (arg0 == "k") {
		let myServers = ns.scan("home").filter(f => f.startsWith("hacknet"));
		for (let i = 0; i < myServers.length; i++) {
			let server = myServers[i];
			ns.killall(server);
		}

	} else {
		ns.tprint(`Invalid argument.`)
	}

}

/** @param {NS} ns */
async function BatchHash(ns, upgNameArg, upgTarget = "") {
	ns.tprint("WHILE LOOP. You must kill this process to end it.")
	let p = 0;
	let pTime = 30;
	let upgName = typeof upgNameArg == "string" ? upgNameArg : upgNameArg[0];
	ns.tprint(upgNameArg);
	if (upgrades.find(upg => upg.upgradeName == upgName).hasSecondArg) {
		if (upgTarget == void 0) {
			ns.tprint(`USER ERROR - Missing argument: server`)
			return;
		}
		// try{
		// 	ns.getServer(upgTarget);
		// } catch {
		// 	ns.tprint(`${upgTarget} is not a valid server.`)
		// 	return;
		// }
	}
	// function ReduceMinCost(previousValue, currentValue, currentIndex, array) {
	// 	let costA = GetCost(ns, previousValue);
	// 	let costB = GetCost(ns, currentValue);
	// 	return costA > costB ? currentValue : previousValue;
	// }
	// ns.tprint(upgNameArg.reduce(ReduceMinCost))
	// ns.tprint(GetCost(ns, upgNameArg[0]))
	// ns.tprint(GetCost(ns, upgNameArg[1]))

	while (true) {
		if (typeof upgNameArg == "object") {
			function ReduceMinCost(previousValue, currentValue, currentIndex, array) {
				let costA = GetCost(ns, previousValue);
				let costB = GetCost(ns, currentValue);
				return costA > costB ? currentValue : previousValue;
			}
			upgName = upgNameArg.reduce(ReduceMinCost);
		}

		let cost = GetCost(ns, upgName);
		//if(ns.hacknet.numHashes() == ns.hacknet.hashCapacity()){
		if (ns.hacknet.numHashes() >= cost) {
			let count = 1;
			if (upgName == "Sell for Money")
				count = Math.floor(ns.hacknet.numHashes() / cost);
			// ns.tprint({count, cost});
			if (ns.hacknet.spendHashes(upgName, upgTarget, count)) {
				if (p >= pTime) {
					let level = ns.hacknet.getHashUpgradeLevel(upgName);
					ns.tprint(`${new Date().toLocaleTimeString()} spendHashes(${upgName}, ${upgTarget}, ${level})`);
					p = 0;
				}

			}
			// hashCost(upgName, count)
		}
		p++
		await ns.sleep(waitTime);
	}
}

function GetCost(ns, upgName, extraAmount = 0) {
	let { cost, incrementCost, upgradeName } = upgrades.find(f => f.upgradeName == upgName);
	let accumulatedCost = (incrementCost + extraAmount) * ns.hacknet.getHashUpgradeLevel(upgradeName);
	//ns.tprint(`Cost: ${cost} + ${accumulatedCost} (${incrementCost})`);
	return cost + accumulatedCost;
}