/** @param {NS} ns */
export async function main(ns) {
	ns.tprint(GetTotalEquipmentCost(ns));
}


const rootkits =
	[
		"NUKE Rootkit"
		, "Soulstealer Rootkit"
		, "Demon Rootkit"
		, "Hmap Node"
		, "Jack the Ripper"
	];

function GetTotalEquipmentCost(ns) {
	let total = 0;
	Object.values(rootkits).forEach(r => {
		const e = ns.gang.getEquipmentCost(r);
		total += e;
		ns.tprint(`${r} ${e} ${total}`);
	});
	return total;
}
