/** @param {NS} ns */
// grow.js

export async function main(ns) {
	const target = ns.args[0];
	while (true) {
		ns.print(new Date().toLocaleString());
		await ns.grow(target);
	}
}
