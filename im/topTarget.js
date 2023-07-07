/** @param {NS} ns */
import GetProgramLevel from './im/files'

export default function main(ns) {
	return GetTopTargets(ns);
}

function GetTopTargets(ns) {
	var servers = ns.scan("home");
	var hackingLevel = ns.getHackingLevel();
	var portStrength = GetProgramLevel(ns);
	var lunaticDifficulty = 90;
	ns.tprint(`Your port strength is ${portStrength}.`)

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

			if (x.minDifficulty > lunaticDifficulty)
				return 0;

			return x.moneyMax;
		}

		return GetValue(a) > GetValue(b) ? 1 : -1;
	}

	servers = servers.sort((a, b) => FilterMostMoneyAndHalfHackingSkill(ns, hackingLevel, portStrength, a, b));
	servers = servers.reverse();
	servers = servers.map(a => a.hostname);

	return servers;

	//return servers.reduce((a, b) => FilterMostMoneyAndHalfHackingSkill(ns, hackingLevel, portStrength, a, b)).hostname;
}
