import GetTargets from "/im/topTarget"
import GetTarget from "./im/target"
import GetServers from "./im/servers"
import GetProgramLevel from "./im/files"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"
import colors from './im/visual'

/** @param {NS} ns */
export async function main(ns) {
	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingLevel = ns.getHackingLevel();
	const servers = GetServers(ns);
	// const home = ns.getServer("home");
	// const homeRam = home.maxRam - home.ramUsed;
	let stats = 0;
	// if (homeRam < 2) {
	// 	ns.tprint(`\u001b[33m ##### ######################## #####`)
	// 	ns.tprint(`\u001b[33m ##### Home has ${homeRam} ram! #####`)
	// 	ns.tprint(`\u001b[33m ##### ######################## #####`)
	// }
	// ns.disableLog("exec");
	ns.disableLog("getServer");

	// ns.exec("power.js", "home", 1);

	if (myHackingLevel == 1)
		ns.exec("crack.js", "home", 1, "n00dles");

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		const serverObject = ns.getServer(server);
		const isAboveMyProgramsLevel = serverObject.numOpenPortsRequired > myProgramsLevel;

		// if (serverObject.numOpenPortsRequired == myProgramsLevel)
		// 	ns.tprint(`${StrLeft(server, 25)} ` +
		// 		` prog: ${isAboveMyProgramsLevel ? 1 : " "}` +
		// 		` admin: ${serverObject.hasAdminRights ? 1 : " "}`)

		if (server == "home")
			continue;

		if (isAboveMyProgramsLevel)
			continue;

		if (serverObject.hasAdminRights)
			continue;

		Crack(ns, server);
		if (ns.getServer(server).hasAdminRights)
			stats++;
	}
	ns.tprint(`Programs: ${myProgramsLevel} - Cracked ${stats} servers`);
	ns.tprint("afteraugs.js end " + new Date().toLocaleString());
}

function Crack(ns, target){
	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(target);
	}

	if (ns.fileExists("FTPCrack.exe", "home")) {
		ns.ftpcrack(target);
	}

	if (ns.fileExists("relaySMTP.exe", "home")) {
		ns.relaysmtp(target);
	}

	if (ns.fileExists("HTTPWorm.exe", "home")) {
		ns.httpworm(target);
	}

	if (ns.fileExists("SQLInject.exe", "home")) {
		ns.sqlinject(target);
	}

	ns.nuke(target);
}