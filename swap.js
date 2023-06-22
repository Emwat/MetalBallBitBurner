/** @param {NS} ns */

import GetServers from "./im/servers"

const validActions = [
	"-k",
	"-a",
	"-w",
	"-g",
	"-h"
];

export async function main(ns) {
	if (ns.args.length == 0) {
		ns.tprint(`No args found. Program did not run. Args are 
		redo.js WIP
		
		`);
		return;
	}


	ns.disableLog("scp");
	ns.disableLog("getServer");
	ns.killall();

	MainHelper(ns, ns.args);


	// ns.exec("count.js", "home");

}

function GetTargetsFromArgs(myArgs) {
	let myTargets = myArgs.filter(f => validActions.indexOf(f) == -1);
	return myTargets;
}

function MainHelper(ns, myArgs) {
	let servers = GetServers(ns);
	servers = servers.map(s => ns.getServer(s));
	// let ram = DetermineRam(myArgs);
	let myTargets = GetTargetsFromArgs(myArgs);

	const hasA = myArgs.indexOf("-a") > 0;
	const hasG = myArgs.indexOf("-g") > 0;
	const hasW = myArgs.indexOf("-w") > 0;
	const hasH = myArgs.indexOf("-h") > 0;
	const hasK = myArgs.indexOf("-k") > 0;
	let stats = { killed: 0 };
	function addKill() {
		stats.killed += 1;
	}

	for (let i = 0; i < servers.length; i++) {
		let host = servers[i].hostname;
		if (host == "home")
			continue;

		const processes = ns.ps(host);

		for (let j = 0; j < processes.length; ++j) {
			const process = processes[j];
			if (!process)
				continue;

			if (process.args.length == 0)
				continue;

			const scriptTarget = process.args[0];

			if (myTargets.indexOf(scriptTarget) == -1)
				continue;

			if (process.filename == "alph.js" && (hasK || !hasA)) {
				ns.kill("alph.js", host, scriptTarget, process.args[1], process.args[2]);
				stats.killed += 1;
			}
			if (hasK || !hasG) { ns.kill("grow.js", host, scriptTarget); stats.killed += 1; }
			if (hasK || !hasW) { ns.kill("weak.js", host, scriptTarget); stats.killed += 1; }
			if (hasK || !hasH) { ns.kill("hack.js", host, scriptTarget); stats.killed += 1; }
		}
	}

	ns.tprint(`Killed ${stats.killed} scripts. Program end.`);
}
