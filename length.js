import GetServers from "./im/servers"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"
import ToDollars from "./im/carat"
import GetTarget from "./im/target"
import Visual from "./im/visual"

/** @param {NS} ns */

let RedTarget;
let MyHackingSkill;

export async function main(ns) {
	await ns.sleep(200);
	ns.disableLog("scan");
	const arg = ns.args[0];
	RedTarget = GetTarget(ns);
	MyHackingSkill = ns.getHackingLevel();

	// if the argument is a number, 
	// wait Number minutes and then run
	if (arg && !isNaN(arg)) {
		const minute = 60000;
		const waitTime = minute * arg;
		ns.tprint(`This program will run in ${arg} minute(s).`);
		await ns.sleep(waitTime);
		MainHelper(ns)
	} else {
		MainHelper(ns);
	}
}

function MainHelper(ns) {
	let stats = GetStats(ns);
	PrintHeaders(ns);
	let totals = DeclareTotals();
	stats = stats.sort((a, b) => a.moneyMax - b.moneyMax);
	for (let i = 0; i < stats.length; i++) {
		const server = stats[i];
		if (server.t == 0)
			continue;

		AddToTotal(totals, server);
		PrintInfo(ns, server);
	}
	if (totals.count == 1)
		return;
	PrintLine(ns);
	PrintInfo(ns, totals);
}

function DeclareTotals() {
	return {
		moneyAvailable: 0,
		moneyMax: 0,
		ramUsed: 0,
		maxRam: 0,
		minDifficulty: 0,
		hackDifficulty: 0,
		// requiredHackingSkill: 1,
		t: 0,
		a: 0,
		g: 0,
		w: 0,
		h: 0,
		i: 0,
		hostname: "Totals",
		count: 0
	};
}

function AddToTotal(totals, server) {
	totals.moneyAvailable += server.moneyAvailable;
	totals.moneyMax += server.moneyMax;
	totals.ramUsed += server.ramUsed;
	totals.maxRam += server.maxRam;
	totals.minDifficulty += server.minDifficulty;
	totals.hackDifficulty += server.hackDifficulty;
	// if (server.requiredHackingSkill > totals.requiredHackingSkill)
	// 	totals.requiredHackingSkill = server.requiredHackingSkill;
	totals.t += server.t;
	totals.a += server.a;
	totals.g += server.g;
	totals.w += server.w;
	totals.h += server.h;
	totals.i += server.i;
	totals.count += 1;
}

function PrintLine(ns) {
	let s = 
		" " + StrLeft("bmmmkkk000", 13) +
		" " + StrLeft("bmmmkkk000", 13) +
		" " + StrLeft("", 6) +
		" " + StrLeft("", 10) +
		" " + StrLeft("", 12) +
		" " + StrLeft("", 6) +
		" " + StrLeft("", 10) +
		" " + StrLeft("", 6) +
		" " + StrLeft("", 6) +
		" " + StrLeft("", 6) +
		" " + StrLeft("", 6) +
		" " + StrLeft("bmmmkkk000", 12) +

		" ";

		s = s.replaceAll(" ","-");
		ns.tprint(s);
}

function GetStats(ns) {
	const hosts = GetServers(ns).sort();
	let stats = [];

	for (let i = 0; i < hosts.length; i++) {
		const server = hosts[i];
		let serverObject = ns.getServer(server);
		serverObject.a = 0;
		serverObject.g = 0;
		serverObject.w = 0;
		serverObject.h = 0;
		serverObject.t = 0;
		serverObject.i = 0;


		stats.push(serverObject);
	}

	for (let i = 0; i < hosts.length; i++) {
		const processes = ns.ps(hosts[i]);
		for (let j = 0; j < processes.length; ++j) {
			const process = processes[j];
			if (!process)
				continue;

			if (process.args.length == 0)
				continue;


			const server = process.args[0];
			let serverObject = stats.filter(f => f.hostname == server)[0];
			// ns.tprint(`${hosts[i]} ${server} ${process.filename}`)

			function incrementIncome(serverObject, host, process) {
				serverObject.i +=
					ns.getScriptIncome("alph.js",
						host,
						...process.args
					);

			}

			if (serverObject) serverObject.t += process.threads;
			if (process.filename == "alph.js") serverObject.a += process.threads;
			if (process.filename == "alph.js") incrementIncome(serverObject, hosts[i], process);
			if (process.filename == "grow.js") serverObject.g += process.threads;
			if (process.filename == "weak.js") serverObject.w += process.threads;
			if (process.filename == "hack.js") serverObject.h += process.threads;
			if (process.filename == "hack.js") serverObject.i += ns.getScriptIncome("hack.js", hosts[i], process.args[0]);


		}
	}

	return stats;
}

function PrintHeaders(ns) {
	ns.tprint(
		" " + StrLeft("moneyAvail", 13) +
		" " + StrLeft("moneyMax", 13) +
		" " + StrLeft("Thresh", 6) +
		" " + StrLeft("use/maxRam", 10) +
		" " + StrLeft("min/HacDif", 12) +
		" " + StrLeft("reqHac", 6) +
		" " + StrLeft("thread", 10) +
		" " + StrLeft("alpha", 6) +
		" " + StrLeft("grow", 6) +
		" " + StrLeft("weak", 6) +
		" " + StrLeft("hack", 6) +
		" " + StrLeft("income", 12) +

		" " + "name" +
		" " + new Date().toLocaleString());
}
const excludeDecimal = true;

function PrintInfo(ns, server) {
	let isAboveThresh = server.moneyAvailable > (server.moneyMax * 0.75);

	ns.tprint(
		Visual(server, RedTarget, MyHackingSkill) +
		" " + NumLeft(server.moneyAvailable, 13) +
		" " + NumLeft(server.moneyMax, 13) +
		" " + StrLeft((isAboveThresh ? "Ready" : ""), 6) +
		" " + StrLeft(`${Math.ceil(server.ramUsed)} / ${server.maxRam}`, 10) +
		" " + StrLeft(`${server.minDifficulty} / ${Math.floor(server.hackDifficulty)}`, 12) +
		" " + NumLeft(server.requiredHackingSkill, 6) +
		" " + NumLeft(server.t, 10) +
		" " + NumLeft(server.a, 6) +
		" " + NumLeft(server.g, 6) +
		" " + NumLeft(server.w, 6) +
		" " + NumLeft(server.h, 6) +
		" " + NumLeft(server.i, 12) +
		" " + server.hostname);
}
