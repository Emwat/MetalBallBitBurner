import GetTargets from "/im/topTarget"
import GetTarget from "./im/target"
import AlphExec from "./im/exec" // CopyNukeExe(ns, alphJS, targetHost, targetMoney)
import GetServers from "./im/servers"
import GetProgramLevel from "./im/files"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"
import FormatTime from './im/time'


const coreScriptRam = 1.75;
const reservedKeywords = ["print"];

/** @param {NS} ns */
export async function main(ns) {
	const alphJS = "alph.js";
	const weakJS = "weak.js";
	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingLevel = ns.getHackingLevel();
	const defaultTarget = GetTarget(ns) || "n00dles";
	const arg0 = ns.args[0];
	let servers = GetServers(ns);

	let serverWithMostMoney = { hostname: "", moneyMax: 0 };
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
		const isAboveMyProgramsLevel = serverObject.numOpenPortsRequired > myProgramsLevel;
		// const isMyServer = serverObject.hasAdminRights;
		const isTooStrong = serverObject.requiredHackingSkill > myHackingLevel;
		const isLunatic = serverObject.minDifficulty > 90;
		let target = server;
		// ns.tprint(StrLeft(server, 20) +
		// 	"	" + ns.formatNumber(serverObject.maxRam - serverObject.ramUsed, 2)
		// );
		let myBug = { server: server, applied: 0, alph: 0, weak: 0, threads: 0 };

		if (server == "home") {
			myBug.note = "isHome";
			myBugs.push(myBug);
			continue;
		}



		if (isAboveMyProgramsLevel) {
			myBug.note = "isAboveMyProgramsLevel";
			myBugs.push(myBug);
			continue;
		}

		if (serverObject.moneyMax == 0) {
			myBug.note = "moneyMax 0";

			target = defaultTarget;
		}

		if (isTooStrong) {
			// myBug.note = "hackDifficulty " + Math.floor(serverObject.hackDifficulty);
			target = defaultTarget;
		}

		if (isLunatic) {
			// myBug.note = "minDifficulty " + serverObject.minDifficulty;
			target = defaultTarget;
		}

		if (target.minDifficulty >= 90) {
			target = defaultTarget;
		}

		if (!target) {
			target = defaultTarget;
		}


		if (arg0 == "target") {
			target = defaultTarget;
		}
		else if (arg0 && !reservedKeywords.includes(arg0)) {
			target = arg0;
		}

		if (target.startsWith("hacknet-server-")) {
			target = defaultTarget;
		}

		myBug.target = target;

		// ns.tprint({server, target})
		if (AlphExec(ns, server, target) > 0) {
			myBug.alph += 1;
			myBug.applied += 1;
			myBug.threads += Math.floor((serverObject.maxRam - serverObject.ramUsed) / coreScriptRam);
			tprintFill(ns, i, server, alphJS, target);
		}

		serverObject = ns.getServer(server);

		if (serverObject.maxRam - serverObject.ramUsed >= coreScriptRam) {


			// exec(script, hostname, threadOrOptions, args) returns pid/0
			ns.scp(weakJS, server, "home");
			if (ns.exec(weakJS, server, 1, target) > 0) {
				myBug.weak += 1;
				myBug.applied += 1;
				myBug.threads += Math.floor((serverObject.maxRam - serverObject.ramUsed) / coreScriptRam);
				tprintFill(ns, i, server, weakJS, target);
			}
		}
		myBugs.push(myBug);
	} // end forloop

	//ns.tprint(`a ${a} w ${w} servers of ${servers.length}.`);
	if (serverWithMostMoney.hostname != "")
		ns.tprint(`	Server with the Most Money: ${serverWithMostMoney.hostname} ${serverWithMostMoney.moneyMax}`);

	ns.tprint("	Applied " + myBugs.map(m => m.applied).reduce((a, b) => { return a + b }));
	ns.tprint("	Threads " + myBugs.map(m => m.threads).reduce((a, b) => { return a + b }));
	if (arg0 == "print")
		PrintMyBugs(ns, myBugs);

	if (arg0 && !reservedKeywords.includes(arg0)) {
		let target = (arg0 == "target" ? defaultTarget : arg0);
		target = ns.getServer(target);
		if (target.hackDifficulty > target.minDifficulty + 5) {
			let time = Math.floor(ns.formulas.hacking.weakenTime(target, ns.getPlayer()));
			time = FormatTime(time / 6000, "m:s");
			ns.tprint(`	Weaken Time for ${target.hostname}: ${time}`);
		} else if (target.moneyAvailable < target.moneyMax * 0.75) {
			let time = Math.floor(ns.formulas.hacking.growTime(target, ns.getPlayer()));
			time = FormatTime(time / 6000, "m:s");
			ns.tprint(`	Grow Time for ${target.hostname}: ${time}`);
		} else {
			let time = Math.floor(ns.formulas.hacking.hackTime(target, ns.getPlayer()));
			time = FormatTime(time / 6000, "m:s");
			ns.tprint(`	Hack Time for ${target.hostname}: ${time}`);
		}
	}

	ns.tprint("fill.js end " + new Date().toLocaleString());

}

function tprintFill(ns, id, server, theScript, target) {
	// ns.tprint(`${NumLeft(id, 2)} on ${StrLeft(server, 20)}, ran ${theScript} ${StrLeft(target, 20)}`);

}

function PrintMyBugs(ns, myBugs) {
	for (let i = 0; i < myBugs.length; i++) {
		const myBug = myBugs[i];
		ns.tprint(
			StrLeft(myBug.server, 20) +
			StrLeft(myBug.note || "", 25) +
			StrLeft(myBug.target || "", 20) +
			(myBug.applied ? NumLeft(myBug.applied, 3) : StrLeft("", 3)) +
			(myBug.alph ? NumLeft(myBug.alph, 3) : StrLeft("", 3)) +
			(myBug.weak ? NumLeft(myBug.weak, 3) : StrLeft("", 3)) +
			// NumLeft(myBug.hackDifficulty, 5) +
			// NumLeft(myBug.minDifficulty, 5) +
			""
		)
	}
}