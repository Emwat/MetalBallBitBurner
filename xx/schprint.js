import GetTopTargets from './im/topTarget'
import GetTarget from "./im/target"
import Visual from "./im/visual"

let RedTarget;
let MyHackingSkill;
/** @param {NS} ns */
export async function main(ns) {
	const waitTime = 60000;
	RedTarget = GetTarget(ns);
	MyHackingSkill = ns.getHackingLevel();
	// If there are no arguments, load the 20%
	if (!ns.args[0]) {
		let topTargets = GetTopTargets(ns);
		topTargets = topTargets.slice(0, 10);
		while (true) {
			PrintHeaders(ns);
			for (let i = 0; i < topTargets.length; i++) {
				PrintInfo(ns, ns.getServer(topTargets[i]))
			}
			await ns.sleep(waitTime);
		}
		return;
	}

	// Load every argument
	while (true) {
		PrintHeaders(ns);
		for (let i = 0; i < ns.args.length; i++) {
			PrintInfo(ns, ns.getServer(ns.args[i]))
		}
		await ns.sleep(waitTime);
	}
}

function GetAllServers(ns) {
	var servers = ns.scan("home");

	for (var i = 0; i < servers.length; i++) {
		var server = servers[i];
		var moreServers = ns.scan(server);
		for (var j = 0; j < moreServers.length; j++) {
			var thisJServer = moreServers[j];
			if (servers.indexOf(thisJServer) < 0) {
				servers.push(thisJServer);
			}
		}
	}
}

function PrintAllServers(ns) {
	var servers = ns.scan("home");

	for (var i = 0; i < servers.length; i++) {
		var server = servers[i];
		var moreServers = ns.scan(server);
		for (var j = 0; j < moreServers.length; j++) {
			var thisJServer = moreServers[j];
			if (servers.indexOf(thisJServer) < 0) {
				servers.push(thisJServer);
			}
		}
	}


	PrintHeaders(ns);
	for (var i = 0; i < servers.length; i++) {
		var server = servers[i];
		server = ns.getServer(server);
		if (server.moneyAvailable < 100)
			continue;
		PrintInfo(ns, server);
	}
}

function PrintHeaders(ns) {
	ns.tprint(
		" " + sadLeft("moneyAvail", 13) +
		" " + sadLeft("moneyMax", 13) +
		" " + sadLeft("maxRam", 6) +
		" " + sadLeft("ramUse", 6) +
		" " + sadLeft("numPor", 6) +
		" " + sadLeft("minDif", 6) +
		" " + sadLeft("hackDi", 6) +
		" " + sadLeft("reqHac", 6) +
		" " + "name" +
		" " + new Date().toLocaleString());
}

function PrintInfo(ns, server) {
	ns.tprint(
		Visual(server, RedTarget, MyHackingSkill) + 
		" " + madLeft(server.moneyAvailable, 13) +
		" " + madLeft(server.moneyMax, 13) +
		" " + madLeft(server.maxRam, 6) +
		" " + madLeft(server.ramUsed, 6) +
		" " + madLeft(server.numOpenPortsRequired, 6) +
		" " + madLeft(server.minDifficulty, 6) +
		" " + madLeft(server.hackDifficulty, 6) +
		" " + madLeft(server.requiredHackingSkill, 6) +
		" " + server.hostname
		);
}

function madLeft(str, length) {
	let output = Math.trunc(str).toString();
	for (var i = 0; i < length - Math.trunc(str).toString().length; i++) {
		output = " " + output;
	}
	return output;
}

function sadLeft(str, length) {
	let output = str.toString();
	for (var i = 0; i < length - str.length; i++) {
		output = " " + output;
	}
	return output;
}