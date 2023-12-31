import GetTarget from "./im/target"
import TopTargets from './im/topTarget'

/** @param {NS} ns */
export async function main(ns) {
	const sharjsRam = 4;
	const alphjsRam = 2.2;
	const growjsRam = 1.75;
	const hackjsRam = 1.7;

	let roomForThreads = ns.args.includes("-max") ? 0 : 10;
	const homeServer = ns.getServer("home");
	const homeRam = homeServer.maxRam - homeServer.ramUsed;
	if (homeServer.maxRam <= 128)
		roomForThreads = 0;

	const sharMaxThreads = Math.floor(homeRam / sharjsRam) - roomForThreads;
	const alphMaxThreads = Math.floor(homeRam / alphjsRam) - roomForThreads;
	const growMaxThreads = Math.floor(homeRam / growjsRam) - roomForThreads;
	const hackMaxThreads = Math.floor(homeRam / hackjsRam) - roomForThreads;
	ns.print(`${homeServer.maxRam} ${homeServer.ramUsed} ${homeRam} ${alphMaxThreads} ${growMaxThreads}`);
	ns.disableLog("scan");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMinSecurityLevel");

	// if (homeServer.maxRam == 256)
	// 	roomForThreads = 5; // 9 GB

	if (ns.args.length == 0) {
		ns.tprint("No args found. Program did not run. Args are " +
			"\r\n many     >> Executes a script and distributes all" +
			"\r\n one      >> Provides a copy paste script for most valuable server" +
			"\r\n [server] >> Provides a copy paste script for argument server " +
			"\r\n     [server] [a/w/g/h] >> Executes script for argument server " +
			"");

	} else if (ns.args[0] == "many") {
		let topTargets = TopTargets(ns);
		let maxThreads = Math.floor(homeRam / growjsRam);
		ns.tprint(`There are ${topTargets.length} targets.`)
		if (maxThreads > 20) {
			// ns.tprint(``);
			maxThreads = maxThreads - Math.floor(growjsRam * 3);
		}

		if (topTargets.length > 2) {
			topTargets = topTargets.splice(0, Math.floor(topTargets.length / 2))
			maxThreads = Math.floor((maxThreads / topTargets.length));
			ns.tprint(`MaxThreads: ${maxThreads} ` +
				`TopTargets Length: ${topTargets.length} ` +
				`MaxThreads/TopTargets: ${Math.floor(maxThreads / topTargets.length)}`);

		}

		// maxThreads = Math.floor(maxThreads / 2);
		for (let i = 0; i < topTargets.length; i++) {
			const target = topTargets[i];
			if (true) {
				// HelperExec(ns, "alph.js", "home", target, Math.floor(maxThreads * 0.02));
				HelperExec(ns, "weak.js", "home", target, Math.floor(maxThreads * 0.6));
				HelperExec(ns, "grow.js", "home", target, Math.floor(maxThreads * 0.2));
				HelperExec(ns, "alph.js", "home", target, Math.floor(maxThreads * 0.18));
			}
			else {
				HelperExec(ns, "weak.js", "home", target, Math.floor(maxThreads * 0.1));
				HelperExec(ns, "grow.js", "home", target, Math.floor(maxThreads * 0.7));
				HelperExec(ns, "hack.js", "home", target, Math.floor(maxThreads * 0.4));
			}
		}
	} else if (ns.args[0] == "one") {
		const target = GetTarget(ns);

		let output = "\r\n";
		output += "\r\n " + Helper(ns, "alph.js", target, alphMaxThreads);
		output += "\r\n " + Helper(ns, "weak.js", target, growMaxThreads);
		output += "\r\n " + Helper(ns, "hack.js", target, hackMaxThreads);
		ns.tprint(output);
	}  else if (ns.args[0] == "s") {
		ns.exec("shar.js", "home", sharMaxThreads );
		ns.tprint(`running shar.js -t ${sharMaxThreads}`);
	} else {
		let [target, arg2] = ns.args;
		if (target.length == 1) {
			[arg2, target] = ns.args;
		}
		if(target == "target")
			target = GetTarget(ns);

		if (false) {

		} else if (arg2 == "a") {
			HelperExec(ns, "alph.js", "home", target, alphMaxThreads);
		} else if (arg2 == "g") {
			HelperExec(ns, "grow.js", "home", target, growMaxThreads);
		} else if (arg2 == "w") {
			HelperExec(ns, "weak.js", "home", target, growMaxThreads);
		} else if (arg2 == "h") {
			HelperExec(ns, "hack.js", "home", target, hackMaxThreads);
		} else {
			const w = Helper(ns, "weak.js", target, Math.floor(growMaxThreads / 2));
			const g = Helper(ns, "grow.js", target, Math.floor(growMaxThreads / 2));
			ns.tprint(`
	${Helper(ns, "alph.js", target, alphMaxThreads)}
	${Helper(ns, "weak.js", target, growMaxThreads)}
	${w}; ${g}
	${Helper(ns, "hack.js", target, hackMaxThreads)}
			`);
		}
	}
}

function ThreadsIdea(ns, i, topTargets, maxThreads) {
	let percent = maxThreads / topTargets.length;
	return Math.floor(percent);
}

function Helper(ns, myScript, scriptTarget, threads) {
	if (threads == 0) {
		return "error -> 0 threads";
	}

	const moneyThresh = ns.getServerMaxMoney(scriptTarget) * 0.75;
	const securityThresh = ns.getServerMinSecurityLevel(scriptTarget) + 5;
	return "run" +
		" " + myScript +
		" " + "-t" +
		" " + threads +
		" " + scriptTarget +
		(myScript == "alph.js" ? " " + moneyThresh : "") +
		(myScript == "alph.js" ? " " + securityThresh : "") +
		"";
	// if (ns.exec(myScript, "home", threads,
	// 	scriptTarget, moneyThresh, securityThresh) == 0)
	// 	ns.tprint(`Failed to run Helper(${myScript}, ${scriptTarget}, ${threads})`);
}

function HelperExec(ns, myScript, hostServer, scriptTarget, threads) {
	if (threads <= 0) {
		ns.tprint(`Fail. HelperExec(${myScript}, ${hostServer}, ${scriptTarget}, ${threads})`);
		return;
	}

	if (myScript == "weak.js" ||
		myScript == "grow.js" ||
		myScript == "hack.js") {
		ns.tprint("running" +
			" " + myScript +
			" " + "-t" +
			" " + threads +
			" " + scriptTarget +
			" " + new Date().toLocaleString());

		if (ns.exec(myScript, hostServer, threads, scriptTarget) == 0)
			ns.tprint(`Fail. HelperExec(${myScript}, ${hostServer}, ${scriptTarget}, ${threads})`);
		return;
	}

	const moneyThresh = Math.floor(ns.getServerMaxMoney(scriptTarget) * 0.75);
	const securityThresh = ns.getServerMinSecurityLevel(scriptTarget) + 5;
	ns.tprint("running" +
		" " + myScript +
		//" " + hostServer.hostname +
		" " + "-t" +
		" " + threads +
		" " + scriptTarget +
		" " + moneyThresh +
		" " + securityThresh +
		" " + new Date().toLocaleString());

	if (ns.exec(myScript, hostServer, threads,
		scriptTarget, moneyThresh, securityThresh) == 0)
		ns.tprint(`Failed to run HelperExec(${myScript}, ${hostServer}, ${scriptTarget}, ${threads})`);
}
