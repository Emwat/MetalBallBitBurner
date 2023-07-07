/** @param {NS} ns */
import GetAllServers from "./im/servers"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"
import StrRight from "./im/strRight"
import GetTarget from "./im/target"
import Visual from "./im/visual"

let showAll = false;
let homeCores = 0;
let player;

export async function main(ns) {
	player = ns.getPlayer();
	const arg = ns.args[0];
	const target = GetTarget(ns);
	homeCores = ns.getServer("home").cpuCores;

	ns.tprint(`
growPercent(server, threads, player, cores)
	Calculate the percent a server would grow to. 
	Not exact due to limitations of mathematics. 
	(Ex: 3.0 would would grow the server to 300% of its current value.)
growThreads(server, player, targetMoney, cores) 	Calculate how many threads it will take to grow server to targetMoney. Starting money is server.moneyAvailable.
growTime(server, player) 	Calculate grow time.
hackChance(server, player) 	Calculate hack chance. (Ex: 0.25 would indicate a 25% chance of success.)
hackExp(server, player) 	Calculate hack exp for one thread.
hackPercent(server, player) 	Calculate hack percent for one thread. (Ex: 0.25 would steal 25% of the server's current value.)
hackTime(server, player) 	Calculate hack time.
weakenTime(server, player) 	Calculate weaken time.
`);

	if (false) {

	}
	else if (arg == "all") {
		showAll = true;
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.requiredHackingSkill - b.requiredHackingSkill);
		//ns.tprint(`${servers[10].requiredHackingSkill} ${servers[11].requiredHackingSkill}`)
		PrintAllServers(ns, servers, target);
	}
	else if (arg == "d") {
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.minDifficulty - b.minDifficulty);
		//ns.tprint(`${servers[10].requiredHackingSkill} ${servers[11].requiredHackingSkill}`)
		PrintAllServers(ns, servers, target);
	}
	else if (arg == "h") {
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.hackDifficulty - b.hackDifficulty);
		PrintAllServers(ns, servers, target);
	}
	else if (arg == "r") {
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.requiredHackingSkill - b.requiredHackingSkill);
		//ns.tprint(`${servers[10].requiredHackingSkill} ${servers[11].requiredHackingSkill}`)
		PrintAllServers(ns, servers, target);
	}
	else if (arg == "m") {
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.moneyMax - b.moneyMax);
		//ns.tprint(`${servers[10].requiredHackingSkill} ${servers[11].requiredHackingSkill}`)
		PrintAllServers(ns, servers, target);
	}
	else if (arg) {
		PrintHeaders(ns);
		PrintHackingInfo(ns, ns.getServer(arg))
	}
	else {
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.requiredHackingSkill - b.requiredHackingSkill);
		//ns.tprint(`${servers[10].requiredHackingSkill} ${servers[11].requiredHackingSkill}`)
		PrintAllServers(ns, servers, target);
	}
}

function GetAllServersO(ns) {
	let servers = GetAllServers(ns);
	servers = servers.map(a => ns.getServer(a));
	return servers;
}

function PrintAllServers(ns, servers, target) {
	const myHackingSkill = ns.getHackingLevel();
	PrintHeaders(ns);

	for (var i = 0; i < servers.length; i++) {
		var server = servers[i];
		//server = ns.getServer(server);
		if (server.hostname.indexOf("pserv-") == 0)
			continue;

		PrintHackingInfo(ns, server, target);
	}
}




function PrintHeaders(ns) {
	ns.tprint(
		" " + StrLeft("moneyAvai", 9) +
		" " + StrLeft("moneyMax", 9) +
		" " + StrLeft("g%", 7) +
		" " + StrLeft("gThrd", 7) +
		" " + StrLeft("gTime", 7) +
		" " + StrLeft("hChnc", 5) +
		" " + StrLeft("hExp", 5) +
		" " + StrLeft("h%", 5) +
		" " + StrLeft("hTime", 7) +
		" " + StrLeft("wTime", 7) +
		" " + StrLeft("ramUse", 6) +
		" " + StrLeft("ramMax", 6) +
		" " + StrLeft("Ports", 6) +
		" " + StrLeft("minDif", 6) +
		" " + StrLeft("hacDif", 6) +
		" " + StrLeft("reqHac", 6) +
		" " + "hostname" +
		" " + new Date().toLocaleString());
}

// growPercent(server, threads, player, cores)
// growThreads(server, player, targetMoney, cores)

function PrintHackingInfo(ns, server, target) {
	const myHackingSkill = ns.getHackingLevel();
	const sGrowPercent = ns.formulas.hacking.growPercent(server, 1, player, homeCores);
	const sGrowThreads = ns.formulas.hacking.growThreads(server, player, server.moneyMax, homeCores);

	ns.tprint(
		Visual(server, target, myHackingSkill) +
		" " + NumLeft(server.moneyAvailable / 10 ** 4, 9) +
		" " + NumLeft(server.moneyMax / 10 ** 4, 9) +
		" " + NumLeft(sGrowPercent * 100, 7) +
		" " + NumLeft(sGrowThreads, 7) +
		" " + NumLeft(ns.formulas.hacking.growTime(server, player), 7) +
		" " + NumLeft(ns.formulas.hacking.hackChance(server, player) * 100, 5) +
		" " + NumLeft(ns.formulas.hacking.hackExp(server, player), 5) +
		" " + NumLeft(ns.formulas.hacking.hackPercent(server, player) * 100, 5) +
		" " + NumLeft(ns.formulas.hacking.hackTime(server, player), 7) +
		" " + NumLeft(ns.formulas.hacking.weakenTime(server, player), 7) +
		" " + NumLeft(server.ramUsed, 6) +
		" " + NumLeft(server.maxRam, 6) +
		" " + NumLeft(server.numOpenPortsRequired, 6) +
		" " + NumLeft(server.minDifficulty, 6) +
		" " + NumLeft(server.hackDifficulty, 6) +
		" " + NumLeft(server.requiredHackingSkill, 6) +
		" " + server.hostname
		//" " + (target == server.hostname ? "    <target>" : "" )
	);
}

// constants() 	All constants used by the game.
// coreUpgradeCost(startingCore, extraCores, costMult) 	Calculate cost of upgrading hacknet node cores.
// hacknetNodeCost(n, mult) 	Calculate the cost of a hacknet node.
// levelUpgradeCost(startingLevel, extraLevels, costMult) 	Calculate cost of upgrading hacknet node level.
// moneyGainRate(level, ram, cores, mult) 	Calculate money gain rate.
// ramUpgradeCost(startingRam, extraLevels, costMult) 	Calculate cost of upgrading hacknet node ram

function SeeHacknetNodes() {

	for (let i = 0; i < 8; i++) {
		ns.tprint(ns.formulas.hacknet.coreUpgradeCost(8, 8 + i, 1));

	}
	for (let i = 0; i < 8; i++) {
		ns.tprint(ns.formulas.hacknet.hacknetNodeCost(i, 1));
	}

	for (let i = 0; i < 10; i++) {
		ns.tprint(ns.formulas.hacknet.levelUpgradeCost(0, i, 1));
	}

	for (let i = 0; i < 10; i++) {
		ns.tprint(ns.formulas.hacknet.moneyGainRate(i, 1, 1, 1));
	}

	for (let i = 0; i < 10; i++) {
		ns.tprint(ns.formulas.hacknet.ramUpgradeCost(i, i, 1));
	}
}

