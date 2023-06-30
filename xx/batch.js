/** @param {NS} ns */

import GetTopTargets from './im/topTarget'
import GetServers from './im/servers'

export async function main(ns) {
	let topTargets = GetTopTargets(ns);
	let t = 0; // t for target
	let b = 0; // b for burners
	const waitTime = 60000;
	const burners = ["grow.js", "weaken.js", "hack.js"];
	let servers = GetServers(ns);
	servers = servers.map(s => ns.getServer(s));
	topTargets = topTargets.splice(0, Math.floor(topTargets.length / 5));

	while (true) {
		for (let i = 0; i < servers.length; i++) {
			let server = servers[i];

			if (server.hostname == "home")
				continue;

			if (t >= topTargets.length) {
				t = 0;
			}

			const target = topTargets[t];

			const threads = Math.floor((server.maxRam / ns.getScriptRam(burners[0])) / 3);
			if (threads > 0) {
				ns.scp(burners[0], servers[i].hostname);
				ns.scp(burners[1], servers[i].hostname);
				ns.scp(burners[2], servers[i].hostname);
				ns.exec(burners[0], servers[i].hostname, Math.floor(threads), target);
				ns.exec(burners[1], servers[i].hostname, Math.floor(threads), target);
				ns.exec(burners[2], servers[i].hostname, Math.floor(threads), target);
			}

			t++;
		}
		await ns.sleep(waitTime);
	}
}