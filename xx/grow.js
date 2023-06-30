/** @param {NS} ns */
// grow.js

const betaTxt = "beta.txt";
const thisTxt = "this.txt";

export async function main(ns) {
	const target = ns.args[0];
	while (true) {
		let timeA = new Date();
		ns.print(timeA.toLocaleString());
		let growAmt = await ns.grow(target);
		let timeB = new Date();
		let record = { timeA, timeB, target, growAmt };
		CapRecording(ns);
		if (IsRecording(ns))
			ns.write(betaTxt, JSON.stringify(record) + ",", "a");
	}
}

function CapRecording(ns) {
	let r = ns.read(betaTxt);
	if (r == "")
		return;
	let rows = JSON.parse("[" + r.slice(0, -1) + "]");
	if (rows.length > 100) {
		r = r.substring(r.indexOf("}") + 2);
		ns.write(betaTxt, r, "w");
	}
}

function IsRecording(ns) {
	const blacklist = [
		"home"
	];

	try {
		let data = JSON.parse(ns.read(thisTxt));
		return blacklist.indexOf(data.hostname) == -1;
	} catch
	{

	}
	return true;
}
