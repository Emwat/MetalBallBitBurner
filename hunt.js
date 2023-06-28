/** @param {NS} ns */
export async function main(ns) {
	ns.tail();
	// ns.disableLog("scan");
	GetAllServers(ns, ns.args[0], 0, 10);
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

		if (alreadyScanned.indexOf(server) == -1) {
			ns.tprint(power + " " + padd(server, power));
			ns.print(power + " " + padd(server, power));
			alreadyScanned.push(server);
		}

		GetAllServers(ns, server, power + 1, stopper)
	}

	return servers;
}

function padd(str, newLength) {
	try {
		let output = ">" + str;
		for (let i = str.length; i < newLength + str.length; i++) {
			output = "-" + output;
		}
		return output;
	} catch {
	}
	return output;

}