import factions from "./static/factions.js"
import cities from './static/cities.js'
import StrLeft from "./im/strLeft.js"
import NumLeft from "./im/numLeft.js"
import ToDollars from "./im/carat.js"
import colors from './im/colors'

/** @param {NS} ns */
export async function main(ns) {

	// ns.tprint(AfterPriceMultiplier(455000,0));
	// ns.tprint(AfterPriceMultiplier(455000,1));
	// ns.tprint(AfterPriceMultiplier(455000,2));
	let augs = GetAugmentations(ns);

	// ns.write("/static/augs.txt", JSON.stringify(augs), "w");
	// return;

	augs = augs.sort((a, b) => a.price - b.price);

	ns.tprint(`You have \$${ToDollars(ns.getServerMoneyAvailable("home"))}`);
	let arg0 = ns.args[0];
	if (ns.args.length == 0) { 
		ns.tprint(`
	B >> BUY
	l >> list
	lc >> list augs for the cities
	lr >> list review. See all augs
	[AUGMENT] >> analyze augment and list data
		`);
	}	else if (arg0 == "B") {
		augs = augs.reverse();
		CommitToPurchases(ns, augs, ns.args.includes("h"), ns.args.includes("c"))
	} else if (arg0 == "l") {
		ListAugs(ns, augs);
	} else if (arg0 == "lc") {
		ListAugs(ns, augs, false, true);
	} else if (arg0 == "lr") {
		ListAugs(ns, augs, true, false);
	} else {
		AnalyzeAug(ns, augs);
	}
	// ns.write("/qsin/augs.txt", JSON.stringify(factionAugs), "w");
}

function GetAugmentations(ns){
	let purchasedAugs = ns.singularity.getOwnedAugmentations(true);

	return factions
		.map(factionName => {
			return ns
				.singularity
				.getAugmentationsFromFaction(factionName)
				.map(augName => {
					return {
						name: augName,
						faction: factionName,
						isMember: ns.getPlayer().factions.includes(factionName),
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
}

function ShtStr(str, max) {
	if (str.length < max)
		return str;
	let half = Math.floor(max / 2);
	return `${str.slice(0, half)}...${str.slice(str.length - half)}`
}

const filterBuying = {
	c: (aug) => includesCombat(aug)
	, h: (aug) => includesHacking(aug)
	, b: (aug) => includesBlade(aug)
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

/** @param {NS} ns */
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

function ShortFactionName(faction) {
	let split = faction.split(" ");
	if (faction == "Four Sigma")
		return faction;
	if (split[0] == "The")
		return faction;
	if (split.length > 1)
		return split[0];
	return faction;
}

function GetNestedPrice(aug, augs) {
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

function NestedPriceStr(aug, augs) {
	let nestedPrice = GetNestedPrice(aug, augs);
	if (aug.price == nestedPrice)
		return "";
	return ToDollars(GetNestedPrice(aug, augs));
}

/** @param {NS} ns */
function ListAugs(ns, augs, isReview = false, isCityReview = false) {
	let output = "\r\n";

	let names = new Set();
	for (let aug of augs) {
		const { name, isMember, repReq, price, purchased, faction } = aug;
		if (!isReview && !isCityReview && !isMember)
			continue;
		if (purchased)
			continue;

		if (names.has(name))
			continue;
		// if (!includesArgs(aug))
		// 	continue;

		names.add(name);

		let augFactions = augs
			.filter(f => f.name == name)
			.map(m => { return { name: ShortFactionName(m.faction), isMember: m.isMember } });

		if (isCityReview && !augFactions.some(af => cities.includes(af.name)))
			continue;

		if (!isCityReview){
			augFactions = augFactions
				.filter(f => isReview || f.isMember)
				.map(m => m.name)
				.join(", ") + (augFactions.length == 1 ? "*" : "");
		} else {
			augFactions = (augFactions.length == 1 ? "*" : " ") + cities.map(c => {
				// let inTheseCities = augFactions.filter(af => af.name == c);
				// return inTheseCities.length == 1 ? c : null;
				return augFactions.some(af => af.name == c) ? c[0] : "-";
			}).filter(f => f).join("").trim();
		}

		let isPurchasedStr = isReview && purchased ? colors.white : "";

		output += "\r\n	" +
			StrLeft(ns.singularity.getFactionRep(faction) < repReq ? `${colors.purple} > ` : " ", 3) +
			isPurchasedStr +
			name.padEnd(52) +
			StrLeft(ToDollars(price), 10) +
			//NestedPrice(aug) + 
			StrLeft(NestedPriceStr(aug, augs), 10) +
			StrLeft(ToDollars(repReq), 10) +
			// StrLeft(includesArgs(aug) ? "1" : "", 2) +
			StrLeft(includesCombat(aug) ? " c " : "", 3) +
			StrLeft(includesHacking(aug) ? " h " : "", 3) +
			augFactions +
			colors.reset;
	}
	ns.tprint(`Purple = You don't have enough rep`);
	ns.tprint(output);
}

function AnalyzeAug(ns, augs) {
	let augTarget = ns.args.length == 1 ? ns.args[0] : ([...ns.args]).join(" ");
	let foundAugs = augs.filter(aug => aug.name == augTarget?.trim());
	let foundArgOutput = "\r\n";

	if (foundAugs.length == 0) {
		ns.tprint(`${ns.args[0]} was not found.`)
		return;
	}
	Object.entries(foundAugs[0]).forEach(([key, value]) => {
		if (key == "faction")
			foundArgOutput += `	${key.padEnd(25)}: ` +
				foundAugs.map(fa => fa.faction).join(`\r\n	${"".padStart(25)}  `) + "\r\n"
		else
			foundArgOutput += `	${key.padEnd(25)}: ${value}\r\n`
	});
	ns.tprint(foundArgOutput);
}
