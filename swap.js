/** @param {NS} ns */

import GetServers from "./im/servers"
import AlphExec from "./im/exec"
import AlphArgs from "./im/alphHelper"
import StrLeft from "./im/strLeft"

const cRam = 1.75;
const hRam = 1.7;
const aRam = 2.2;

export async function main(ns) {
	if (ns.args.length == 0) {
		ns.tprint(`No args found. Program did not run. Args are 
		--mv [oldAction] [oldTarget] [newAction] [newTarget]
		
		`);
		return;
	}

	const iMv = ns.args.indexOf("--mv");

	//ns.disableLog("scan");
	ns.disableLog("scp");
	ns.disableLog("getServer");

	if (iMv > -1) {
		if (iMv + 4 > ns.args.length) {
			ns.tprint(`-mv must have 4 following arguments. oldAction/oldTarget/newAction/newTarget`)
		}
		let actions = {
			oldAction: ns.args[iMv + 1],
			oldTarget: ns.args[iMv + 2],
			newAction: ns.args[iMv + 3],
			newTarget: ns.args[iMv + 4]
		};
		// let actions = [
		// 	ns.args[iMv + 1],
		// 	ns.args[iMv + 2],
		// 	ns.args[iMv + 3],
		// 	ns.args[iMv + 4]
		// ];
		if (
			actions.oldAction == undefined ||
			actions.oldTarget == undefined ||
			actions.newAction == undefined ||
			actions.newTarget == undefined
		) {
			ns.tprint("Fail. " +
				" " + actions.oldAction +
				" " + actions.newTarget +
				" " + actions.oldAction +
				" " + actions.newTarget
			);
			return;
		}

		const stats = { killed: 0 };
		const servers = GetServers(ns);
		ns.print(`${ns.args.concat()}`)
		ns.print(`${actions[0]} ${actions[1]} ${actions[2]} ${actions[3]}`)

		for (let i = 0; i < servers.length; i++) {
			let host = servers[i];
			MainHelper(ns, host, ApplyNewAction, actions, stats)
		}
		ns.tprint(`Stats.Killed ${stats.killed}`);
	}

	ns.tprint(`swap.js ${ns.args.concat()} end ${new Date().toLocaleString()}`);
}

function DeHelper(actions) {
	return [actions.oldAction, actions.oldTarget, actions.newAction, actions.newTarget];
}

function MainHelper(ns, host, ApplyNewAction, actions, stats) {
	const processes = ns.ps(host);

	for (let j = 0; j < processes.length; ++j) {
		const process = processes[j];
		if (!process)
			continue;

		if (process.args.length == 0)
			continue;

		const scriptTarget = process.args[0];
		if (actions.oldTarget != scriptTarget)
			continue;

		if (actions.oldAction != "max") {
			ApplyNewAction(ns, process, host, actions, stats);
		} else {
			const acts = "wgha";
			for (let k = 0; k < acts.length; k++) {
				actions.oldAction = acts[k];
				actions.newAction = acts[k];

				ApplyNewAction(ns, process, host, actions, stats);
			}

		}
	}
}

// kill(filename, hostname, args) returns true/false
// exec(script, hostname, threadOrOptions, args) returns pid/0
function ApplyNewAction(ns, process, host, actions, stats) {
	let killed = 0;
	const [oldAction, oldTarget, newAction, newTarget] = DeHelper(actions);


	if (oldAction == "w") { killed += ns.kill("weak.js", host, oldTarget); }
	if (oldAction == "g") { killed += ns.kill("grow.js", host, oldTarget); }
	if (oldAction == "h") { killed += ns.kill("hack.js", host, oldTarget); }
	if (oldAction == "a" && process.filename == "alph.js") {
		ns.kill("alph.js", host, oldTarget, process.args[1], process.args[2]);
		killed += 1;
	}

	stats.killed += killed;
	ns.tprint(`killed ${killed} ${oldAction} scripts on ${host}.`);

	if (newAction == "k")
		return;

	let threads = 0;

	function t(action) {
		const things = [
			["g", cRam]
			, ["w", cRam]
			, ["h", hRam]
			, ["a", aRam]
		];
		let output = things.filter(f => f[0] == action);
		return output[0][1];
	}

	if (killed > 0) {
		threads = Math.floor((process.threads * t(oldAction)) / t(newAction));
	}

	if (threads < 1)
		return;

	let execID = 0;

	if (newAction == "g") { execID = ns.exec("grow.js", host, threads, newTarget); }
	if (newAction == "w") { execID = ns.exec("weak.js", host, threads, newTarget); }
	if (newAction == "h") { execID = ns.exec("hack.js", host, threads, newTarget); }
	if (newAction == "a") { execID = AlphExec(ns, host, newTarget, threads); }

	if (execID)
		ns.tprint(`on ${StrLeft(host, 20)}, ran ${newAction} -t ${threads}`);
}