/** @param {NS} ns */
import AlphExec from "./im/exec"
import GetServers from "./im/servers"
import GetTargets from "./im/topTarget"

const hackScriptRam = 1.7;
const coreScriptRam = 1.75;
const alphScriptRam = 2.2;
let myHackingLevel;

/** @param {NS} ns */
export async function main(ns) {
	myHackingLevel = ns.getHackingLevel();
	let home = ns.getServer("home");
	let bundledRam = hackScriptRam + coreScriptRam * 2 + alphScriptRam;
	let threads = 200; // home.maxRam / bundledRam;
	let serversCount = GetServersCount(ns);
	let loopThreads = bundledRam * threads * 4 * serversCount;
	loopThreads = (home.maxRam - home.ramUsed) / loopThreads;
	loopThreads = Math.floor(loopThreads);
	// ns.tprint(`${home.maxRam - home.ramUsed} ${bundledRam} ${threads} ${serversCount} ${loopThreads}`)
	// return;
	// 	Total:     262.14TB
	// Used:       34.04TB (12.99%)
	// Available: 228.10TB
	loopThreads = 1;
	if (ns.args[0]) {
		loopThreads = ns.args[0];
	}
	const hostnames = GetServers(ns).sort();
	let servers = hostnames.map(m => ns.getServer(m));
	// MainHelper(ns, servers, threads);
	let output = 0;
	let looped = 0;
	for (let i = 0; i < loopThreads; i++) {
		let o = MainHelper(ns, servers, threads);
		output += o;
		if (o == 0)
			break;
		looped++;
		await ns.sleep(1000 * 1);
	}
	ns.tprint(`Applied a total of ${output} threads. (Looped ${looped} times)`)
	ns.tprint(`hq.js ended ${new Date().toLocaleString()}`)
}

function GetServersCount(ns) {
	const hostnames = GetServers(ns);
	let servers = hostnames.map(m => ns.getServer(m));
	let output = 0;
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		let isTooStrong = server.requiredHackingSkill > myHackingLevel;

		if (server.moneyMax <= 0) {
			continue;
		}

		if (isTooStrong) {
			continue;
		}

		output += 1;
	}
	return output;
}


function MainHelper(ns, servers, threads) {

	let output = 0;
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		let isTooStrong = server.requiredHackingSkill > myHackingLevel;
		let lessThreads = threads;
		// ns.tprint(`${server.requiredHackingSkill} ${myHackingLevel} ${isTooStrong}`)
		let t = 0;
		if (server.moneyMax <= 0) {
			continue;
		}

		if (isTooStrong) {
			continue;
		}

		if (server.moneyMax > 10 ** 9) {
			if (ns.exec("weak.js", "home", lessThreads, server.hostname) > 0) { t++ }
			if (ns.exec("grow.js", "home", lessThreads, server.hostname) > 0) { t++ }
			if (ns.exec("hack.js", "home", lessThreads, server.hostname) > 0) { t++ }
		}

		if (AlphExec(ns, "home", server.hostname, lessThreads) > 0) { t++ }

		output += lessThreads * t;

	}
	ns.tprint(`Applied ${output} threads.`);
	return output;
}