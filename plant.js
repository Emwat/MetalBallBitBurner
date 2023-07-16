import GetTargets from "/im/topTarget"
import GetTarget from "./im/target"
import GetServers from "./im/servers"
import GetProgramLevel from "./im/files"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"

/** @param {NS} ns */
export async function main(ns) {
	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingLevel = ns.getHackingLevel();
	const servers = GetServers(ns);
	ns.disableLog("exec");
	ns.disableLog("getServer");

	// ns.exec("power.js", "home", 1);

	if (myHackingLevel == 1)
		ns.exec("crack.js", "home", 1, "n00dles");

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		const serverObject = ns.getServer(server);
		const isAboveMyProgramsLevel = serverObject.numOpenPortsRequired > myProgramsLevel;

		if (server == "home")
			continue;

		if (isAboveMyProgramsLevel)
			continue;

		if (serverObject.hasAdminRights)
			continue;
		
		ns.exec("crack.js", "home", 1, server)
	}

	ns.tprint("afteraugs.js end " + new Date().toLocaleString());
}
