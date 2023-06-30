import GetServers from "./im/servers"
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"
import ToDollars from "./im/carat"
import GetTarget from "./im/target"
import Visual from "./im/visual"

/** @param {NS} ns */

let RedTarget;
let MyHackingSkill;
const white = "\u001b[37m";

export async function main(ns) {
	await ns.sleep(200);
	ns.disableLog("scan");
	RedTarget = GetTarget(ns);
	MyHackingSkill = ns.getHackingLevel();

	const wArgIndex = ns.args.indexOf("-w");
	const iArgIndex = ns.args.indexOf("-i") > -1;

	// if the argument is a number, 
	// wait Number minutes and then run
	if (wArgIndex > -1) {
		let xMinutes = ns.args[wArgIndex + 1];
		if (isNaN(xMinutes))
		{
			ns.tprint(`${xMinutes} is not a number. It is ${typeof xMinutes}`)
			return;
		}
		const minute = 60000;
		const waitTime = minute * xMinutes;
		ns.tprint(`This program will run in ${xMinutes} minute(s).`);
		await ns.sleep(waitTime);
		MainHelper(ns, GetStats(ns, iArgIndex))
	} else {
		MainHelper(ns, GetStats(ns, iArgIndex));
	}

	ns.tprint(`length.js ended. ${new Date().toLocaleString()}`);
}

function MainHelper(ns, stats) {
	
	PrintHeaders(ns);
	let totals = DeclareTotals();
	stats = stats.sort((a, b) => a.moneyMax - b.moneyMax);
	let info = [];
	let j = 1;
	for (let i = 0; i < stats.length; i++) {
		const server = stats[i];
		if (server.t == 0)
			continue;

		AddToTotal(totals, server);
		ns.tprint(PrintInfo(server, j));
		j++;
		// info.push(PrintInfo(server));
	}
	// ns.tprint(info.concat([]));
	if (totals.count == 1)
		return;
	PrintLineBreak(ns);
	ns.tprint(PrintInfo(totals));
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
		a: 0,
		w: 0,
		g: 0,
		h: 0,
		t: 0,
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
	totals.a += server.a;
	totals.g += server.g;
	totals.w += server.w;
	totals.h += server.h;
	totals.t += server.t;
	totals.i += server.i;
	totals.count += 1;
}

function GetStats(ns, isSortByIncome) {
	const hosts = GetServers(ns).sort();
	// const hosts = ["home"].concat(GetServers(ns)).sort();
	let stats = [];

	for (let i = 0; i < hosts.length; i++) {
		const server = hosts[i];
		let serverObject = ns.getServer(server);
		serverObject.a = 0;
		serverObject.w = 0;
		serverObject.g = 0;
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
			if (process.filename == "weak.js") serverObject.w += process.threads;
			if (process.filename == "grow.js") serverObject.g += process.threads;
			if (process.filename == "hack.js") serverObject.h += process.threads;
			if (process.filename == "hack.js") serverObject.i += ns.getScriptIncome("hack.js", hosts[i], process.args[0]);


		}
	}
	if(isSortByIncome)
		stats.sort((a, b) => a.i - b.i);
	else 
		stats.sort((a, b) => a.moneyMax - b.moneyMax)
	return stats;
}

const vertical = " |X| ";

function PrintHeaders(ns) {
	ns.tprint(
		StrLeft("", 3) +
		" " + StrLeft("moneyAvail", 13) +
		" " + StrLeft("moneyMax", 13) +
		" " + StrLeft("Thresh", 6) +
		" " + StrLeft("use/maxRam", 11) +
		" " + StrLeft("min/HacDif", 12) +
		" " + StrLeft("reqHac", 6) +
		vertical +
		" " + StrLeft("alph", 6) +
		" " + StrLeft("weak", 6) +
		" " + StrLeft("grow", 6) +
		" " + StrLeft("hack", 6) +
		" " + StrLeft("thread", 10) +
		" " + StrLeft("income", 12) +

		" " + "name" +
		" " + new Date().toLocaleString());
}

function PrintLineBreak(ns) {
	let str =
		StrLeft("", 3) +
		" " + StrLeft("tbbbmmmkkk000", 13) +
		" " + StrLeft("tbbbmmmkkk000", 13) +
		" " + StrLeft("", 6) +
		" " + StrLeft("", 11) +
		" " + StrLeft("", 12) +
		" " + StrLeft("", 6) +
		vertical +
		" " + StrLeft("", 6) +
		" " + StrLeft("", 6) +
		" " + StrLeft("", 6) +
		" " + StrLeft("", 6) +
		" " + StrLeft("", 10) +
		" " + StrLeft("tbbbmmmkkk000", 12) +

		" ";

		str = str.replaceAll(" ","-");
		ns.tprint(str);
		return str;
}

function PrintInfo(server, i) {
	let hasMoneyPercentage = server.moneyAvailable / server.moneyMax * 100;
	let hasNoMoneyScripts = server.a == 0 && server.h == 0 && (server.w + server.g) > 0;

	return "" +
		NumLeft(i, 3) +
		Visual(server, RedTarget, MyHackingSkill) +
		(hasNoMoneyScripts ? white : "") +
		" " + NumLeft(server.moneyAvailable, 13) +
		" " + NumLeft(server.moneyMax, 13) +
		" " + NumLeft(hasMoneyPercentage, 6) +
		" " + StrLeft(`${NumLeft(Math.ceil(server.ramUsed))} / ${NumLeft(server.maxRam, 4)}`, 11) +
		" " + StrLeft(`${NumLeft(server.minDifficulty, 3)} / ${NumLeft(Math.floor(server.hackDifficulty), 3)}`, 12) +
		" " + NumLeft(server.requiredHackingSkill, 6) +
		vertical +
		" " + NumLeft(server.a, 6) +
		" " + NumLeft(server.w, 6) +
		" " + NumLeft(server.g, 6) +
		" " + NumLeft(server.h, 6) +
		" " + NumLeft(server.t, 10) +
		" " + StrLeft(ToDollars(server.i) + "", 12) +
		" " + server.hostname +
		"";
}
