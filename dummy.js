/** @param {NS} ns */
import AlphExec from "./im/exec"
import GetServers from "./im/servers"
import GetTargets from "./im/topTarget"

const hackScriptRam = 1.7;
const coreScriptRam = 1.75;
const alphScriptRam = 2.2;
let myHackingLevel;
export async function main(ns) {
	myHackingLevel = ns.getHackingLevel();
	const hostnames = GetServers(ns);
	let servers = hostnames.map(m => ns.getServer(m));
	servers = servers.filter(f => myHackingLevel > f.requiredHackingSkill);

	let serversSumMoney = GetServersSumMoney(servers);




	ns.tprint(`serversSumMoney: ${serversSumMoney}`);

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
		const leftoverRam = Math.floor(h.maxRam - h.ramUsed - 10);
		//const leftoverRam = h.maxRam - Math.floor(hackScriptRam * 10);


		for (let i = 0; i < servers.length; i++) {
			const server = servers[i];
			let isTooStrong = server.requiredHackingSkill > myHackingLevel;
			// ns.tprint(`${server.requiredHackingSkill} ${myHackingLevel} ${isTooStrong}`)

			if (server.moneyMax <= 0) {
				continue;
			}

			if (isTooStrong) {
				// ns.print(`Skipped ${server.hostname} b/c ${server.requiredHackingSkill}`);
				continue;
			}

			// if (server.moneyAvailable == server.moneyMax) {
			// 	if (ns.kill("grow.js", home, server.hostname)) {
			// 		stats.k += 1;
			// 		continue;
			// 	}
			// }

			// DoWeakGrow(ns, server, stats)
			let threads = 1;
			let percentage = server.moneyMax / serversSumMoney;
			threads = (leftoverRam / alphScriptRam) * percentage;
			threads = Math.floor(threads - 1);
			
			if (threads <= 0)
				threads = 1;

			if (AlphExec(ns, home, server.hostname, threads) > 0) {
				// ns.tprint(`S -- AlphExec(${home}, ${server.hostname}, ${threads})`);
				stats.a += threads;
				stats.t += threads;
				stats.c += 1;
			} else {
				ns.tprint(`F -- AlphExec(${home}, ${server.hostname}, ${threads})`);
			}

		}
		ns.disableLog("exec");
		ns.tprint(`w ${stats.w} g ${stats.g} threads: ${stats.t} targets: ${stats.c} killed: ${stats.k}`)
		break;
		await ns.sleep(60000 * 5);
	}

}

function GetServersSumMoney(servers) {
	let serversSumMoney = 0;
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		const isTooStrong = server.requiredHackingSkill > myHackingLevel;

		if (server.moneyMax <= 0) {
			continue;
		}

		if (isTooStrong) {
			continue;
		}
		serversSumMoney += server.moneyMax;
	}
	return serversSumMoney;
}

function DoWeakGrow(ns, server, stats, leftoverRam) {
	let threads = 1;
	let percentage = server.moneyMax / serversSumMoney;
	threads = (leftoverRam / coreScriptRam) * percentage;
	threads = Math.floor(threads - 1);
	// ns.tprint(`${leftoverRam} / ${coreScriptRam} * ${percentage} (${server.moneyMax} ${serversSumMoney})`)

	if (threads <= 0)
		threads = 2;

	// ns.print(`${server.hostname} ${percentage} ${threads}`);

	const threadsWeak = Math.floor(threads * 0.69);
	if (threadsWeak > 0) {
		if (ns.exec("weak.js", home, threadsWeak, server.hostname) == 0)
			ns.print(`failed ns.exec(weak.js, home, ${threadsWeak}, ${server.hostname})`);
	}

	const threadsGrow = Math.floor(threads * 0.29);
	if (threadsGrow > 0) {
		if (ns.exec("grow.js", home, threadsGrow, server.hostname) == 0)
			ns.print(`failed ns.exec(grow.js, home, ${threadsGrow}, ${server.hostname})`);
	}
	stats.w += threadsWeak;
	stats.g += threadsGrow;
	stats.t += threadsWeak + threadsGrow;
	stats.c += 1;
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
		const hackScript = "alph.js";
		const coreThreads = Math.floor(server.maxRam / alphScriptRam);
		const hackThreads = Math.floor(server.maxRam / alphScriptRam);

		if (server.maxRam <= 0) {
			// if (server.moneyMax > 0)
			// 	serversWithMoney.push(server.hostname);
			continue;
		}

		if (server.hostname == "home")
			continue;

		if (server.hostname.startsWith("pserv"))
			continue;

		if (hackThreads <= 0)
			continue;

		if (!server.hasAdminRights)
			continue;

		if (server.requiredHackingSkill > myHackingLevel)
			continue;

		ns.killall(server.hostname);
		ns.scp(hackScript, server.hostname);

		if (server.moneyMax <= 0 || server.requiredHackingSkill / 2 > myHackingLevel) {
			//ns.print(serversWithMoney[j]);

			AlphExec(ns, server.hostname, serversWithMoney[j]);
			//ns.exec(hackScript, server.hostname, hackThreads, serversWithMoney[j]);
			//ns.print(`${myScript} ${server.hostname} ${threads} serversWithMoney[${j}]: ${serversWithMoney[j]}`);
			if (j > 0)
				j -= 1;
			else
				j = serversWithMoney.length - 1;
		}
		else {
			AlphExec(ns, server.hostname, server.hostname);
			continue;

			if (false) { }
			else if (server.hackDifficulty > server.minDifficulty + 5) {
				ns.exec("weak.js", server.hostname, coreThreads, server.hostname);
			}
			else if (server.moneyAvailable < server.moneyMax * 0.75) {
				ns.exec("grow.js", server.hostname, coreThreads, server.hostname);
			}
			else {
				ns.exec(hackScript, server.hostname, hackThreads, server.hostname);
			}
		}
	}

	// ns.tprint("-----------servers with money adjusted");
	// for(let i = 0; i < serversWithMoney.length;i++)
	// {
	// 	ns.tprint(serversWithMoney[i]);
	// }
}

