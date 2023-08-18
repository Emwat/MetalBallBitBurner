import factions from "./static/factions.js"
import StrLeft from "./im/strLeft.js"
import NumLeft from "./im/numLeft.js"
import ToDollars from "./im/carat.js"


/** @param {NS} ns */
export async function main(ns) {

	// ns.tprint(AfterPriceMultiplier(455000,0));
	// ns.tprint(AfterPriceMultiplier(455000,1));
	// ns.tprint(AfterPriceMultiplier(455000,2));

	let purchasedAugs = ns.singularity.getOwnedAugmentations(true);
	let augs = factions
		.map(factionName => {
		return ns
			.singularity
			.getAugmentationsFromFaction(factionName)
			.map(augName => {
				return {
					name: augName,
					faction: factionName,
					isMember: ns.singularity.getFactionRep(factionName) > 0,
					purchased: purchasedAugs.includes(augName),
					repReq: ns.singularity.getAugmentationRepReq(augName),
					preReq: ns.singularity.getAugmentationPrereq(augName),
					price: ns.singularity.getAugmentationPrice(augName),
					// price: ns.singularity.getAugmentationBasePrice(augName),
					...(CleanAugStats(ns.singularity.getAugmentationStats(augName)))
				}
			})
	})
	.filter(f => f.faction != "Shadows of Anarchy")
	.flat(2);

	// ns.write("/static/augs.txt", JSON.stringify(augs), "w");
	// return;

	if (ns.args[0] && !["h", "c", "max"].includes(ns.args[0])) {
		let foundArg = augs.find(aug => aug.name == ns.args[0]);
		if (!foundArg) {
			ns.tprint(`${ns.args[0]} was not found.`)
			return;
		}
		let foundArgOutput = "\r\n";
		Object.entries(foundArg).forEach(([key, value]) => {
			foundArgOutput += `${key.padEnd(25)}: ${value}\r\n`
		});
		ns.tprint(foundArgOutput);
		return;
	}

	function includesArgs(aug) {
		const argFunctions = [includesCombat, includesHacking];
		return argFunctions.every(func => func(ns, aug));
	}

	augs = augs.sort((a, b) => a.price - b.price);

	function NestedPrice(aug) {
		if (aug.preReq.length == 0)
			return aug.price;

		let preReqs = aug.preReq;
		let requiredPurchases = [];

		let uniqueValues = [];
		for (let i = 0; i < preReqs.length; i++) {
			const preReq = augs.find(f => f.name == preReqs[i]);
			const preReqName = preReq.name;
			if (uniqueValues.includes(preReqName)) {
				continue;
			}
			uniqueValues.push(preReqName);
			// ns.tprint({uniqueValues, preReqName})
			if (preReq.purchased)
				continue;
			requiredPurchases.push(preReq);
		}

		// ns.tprint("requiredPurchases:")
		// ns.tprint(requiredPurchases)
		// return requiredPurchases.length;
		return AfterPriceMultiplier(aug.price, requiredPurchases.length);
	}

	function NestedPriceStr(aug) {
		let nestedPrice = NestedPrice(aug);
		if (aug.price == nestedPrice)
			return "";
		return ToDollars(NestedPrice(aug));
	}

	ns.tprint(`Purple = You don't have enough rep`);

	let output = "\r\n";
	let names = new Set();
	for (let aug of augs) {
		const { name, isMember, repReq, price, purchased, faction } = aug;
		if (!isMember)
			continue;
		if (purchased)
			continue;
		if (names.has(name))
			continue;
		// if (!includesArgs(aug))
		// 	continue;

		names.add(name);

		output += "\r\n	" +
			StrLeft(ns.singularity.getFactionRep(faction) < repReq ? " \u001B[35m> " : " ", 3) +
			name.padEnd(52) +
			StrLeft(ToDollars(price), 10) +
			//NestedPrice(aug) + 
			StrLeft(NestedPriceStr(aug), 10) +
			StrLeft(ToDollars(repReq), 10) +
			// StrLeft(includesArgs(aug) ? "1" : "", 2) +
			StrLeft(includesCombat(aug) ? " c " : "", 3) +
			StrLeft(includesHacking(aug) ? " h " : "", 3) +
			faction.padEnd(10) +
			"\u001b[0m";
	}
	ns.tprint(`You have \$${ToDollars(ns.getServerMoneyAvailable("home"))}`);
	let arg0 = ns.args[0];
	if (["h"].includes(arg0)) {
		augs = augs.reverse();
		CommitToPurchases(ns, augs, true, false)
	} else if (["c"].includes(arg0)) {
		augs = augs.reverse();
		CommitToPurchases(ns, augs, false, true)
	} else if (["max"].includes(arg0)) {
		augs = augs.reverse();
		CommitToPurchases(ns, augs, true, true)
	} else {

		ns.tprint(output);
	}
	// ns.write("/qsin/augs.txt", JSON.stringify(factionAugs), "w");
}

function ShtStr(str) {
	if (str.length < 30)
		return str;
	return `${str.slice(0, 15)}...${str.slice(str.length - 15)}`
}

function includesCombat(aug) {
	return (
		aug.strength > 1 ||
		aug.strength_exp > 1 ||
		aug.defense > 1 ||
		aug.defense_exp > 1 ||
		aug.dexterity > 1 ||
		aug.dexterity_exp > 1 ||
		aug.agility > 1 ||
		aug.agility_exp > 1
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

function includesBlade(aug) {
	return (
		bladeburner_max_stamina > 1 ||
		bladeburner_stamina_gain > 1 ||
		bladeburner_analysis > 1 ||
		bladeburner_success_chance > 1
	);
}

function CommitToPurchases(ns, augs, isBuyingHacks = false, isBuyingCombat = false) {
	let m = 0;
	for (let aug of augs) {
		const myMoney = ns.getServerMoneyAvailable("home");
		const { name, isMember, repReq, price, purchased, faction } = aug;
		if (!isMember)
			continue;
		if (purchased)
			continue;
		if (!(isBuyingCombat && isBuyingHacks)) {
			if (isBuyingHacks && !includesHacking(aug))
				continue;
			if (isBuyingCombat && !includesCombat(aug))
				continue;
		}
		if (ns.singularity.getFactionRep(faction) < repReq)
			continue;

		const closestRepAug = augs
			.find(f => f.isMember && !f.purchased && f.faction_rep > 1 &&
				ns.singularity.getFactionRep(f.faction) > f.repReq);

		if (closestRepAug) {
			let afterNextPrice = AfterPriceMultiplier(closestRepAug.preReq, m + 1) + AfterPriceMultiplier(price);
			if (afterNextPrice > myMoney) {
				if (ns.singularity.purchaseAugmentation(closestRepAug.faction, closestRepAug.name)) {
					ns.tprint(`Bought ${closestRepAug.name} ahead of ${name}`)
					continue;
				}
			}
		}

		if (ns.singularity.purchaseAugmentation(faction, name)) {
			ns.tprint(`Bought ${name}`)
		}
	}
	ns.tprint(`After augmentations, you have \$${ToDollars(ns.getServerMoneyAvailable("home"))}`);
}

function AfterPriceMultiplier(price, iteration) {
	let output = price;
	for (let i = 0; i < iteration; i++) {
		output *= 1.9;
	}
	return output;
}

function CleanAugStats(aug) {
	let output = {};
	Object.entries(aug).forEach(([key, value]) => {
		if (value != 1)
			output[key] = value;
	})
	return output;
}