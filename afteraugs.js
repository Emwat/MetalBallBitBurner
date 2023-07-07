import GetTargets from "/im/topTarget"
import GetTarget from "./im/target"
import GetServers from "./im/servers"
import GetProgramLevel from "./im/files"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"

/** @param {NS} ns */
export async function main(ns) {
	const myScript = "alph.js";
	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingLevel = ns.getHackingLevel();
	const servers = GetServers(ns);
	const defaultTarget = GetTarget(ns);

	let execStat = 0;
	let serverWithMostMoney = { hostname: "", moneyMax: 0 };
	ns.disableLog("scp");
	ns.disableLog("exec");
	ns.disableLog("getServer");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMinSecurityLevel");

	ns.tprint(`Gaining admin access and applying ${myScript} to servers...`)

	ns.tprint(
		" # " +
		" pt" +
		StrLeft("hak/min", 7) +
		" name"
	);
	// ns.exec("power.js", "home", 1);

	if (myHackingLevel == 1)
		ns.exec("crack.js", "home", 1, "n00dles");

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		const serverObject = ns.getServer(server);
		const isAboveMyProgramsLevel = serverObject.numOpenPortsRequired > myProgramsLevel;
		const isTooStrong = serverObject.hackDifficulty > myHackingLevel;
		let target = defaultTarget;
		let targetObject = null;

		if (server == "home")
			continue;

		if (isAboveMyProgramsLevel)
			continue;

		if (isTooStrong)
			continue;

		if (serverObject.hasAdminRights)
			continue;
		else
			ns.exec("crack.js", "home", 1, server)

		if (myHackingLevel < 100) {
			target = "n00dles";
		}

		if (target == undefined) {
			target = server;
		}

		targetObject = ns.getServer(target);

		if (targetObject.moneyMax == 0)
			continue;


		// if (AlphExec(ns, server, target) > 0) {
		// 	ns.print(`${myScript} ${server} ${target}`);
		// 	execStat++;
		// 	if (targetObject.moneyMax > serverWithMostMoney.moneyMax)
		// 		serverWithMostMoney = targetObject;

		// 	ns.tprint(
		// 		NumLeft(execStat, 3) +
		// 		StrLeft(serverObject.numOpenPortsRequired, 2) +
		// 		StrLeft(Math.floor(serverObject.hackDifficulty) + "/" + serverObject.minDifficulty, 7) +

		// 		//NumLeft(serverObject.hackDifficulty, 4) +
		// 		StrLeft(server, 20) +
		// 		""
		// 	);

		// 	if (server == "n00dles") {
		// 		ns.exec("weak.js", server, 1, server);
		// 	}
		// }


	}
	// ns.tprint(`Applied ${myScript} to ${execStat} servers of ${servers.length}.`);
	// if (serverWithMostMoney.hostname != "")
	// 	ns.tprint(`Server with the Most Money: ${serverWithMostMoney.hostname} ${serverWithMostMoney.moneyMax}`);

	ns.tprint("afteraugs.js end " + new Date().toLocaleString());

}
