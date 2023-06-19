import TopTargets from './im/topTarget';
import CopyNukeExe from './im/exec';
import ToDollars from './im/carat'
import NumLeft from './im/numLeft'
import ZeroLeft from './im/zeroLeft'
import StrLeft from './im/strLeft'

/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length == 0) {
		ns.tprint("No args found. Program did not run. Args are " +
			"\r\n rename" +
			"\r\n script" +
			"\r\n script [target] [a/w/g/h]" +
			"\r\n upgrade" +
			"\r\n calc" +
			"\r\n");
	} else if (ns.args[0] == "rename") {
		RenamePServ(ns);
	} else if (ns.args[0] == "script") {
		const [ignoreMe, target, myArg] = ns.args;
		if (myArg) {
			PushOneScript(ns, target, myArg);
		} else {
			PushScriptToMany(ns);
		}

	} else if (ns.args[0] == "upgrade") {
		UpgradePServ(ns);
	} else if (ns.args[0] == "calc") {
		PrintPServCalc(ns);
	} else if (ns.args[0] == "info") {
		PrintPServInfo(ns);
	} else if (ns.args[0] == "max") {
		PrintPServMax(ns);
	}

	else {
		ns.tprint("No args found.");
	}

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
	for (let i = 0; i < allServers.length; i++) {
		const server = allServers[i];
		const serverObject = ns.getServer(server);
		let threads = Math.floor(serverObject.maxRam / coreRam);
		threads = Math.floor(threads / 3);
		const target = topTargets[t]; t++; if (t >= topTargets.length) t = 0;
		if (threads == 0)
			continue;

		ns.scriptKill("alph.js", server);
		for (let b = 0; b < burners.length; b++) {
			const burner = burners[b];
			ns.scriptKill(burner, server);
			ns.scp(burner, server);
			ns.exec(burner, server, threads, target);
		}

		const ramLeftover = serverObject.maxRam - serverObject.ramUsed;
		const ramLeftOverThreads = Math.floor(ramLeftover / hackjsRam);
		if (ramLeftover > 1 && ramLeftOverThreads > 0) {
			ns.exec(burners[2], server, ramLeftOverThreads, target);
		}

		ns.tprint(`${server} ${target} -t ${threads} * 3`)

	}
}

function PushOneScript(ns, target, myArg) {
	const allServers = GetAllPServ(ns);
	let t = 0;

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
		else if (myArg == "a") ns.exec("alph.js", server, threads, target);
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
		ns.tprint(
			" " + NumLeft(costs[i], 6) +
			" " + NumLeft(cost, 13) +
			" " + NumLeft(cost * servers.length, 13) +
			" " + StrLeft(ToDollars(cost * servers.length))
		);
	}
}

function PrintPServInfo(ns) {
	const servers = GetAllPServ(ns); // string[]
	let output = "\r\n";

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
				if (filename == "alph.js") return "a";
				if (filename == "grow.js") return "g";
				if (filename == "weak.js") return "w";
				if (filename == "hack.js") return "h";
			}
			moreInfo += StrLeft(shortName(process.filename) + " " + "".concat(process.args), 20);
		}
		serverIncome = Math.floor(serverIncome);


		output += 
			" " + StrLeft(server.hostname, 13) +
			" " + StrLeft(server.ramUsed + "/" + server.maxRam, 20) +
			" " + StrLeft("$" + serverIncome, 13) +
			" " + StrLeft(moreInfo, 13) +
			"\r\n";

	}

	ns.tprint(output);
}

function PrintPServMax(ns) {
	const allServers = GetAllPServ(ns);
	const ram = GetMaxAffordableRam(ns);
	ns.tprint(`You started with ${ToDollars(ns.getServerMoneyAvailable("home"))}`);
	for (let i = 0; i < allServers.length; i++) {
		const server = allServers[i];
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			const oldRam = ns.getServer(server).maxRam;
			if (ns.upgradePurchasedServer(server, ram))
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

function UpgradePServ(ns) {
	const allServers = GetAllPServ(ns);
	const ram = ns.args[1] || 128;

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