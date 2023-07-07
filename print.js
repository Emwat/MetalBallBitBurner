/** @param {NS} ns */
import GetAllServers from "./im/servers"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"
import StrRight from "./im/strRight"
import GetTarget from "./im/target"
import Visual from "./im/visual"

let showAll = false;

export async function main(ns) {
	const arg = ns.args[0];
	const target = GetTarget(ns);
	showAll = ns.args.indexOf("all") > -1;

	if (false)
	{

	}
	else if (arg == "mi") {
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.minDifficulty - b.minDifficulty);
		//ns.tprint(`${servers[10].requiredHackingSkill} ${servers[11].requiredHackingSkill}`)
		PrintAllServers(ns, servers, target);
	}
	else if (arg == "h") {
		ns.tprint("hackDifficulty");
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.hackDifficulty - b.hackDifficulty);
		PrintAllServers(ns, servers, target);
	}
	else if (arg == "r") {
		ns.tprint("requiredHackingSkill");
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.requiredHackingSkill - b.requiredHackingSkill);
		//ns.tprint(`${servers[10].requiredHackingSkill} ${servers[11].requiredHackingSkill}`)
		PrintAllServers(ns, servers, target);
	}
	else if (arg == "m") {
		ns.tprint("moneyMax");
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.moneyMax - b.moneyMax);
		//ns.tprint(`${servers[10].requiredHackingSkill} ${servers[11].requiredHackingSkill}`)
		PrintAllServers(ns, servers, target);
	}
	else if (arg && arg != "all") {
		ns.tprint(arg);
		PrintHeaders(ns);
		PrintInfo(ns, ns.getServer(arg))
	}
	else {
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.requiredHackingSkill - b.requiredHackingSkill);
		//ns.tprint(`${servers[10].requiredHackingSkill} ${servers[11].requiredHackingSkill}`)
		PrintAllServers(ns, servers, target);
	}
}

function GetAllServersO(ns){
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

		if (!showAll && server.requiredHackingSkill / 1.25 > myHackingSkill)
			continue;
		
		PrintInfo(ns, server, target);
	}
}

function PrintHeaders(ns) {
	ns.tprint(
		" " + StrLeft("moneyAvail", 13) +
		" " + StrLeft("moneyMax", 13) +
		" " + StrLeft("ramUse", 6) +
		" " + StrLeft("ramMax", 6) +
		" " + StrLeft("Ports", 6) +
		" " + StrLeft("minDif", 6) +
		" " + StrLeft("hacDif", 6) +
		" " + StrLeft("reqHac", 6) +
		" " + "hostname" +
		" " + new Date().toLocaleString());
}

function PrintInfo(ns, server, target) {
	const myHackingSkill = ns.getHackingLevel();
	ns.tprint(
		Visual(server, target, myHackingSkill) +
		" " + NumLeft(server.moneyAvailable, 13) +
		" " + NumLeft(server.moneyMax, 13) +
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


