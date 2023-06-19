/** @param {NS} ns */

import GetServers from "./im/servers"
import AlphaExec from "./im/exec"

const burners = ["grow.js", "weak.js", "hack.js"];
const alphjsRam = 2.2;
const growjsRam = 1.75;
const hackjsRam = 1.7;
const roomForScripts = 20;

export async function main(ns) {
	if (ns.args.length == 0) {
		ns.tprint(`No args found. Program did not run. Args are 
		focus.js [myArg:a/g/w/h] [target] >> kill everything AND apply arg script
		focus.js [k] >> kill everything
		focus.js [b] >> WHILE LOOP
		`);
		return;
	}

	let [myArg, target, totalThreads] = ns.args;
	if (target && target.length == 1) {
		[target, myArg] = ns.args;
	}

	ns.disableLog("scp");
	ns.disableLog("getServer");
	ns.killall();
	const homeServer = ns.getServer("home");
	// const homeCPU = homeServer.cpuCores;



	if (myArg == "b") {
		let waitTime = 60000 * 5;
		const x = 1.1;

		while (true) {
			ns.tprint(`This program will run until killed.`);
			const targetServer = ns.getServer(target);
			const securityThresh = targetServer.minDifficulty + 5;
			const moneyThresh = targetServer.moneyMax * 0.75;

			if (targetServer.hackDifficulty > securityThresh) {
				MainHelper(ns, "w", targetServer);
				waitTime = ns.getWeakenTime(target) * x;
			} else if (targetServer.moneyAvailable < moneyThresh) {
				MainHelper(ns, "g", targetServer);
				waitTime = ns.getGrowTime(target) * x;
			} else {
				MainHelper(ns, "h", targetServer);
				waitTime = ns.getHackTime(target) * x;
			}

			await ns.sleep(waitTime);
		}
	} else if (myArg == "max") {
		const targetServer = ns.getServer(target);
		let servers = GetServers(ns);
		servers = servers.map(s => ns.getServer(s));
		MainHelper(ns, myArg, targetServer, GetTotalThreads(servers, hackjsRam));
		return;
	} else {
		const targetServer = ns.getServer(target);
		MainHelper(ns, myArg, targetServer, totalThreads);
	}

	// ns.exec("count.js", "home");

}

function MainHelper(ns, myArg, targetServer, totalThreads) {
	const target = targetServer.hostname;
	let servers = GetServers(ns);
	// ns.tprint("servers.indexOf(home) => " + servers.indexOf("home"));
	let t = 0;
	servers = servers.map(s => ns.getServer(s));

	let ram = DetermineRam(myArg);

	for (let i = 0; i < servers.length; i++) {
		let serverObject = servers[i];
		let server = serverObject.hostname;
		const isHome = server == "home";
		let threads = Math.floor(serverObject.maxRam / ram) - (isHome ? roomForScripts : 0);

		if (myArg != "k" && threads <= 0)
			continue;

		if (!serverObject.hasAdminRights)
			continue;

		ns.scriptKill("alph.js", server);
		for (let b = 0; b < burners.length; b++) {
			const burner = burners[b];
			ns.scriptKill(burner, server);
			if (!isHome)
				ns.scp(burner, server);
		}

		if (myArg == "k")
			continue;

		if (!totalThreads) {
			if (false) { }
			else if (myArg == "a") AlphaExec(ns, "alph.js", server, target);
			else if (myArg == "g") ns.exec("grow.js", server, threads, target);
			else if (myArg == "w") ns.exec("weak.js", server, threads, target);
			else if (myArg == "h") ns.exec("hack.js", server, threads, target);
			t += threads;
		} else {

			t += Distribute(ns, t, server, threads, target, totalThreads, serverObject, targetServer, isHome);

		}


		//ns.tprint(`${myArg} ${server} ${target} -t ${threads}`)
	}

	ns.tprint(`Unleashed ${t} ${myArg} threads on ${target}. Program end.`);
}

function Distribute(ns, t, server, threads, target, totalThreads, serverObject, targetServer, isHome) {
	let distributeOutput = 0;
	function cap(threads, totalThreads, percentage) {
		let limit = totalThreads * percentage;
		if (threads > limit)
			return Math.floor(threads - limit);
		return threads;
	}

	// this function is to do ns.exec("grow.js", server, cap(threads, totalThreads, 0.3), target);
	function execScriptGetAdjust(myScript, threads, percentage) {
		let output = cap(threads, totalThreads, percentage);
		ns.exec(myScript, server, output, target);

		//ns.tprint(`${myScript} threads: ${threads} adjThreads: ${output}`);
		return output;
	}

	let adjThreads = 0;

	if (isHome) { }
	else if (t < totalThreads * 0.45) adjThreads = execScriptGetAdjust("grow.js", threads, 0.45);
	else if (t < totalThreads * 0.6) adjThreads = execScriptGetAdjust("weak.js", threads, 0.6);
	else if (t < totalThreads * 0.9) adjThreads = execScriptGetAdjust("hack.js", threads, 0.9);

	distributeOutput += adjThreads;

	threads = Math.floor(serverObject.maxRam / alphjsRam) - (isHome ? 10 : 0);
	adjThreads = Math.floor(threads - adjThreads);

	if (adjThreads > 0) {
		distributeOutput += adjThreads;
		ns.exec("alph.js", server, adjThreads, target,
			targetServer.moneyMax * 0.75, targetServer.minDifficulty + 5);
	}
	return distributeOutput;
}


function GetTotalThreads(servers, ram) {
	let output = 0;
	for (let i = 0; i < servers.length; i++) {
		let server = servers[i];
		const isHome = server.hostname == "home";
		const threads = Math.floor(server.maxRam / ram) - (isHome ? roomForScripts : 0);
		if (!server.hasAdminRights)
			continue;
			
		output += threads;
	}
	return output;
}

// function SpareRamForHome(server){
// 	if (server.hostname != "home")
// 	return 0;
// 	if (server.maxRam >= )
// }

function DetermineRam(myArg) {
	if (false) { }
	else if (myArg == "a") return alphjsRam;
	else if (myArg == "g") return growjsRam;
	else if (myArg == "w") return growjsRam;
	else if (myArg == "h") return hackjsRam;

	return growjsRam;
}