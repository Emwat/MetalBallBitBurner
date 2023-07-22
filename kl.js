/** @param {NS} ns */
export async function main(ns) {
	const arg0 = ns.args[0];
	if (ns.scriptKill(arg0 + ".js", "home"))
		ns.tprint(`killed ${arg0}.js`);
	else
		ns.tprint(`Did not kill anything.`);

}