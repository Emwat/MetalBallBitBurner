/** @param {NS} ns */

import GetServers from './im/servers'
const hackScriptRam = 1.7;
const coreScriptRam = 1.75;

export async function main(ns) {
	const hostnames = GetServers(ns);
	let servers = hostnames.map(m => ns.getServer(m));
	const serversSumMoney = servers.map(s => s.moneyMax).reduce((prev, next) => prev + next);

	ns.disableLog("scp");
	ns.disableLog("exec");
	ns.disableLog("sleep");
	ns.disableLog("killall");

	HackSelfEverywhere(ns, servers);

	while (true) {
		servers = hostnames.map(m => ns.getServer(m));
		const home = "home";

		let stats = {
			tw: 0, tg: 0, th: 0,
			cw: 0, cg: 0, ch: 0,
			kw: 0, kg: 0, kh: 0
		};
		// let existingScripts = ns.pw(home);
		// ns.exec("weaken.js", h, threads, server);
		// ns.exec("grow.js", h, threads, server);
		HomeWeakenAndGrow(ns, home, servers, stats);
		HomeHackLeftoverRam(ns, home, servers, stats, serversSumMoney);
		HomeGrowLeftOverRam(ns, home, servers, stats, serversSumMoney);
		ns.tprint(`w ${stats.cw} ${stats.tw} g ${stats.cg} ${stats.tg} h ${stats.ch} ${stats.th}`)

		await ns.sleep(60000 * 5);
	}

}

function HackSelfEverywhere(ns, servers) {
	let j = 0;
	let serversWithMoney = ["n00dles"];
	for (let i = 0; i < servers.length; i++) {
		let server = servers[i];
		const myScript = "hack.js";
		const myScriptRam = hackScriptRam; // ns.getScriptRam(myScript)
		const threads = Math.floor(server.maxRam / myScriptRam);

		if (server.maxRam <= 0)
			continue;

		if (server.hostname == "home")
			continue;

		if (server.hostname.startsWith() == "pserv")
			continue;

		if (threads <= 0)
			continue;

		ns.killall(server.hostname);
		ns.scp(myScript, server.hostname);
		if (server.moneyMax <= 0) {
			ns.print(serversWithMoney[j]);
			ns.exec(myScript, server.hostname, threads, serversWithMoney[j]);
			ns.print(`${myScript} ${server.hostname} ${threads} serversWithMoney[${j}]: ${serversWithMoney[j]}`);
			if (j > 0)
				j -= 1;
			else
				j = serversWithMoney.length - 1;
		}
		else {
			ns.exec(myScript, server.hostname, threads, server.hostname);
			serversWithMoney.push(server.hostname);
			j = serversWithMoney.length - 1;
		}
	}
}

function HomeWeakenAndGrow(ns, home, servers, stats) {
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		// const moneyThresh = ns.getServerMaxMoney(server) * 0.75;
		//const securityThresh = ns.getServerMinSecurityLevel(server.hostname) + 5;
		const securityThresh = server.minDifficulty + 5;
		const moneyThresh = server.moneyMax * 0.75;
		// ns.getServerSecurityLevel(server)
		if (server.moneyMax <= 0) {
			continue;
		}

		if (server.hackDifficulty > securityThresh) {
			let threads = Math.floor(server.hackDifficulty - securityThresh);
			if (threads == 0)
				threads = 1;
			ns.exec("weaken.js", home, threads, server.hostname);
			ns.print(`${server.hackDifficulty} ${securityThresh} ${threads} ${server.hostname}`)
			// ns.tprint(`weaken.js home ${threads} ${server.hostname}`);
			stats.tw += threads;
			stats.cw += 1;
		} else {
			if (ns.kill("weaken.js", home, server.hostname))
				stats.kw += 1;
		}

		if (server.moneyAvailable < moneyThresh) {
			let threads = server.moneyMax.toString().length * 40;
			ns.exec("grow.js", home, threads, server.hostname);
			// ns.tprint(`grow.js home ${threads} ${server.hostname}`);
			stats.tg += threads;
			stats.cg += 1;
		} else {
			if (ns.kill("grow.js", home, server.hostname))
				stats.kg += 1;
		}

	}
}

function HomeHackLeftoverRam(ns, home, servers, stats, serversSumMoney) {
	const h = ns.getServer(home);
	const leftoverRam = Math.floor(h.maxRam - h.ramUsed);
	ns.print(`LeftoverRam for Hacking: ${leftoverRam}`);

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];

		if (server.moneyMax <= 0) {
			continue;
		}

		if (server.moneyAvailable <= 0) {
			continue;
		}

		let threads = 1;
		let percentage = server.moneyMax / serversSumMoney;
		threads = (leftoverRam / hackScriptRam) * percentage;
		threads = Math.floor(threads - 1);
		if (threads <= 0)
			continue;
		ns.exec("hack.js", home, threads, server.hostname);
		stats.th += threads;
		stats.ch += 1;
	}
}

function HomeGrowLeftOverRam(ns, home, servers, stats, serversSumMoney) {
	const h = ns.getServer(home);
	const leftoverRam = Math.floor(h.maxRam - h.ramUsed);
	ns.print(`LeftoverRam for Growing: ${leftoverRam}`);
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];

		if (server.moneyMax <= 0) {
			continue;
		}

		if (server.moneyAvailable <= 0) {
			continue;
		}

		let threads = 1;
		let percentage = server.moneyMax / serversSumMoney;
		threads = (leftoverRam / hackScriptRam) * percentage;
		threads = Math.floor(threads - 1);
		if (threads <= 0)
			continue;

		ns.exec("grow.js", home, threads, server.hostname);
		// ns.tprint(`grow.js home ${threads} ${server.hostname}`);
		stats.tg += threads;
		stats.cg += 1;
	}
}