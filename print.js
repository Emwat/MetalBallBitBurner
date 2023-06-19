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

	if (false)
	{

	}
	else if (arg == "all") {
		showAll = true;
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.requiredHackingSkill - b.requiredHackingSkill);
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
		PrintInfo(ns, ns.getServer(arg))
	}
	else {
		let servers = GetAllServersO(ns);
		servers = servers.sort((a, b) => a.requiredHackingSkill - b.requiredHackingSkill);
		//ns.tprint(`${servers[10].requiredHackingSkill} ${servers[11].requiredHackingSkill}`)
		PrintAllServers(ns, servers, target);
	}
}

function sampleCode(ns) {
	let target = ns.args[0];
	let server = ns.getServer(target);

	let ramAvailable = server.maxRam - server.ramUsed;
	let ramPerThread = ns.getScriptRam('/scripts/hack.js');
	let maxThreads = Math.floor(ramAvailable / ramPerThread);

	ns.tprint("------------------------------------");
	ns.tprint("Server Infomation");
	ns.tprint("------------------------------------");
	ns.tprint("Host Name: " + server.hostname);
	ns.tprint("IP: " + server.ip);
	ns.tprint("Owned By: " + server.organizationName);
	ns.tprint("");
	ns.tprint("------------------------------------");
	ns.tprint("Security Infomation");
	ns.tprint("------------------------------------");
	ns.tprint("Required Hacking Level: " + server.requiredHackingSkill);
	ns.tprint("Min Security level: " + server.minDifficulty);
	ns.tprint("Current security: " + ns.nFormat(server.hackDifficulty, "0.00"));
	ns.tprint("");
	ns.tprint("------------------------------------");
	ns.tprint("Money Infomation");
	ns.tprint("------------------------------------");
	ns.tprint("Max Money: " + ns.nFormat(server.moneyMax, "$0.000a"));
	ns.tprint("Current Money: " + ns.nFormat(server.moneyAvailable, "$0.000a"));
	ns.tprint("Server Growth: " + server.serverGrowth);
	ns.tprint("");
	ns.tprint("------------------------------------");
	ns.tprint("Hardware Infomation");
	ns.tprint("------------------------------------");
	ns.tprint("Cores: " + server.cpuCores);
	ns.tprint("Max RAM: " + server.maxRam);
	ns.tprint("Used RAM: " + server.ramUsed);
	ns.tprint("Max Threads: " + maxThreads);
	ns.tprint("");
	ns.tprint("------------------------------------");
	ns.tprint("Hacking Infomation");
	ns.tprint("------------------------------------");
	ns.tprint("Rooted: " + server.hasAdminRights);
	ns.tprint("Backdoored: " + server.backdoorInstalled);
	ns.tprint("Required Open Ports: " + server.numOpenPortsRequired);
	ns.tprint("Ports Currently Open: " + server.openPortCount);
	ns.tprint("------------------------------------");
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


