/** @param {NS} ns */
// weak.js

const saveFile = "record.txt";
const dataFile = "data.txt";

export async function main(ns) {
	const target = ns.args[0];
	while (true) {
		let timeA = new Date();
		ns.print(timeA.toLocaleString());
		let weakAmt = await ns.weaken(target);
		let timeB = new Date();
		let record = { timeA, timeB, target, weakAmt };
		CapRecording(ns);
		if (IsRecording(ns))
			ns.write("record.txt", JSON.stringify(record) + ",", "a");
	}
}

function CapRecording(ns) {
	let r = ns.read(saveFile);
	if (r == "")
		return;
	let rows = JSON.parse("[" + r.slice(0, -1) + "]");
	if (rows.length > 100) {
		r = r.substring(r.indexOf("}") + 2);
		ns.write(saveFile, r, "w");
	}
}

function IsRecording(ns) {
	const blacklist = [
		"home"
	];
	try {
		let data = JSON.parse(ns.read(dataFile));
		return blacklist.indexOf(data.hostname) == -1;
	} catch
	{

	}
	return true;

}