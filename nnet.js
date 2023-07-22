/** @param {NS} ns */

// cost, incrementCost, Name
let upgrades = [
	[4, 0, "Sell for Money"]
	//, [100, , "Sell for Corporation Funds"]
	, [50 ,50,"Reduce Minimum Security"]
	, [50 ,50,"Increase Maximum Money"]
	, [100, 50, "Improve Studying"]
	, [50 ,50,"Improve Gym Training"]
	// , [200,, "Exchange for Corporation Research"]
	, [250, 250, "Exchange for Bladeburner Rank"]
	// , [250,, "Exchange for Bladeburner SP"]
	// , [200, 200, "Generate Coding Contract"]
	// , [400,, "Company Favor"]
];


export async function main(ns) {
	let arg0 = ns.args[0];
	let arg1 = ns.args[1];
	let waitTime = 1000 * 7;

	// ns.tprint(ns.hacknet.getHashUpgrades());
	if (!arg0) {
		ns.tprint(`No arguments applied. Acceptable arguments are
bm >> batch, Sell for Money
bs >> batch, Improve Studying
bh >> batch, Reduce Minimum Security
bo >> batch, Increase Maximum Money
k >> kill
`)
	} else if (arg0 == "bm") { await BatchHash(ns, "Sell for Money", "", waitTime); }
	else if (arg0 == "bs") { await BatchHash(ns, "Improve Studying", "", waitTime); }
	else if (arg0 == "bg") { await BatchHash(ns, "Improve Gym Training", "", waitTime); }
	else if (arg0 == "bh") { await BatchHash(ns, "Reduce Minimum Security", arg1, waitTime); }
	else if (arg0 == "bo") { await BatchHash(ns, "Increase Maximum Money", arg1, waitTime); }
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

async function BatchHash(ns, upgName, upgTarget, waitTime) {
	ns.tprint("WHILE LOOP. You must kill this process to end it.")
	let p = 0;
	let pTime = 30;

	while (true) {
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