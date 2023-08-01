import GetServers from './im/servers';
import TopTargets from './im/topTarget';
import AlphExec from './im/exec';
import ToDollars from './im/carat'
import NumLeft from './im/numLeft'
import ZeroLeft from './im/zeroLeft'
import StrLeft from './im/strLeft'

/** @param {NS} ns */
export async function main(ns) {
	const arg0 = ns.args[0];

	if (ns.args.length == 0) {
		ns.tprint(`No args found. Program did not run. Args are 
			rename
			script
			script [target] [a/w/g/h]
			upgrade
			om >> upgrade lowest ram server to max
			calc
			info >> PrintPServInfo
			l >> PrintPServInfo isExcludingMoreInfo = true
			max >> all servers w/ max ram
			hq >> loopThreads
			k >> kill

			`);
	} else if (arg0 == "rename") {
		RenamePServ(ns);
	} else if (arg0 == "script") {
		const [ignoreMe, target, myArg] = ns.args;
		if (myArg) {
			PushOneScript(ns, target, myArg);
		} else if (target) {
			PushOneScript(ns, target, "a");
		} else {
			PushScriptToMany(ns);
		}
		ns.exec("power.js", "home", 1);

	} else if (arg0 == "upgrade") {
		Upgrade_All_P_Servers(ns, ns.args[1] || 128);
	} else if (arg0 == "upgradehax") {
		ns.tail();
		Upgrade_All_P_Servers_Hax(ns, ns.args[1]);
	}
	else if (arg0 == "om") {
		//ns.tail();
		UpgradePServOM(ns);
	} else if (arg0 == "calc") {
		PrintPServCalc(ns);
	} else if (arg0 == "info") {
		PrintPServInfo(ns);
	}
	else if (arg0 == "l") {
		PrintPServInfo(ns, true);
	} else if (arg0 == "max") {
		Upgrade_P_Servers_To_Max(ns);
	} else if (arg0 == "hq") {
		const [ignoreMe, loopThreads] = ns.args;
		await HQMain(ns, loopThreads || 1);
	} else if (arg0 == "k") {
		KillPServScripts(ns);
	}

	else {
		ns.tprint("No args found.");
	}

	ns.tprint("pserv.js end " + new Date().toLocaleString());
}

function GetAllPServ(ns, otherName) {
	const allServers = ns.scan("home");
	return allServers.filter(a => a.indexOf(otherName || "pserv-") == 0);
}

const burners = [
	"weak.js",
	"grow.js",
	"hack.js"
];

function PushScriptToMany(ns) {
	const allServers = GetAllPServ(ns);
	let topTargets = TopTargets(ns);
	topTargets = topTargets.splice(0, Math.floor(topTargets.length / 2));
	let t = 0;

	// ns.tprint("test top targets");
	// for(let i = 0; i < topTargets.length; i++) ns.tprint(topTargets[i]);

	const coreRam = 1.75;
	const hackjsRam = 1.7;
	const alphjsRam = 2.2;
	for (let i = 0; i < allServers.length; i++) {
		const server = allServers[i];
		const serverObject = ns.getServer(server);
		let threads = Math.floor(serverObject.maxRam / coreRam);

		const target = topTargets[t]; t++; if (t >= topTargets.length) t = 0;
		if (threads == 0)
			continue;

		function ApplyScript(myScript, server, threads, target) {
			ns.scriptKill(myScript, server);
			ns.scp(myScript, server);
			if (threads > 0)
				ns.exec(myScript, server, threads, target);
		}

		const wThreads = Math.floor(threads * 0.2);
		const gThreads = Math.floor(threads * 0.2);
		const hThreads = Math.floor(threads * 0.1);

		ns.scriptKill("alph.js", server);
		ApplyScript("weak.js", server, wThreads, target);
		ApplyScript("grow.js", server, gThreads, target);
		ApplyScript("hack.js", server, hThreads, target);

		// const ramLeftover = serverObject.maxRam - ns.getServer(server).ramUsed;
		// const ramLeftOverThreads = Math.floor(ramLeftover / alphjsRam);
		// if (ramLeftOverThreads > 0) 
		AlphExec(ns, server, target);


		ns.tprint(`${server} ${target} -t ${wThreads} ${gThreads} ${hThreads}`)

	}
}

