/** @param {NS} ns */

import GetServers from './im/servers'
import GetTargets from "./im/topTarget"

const hackScriptRam = 1.7;
const coreScriptRam = 1.75;
let myHackingLevel;
export async function main(ns) {
	myHackingLevel = ns.getHackingLevel();
	const hostnames = GetServers(ns);
	let servers = hostnames.map(m => ns.getServer(m));
	servers = servers.filter(f => myHackingLevel > f.requiredHackingSkill);


	let serversSumMoney = servers
		.filter(f => myHackingLevel > f.requiredHackingSkill / 2)
		.map(s => s.moneyMax)
		.reduce((prev, next) => prev + next);

	serversSumMoney = 0;
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		const isTooStrong = server.requiredHackingSkill > myHackingLevel / 2;

		if (server.moneyMax <= 0) {
			continue;
		}

		if (isTooStrong) {
			continue;
		}
		serversSumMoney += server.moneyMax;
	}

	// ns.tprint(`serversSumMoney: ${serversSumMoney}`);

	ns.disableLog("scp");
	//ns.disableLog("exec");
	ns.disableLog("sleep");
	ns.disableLog("killall");

	HackSelfEverywhere(ns, servers);

	while (true) {
		servers = hostnames.map(m => ns.getServer(m));
		const home = "home";

		let stats = { g: 0, w: 0, t: 0, c: 0, k: 0 };
		// let existingScripts = ns.pw(home);
		// ns.exec("weak.js", h, threads, server);
		// ns.exec("grow.js", h, threads, server);
		const h = ns.getServer(home);
		// const leftoverRam = Math.floor(h.maxRam - h.ramUsed);
		const leftoverRam = h.maxRam - Math.floor(hackScriptRam * 10);
		let maxHackDifficulty = 1;

		for (let i = 0; i < servers.length; i++) {
			const server = servers[i];
			const isTooStrong = server.requiredHackingSkill > myHackingLevel / 2;
			// ns.tprint(`${server.requiredHackingSkill} ${myHackingLevel} ${isTooStrong}`)

			if (server.moneyMax <= 0) {
				continue;
			}

			if (isTooStrong) {
				// ns.print(`Skipped ${server.hostname} b/c ${server.requiredHackingSkill}`);
				continue;
			}

			if (server.moneyAvailable == server.moneyMax) {
				if (ns.kill("grow.js", home, server.hostname)) {
					stats.k += 1;
					continue;
				}
			}

			if (server.hackDifficulty > maxHackDifficulty)
				server.hackDifficulty = maxHackDifficulty;

			let threads = 1;
			let percentage = server.moneyMax / serversSumMoney;
			threads = (leftoverRam / coreScriptRam) * percentage;
			threads = Math.floor(threads - 1);
			// ns.tprint(`${leftoverRam} / ${coreScriptRam} * ${percentage} (${server.moneyMax} ${serversSumMoney})`)

			if (threads <= 0)
				threads = 2;

			// ns.print(`${server.hostname} ${percentage} ${threads}`);

			const threadsWeak = Math.floor(threads * 0.49);
			if (threadsWeak > 0) {
				if (ns.exec("weak.js", home, threadsWeak, server.hostname) == 0)
					ns.print(`failed ns.exec(weak.js, home, ${threadsWeak}, ${server.hostname})`);
			}

			const threadsGrow = Math.floor(threads * 0.49);
			if (threadsGrow > 0) {
				if (ns.exec("grow.js", home, threadsGrow, server.hostname) == 0)
					ns.print(`failed ns.exec(grow.js, home, ${threadsGrow}, ${server.hostname})`);

			}
			stats.w += threadsWeak;
			stats.g += threadsGrow;
			stats.t += threadsWeak + threadsGrow;
			stats.c += 1;

		}
		ns.disableLog("exec");
		ns.tprint(`w ${stats.w} g ${stats.g} threads: ${stats.t} targets: ${stats.c} killed: ${stats.k}`)
		break;
		await ns.sleep(60000 * 5);
	}

}

function HackSelfEverywhere(ns, servers) {
	let j = 0;
	let serversWithMoney = GetTargets(ns);
	serversWithMoney.reverse().splice(0, Math.floor((serversWithMoney.length / 5) * 4));
	// ns.tprint("-----------servers with money");
	// for (let i = 0; i < serversWithMoney.length; i++) {
	// 	ns.tprint(serversWithMoney[i]);
	// }

	for (let i = 0; i < servers.length; i++) {
		let server = servers[i];
		const myScript = "hack.js";
		const myScriptRam = hackScriptRam; // ns.getScriptRam(myScript)
		const threads = Math.floor(server.maxRam / myScriptRam);

		if (server.maxRam <= 0) {
			// if (server.moneyMax > 0)
			// 	serversWithMoney.push(server.hostname);
			continue;
		}

		if (server.hostname == "home")
			continue;

		if (server.hostname.startsWith("pserv"))
			continue;

		if (threads <= 0)
			continue;

		if (!server.hasAdminRights)
			continue;

		if (server.requiredHackingSkill > myHackingLevel)
			continue;

		ns.killall(server.hostname);
		ns.scp(myScript, server.hostname);

		if (server.moneyMax <= 0 || server.requiredHackingSkill / 2 > myHackingLevel) {
			//ns.print(serversWithMoney[j]);
			ns.exec(myScript, server.hostname, threads, serversWithMoney[j]);
			//ns.print(`${myScript} ${server.hostname} ${threads} serversWithMoney[${j}]: ${serversWithMoney[j]}`);
			if (j > 0)
				j -= 1;
			else
				j = serversWithMoney.length - 1;
		}
		else {
			const coreThreads = Math.floor(server.maxRam / myScriptRam);
			if (false) { }
			else if (server.hackDifficulty > server.minDifficulty + 5) {
				ns.exec("weak.js", server.hostname, coreThreads, server.hostname);
			}
			else if (server.moneyAvailable < server.moneyMax * 0.75) {
				ns.exec("grow.js", server.hostname, coreThreads, server.hostname);
			}
			else {
				ns.exec(myScript, server.hostname, threads, server.hostname);
			}
		}
	}

	// ns.tprint("-----------servers with money adjusted");
	// for(let i = 0; i < serversWithMoney.length;i++)
	// {
	// 	ns.tprint(serversWithMoney[i]);
	// }
}

