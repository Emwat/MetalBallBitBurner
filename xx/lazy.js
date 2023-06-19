/** @param {NS} ns */
export async function main(ns) {
	const h = "home";
	ns.tprint("I'm lazy...");
	ns.exec("afteraugs.js", h);
	ns.exec("net.js", h);
	// ns.spawn("purchase.js");
	// ns.spawn("pserv.js", "rename");
	// ns.spawn("pserv.js", "max");
	// ns.spawn("pserv.js", "script");
	ns.exec("homeHelper.js", h, "many")
	ns.tprint("Yeah... ok.");
}