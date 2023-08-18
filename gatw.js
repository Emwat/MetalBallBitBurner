
// 08/12/2023 11:13 PM
// untested. Realizing it doesn't work by the time I finished this code.

/** @param {NS} ns */
export async function main(ns) {
	let territory = ns.gang.getGangInformation().territory;
	territory = { prev: territory, current: territory };
	while (com(territory.prev) <= com(territory.current)) {
		territory.prev = territory.current;
		territory.current = ns.gang.getGangInformation().territory;
		ns.tprint(20000);
	}


}

function com(number) {
	return Math.floor(number * 100);
}