import GetServers from "./im/servers"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"

/** @param {NS} ns */

let arg = `[{"id":5,"x":0,"y":0,"highestCharge":0,"numCharge":0,"rotation":1},{"id":0,"x":0,"y":3,"highestCharge":100,"numCharge":1207.01,"rotation":0},{"id":101,"x":2,"y":0,"highestCharge":0,"numCharge":0,"rotation":0},{"id":100,"x":2,"y":1,"highestCharge":0,"numCharge":0,"rotation":0},{"id":101,"x":2,"y":3,"highestCharge":0,"numCharge":0,"rotation":2},{"id":1,"x":4,"y":1,"highestCharge":100,"numCharge":1203,"rotation":3}]`

export async function main(ns) {
	const servers = GetServers(ns);

	let statServers = 0;
	let statThreads = 0;
	ns.disableLog("scp");
	// ns.disableLog("exec");
	ns.disableLog("getServer");

	ns.tprint(`Fylling up servers...`)
	// arg = ns.args[0];
	if (!arg) {
		ns.tprint("Fail. No argument provided.");
		return;
	}

	// ns.tprint(arg);
	let { x, y } = JSON.parse(arg)[0];
	await ns.stanek.chargeFragment(x, y);

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		let serverObject = ns.getServer(server);
		let threads = Math.floor((serverObject.maxRam - serverObject.ramUsed) / 2)
		if (threads < 1)
			continue;
		if (server == "home")
			continue;

		ns.scp("chrg.js", server);
		if (ns.exec("chrg.js", server, threads, arg) > 0) {
			statServers++
			statThreads += threads;
		}
	}
	ns.tprint(`Executed chrg.js on ${statServers} servers. Total threads: ${statThreads}`)
	ns.tprint("fyll.js end " + new Date().toLocaleString());
}