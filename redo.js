/** @param {NS} ns */

import GetServers from "./im/servers"

const burners = ["grow.js", "weaken.js", "hack.js"];

export async function main(ns) {
	if (ns.args.length == 0) {
		ns.tprint(`No args found. Program did not run. Args are 
		redo.js WIP
		
		`);
		return;
	}

	let [myArg, target, myArgThreads] = ns.args;
	if (target && target.length == 1) {
		[target, myArg] = ns.args;
	}

	ns.disableLog("scp");
	ns.disableLog("getServer");
	ns.killall();

	if (myArg == "b") {
		let waitTime = 60000 * 5;
		const x = 1.1;

		while (true) {
			ns.tprint(`This program will run until killed.`);
			const targetServer = ns.getServer(target);
			const securityThresh = targetServer.minDifficulty + 5;
			const moneyThresh = targetServer.moneyMax * 0.75;

			if (targetServer.hackDifficulty > securityThresh) {
				MainHelper(ns, "w", target);
				waitTime = ns.getWeakenTime(target) * x;
			} else if (targetServer.moneyAvailable < moneyThresh) {
				MainHelper(ns, "g", target);
				waitTime = ns.getGrowTime(target) * x;
			} else {
				MainHelper(ns, "h", target);
				waitTime = ns.getHackTime(target) * x;
			}

			await ns.sleep(waitTime);
		}
	} else {
		MainHelper(ns, myArg, target, myArgThreads);
	}

	// ns.exec("count.js", "home");

}

function MainHelper(ns, myArg, target, myArgThreads) {
	let servers = GetServers(ns);
	ns.tprint("servers.indexOf(home) => " + servers.indexOf("home"));
	let t = 0;
	servers = servers.map(s => ns.getServer(s));

	let ram = DetermineRam(myArg);

	for (let i = 0; i < servers.length; i++) {
		let server = servers[i];
		const isHome = server.hostname == "home";
		const threads = Math.floor(server.maxRam / ram) - (isHome ? 5 : 0);

		if (myArg != "k" && threads <= 0)
			continue;

		server = server.hostname;

		ns.scriptKill("alpha.js", server);
		for (let b = 0; b < burners.length; b++) {
			const burner = burners[b];
			ns.scriptKill(burner, server);
			if (!isHome)
				ns.scp(burner, server);
		}

		if (myArg == "k")
			continue;

		if (!myArgThreads) {
			if (false) { }
			else if (myArg == "a") ns.exec("alpha.js", server, threads, target);
			else if (myArg == "g") ns.exec("grow.js", server, threads, target);
			else if (myArg == "w") ns.exec("weaken.js", server, threads, target);
			else if (myArg == "h") ns.exec("hack.js", server, threads, target);
		} else {
			// ns.tprint(`${myArgThreads * 0.3} ${myArgThreads * 0.6} ${myArgThreads * 0.9} ${myArgThreads * 0.1}`)
			// if (isHome) {} 
			// else if (t < myArgThreads * 0.3) ns.tprint(`${t} ${Math.floor(myArgThreads * 0.3)}`);
			// else if (t < myArgThreads * 0.6) ns.tprint(`${t} ${Math.floor(myArgThreads * 0.6)}`);
			// else if (t < myArgThreads * 0.9) ns.tprint(`${t} ${Math.floor(myArgThreads * 0.9)}`);
			// else ns.exec("alpha.js", server, threads, target);
			if (isHome) {} 
			else if (t < myArgThreads * 0.3) ns.exec("grow.js", server, threads, target);
			else if (t < myArgThreads * 0.6) ns.exec("weaken.js", server, threads, target);
			else if (t < myArgThreads * 0.9) ns.exec("hack.js", server, threads, target);
			else ns.exec("alpha.js", server, threads, target);
		}

		t += threads;
		//ns.tprint(`${myArg} ${server} ${target} -t ${threads}`)
	}

	ns.tprint(`Unleashed ${t} ${myArg} threads on ${target}. Program end.`);
}

// function SpareRamForHome(server){
// 	if (server.hostname != "home")
// 	return 0;
// 	if (server.maxRam >= )
// }

function DetermineRam(myArg) {
	const alphjsRam = 2.2;
	const growjsRam = 1.75;
	const hackjsRam = 1.7;

	if (false) { }
	else if (myArg == "a") return alphjsRam;
	else if (myArg == "g") return growjsRam;
	else if (myArg == "w") return growjsRam;
	else if (myArg == "h") return hackjsRam;
	return -1;
}