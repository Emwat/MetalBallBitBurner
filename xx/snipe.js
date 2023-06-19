/** @param {NS} ns */

// 06/12/2023 10:59 AM
// I have no idea how to do this.
export async function main(ns) {
	if (!ns.args) {
		ns.tprint(`No argument found. Ending program.`)
		return;
	}
	const target = ns.args[0];
	let pathway = ["home"];
	PushOn(ns, pathway, "home", target, 0);
	PrintPathway(ns, pathway);
	ns.tprint("end program.");

}

function PushOn(ns, pathway, currentNode, target, route) {
	let nextDepth = ns.scan(currentNode);
	for (let n = route; n < nextDepth.length; n++) {
		const node = nextDepth[n];
		if (node == target) {
			pathway.push(node);
			return;
		}
		if (pathway.indexOf(node) < 0) {
			
			pathway.push(node);
			PushOn(ns, pathway, node, target);
			break;
		}
	};
	route += 1;


}

function PrintPathway(ns, pathway) {
	let output = "connect " + pathway[1] + "; ";
	for (let i = 2; i < pathway.length; i++) {
		output += " connect " + pathway[i] + "; ";
	}
	ns.tprint(output);
}

function old() {
	let servers = ns.scan("home");
	const target = ns.args[0];
	let pathways = [];
	for (let i = 0; i < servers.length; i++) {
		let pathway = [];
		const server = servers[i];
		const moreServers = ns.scan(server);
		//ns.tprint(server);
		for (let j = 0; j < moreServers.length; j++) {
			const thisJServer = moreServers[j];
			if (pathway.indexOf(thisJServer) < 0) {
				pathway.push(thisJServer);
			}

			if (servers.indexOf(thisJServer) < 0) {
				servers.push(thisJServer);
			}
		}
		pathways.push(pathway);
	}

	let output = "";
	for (let i = 0; i < pathways.length; i++) {
		const pathway = pathways[i];
		// if (pathway.indexOf(target) == -1)
		// 	continue;

		for (let j = 0; j < pathway.length; j++) {
			output += pathway[j] + " > ";
		}
		output += "\r\n";
	}
	ns.tprint(output);
}