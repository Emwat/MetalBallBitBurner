import GetTargets from "/im/topTarget"
import GetTarget from "./im/target"
import AlphExec from "./im/exec" // CopyNukeExe(ns, myScript, targetHost, targetMoney)
import GetServers from "./im/servers"
import GetProgramLevel from "./im/files"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"

/** @param {NS} ns */
const coreScriptRam = 1.75;

export async function main(ns) {
	const myScript = "alph.js";
	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingLevel = ns.getHackingLevel();
	const servers = GetServers(ns);
	const defaultTarget = GetTarget(ns);

	let execStat = 0;
	let serverWithMostMoney = { hostname: "", moneyMax: 0 };
	ns.disableLog("scp");
	// ns.disableLog("exec");
	ns.disableLog("getServer");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMinSecurityLevel");

	ns.tprint(`Filling up servers...`)

	ns.tprint(
		" # " +
		" pt" +
		StrLeft("hak/min", 7) +
		" name"
	);
	ns.exec("power.js", "home", 1);

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		let serverObject = ns.getServer(server);
		const isAboveMyProgramsLevel = serverObject.numOpenPortsRequired > myProgramsLevel;
		const isTooStrong = serverObject.hackDifficulty > myHackingLevel;
		let target = server;
		let targetObject = null;
		ns.tprint(StrLeft(server, 20) +
			"	" + ns.formatNumber(serverObject.maxRam - serverObject.ramUsed, 2)
		);

		if (server == "home")
			continue;

		if (isAboveMyProgramsLevel)
			continue;

		if (myHackingLevel < 100) {
			target = "n00dles";
		}

		if (serverObject.moneyMax == 0)
			target = defaultTarget;

		if (isTooStrong)
			target = defaultTarget;

		targetObject = ns.getServer(target);

		if (AlphExec(ns, server, target) > 0) {
			ns.tprint(`on ${server}, ran ${myScript} ${target}`);
			execStat++;
			if (targetObject.moneyMax > serverWithMostMoney.moneyMax)
				serverWithMostMoney = targetObject;
		}

		serverObject = ns.getServer(server);
		if (serverObject.maxRam - serverObject.ramUsed >= coreScriptRam) {
			// exec(script, hostname, threadOrOptions, args) returns pid/0
			if (ns.exec("weak.js", server, 1, target) > 0)
				ns.tprint(`on ${server}, ran weak.js ${target}`);
		}


	}
	ns.tprint(`Applied ${myScript} to ${execStat} servers of ${servers.length}.`);
	if (serverWithMostMoney.hostname != "")
		ns.tprint(`Server with the Most Money: ${serverWithMostMoney.hostname} ${serverWithMostMoney.moneyMax}`);

	ns.tprint("fill.js end " + new Date().toLocaleString());
}
