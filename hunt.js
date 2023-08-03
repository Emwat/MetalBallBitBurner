

// 07/26/2023 08:00 AM asked for help. Got told to get rid of power and stopper.

/** @param {NS} ns */
export async function main(ns) {
	const stopper = 15;
	ns.tail();
	ns.disableLog("scan");
	GetAllServers(ns, ns.args[0], 0, stopper);
}
let alreadyScanned = [];

function GetAllServers(ns, target, power, stopper) {
	if (power + 1 == stopper)
		return;

	if (target == "home") {
		// ns.tprint(power + " " + padd(target, power));
		// return;
	}

	// if (alreadyScanned.indexOf(target) > -1)
	// 	return;

	const servers = ns.scan(target);
	alreadyScanned.push(target);

	for (var i = 0; i < servers.length; i++) {
		const server = servers[i];
		if (server.substr(0, "pserv-".length) == "pserv-")
			continue;
		if (server.substr(0, "hacknet-".length) == "hacknet-")
			continue;

		if (alreadyScanned.indexOf(server) == -1) {
			ns.tprint(power + " " + padd(ns, server, power));
			ns.print(power + " " + padd(ns, server, power));
			alreadyScanned.push(server);
		}

		GetAllServers(ns, server, power + 1, stopper)
	}

	return servers;
}

function padd(ns, str, newLength) {
	try {
		let output = ">" + str;
		for (let i = str.length; i < newLength + str.length; i++) {
			output = "-" + output;
		}
		return output;
	} catch {
		ns.print({ error: "padd", str, newLength })
	}
	return output;

}