function PushOneScript(ns, target, myArg) {
	const allServers = GetAllPServ(ns);
	const coreRam = 1.75;
	const hackjsRam = 1.7;
	const alphjsRam = 2.2;
	let ram = coreRam;
	if (false) { }
	else if (myArg == "a") ram = alphjsRam;
	else if (myArg == "g") ram = coreRam;
	else if (myArg == "w") ram = coreRam;
	else if (myArg == "h") ram = hackjsRam;

	for (let i = 0; i < allServers.length; i++) {
		const server = allServers[i];
		const serverObject = ns.getServer(server);
		let threads = Math.floor(serverObject.maxRam / ram);
		if (threads == 0)
			continue;

		ns.scriptKill("alph.js", server);
		for (let b = 0; b < burners.length; b++) {
			const burner = burners[b];
			ns.scriptKill(burner, server);
		}

		if (false) { }
		else if (myArg == "a") AlphExec(ns, server, target);
		else if (myArg == "g") ns.exec("grow.js", server, threads, target);
		else if (myArg == "w") ns.exec("weak.js", server, threads, target);
		else if (myArg == "h") ns.exec("hack.js", server, threads, target);
		ns.tprint(`${myArg} ${server} ${target} -t ${threads}`)

	}
}

function GetMaxAffordableRam(ns) {
	let costs = [2];
	const myMoney = ns.getServerMoneyAvailable("home");
	let maxAffordableRam = 0;
	for (let i = 2; i < 30; i++) {
		costs.push(Math.pow(2, i));
	}

	const servers = 25;
	for (let i = 0; i < costs.length; i++) {
		const cost = ns.getPurchasedServerCost(costs[i]) * servers;
		if (myMoney > cost)
			maxAffordableRam = costs[i];
		else
			break;
	}
	return maxAffordableRam;
}

function PrintPServCalc(ns) {
	const costs = [2];
	for (let i = 2; i < 30; i++) {
		costs.push(Math.pow(2, i));
	}

	const servers = GetAllPServ(ns);
	const maxRam = ns.getServer(servers[servers.length - 1]).maxRam;
	ns.tprint(`You have ${servers.length} private servers. The last server has ${maxRam} ram.`);
	for (let i = 0; i < costs.length; i++) {
		const cost = ns.getPurchasedServerCost(costs[i]);
		let costAllServers = cost * servers.length;
		let readableCostAllServers = ToDollars(cost * servers.length);
		let readableCostMaxServers = ToDollars(cost * ns.getPurchasedServerLimit());
		// if (!isFinite(cost))
		// {
		// 	const adjCost = ns.getPurchasedServerCost(costs[0])/Math.pow(10,3) * i * 2;

		// 	costAllServers = adjCost * servers.length;

		// }

		ns.tprint(
			" " + NumLeft(i + 1, 3) +
			" " + NumLeft(costs[i], 6) +
			" " + NumLeft(cost, 13) +
			" " + NumLeft(costAllServers, 13) +
			// " " + readableCostAllServers +
			" " + readableCostMaxServers
		);
	}
}

