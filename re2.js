import factions from "./static/factions.js"
import StrLeft from "./im/strLeft.js"
import NumLeft from "./im/numLeft.js"
import ToDollars from "./im/carat.js"



/** @param {NS} ns */
export async function main(ns) {
	let augs = JSON.parse(ns.read("static/augs.txt"))
	let names = new Set();
	let output = "\r\n";
	let factions = [
		"idc"
		,"Church of the Machine God"
		,"Tian Di Hui"
		,"Aevum"
		,"Sector-12"
		
		,"Netburners"

		,"Slum Snakes"
		,"Tetrads"
		
	];

	let purchasedAugs = ns.singularity.getOwnedAugmentations(true);


	augs = augs.map(aug => {
		return {
			...aug,
			purchased: purchasedAugs.includes(augName),
			isMember: factions.includes(factionName),
		}
	});

	ns.tprint(`Purple = You don't have enough rep`);

	for (let aug of augs) {
		const { name, repReq, price, faction } = aug;
		if (names.has(name))
			continue;
		// if (!includesArgs(aug))
		// 	continue;

		names.add(name);

		output += "\r\n	" +
			StrLeft(ns.singularity.getFactionRep(faction) < repReq ? " \u001B[35m> " : " ", 3) +
			ShtStr(name).padEnd(35) +
			StrLeft(ToDollars(price), 10) +
			//NestedPrice(aug) + 
			//StrLeft(NestedPriceStr(aug), 10) +
			StrLeft(ToDollars(repReq), 10) +
			// StrLeft(includesArgs(aug) ? "1" : "", 2) +
			StrLeft(includesCombat(aug) ? " c " : "", 3) +
			StrLeft(includesHacking(aug) ? " h " : "", 3) +
			faction.padEnd(10) +
			"\u001b[0m";
	};
	ns.tprint(output);
}

function includesCombat(aug) {
	return (
		aug.strength > 1 ||
		aug.strength_exp > 1 ||
		aug.dexterity > 1 ||
		aug.dexterity_exp > 1
	);
}

function includesHacking(aug) {
	return (
		aug.hacking > 1 ||
		aug.hacking_chance > 1 ||
		aug.hacking_money > 1 ||
		aug.hacking_exp > 1 ||
		aug.hacking_grow > 1 ||
		aug.hacking_money > 1 ||
		aug.hacking_speed > 1
	);
}

function ShtStr(str) {
	if (str.length < 30)
		return str;
	return `${str.slice(0, 15)}...${str.slice(str.length - 15)}`
}
