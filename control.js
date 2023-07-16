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
	let threads = 1;
	let loopThreads = 1;
	let actions = "w";

	let indexArgThread = ns.args.indexOf("thread");
	let indexArgLoop = ns.args.indexOf("loop");
	let indexArgAction = ns.args.indexOf("act");
	if (ns.args.length >= indexArgThread + 1 && indexArgThread > -1) {
		threads = ns.args[indexArgThread + 1];
	}
	if (ns.args.length >= indexArgLoop + 1 && indexArgLoop > -1) {
		loopThreads = ns.args[indexArgLoop + 1];
	}
	if (ns.args.length >= indexArgAction + 1 && indexArgAction > -1) {
		actions = ns.args[indexArgAction + 1];
	}

	// ns.tprint(`thread ${indexArgThread} loop ${indexArgLoop} act ${indexArgAction}`)
	// ns.tprint(`thread ${threads} loop ${loopThreads} act ${actions}`)

	const hostnames = GetServers(ns).sort();
	let servers = hostnames.map(m => ns.getServer(m));
	// MainHelper(ns, servers, threads);
	let output = 0;
	let looped = 0;
	for (let i = 0; i < loopThreads; i++) {
		let o = HQHelper(ns, servers, threads, actions);
		output += o;
		if (o == 0)
			break;
		looped++;
		await ns.sleep(1000 * 1);
	}
	ns.tprint(`Applied a total of ${output} threads. (Looped ${looped} times)`)
	ns.tprint(`hq.js ended ${new Date().toLocaleString()}`)
}


function HQHelper(ns, servers, threads, actions) {
	let output = 0;
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		// ns.tprint(`${server.requiredHackingSkill} ${myHackingLevel} ${isTooStrong}`)
		let t = 0;
		if (server.moneyMax <= 0) {
			continue;
		}

		if (server.requiredHackingSkill > myHackingLevel) {
			continue;
		}

		if (!server.hasAdminRights) {
			continue;
		}

		if (actions.includes("w") && ns.exec("weak.js", "home", Math.floor(threads), server.hostname) > 0) { t++ }
		if (actions.includes("g") && ns.exec("grow.js", "home", Math.floor(threads), server.hostname) > 0) { t++ }
		if (actions.includes("h") && ns.exec("hack.js", "home", Math.floor(threads), server.hostname) > 0) { t++ }

		output += threads * t;

	}
	return output;
}