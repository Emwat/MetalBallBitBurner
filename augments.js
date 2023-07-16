/** @param {NS} ns */

import augs from "./static/augs"


export async function main(ns) {
	let arg0 = ns.args[0];

	if (arg0 == "a" || arg0 == "available")
	{
		let sleeveAugs = ns.sleeve.getSleevePurchasableAugs();

		
	}
}