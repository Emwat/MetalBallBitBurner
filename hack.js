/** @param {NS} ns */
// hack.js

export async function main(ns) {
	const target = ns.args[0];
	while (true) {
		let timeA = new Date();
		ns.print(timeA.toLocaleString());
		let hackAmt = await ns.hack(target);
		let timeB = new Date();
		let record = { timeA, timeB, target, hackAmt };
		if (IsRecording(ns, target))
			ns.write("record.txt", JSON.stringify(record) + ",", "a");
	}
}

function IsRecording(ns, target) {
	const blacklist = [
		"n00dles"
		, "foodnstuff"
		, "darkweb"
		, "home"
		, "sigma-cosmetics"
		, "joesguns"
		, "nectar-net"
		, "hong-fang-tea"
		, "harakiri-sushi"
		, "neo-net"
		, "CSEC"
		, "zer0"
		, "max-hardware"
	];
	const recordTextLength = 150;
	if (ns.read("record.txt").length > recordTextLength * Math.pow(10, 7))
		return false;
	return blacklist.indexOf(target) == -1;
}
