/** @param {NS} ns */
import GetServers from "./im/servers"
import ZeroLeft from "./im/zeroLeft"

const saveFile = "record.txt";
const dataFile = "data.txt";

export async function main(ns) {
	const servers = GetServers(ns);

	if (ns.args.length == 0) {
		WriteDataTxtToAllServers(ns, servers);
	} else if (ns.args[0] == "reset") {
		for (let i = 0; i < servers.length; i++) {
			const server = servers[i];
			ns.rm(saveFile, server);
		}
	}


	ns.tprint(`power.js end ` + new Date().toLocaleString());
}

function WriteDataTxtToAllServers(ns, servers) {
	ns.tprint(`Writing ${dataFile} to all servers.`);
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
	ns.write(dataFile, JSON.stringify(data), "w");
	ns.scp(dataFile, server, "home");
}
