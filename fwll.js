import GetTargets from "/im/topTarget"
import GetTarget from "./im/target"
import AlphExec from "./im/exec" // CopyNukeExe(ns, alphJS, targetHost, targetMoney)
import GetServers from "./im/servers"
import GetProgramLevel from "./im/files"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"

/** @param {NS} ns */

	const alphJS = "alph.js";
	const growJS = "grow.js";
	const weakJS = "weak.js";
	const hackJS = "hack.js";
	const sharJS = "shar.js";

const scriptMap = new Map();

	

export async function main(ns) {
	scriptMap.set('a', [alphJS, 2.2])
	scriptMap.set('g', [growJS, 1.75, (program, server, threads, target) => {program.exec(growJS, server, threads, target)}]);
	scriptMap.set('w', [weakJS, 1.75, (program, server, threads, target) => {program.exec(weakJS, server, threads, target)}]);
	scriptMap.set('h', [hackJS, 1.7, (program, server, threads, target) => {program.exec(hackJS, server, threads, target)}]);
	scriptMap.set('s', [sharJS, 4, (program, server, threads, target) => {program.exec(hackJS, server, threads, target)}]);

	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingLevel = ns.getHackingLevel();
	const defaultTarget = GetTarget(ns) || "n00dles";
	let [argTarget, argAction] = ns.args;
	
	let myScript = weakJS;
	let myScriptRam = 1.75;

	let servers = GetServers(ns);

	let serverWithMostMoney = { hostname: "", moneyMax: 0 };

	if (argTarget?.length || 0 == 1)
	{
		[argAction, argTarget] = ns.args;
	}

	// ns.tprint(argAction)
	// ns.tprint(scriptMap.get(argAction))
	if (argAction)
	{
		myScript = scriptMap.get(argAction)[0];
		myScriptRam = scriptMap.get(argAction)[1];
	}
	

	ns.disableLog("scp");
	// ns.disableLog("exec");
	ns.disableLog("getServer");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMinSecurityLevel");

	ns.tprint(`Filling up servers...`)

	// ns.tprint(
	// 	" # " +
	// 	" pt" +
	// 	StrLeft("hak/min", 7) +
	// 	" name"
	// );
	// ns.exec("power.js", "home", 1);
	//servers = ["zer0"]
	// servers = ["pserv-00"];

	if (myHackingLevel == 1)
		ns.exec("crack.js", "home", 1, "n00dles");

	let myBugs = [];

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		let serverObject = ns.getServer(server);
		// const isAboveMyProgramsLevel = serverObject.numOpenPortsRequired > myProgramsLevel;
		const isMyServer = serverObject.hasAdminRights;
		const isTooStrong = serverObject.hackDifficulty > myHackingLevel || serverObject.minDifficulty > 90;
		let target = server;
		// ns.tprint(StrLeft(server, 20) +
		// 	"	" + ns.formatNumber(serverObject.maxRam - serverObject.ramUsed, 2)
		// );
		let myBug = { server: server, applied: 0, a: 0, g: 0, h: 0, w: 0, s: 0 };

		if (server == "home") {
			myBug.note = "isHome";
			myBugs.push(myBug);
			continue;
		}

		if (!isMyServer) {
			myBug.note = "!isMyServer";
			myBugs.push(myBug);
			continue;
		}

		if (serverObject.moneyMax == 0) {

			target = defaultTarget;
		}

		if (argAction != "s" && isTooStrong) {
			target = defaultTarget;
		}

		if (argTarget == "target") {
			target = defaultTarget;
		}
		else if (argTarget) {
			target = argTarget;
		}

		myBug.target = target;

		serverObject = ns.getServer(server);
		let threads = Math.floor((serverObject.maxRam - serverObject.ramUsed) / myScriptRam);

		if (threads > 0) {
			// exec(script, hostname, threadOrOptions, args) returns pid/0
			ns.scp(myScript, server, "home");
			if (ns.exec(myScript, server, threads, target) > 0) {
				myBug.applied += 1;
				myBug[myScript[0].toLowerCase()] += 1;
				tprintFill(ns, i, server, myScript, target);
			}
		}
		myBugs.push(myBug);
	} // end forloop

	//ns.tprint(`a ${a} w ${w} servers of ${servers.length}.`);
	if (serverWithMostMoney.hostname != "")
		ns.tprint(`Server with the Most Money: ${serverWithMostMoney.hostname} ${serverWithMostMoney.moneyMax}`);

	ns.tprint("fill.js end " + new Date().toLocaleString());



}

function tprintFill(ns, id, server, theScript, target) {
	// ns.tprint(`${NumLeft(id, 2)} on ${StrLeft(server, 20)}, ran ${theScript} ${StrLeft(target, 20)}`);

}

function PrintMyBug(ns, myBugs){
		for (let i = 0; i < myBugs.length; i++) {
		const myBug = myBugs[i];
		ns.tprint(
			StrLeft(myBug.server, 20) +
			StrLeft(myBug.note || "", 14) +
			StrLeft(myBug.target || "", 20) +
			(myBug.applied ? NumLeft(myBug.applied, 3) : "   ") +
			(myBug.a ? NumLeft(myBug.a, 3) + "a" : "   ") +
			(myBug.g ? NumLeft(myBug.g, 3) + "g" : "   ") +
			(myBug.w ? NumLeft(myBug.w, 3) + "w" : "   ") +
			(myBug.h ? NumLeft(myBug.h, 3) + "h" : "   ") +
			(myBug.s ? NumLeft(myBug.s, 3) + "s" : "   ") +
			""
		)
	}
}