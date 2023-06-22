/** @param {NS} ns */
// alph.js

const saveFile = "record.txt";
const dataFile = "data.txt";

export async function main(ns) {
	const [target, moneyThresh, securityThresh] = ns.args;

	while (true) {
		let timeA = new Date();
		ns.print(timeA.toLocaleString());
		let timeB = new Date();
		let record = null;

		if (ns.getServerSecurityLevel(target) > securityThresh) {
			let weakAmt = await ns.weaken(target);
			record = { timeA, timeB, target, weakAmt };
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			let growAmt = await ns.grow(target);
			record = { timeA, timeB, target, growAmt };
		} else {
			let hackAmt = await ns.hack(target);
			record = { timeA, timeB, target, hackAmt };
		}
		CapRecording(ns);
		if (record && IsRecording(ns))
			ns.write(saveFile, JSON.stringify(record) + ",", "a");
	}

}

function CapRecording(ns) {
	let r = ns.read(saveFile);
	if (r == "")
		return;
	let rows = JSON.parse("[" + r.slice(0, -1) + "]");
	if (rows.length > 100)
	{
		r = r.substring(r.indexOf("}") + 2);
		ns.write(saveFile, r, "w");
	}
}

function IsRecording(ns) {
	const blacklist = [
		"home"
	];

	let data = JSON.parse(ns.read(dataFile));
	return blacklist.indexOf(data.hostname) == -1;
}