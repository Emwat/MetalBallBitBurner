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
	let threads = 200; // home.maxRam / bundledRam;
	let loopThreads = 1;
	if (ns.args[0]) {
		loopThreads = ns.args[0];
	}
	if (ns.args[1]) {
		threads = ns.args[1];
	}
	const hostnames = GetServers(ns).sort();
	let servers = hostnames.map(m => ns.getServer(m));
	// MainHelper(ns, servers, threads);
	let output = 0;
	let looped = 0;
	for (let i = 0; i < loopThreads; i++) {
		let o = 0;
		for (let x = 0; x < 10; x++)
			o += HQHelper(ns, servers, threads)

		output += o;
		if (o == 0)
			break;
		looped++;
		await ns.sleep(500);
	}
	ns.tprint(`Applied a total of ${output} threads. (Looped ${looped} times)`)
	ns.tprint(`hq.js ended ${new Date().toLocaleString()}`)
}


function HQHelper(ns, servers, threads) {

	const richServers = [
		ns.getServer("ecorp"),
		ns.getServer("megacorp"),
	]
	let output = 0;
	for (let i = 0; i < richServers.length; i++) {
		const server = richServers[i];
		let isTooStrong = server.requiredHackingSkill > myHackingLevel;
		let lessThreads = threads;
		// ns.tprint(`${server.requiredHackingSkill} ${myHackingLevel} ${isTooStrong}`)
		let a = 0;
		let w = 0;
		let g = 0;
		let h = 0;
		if (server.moneyMax <= 0) {
			continue;
		}

		if (isTooStrong) {
			continue;
		}

		if (ns.exec("weak.js", "home", 200, server.hostname) > 0) { w++ }
		if (ns.exec("weak.js", "home", 200, server.hostname) > 0) { w++ }
		if (ns.exec("grow.js", "home", 850, server.hostname) > 0) { g++ }
		if (ns.exec("grow.js", "home", 850, server.hostname) > 0) { g++ }
		if (ns.exec("hack.js", "home", 7, server.hostname) > 0) { h++ }

		output += w * 200 + g * 850 + h * 7;

	}
	return output;
}