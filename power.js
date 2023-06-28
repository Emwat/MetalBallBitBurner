/** @param {NS} ns */
import GetServers from "./im/servers"
import ZeroLeft from "./im/zeroLeft"

const betaTxt = "beta.txt";
const thisTxt = "this.txt";

export async function main(ns) {
	const servers = GetServers(ns);

	if (ns.args.length == 0) {
		WriteThisTxtToAllServers(ns, servers);
	} else if (ns.args[0] == "reset") {
		for (let i = 0; i < servers.length; i++) {
			const server = servers[i];
			ns.rm(betaTxt, server);
		}
	}


	ns.tprint(`power.js end ` + new Date().toLocaleString());
}

function WriteThisTxtToAllServers(ns, servers) {
	ns.tprint(`Writing ${thisTxt} to all servers.`);
	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		WriteData(ns, server);
	}

	for (let i = 0; i < 25; i++) {
		try {
			WriteData(ns, "pserv-" + ZeroLeft(i, 2));
		}
		catch
		{
			break;
		}
	}

	WriteData(ns, "home");
}

function WriteData(ns, server) {
	let data = ns.getServer(server);
	ns.write(thisTxt, JSON.stringify(data), "w");
	ns.scp(thisTxt, server, "home");
}
