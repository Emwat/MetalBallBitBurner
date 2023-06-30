/** @param {NS} ns */
export async function main(ns) {
	let [action, target] = ns.args;
	let amt = 0;
	if (action == "w")
	amt = await ns.weaken(target);
	else if (action == "g")
	amt = await ns.grow(target);
	else if (action == "h")
	amt = await ns.hack(target);

	ns.tprint(action + " " + amt);
}