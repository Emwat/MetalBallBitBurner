
import AlphExec from "./im/exec"
import GetServers from "./im/servers"
import GetTargets from "./im/topTarget"
import GetTarget from "./im/target"
import GetProgramLevel from "./im/files"


const hackScriptRam = 1.7;
const coreScriptRam = 1.75;
const alphScriptRam = 2.2;
let myHackingLevel;

/** @param {NS} ns */
export async function main(ns) {
	myHackingLevel = ns.getHackingLevel();
	let threads = 1000; // home.maxRam / bundledRam;
	let loopThreads = 1;
	if (ns.args[0]) {
		loopThreads = ns.args[0];
	}
	if (ns.args[1]) {
		threads = ns.args[1];
	}

	function SortByMoney(a, b) {
		// if (a.hostname == redTarget) return -1;
		// if (b.hostname == redTarget) return 1;

		return b.moneyMax - a.moneyMax;
	}

	const redTarget = GetTarget(ns);
	const hostnames = GetServers(ns);
	let servers = hostnames.map(m => ns.getServer(m)).sort(SortByMoney);
	// MainHelper(ns, servers, threads);
	let output = 0;
	let looped = 0;

	let hosts = servers.slice();
	function filterMyServers(f) {
		if (f.hostname.startsWith("pserv")) return true;
		if (f.hostname.startsWith("hacknet-")) return true;
		if (f.hostname == "home") return true;
		return false;
	}

	hosts = hosts.filter(filterMyServers);
	// ns.tprint(hosts.map(m => m.hostname))
	for (let i = 0; i < hosts.length; i++) {
		for (let j = 0; j < loopThreads; j++) {
			let o = HQHelper(ns, servers, threads, hosts[i].hostname);
			output += o;
			if (o == 0)
				break;
			looped++;
			await ns.sleep(1000 * 1);
		}
	}

	ns.tprint(`Applied a total of ${output} threads. (Looped ${looped} times)`)
	ns.tprint(`hq.js ended ${new Date().toLocaleString()}`)
}

function HQHelper(ns, servers, threads, host) {
	if (ns.args[2]) {
		servers = [ns.getServer(ns.args[2])];
	}

	// servers = [
	// 	// ns.getServer("n00dles"),
	// 	// ns.getServer("phantasy"),
	// 	// ns.getServer("rho-construction")
	// 	// ns.getServer("ecorp"),
	// 	// ns.getServer("megacorp"),
	// 	];
	let output = 0;
	const myProgramsLevel = GetProgramLevel(ns);
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		const isTooStrong = server.requiredHackingSkill > myHackingLevel;
		const isAboveMyProgramsLevel = server.numOpenPortsRequired > myProgramsLevel;
		const hostObject = ns.getServer(host);
		let lessThreads = threads;
		let capAtSilverHelix = 10 ** 9;
		let capAtSyscore = 10 ** 10;
		let capAtTaiyang = 10 ** 10 * 2;
		// ns.tprint(`${server.requiredHackingSkill} ${myHackingLevel} ${isTooStrong}`)
		let t = 0;
		if (hostObject.maxRam - hostObject.ramUsed < threads)
			break;

		if (["n00dles", "foodnstuff"].includes(server.hostname)) {
			continue;
		}

		if (server.moneyMax <= 0) {
			continue;
		}

		if (isTooStrong) {
			continue;
		}

		if (isAboveMyProgramsLevel) {
			continue;
		}

		if (server.minDifficulty <= 90) {
			if (AlphExec(ns, host, server.hostname, lessThreads) > 0) { t++ }
			if (ns.exec("weak.js", host, Math.floor(lessThreads * 0.3), server.hostname) > 0) { t++ }
			if (ns.exec("grow.js", host, Math.floor(1000), server.hostname) > 0) { t++ }
			if (ns.exec("hack.js", host, Math.floor(lessThreads * 0.1), server.hostname) > 0) { t++ }
		} else {
			continue;
			if (ns.exec("grow.js", host, Math.floor(lessThreads), server.hostname) > 0) { t++ }
			if (ns.exec("grow.js", host, Math.floor(lessThreads), server.hostname) > 0) { t++ }
			if (ns.exec("grow.js", host, Math.floor(lessThreads), server.hostname) > 0) { t++ }
			if (ns.exec("hack.js", host, Math.floor(lessThreads * 0.2), server.hostname) > 0) { t++ }
		}

		// if (ns.exec("grow.js", "home", Math.floor(lessThreads), server.hostname) > 0) { t++ }
		// if (ns.exec("hack.js", "home", Math.floor(lessThreads), server.hostname) > 0) { t++ }

		// if (server.moneyMax < capAtSilverHelix) {
		// 	lessThreads = Math.floor(lessThreads * 0.05);
		// 	if (AlphExec(ns, "home", server.hostname, lessThreads) > 0) { t++ }

		// } else if (server.moneyMax < capAtSyscore) {
		// 	lessThreads = Math.floor(lessThreads * 0.1);

		// 	if (AlphExec(ns, "home", server.hostname, lessThreads) > 0) { t++ }
		// 	if (ns.exec("weak.js", "home", Math.floor(lessThreads * 0.5), server.hostname) > 0) { t++ }
		// 	// if (ns.exec("grow.js", "home", lessThreads, server.hostname) > 0) { t++ }
		// 	// if (ns.exec("hack.js", "home", lessThreads, server.hostname) > 0) { t++ }
		// } else if (server.moneyMax < capAtTaiyang) {
		// 	lessThreads = Math.floor(lessThreads * 0.2);

		// 	if (AlphExec(ns, "home", server.hostname, lessThreads * 2) > 0) { t++ }
		// 	if (ns.exec("weak.js", "home", Math.floor(lessThreads * 0.5), server.hostname) > 0) { t++ }
		// 	// if (ns.exec("grow.js", "home", lessThreads, server.hostname) > 0) { t++ }
		// 	// if (ns.exec("hack.js", "home", lessThreads, server.hostname) > 0) { t++ }
		// } else {
		// 	if (AlphExec(ns, "home", server.hostname, lessThreads * 2) > 0) { t++ }
		// 	if (ns.exec("weak.js", "home", Math.floor(lessThreads * 0.5), server.hostname) > 0) { t++ }
		// 	// if (ns.exec("grow.js", "home", lessThreads, server.hostname) > 0) { t++ }
		// 	// if (ns.exec("hack.js", "home", lessThreads, server.hostname) > 0) { t++ }
		// }

		output += lessThreads * t;
	}
	if (["pserv-00", "hacknet-server-0", "home"].includes(host))
		ns.tprint(`Applied ${output} threads on ${host}.`);
	return output;
}
