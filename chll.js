import GetServers from "./im/servers"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"

/** @param {NS} ns */

const usedTxt = "forStanek1.txt"; // Stores the last saved fragment batch. see sg.js


export async function main(ns) {
	const servers = GetServers(ns);
	//ns.tprint(ns.read(usedTxt));
	let fragJSON = ns.read(usedTxt);

	let stats = { servers: 0, threads: 0 };
	ns.disableLog("scp");
	// ns.disableLog("exec");
	ns.disableLog("getServer");

	let arg0 = ns.args[0];

	// ns.tprint(arg);
	if (arg0 == "k") {
		await ns.sleep(200);
		KillCharge(ns, servers);
	} else if (arg0 == "kh") {
		KillCharge(ns, servers, true);
	} else if (arg0 == "h") {
		await TestFragments(ns, JSON.parse(fragJSON));
		await ChargeServers(ns, servers, fragJSON, stats, false);
	} else {
		await TestFragments(ns, JSON.parse(fragJSON));
		await ChargeServers(ns, servers, fragJSON, stats, true);
	}


	ns.tprint("chll.js end " + new Date().toLocaleString());
}

// Tests the first fragment, to avoid error pileup
async function TestFragments(ns, frags) {
	for (let i = 0; i < frags.length; i++) {
		const frag = frags[i];
		const { x, y, id } = frag;
		if (id > 99)
			continue;
		await ns.stanek.chargeFragment(x, y);
	}
}

async function ChargeServers(ns, servers, arg, stats, avoidHacknet) {
	ns.tprint(`Running test...`)
	await TestFragments(ns, JSON.parse(arg));
	ns.tprint(`Charging servers...`)

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		let serverObject = ns.getServer(server);
		let threads = Math.floor((serverObject.maxRam - serverObject.ramUsed) / 2)
		if (threads < 1)
			continue;
		if (server == "home")
			continue;
		if (avoidHacknet && server.startsWith("hacknet"))
			continue;
		else if (server.startsWith("hacknet"))
			ns.tprint(`chrg.js on ${server} w/ ${threads}`);

		ns.scp("chrg.js", server);
		if (ns.exec("chrg.js", server, threads, arg) > 0) {
			stats.servers += 1;
			stats.threads += threads;
			// ns.tprint(`${stats.servers} ${stats.threads}`)
		}
	}
	ns.tprint(`Executed chrg.js on ${stats.servers} servers. Total threads: ${stats.threads}`)
}

function KillCharge(ns, servers, onlyHacknet) {
	ns.tprint(`Killing charge scripts...`)
	let killStat = 0;
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		if (onlyHacknet && !server.startsWith("hacknet"))
			continue;

		ns.scp("chrg.js", server);
		if (ns.scriptKill("chrg.js", server)) killStat++
	}
	ns.tprint(`Killed ${killStat} scripts.`);
}
