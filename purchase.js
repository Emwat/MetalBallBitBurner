import AlphExec from './im/exec' //ExecutiveFunction(ns, myScript, target)
import GetTarget from './im/target'
import ZeroLeft from './im/zeroLeft'

/** @param {NS} ns */

// 25 servers, 8 GB, $3.2m

export async function main(ns) {
	const arg = ns.args[0];
	// if (!arg) {
	// 	ns.tprint("No args found. Available arguments are " +
	// 		"\r\n i - FindIterator" +
	// 		"\r\n p - Make Purchases" +
	// 		"\r\n\r\nEnding program.")
	// 	return;
	// }

	let ram = 8;

	if (arg == "i") {
		ns.tprint(FindIterator(ns));
	} else if (arg == "p") {
		await MakePurchases(ns, ram);
	} else {
		await MakePurchases(ns, ram);
	}

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