import GetProgramLevel from "./im/files"

// class Milestone {
// 	constructor(portsReq, hackReq, server, name) {
// 		this.portsReq = portsReq;
// 		this.hackReq = hackReq;
// 		this.server = server;
// 		this.name = name;
// 	}
// }

let stopGoing = false;
let collection = [];

/** @param {NS} ns */
export async function main(ns) {
	let milestones = [
		"CSEC",
		"avmnite-02h",
		"I.I.I.I",
		"run4theh111z",
		"fulcrumassets",
		"w0r1d_d43m0n"
	];

	if (ns.args[0]) {
		milestones = [ns.args[0]];
	}
	

	let output = "\r\n";
	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingLevel = ns.getHackingLevel();
	collection = [];
	for (let i = 0; i < milestones.length; i++) {
		let server = ns.getServer(milestones[i]);
		let extra = "";
		if (!server.backdoorInstalled &&
			myHackingLevel >= server.requiredHackingSkill &&
			myProgramsLevel > server.numOpenPortsRequired)
			extra = "backdoor;"

		KeepGoing(ns, "home", ["home"], [], milestones[i]);
		stopGoing = false;
		let path = collection[i];
		if (server.backdoorInstalled) {
			continue;
		}
		if (!path) {
			collection.push(path);
		}
		if (path) {
			output += (`	connect ${path.join("; connect ")}; ${extra} \r\n`);
		}
	}
	ns.tprint(output);

}

function KeepGoing(ns, currentServer, scanned, array, target) {
	const servers = ns.scan(currentServer);
	array.push(currentServer);
	if (target == currentServer) {
		collection.push(array);
		stopGoing = true;
		return;
	}
	if (stopGoing)
		return;
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		if (!scanned.includes(server)) {
			scanned.push(server);
			KeepGoing(ns, server, scanned, [...array], target);
		}
	}
}
