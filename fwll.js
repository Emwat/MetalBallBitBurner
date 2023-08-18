import GetTargets from "/im/topTarget"
import GetTarget from "./im/target"
import AlphExec from "./im/exec" // CopyNukeExe(ns, alphJS, targetHost, targetMoney)
import GetServers from "./im/servers"
import GetProgramLevel from "./im/files"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"

const alphJS = "alph.js";
const growJS = "grow.js";
const weakJS = "weak.js";
const hackJS = "hack.js";
const sharJS = "shar.js";
// const kallJS = "kall.js";

class scriptMap {
	constructor(script, ram, execArgs) {
		this.script = script;
		this.ram = ram;
		this.execArgs = execArgs;
	}
}

const scriptArgs = ({ script, hostname, threads, target }) => {
	return [script, hostname, threads, target];
}

const scriptMaps = {
	'a': new scriptMap(alphJS, 2.2)
	, 'g': new scriptMap(growJS, 1.75, scriptArgs)
	, 'w': new scriptMap(weakJS, 1.75, scriptArgs)
	, 'h': new scriptMap(hackJS, 1.70, scriptArgs)
	, 's': new scriptMap(sharJS, 4, ({ script, hostname, threads }) => { return [script, hostname, threads]; })
	// , 'k': new scriptMap(kallJS, 2.1, ({ script, server }) => { return [script, "home", 1, server]; })
};

/** @param {NS} ns */
export async function main(ns) {
	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingLevel = ns.getHackingLevel();
	const defaultTarget = GetTarget(ns) || "n00dles";
	let [argTarget, argAction] = ns.args;


	let servers = GetServers(ns);
	let body;
	let serverWithMostMoney = { hostname: "", moneyMax: 0 };

	if (argTarget?.length || 0 == 1) {
		[argAction, argTarget] = ns.args;
	}

	// ns.tprint(argAction)
	// ns.tprint(scriptMap.get(argAction))

	if (argAction) {
		body = scriptMaps[argAction];
	} else {
		argAction = "a";
		body = scriptMaps[argAction];
	}

	if (!body){
		ns.tprint(`fwll does not support ${argAction}`);
		return;
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
	let dontCare = !["k","s"].includes(argAction);

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
		let myBug = { server: server, applied: 0, a: 0, g: 0, h: 0, w: 0, s: 0, k: 0 };

		if (argAction == "k" && server == "home") {
			myBug.note = "isHome";
			myBugs.push(myBug);
			continue;
		}

		if (!isMyServer) {
			myBug.note = "!isMyServer";
			myBugs.push(myBug);
			continue;
		}


		if (dontCare && serverObject.moneyMax == 0) {
			target = defaultTarget;
		}

		if (dontCare && isTooStrong) {
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
		

		let threads = Math.floor((serverObject.maxRam - serverObject.ramUsed) / body.ram);

		if (argAction == "k" || threads > 0) {
			
			// exec(script, hostname, threadOrOptions, args) returns pid/0
			ns.scp(body.script, server, "home");
			let transformer = {
				script: body.script,
				hostname: server,
				threads,
				server,
				target
			}

			// ns.tprint(body.execArgs(transformer).join(" "));
			if (argAction == "a") {
				if (AlphExec(ns, "home", target, threads) > 0){
					myBug.applied += 1;
					myBug[argAction.toLowerCase()] += 1;
					tprintFill(ns, i, server, body.script, target);
				}
			}
			else if (ns.exec(...body.execArgs(transformer)) > 0) {
				myBug.applied += 1;
				myBug[argAction.toLowerCase()] += 1;
				tprintFill(ns, i, server, body.script, target);
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

function PrintMyBug(ns, myBugs) {
	ns.tprint(
			StrLeft("server", 20) +
			StrLeft("note", 14) +
			StrLeft("target", 20) +
			StrLeft("app", 3) +
			StrLeft(" a ", 3) +
			StrLeft(" g ", 3) +
			StrLeft(" w ", 3) +
			StrLeft(" h ", 3) +
			StrLeft(" s ", 3) +
			StrLeft(" k ", 3) +
			""
		)

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
			(myBug.k ? NumLeft(myBug.k, 3) + "k" : "   ") +
			""
		)
	}
}