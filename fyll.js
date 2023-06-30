import GetServers from "./im/servers"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"

/** @param {NS} ns */

export async function main(ns) {
	const servers = GetServers(ns);

	let execStat = { i: 0, t: 0 };
	ns.disableLog("scp");
	// ns.disableLog("exec");
	ns.disableLog("getServer");

	ns.tprint(`Fylling up servers...`)

	// ns.tprint(
	// 	" # " +
	// 	" pt" +
	// 	StrLeft("hak/min", 7) +
	// 	" name"
	// );
	// ns.exec("power.js", "home", 1);

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		let serverObject = ns.getServer(server);
		let threads = Math.floor((serverObject.maxRam - serverObject.ramUsed) / 2)
		if (threads < 1)
			continue;
		if (server == "home")
			continue;

		ns.scp("chrg.js", server);
		if (ns.exec("chrg.js", server, threads) > 0) {
			execStat.i++
			execStat.t += threads;
		}
	}
	ns.tprint(`Executed chrg.js on ${execStat.i} servers. Total threads: ${execStat.t}`)
	ns.tprint("fyll.js end " + new Date().toLocaleString());
}