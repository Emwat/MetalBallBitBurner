import AlphExec from './im/exec' //ExecutiveFunction(ns, myScript, target)
import GetTarget from './im/target'
import ZeroLeft from './im/zeroLeft'
import ToDollars from './im/carat'

/** @param {NS} ns */

// 25 servers, 8 GB, $3.2m

export async function main(ns) {
	const arg = ns.args[0];


	let ram = ns.args[1] || 8;

	if (!arg) {
		ns.tprint(`"No args found. Available arguments are " +
	c [ram] - Cost
	i - FindIterator
	p [ram]- Make Purchases
	
	Ending program."`)
		return;
	} else if (arg == "c" || arg == "cost") {
		let serverLimit = ns.getPurchasedServerLimit();
		ns.tprint(`With (${ram}) ram: ` +
			`  One Server: ${ToDollars(ns.getPurchasedServerCost(ram))} ` +
			`  ${serverLimit} Servers: ${ToDollars(ns.getPurchasedServerCost(ram) * serverLimit)}`);
	}
	else if (arg == "i") {
		ns.tprint(FindIterator(ns));
	} else if (arg == "p") {
		await MakePurchases(ns, ram);
	} else if (arg == "o") {
		let i = FindIterator(ns);
		let hostname = "pserv-" + ZeroLeft(i, 2);
		let newHostname = ns.purchaseServer(hostname, ram);
		if (newHostname != "") {
			ns.tprint(`Purchased server ${newHostname}.`)
		}
	} else if (arg == "om") {
		let x = 21;
		while (x > 0) {
			let attemptRam = 2 ** x;
			let i = FindIterator(ns);
			let hostname = "pserv-" + ZeroLeft(i, 2);
			let newHostname = ns.purchaseServer(hostname, attemptRam);
			if (newHostname != "") {
				ns.tprint(`Purchased server ${newHostname} with ${attemptRam} ram. (2 ** ${x})`)
				break;
			}
			x--;
		}

	} else {
		ns.tprint("no arguments found.")
	}

	ns.tprint(`purchase.js ${ns.args.concat()} ended.`);
}

function FindIterator(ns) {
	let servers = ns.scan("home");
	servers = servers.filter(s => s.indexOf("pserv-") == 0);
	return servers.length;
}

async function MakePurchases(ns, ram) {
	let i = FindIterator(ns);
	const myScript = "alph.js";

	const waitTime = 20;
	let target = GetTarget(ns);
	if (ns.args[1]) {
		ram = ns.args[1];
	}

	if (i == ns.getPurchasedServerLimit()) {
		ns.tprint("You already purchased all the servers.");
		ns.exec("pserv.js", "home", 1, "info");
		return;
	}

	while (i < ns.getPurchasedServerLimit()) {
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			let hostname = ns.purchaseServer("pserv-" + ZeroLeft(i, 2), ram);
			if (hostname)
				AlphExec(ns, hostname, target);
			++i;
		}
		await ns.sleep(waitTime);
	}
	ns.tprint(`Purchased ${i} servers.`);
	ns.exec("pserv.js", "home", 1, "rename");
}