/** @param {NS} ns */
import GetServers from './im/servers'
import GetProgramLevel from './im/files'

let myHackingLevel;
let myPortPrograms;

export default function main(ns) {
	myHackingLevel = ns.getHackingLevel();
	myPortPrograms = GetProgramLevel(ns);

	return GetTarget(ns);
	// while (true) {
	// 	await ns.weaken(target);
	// 	await ns.grow(target);
	// }
}



function GetTarget(ns) {
	let servers = GetServers(ns);
	let singleTarget = { hostname: "null", moneyMax:0};
	servers = servers.map(s => ns.getServer(s));
	//servers = servers.sort((a, b) => GetValue(b) - GetValue(a) ? a : b);

	for (var i = 0; i < servers.length; i++) {
		let server = servers[i];
		if (GetValue(singleTarget) < GetValue(server))
			singleTarget = server;
		//ns.tprint(server.hostname + " " + server.moneyMax + " " + GetValue(server));
	}
	return BlackListFilter(singleTarget.hostname);
}


// As a rule of thumb, your hacking target should be
// the server with highest max money that’s 
// required hacking level is under 1/2 of your hacking level.
function GetValue(x) {
	if (x.requiredHackingSkill == undefined)
		return 0;

	if (x.numOpenPortsRequired > myPortPrograms)
		return 0;

	if (x.requiredHackingSkill > myHackingLevel / 2)
		return 0;

	return x.moneyMax;
}

function BlackListFilter(server) {
	const blackList = ["iron-gym"]
	if (blackList.indexOf(server) == -1)
		return server;

	const otherTargets = [
		{ requiredHackingSkill: 100, name: "phantasy" },
		{ requiredHackingSkill: 90, name: "max-hardware" },
	];

	return (myHackingLevel / 2 > otherTargets[0].requiredHackingSkill) ?
		otherTargets[0].name : otherTargets[1].name;
}