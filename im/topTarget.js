/** @param {NS} ns */
import GetProgramLevel from './im/files'
import GetServers from './im/servers'

export default function main(ns) {
	return GetTopTargets(ns);
}

var hackingLevel;
var portStrength;
var lunaticDifficulty = 90;

function GetTopTargets(ns) {
	var servers = GetServers(ns);
	hackingLevel = ns.getHackingLevel();
	portStrength = GetProgramLevel(ns);
	lunaticDifficulty = 90;
	servers = servers.map(s => ns.getServer(s));

	// As a rule of thumb, your hacking target should be
	// the server with highest max money that’s 
	// required hacking level is under 1/2 of your hacking level.

	servers = servers.filter(f => GetValue(f) == 1);
	servers = servers.sort((a, b) => a.maxMoney > b.maxMoney ? 1 : -1);
	servers = servers.map(a => a.hostname);

	return servers;

	//return servers.reduce((a, b) => FilterMostMoneyAndHalfHackingSkill(ns, hackingLevel, portStrength, a, b)).hostname;
}

function GetValue(x) {
	//x = ns.getServer(x);
	if (x.moneyMax == 0)
		return 0;

	if (x.requiredHackingSkill == undefined)
		return 0;

	if (x.numOpenPortsRequired > portStrength)
		return 0;

	if (x.requiredHackingSkill > hackingLevel / 2)
		return 0;

	if (!x.hasAdminRights)
		return 0;

	if (x.minDifficulty > lunaticDifficulty)
		return 0;

	return 1;
}