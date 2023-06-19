/** @param {NS} ns */
import GetProgramLevel from "./im/files"
import GetTarget from "./im/target"
import Visual from "./im/visual"


export async function main(ns) {
	PrintTargets(ns);
}

function PrintTargets(ns) {
	var servers = ns.scan("home");
	var hackingLevel = ns.getHackingLevel();
	var portStrength = GetProgramLevel(ns);

	for (var i = 0; i < servers.length; i++) {
		var server = servers[i];
		var moreServers = ns.scan(server);
		//ns.tprint(server);
		for (var j = 0; j < moreServers.length; j++) {
			var thisJServer = moreServers[j];
			if (servers.indexOf(thisJServer) < 0) {
				servers.push(thisJServer);
				//ns.tprint(thisJServer);
			}
		}

	}

	servers = servers.map(s => ns.getServer(s));

	// for (var i = 0; i < servers.length; i++) {
	// 	let server = servers[i];
	// 	ns.tprint(server.hostname + " " + server.moneyMax);
	// }

	// As a rule of thumb, your hacking target should be
	// the server with highest max money that’s 
	// required hacking level is under 1/2 of your hacking level.
	function FilterMostMoneyAndHalfHackingSkill(ns, hackingLevel, portStrength, a, b) {
		//ns.tprint(a + " " + b.hostname + " " + b.moneyMax);
		//return a.moneyMax > b.moneyMax ? a.moneyMax : b.moneyMax;

		function GetValue(x) {
			//x = ns.getServer(x);
			if (x.requiredHackingSkill == undefined)
				return 0;

			if (x.numOpenPortsRequired > portStrength)
				return 0;

			if (x.requiredHackingSkill > hackingLevel / 2)
				return 0;

			return x.moneyMax;
		}

		return GetValue(a) > GetValue(b) ? a : b;
	}

	// servers = servers.sort((a, b) => FilterMostMoneyAndHalfHackingSkill(ns, hackingLevel, portStrength, a, b));
	servers = servers.sort((a, b) => a.moneyMax - b.moneyMax);
	servers = servers.reverse();
	servers = servers.filter(s => miniGetValue(s, hackingLevel, portStrength) > 0);

	ns.tprint(
		" " + sadLeft("moneyMax", 13) +
		" " + sadLeft("moneyAvail", 13) +
		" " + sadLeft("reqHac", 6) +
		" " + sadLeft("hacDif", 6) +
		" " + sadLeft("srvGrw", 6) +
		" " + sadLeft("reqPor", 6) +
		" " + "name" +
		" " + new Date().toLocaleString());

	for (var i = 0; i < servers.length; i++) {
		let server = servers[i];
		if (i == Math.floor(servers.length / 2))
			ns.tprint(sadLeft("---- HALFWAY ----", 38));
		ns.tprint(
			Visual(server, GetTarget(ns), hackingLevel) +
			" " + madLeft(server.moneyMax, 13) +
			" " + madLeft(server.moneyAvailable, 13) +
			" " + madLeft(server.hackDifficulty, 6) + 
			" " + madLeft(server.requiredHackingSkill, 6) +
			" " + madLeft(server.serverGrowth, 6) + 
			" " + madLeft(server.numOpenPortsRequired, 6) +
			" " + server.hostname);
	}
	//return servers;

	//return servers.reduce((a, b) => FilterMostMoneyAndHalfHackingSkill(ns, hackingLevel, portStrength, a, b)).hostname;
}

function miniGetValue(x, hackingLevel, portStrength) {
	//x = ns.getServer(x);
	if (x.requiredHackingSkill == undefined)
		return 0;

	if (x.numOpenPortsRequired > portStrength)
		return 0;

	if (x.requiredHackingSkill > hackingLevel / 2)
		return 0;

	return x.moneyMax;
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