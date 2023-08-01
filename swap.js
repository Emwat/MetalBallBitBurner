/** @param {NS} ns */

import GetServers from "./im/servers"
import AlphExec from "./im/exec"
// import AlphArgs from "./im/alphHelper"
import StrLeft from "./im/strLeft"

const sRam = 2;
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

	if (iMv > -1) {
		MoveAction(ns, iMv);
	} else if (ns.args[0] == "k") {
		let killStat = 0;
		const servers = GetServers(ns);
		for (let server of servers) {
			for (let script of ns.ps(server)) {
				if (script.filename == "alph.js" && script.threads < 30)
					if (ns.scriptKill(script.filename, server))
						killStat++
			}
		}
		ns.tprint(`Killed ${killStat} alph scripts.`)
	}


	//ns.disableLog("scan");
	//ns.disableLog("scp");
	//ns.disableLog("getServer");



	ns.tprint(`swap.js ${ns.args.concat()} end ${new Date().toLocaleString()}`);
}

function MoveAction(ns, iMv) {

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
	// if (
	// 	actions.oldAction == undefined ||
	// 	actions.oldTarget == undefined ||
	// 	actions.newAction == undefined ||
	// 	actions.newTarget == undefined
	// ) {
	// 	ns.tprint("Fail. " +
	// 		" " + actions.oldAction +
	// 		" " + actions.newTarget +
	// 		" " + actions.oldAction +
	// 		" " + actions.newTarget
	// 	);
	// 	return;
	// }

	const stats = { killed: 0 };
	const servers = GetServers(ns);

	for (let i = 0; i < servers.length; i++) {
		let host = servers[i];
		MoveHelper(ns, host, actions, stats)
	}
}

function MoveHelper(ns, host, actions, stats) {
	const processes = ns.ps(host);
	for (let j = 0; j < processes.length; ++j) {
		const process = processes[j];


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
	const { oldAction, oldTarget, newAction, newTarget } = actions;
	ns.print(`${oldAction} ${oldTarget} ${newAction} ${newTarget}`)

	if (oldAction == "c") { killed += ns.kill("chrg.js", host) ? 1 : 0; }
	if (oldAction == "w") { killed += ns.kill("weak.js", host, oldTarget) ? 1 : 0; }
	if (oldAction == "g") { killed += ns.kill("grow.js", host, oldTarget) ? 1 : 0; }
	if (oldAction == "h") { killed += ns.kill("hack.js", host, oldTarget) ? 1 : 0; }
	if (oldAction == "a" && process.filename == "alph.js") {
		ns.kill("alph.js", host, oldTarget, process.args[1], process.args[2]);
		killed += 1;
	}

	stats.killed += killed;

	if (newAction == "k")
		return;

	let threads = 0;

	function t(action) {
		const things = [
			["c", sRam]
			, ["g", cRam]
			, ["w", cRam]
			, ["h", hRam]
			, ["a", aRam]
		];
		let output = things.find(f => f[0] == action);
		if (output)
			return output[0][1];
		return 0;
	}

	if (killed > 0) {
		threads = Math.floor((process.threads * t(oldAction)) / t(newAction));
	}

	if (threads < 1)
		return;

	let execID = 0;
	if (host == "home") {
		if (newAction == "g") { execID = ns.spawn("grow.js", threads, newTarget); }
		if (newAction == "w") { execID = ns.spawn("weak.js", threads, newTarget); }
		if (newAction == "h") { execID = ns.spawn("hack.js", threads, newTarget); }
		// if (newAction == "a") { execID = ns.spawn(AlphExec(ns, host, newTarget, threads)); }
	} else {
		if (newAction == "g") { execID = ns.exec("grow.js", host, threads, newTarget); }
		if (newAction == "w") { execID = ns.exec("weak.js", host, threads, newTarget); }
		if (newAction == "h") { execID = ns.exec("hack.js", host, threads, newTarget); }
		if (newAction == "a") { execID = AlphExec(ns, host, newTarget, threads); }
	}


	if (execID)
		ns.tprint(`on ${StrLeft(host, 20)}, ran ${newAction} -t ${threads}`);
}