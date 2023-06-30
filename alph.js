/** @param {NS} ns */
// alph.js

export async function main(ns) {
	const [target, moneyThresh, securityThresh] = ns.args;

	while (true) {
		ns.print(new Date().toLocaleString());

		if (ns.getServerSecurityLevel(target) > securityThresh) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}
