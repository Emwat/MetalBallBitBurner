/** @param {NS} ns */
// weak.js

export async function main(ns) {
	const target = ns.args[0];
	while (true) {
		ns.print(new Date().toLocaleString());
		await ns.weaken(target);
	}
}
