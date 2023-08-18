/** @param {NS} ns */
export async function main(ns) {
	let startingPower = ns.gang.getGangInformation().power;
	let currentPower = ns.gang.getGangInformation().power;
	let ms = 0;
	ns.disableLog("sleep");

	while (true) {
		let newPower = ns.gang.getGangInformation().power;
		if (newPower.toFixed(3) != currentPower.toFixed(3)) {
			ns.print({ ms, currentPower: currentPower.toFixed(3), newPower: newPower.toFixed(3) })
			currentPower = newPower;
			ms = 0;
		}

		await ns.sleep(20);
		ms += 20;
	}
}