/** @param {NS} ns */

// cost, incrementCost, Name
let upgrades = [
	[4, 0, "Sell for Money"]
	, [50, 50, "Reduce Minimum Security"]
	, [50, 50, "Increase Maximum Money"]
	, [50, 50, "Improve Gym Training"]
	, [100, 50, "Improve Studying"]
	, [100, 100, "Sell for Corporation Funds"]
	, [200, 100, "Exchange for Corporation Research"]
	, [250, 250, "Exchange for Bladeburner Rank"]
	, [250, 250, "Exchange for Bladeburner SP"]
	// , [200, 200, "Generate Coding Contract"]
	// , [400,, "Company Favor"]
];

let collections = {
	bb: ["Exchange for Bladeburner Rank", "Exchange for Bladeburner SP"],
	hacks: ["Reduce Minimum Security", "Increase Maximum Money"]
}

const waitTime = 1000 * 7;

export async function main(ns) {
	let arg0 = ns.args[0];
	let arg1 = ns.args[1];

	// ns.tprint(ns.hacknet.getHashUpgrades());
	if (!arg0) {
		ns.tprint(`No arguments applied. Acceptable arguments are
bm >> batch, Sell for Money
bs >> batch, Improve Studying
bh >> batch, Reduce Minimum Security
bo >> batch, Increase Maximum Money
k >> kill
`)
	} 
	else if (arg0 == "bb") { await BatchHash(ns, collections.bb, arg1); }
	else if (arg0 == "bh") { await BatchHash(ns, collections.hacks, arg1); }
	else if (arg0 == "bm") { await BatchHash(ns, "Sell for Money", ""); }
	else if (arg0 == "bg") { await BatchHash(ns, "Improve Gym Training", ""); }
	else if (arg0 == "bs") { await BatchHash(ns, "Improve Studying", ""); }
	else if (arg0 == "bo") { await BatchHash(ns, "Increase Maximum Money", arg1); }
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

async function BatchHash(ns, upgNameArg, upgTarget) {
	ns.tprint("WHILE LOOP. You must kill this process to end it.")
	let p = 0;
	let pTime = 30;
	let upgName = typeof upgNameArg == "string" ? upgNameArg : upgNameArg[0];
	while (true) {
		if (typeof upgNameArg == "object") {
			function ReduceMinCost(previousValue, currentValue, currentIndex, array) {
				let costA = GetCost(ns, previousValue);
				let costB = GetCost(ns, currentValue);
				return costA > costB ? previousValue : currentValue;
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
	let [cost, incrementCost, upgradeName] = upgrades.find(f => f[2] == upgName);
	let accumulatedCost = (incrementCost + extraAmount) * ns.hacknet.getHashUpgradeLevel(upgradeName);
	//ns.tprint(`Cost: ${cost} + ${accumulatedCost} (${incrementCost})`);
	return cost + accumulatedCost;
}