/** @param {NS} ns */
import AlphExec from "./im/exec"
import GetServers from "./im/servers"

export async function main(ns) {
	const servers = GetServers(ns);
	HackSelfEverywhere(ns, servers);
}

function HackSelfEverywhere(ns, servers) {
	let myHackingLevel = ns.getHackingLevel();
	for (let i = 0; i < servers.length; i++) {
		let server = ns.getServer(servers[i]);

		if (server.maxRam <= 0)
			continue;
		
		if (server.hostname == "home")
			continue;

		if (server.hostname.startsWith("pserv"))
			continue;

		if (!server.hasAdminRights)
			continue;

		if (server.requiredHackingSkill > myHackingLevel)
			continue;


		ns.scp("alph.js", server.hostname);
		AlphExec(ns, server.hostname, server.hostname, 1);

	}
}
