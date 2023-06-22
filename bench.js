/** @param {NS} ns */
export async function main(ns) {
	let arguments = ns.args;
	const myScript = ns.args[0];
	arguments.shift();
	ns.exec("length.js", "home", 1);
	ns.exec(myScript, "home", 1, ...arguments);
	await ns.sleep(60000 * 10);
	ns.exec("length.js", "home", 1);
}