import GetTargets from "/im/topTarget"
import GetTarget from "./im/target"
import AlphExec from "./im/exec" // CopyNukeExe(ns, myScript, targetHost, targetMoney)
import GetServers from "./im/servers"
import GetProgramLevel from "./im/files"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"

/** @param {NS} ns */
export async function main(ns) {
	const myScript = "alph.js";
	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingSkill = ns.getHackingLevel();
	const servers = GetServers(ns);
	const targets = GetTargets(ns);
	const defaultTarget = GetTarget(ns);

	const minMoney = ns.getServer(targets[Math.floor(targets.length / 2)]).moneyMax;
	let execStat = 0;
	let serverWithMostMoney = { hostname: "uninitialized", moneyMax: 0 };
	ns.disableLog("scp");
	ns.disableLog("exec");
	ns.disableLog("getServer");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMinSecurityLevel");

	for (let i = 0; i < servers.length; ++i) {
		const server = servers[i];
		if (server.length <= 2)
			continue;
		const serverObject = ns.getServer(server);
		const isAboveMyProgramsLevel = serverObject.numOpenPortsRequired > myProgramsLevel;
		const isDifficultHack = serverObject.requiredHackingSkill > myHackingSkill / 2;
		const isSad = serverObject.moneyMax < minMoney;
		let target = defaultTarget;
		// const isBroke = serverObject.moneyMax == 0;

		if (isAboveMyProgramsLevel)
			continue;

		ns.tprint(`${NumLeft(i, 2)} ${StrLeft(server, 20)}` +
			` sad: ${isSad ? "1" : " "}` +
			` diff: ${isDifficultHack ? "1" : " "}`)

		if (myHackingSkill < 100) {
			target = "n00dles";
		}
		else if (target == undefined) {
			target = BlackListFilter(server);
		}
		else if (isSad) {
			// targets[0]
		}
		else if (isDifficultHack) {
			// targets[0]
		}
		else {
			target = BlackListFilter(server);
		}

		// if (serverObject.maxRam > 0 && ns.exec("weak.js", target, Math.floor(serverObject.maxRam / 1.7), target)) {
		if (AlphExec(ns, myScript, server, target) > 0) {
			ns.print(`${myScript} ${server} ${target}`);
			execStat++;
			let targetObject = ns.getServer(target);
			if (targetObject.moneyMax > serverWithMostMoney.moneyMax)
				serverWithMostMoney = targetObject;
		}


	}
	ns.tprint(`Applied ${myScript} to ${execStat} servers of ${servers.length}.`);
	if (serverWithMostMoney)
		ns.tprint(`Server with Most Money: ${serverWithMostMoney.hostname} ${serverWithMostMoney.moneyMax}`);

}

function BlackListFilter(server, myHackingSkill){
	const blackList = ["iron-gym"]
	if (blackList.indexOf(server) == -1)
		return server;

	const otherTargets = [
				{ requiredHackingSkill: 100, name: "phantasy" },
				{ requiredHackingSkill: 90, name: "max-hardware" },
			];

	return (myHackingSkill / 2 > otherTargets[0].requiredHackingSkill) ?
				otherTargets[0].name : otherTargets[1].name;
}