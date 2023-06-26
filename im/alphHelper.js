/** @param {NS} ns */
export default function main(ns, server) {
	if (typeof server == "string") {
		server = ns.getServer(server);
	}

	const moneyThresh = ns.getServer(server).moneyMax * 0.75;
	const securityThresh = ns.getServer(server).hackDifficulty + 5;
	return [moneyThresh, securityThresh];
}