function PrintPServInfo(ns, isExcludingMoreInfo = false) {
	const servers = GetAllPServ(ns); // string[]
	let output = "\r\n";
	let sum = 0;
	let avg = 0;

	for (let i = 0; i < servers.length; i++) {
		const server = ns.getServer(servers[i]); // object[]
		const processes = ns.ps(servers[i]);
		let serverIncome = 0;
		let moreInfo = "";
		for (let j = 0; j < processes.length; ++j) {
			const process = processes[j];

			if (!process)
				continue;

			if (process.args.length == 0)
				continue;

			serverIncome += ns.getScriptIncome("alph.js", server.hostname, ...process.args);
			serverIncome += ns.getScriptIncome("hack.js", server.hostname, ...process.args);

			function shortName(filename) {
				if (filename == "chrg.js") return "c";
				if (filename == "alph.js") return "a";
				if (filename == "grow.js") return "g";
				if (filename == "weak.js") return "w";
				if (filename == "hack.js") return "h";
			}
			if (!isExcludingMoreInfo)
				moreInfo += StrLeft(shortName(process.filename) + " " + "".concat(process.args), 20);
		}

		serverIncome = Math.floor(serverIncome);
		sum += serverIncome;
		output +=
			" " + StrLeft(server.hostname, 13) +
			" " + StrLeft(server.ramUsed + "/" + server.maxRam, 20) +
			" " + NumLeft(serverIncome, 13) +
			" " + StrLeft(moreInfo, 13) +
			"\r\n";


	}
	avg = Math.floor(sum / servers.length);
	sum = Math.floor(sum);
	ns.tprint("--------------------------tbbbmmmkkk000");
	ns.tprint(output);
	ns.tprint("--------------------------tbbbmmmkkk000");
	ns.tprint("sum: " + ToDollars(sum) + " avg: " + ToDollars(avg));


}

function Upgrade_P_Servers_To_Max(ns) {
	const allServers = GetAllPServ(ns);
	const ram = GetMaxAffordableRam(ns);
	ns.tprint(`You started with ${ToDollars(ns.getServerMoneyAvailable("home"))}`);
	for (let i = 0; i < allServers.length; i++) {
		const server = allServers[i];
		const cost = ns.getPurchasedServerCost(ram);
		if (ns.getServerMoneyAvailable("home") > cost) {
			const oldRam = ns.getServer(server).maxRam;
			// ns.tprint(`debug ${server} ${cost}`)
			if (oldRam >= ram)
				continue;
			else if (ns.upgradePurchasedServer(server, ram))
				ns.tprint(`Upgraded ${server} from ${oldRam} to ${ram}.`);
		} else {
			ns.tprint(`You did not have enough money at ${i}.`)
			break;
		}
	}
}

function RenamePServ(ns) {
	const allServers = GetAllPServ(ns, ns.args[1]);
	let newServers = [];
	for (let i = 0; i < allServers.length; i++) {
		const server = allServers[i];
		const newName = "tmpserv-" + i;
		if (ns.renamePurchasedServer(server, newName))
			newServers.push(newName);
	}

	for (let i = 0; i < newServers.length; i++) {
		const server = newServers[i];
		ns.tprint(`${allServers[i]} / ${server} / pserv-${ZeroLeft(i, 2)}`);
		ns.renamePurchasedServer(server, "pserv-" + ZeroLeft(i, 2));
	}
}

function Upgrade_All_P_Servers(ns, ram) {
	const allServers = GetAllPServ(ns);

	for (let i = 0; i < allServers.length; i++) {
		const server = allServers[i];
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			if (ns.upgradePurchasedServer(server, ram))
				ns.tprint(`Upgraded ${server} to ${ram}.`);
		} else {
			ns.tprint(`You did not have enough money at ${i}.`)
			break;
		}
	}
}

function Upgrade_All_P_Servers_Hax(ns, power) {
	const allServers = GetAllPServ(ns);

	for (let i = 0; i < allServers.length; i++) {
		const server = allServers[i];
		if (ns.upgradePurchasedServer(server, 2 ** power)) {
			ns.tprint(`Upgraded ${server} to 2 ** ${power}.`);
		} else {
			break;
		}
	}
}

