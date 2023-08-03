
import augs from "./static/augs"


/** @param {NS} ns */
export async function main(ns) {
	let arg0 = ns.args[0];

	if (ns.args.length == 0 || arg0 == "a" || arg0 == "available")
	{
		let sleeveAugs = ns.sleeve.getSleeveAugmentations(1);
		let sleeveAugMenu = ns.sleeve.getSleevePurchasableAugs(1);
		let output = "\r\n";
		if (sleeveAugs.length == 0){
			ns.tprint(`There is nothing to buy.`);
			return;
		}
		for(let aug of sleeveAugs){
			output += aug.name + 
				aug.cost +
			"\r\n";
		}
		ns.tprint(output);

		
	}
}