async function HQMain(ns, loopThreads) {
	const allServers = GetAllPServ(ns);
	const servers = GetServers(ns).map(m => ns.getServer(m));
	let threads = 200;
	let looped = 1;
	let output = 0;
	let o = 0;
	for (let i = 0; i < loopThreads; i++) {
		for (let p = 0; p < allServers.length; p++) {
			const pserver = allServers[p];
			o = HQHelper(ns, servers, threads, pserver);
			output += o;
			if (o == 0)
				break;
			looped++;
		}
		if (o == 0)
			break;
		await ns.sleep(1000 * 1);
	}
	ns.tprint(`Applied a total of ${output} threads. (Looped ${looped} times)`)
}

function HQHelper(ns, servers, threads, host) {
	let output = 0;
	const myHackingLevel = ns.getHackingLevel();
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		let isTooStrong = server.requiredHackingSkill > myHackingLevel;
		let lessThreads = threads;
		let capAtSilverHelix = 10 ** 9;
		let capAtSyscore = 10 ** 10;
		let capAtTaiyang = 10 ** 10 * 2;
		// ns.tprint(`${server.requiredHackingSkill} ${myHackingLevel} ${isTooStrong}`)
		let t = 0;
		if (server.moneyMax <= 0) {
			continue;
		}

		if (isTooStrong) {
			continue;
		}

		if (server.moneyMax < capAtSilverHelix) {
			lessThreads = Math.floor(lessThreads * 0.20);
			if (AlphExec(ns, host, server.hostname, lessThreads) > 0) { t++ }

		} else if (server.moneyMax < capAtSyscore) {
			lessThreads = Math.floor(lessThreads * 0.40);

			if (AlphExec(ns, host, server.hostname, lessThreads) > 0) { t++ }
			// if (ns.exec("weak.js", host, lessThreads, server.hostname) > 0) { t++ }
			// if (ns.exec("grow.js", host, lessThreads, server.hostname) > 0) { t++ }
			// if (ns.exec("hack.js", host, lessThreads, server.hostname) > 0) { t++ }
		} else if (server.moneyMax < capAtTaiyang) {
			lessThreads = Math.floor(lessThreads * 0.60);

			if (AlphExec(ns, host, server.hostname, lessThreads) > 0) { t++ }
			// if (ns.exec("weak.js", host, lessThreads, server.hostname) > 0) { t++ }
			// if (ns.exec("grow.js", host, lessThreads, server.hostname) > 0) { t++ }
			// if (ns.exec("hack.js", host, lessThreads, server.hostname) > 0) { t++ }
		} else {
			if (AlphExec(ns, host, server.hostname, lessThreads) > 0) { t++ }
			// if (ns.exec("weak.js", host, lessThreads, server.hostname) > 0) { t++ }
			// if (ns.exec("grow.js", host, lessThreads, server.hostname) > 0) { t++ }
			// if (ns.exec("hack.js", host, lessThreads, server.hostname) > 0) { t++ }
		}


		output += lessThreads * t;

	}
	// ns.tprint(`Applied ${output} threads.`);
	return output;
}

function KillPServScripts(ns) {
	let allServers = GetAllPServ(ns);
	for (let p = 0; p < allServers.length; p++) {
		ns.scriptKill("chrg.js", allServers[p]);
		ns.scriptKill("weak.js", allServers[p]);
		ns.scriptKill("grow.js", allServers[p]);
		ns.scriptKill("hack.js", allServers[p]);
		ns.scriptKill("alph.js", allServers[p]);
	}
}

function UpgradePServOM(ns) {
	let x = 21;
	while (x > 3) {
		let attemptRam = 2 ** x;
		let hostname = FindWeakestServer(ns);
		if (ns.upgradePurchasedServer(hostname, attemptRam)) {
			ns.tprint(`Upgraded server ${hostname} with ${attemptRam} ram. (2 ** ${x})`)
			break;
		}
		x--;
	}
}

function FindWeakestServer(ns) {
	let allServers = GetAllPServ(ns);
	
	let output = { hostname: "undefined", maxRam: 2 ** 21 };
	for (let i = 0; i < allServers.length; i++) {
		let server = ns.getServer(allServers[i]);
		if (server.maxRam < output.maxRam)
			output = server;
	}
	return output.hostname;
}