import ToDollars from './im/carat'
import StrLeft from './im/strLeft'
import colors from './im/colors'

let numberOfSleeves; // ns.getNumSleeves();

/** @param {NS} ns */
export async function main(ns) {
	let { numSleeves, argRabbit, argParams } = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;


	ns.tprint(!argParams.includes("p") ? `Purchasing augs...` : "Previewing augs...");
	if (argRabbit || argRabbit == "0") {
		PurchaseAugs(argRabbit, ns, argParams);
	}
	else
		loop(ns, PurchaseAugs, [ns, argParams]);

}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numberOfSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}

/** @param {NS} ns */
function GetSleeveAugMenu(sleeveNumber, ns) {
	let statics = JSON.parse(ns.read("/static/augs.txt"));
	let sleeveAugMenu = ns.sleeve.getSleevePurchasableAugs(sleeveNumber);

	sleeveAugMenu = sleeveAugMenu.map(augPair => {
		let savedData = statics.find(s => s.name == augPair.name);
		return {
			...savedData,
			name: augPair.name,
			cost: augPair.cost
		}
	});

	sleeveAugMenu = sleeveAugMenu.sort((a, b) => b.cost - a.cost);
	return sleeveAugMenu;
}

/** @param {NS} ns */
function PurchaseAugs(sleeveNumber, ns, argParams) {
	let sleeveAugMenu = GetSleeveAugMenu(sleeveNumber, ns);

	// let combatSleeves = [0, 1, 2, 3, 4];
	// let isCombat = combatSleeves.includes(sleeveNumber);
	//let partyLength = (isCombat ? combatSleeves.length : numberOfSleeves - combatSleeves.length);
	// if (argParams.includes("max")) {
	// 	partyLength = numberOfSleeves;
	// }

	let preview = "\r\n";
	let isPreview = argParams.includes("p");
	let isCombat = argParams.includes("c");
	let total = 0;
	for (let aug of sleeveAugMenu) {
		let myMoney = ns.getServerMoneyAvailable("home");
		let inShoppingCart = true;

		if (aug.name == "Z.O.Ë.")
			inShoppingCart = false;
		// if (myMoney < aug.cost * partyLength)
		// 	continue;

		if (isCombat) {
			if (!includesCombat(aug))
				inShoppingCart = false;
		}

		if (isPreview) {
			preview += (inShoppingCart ? "" : colors.black)
				+ aug.name.padEnd(40)
				+ " " + StrLeft(ToDollars(aug.cost, true), 7)
				+ " " + getSimpleAugString(aug)
				+ colors.reset + "\r\n";
			if (inShoppingCart)
				total += aug.cost;
			continue;
		}

		if (inShoppingCart)
			ns.sleeve.purchaseSleeveAug(sleeveNumber, aug.name);
	}
	preview += "\r\n" + "Total".padEnd(40)
		+ " " + StrLeft(ToDollars(total), 7)
		+ "\r\n";
	if (argParams.includes("p")) {
		ns.tprint(preview);
	}
}

const shorthandInfo = {
	strength: "str"
	, strength_exp: "strXP"
	, defense: "def"
	, defense_exp: "defXP"
	, dexterity: "dex"
	, dexterity_exp: "dexXP"
	, agility: "agi"
	, agility_exp: "agiXP"
	, hacking: "hack"
	, hacking_chance: "h%"
	, hacking_money: "h$"
	, hacking_exp: "hXP"
	, hacking_grow: "h+"
	, hacking_speed: "h>"
	, charisma: "cha"
	, charisma_exp: "chaXP"
	, hacknet_node_purchase_cost: "nnN"
	, hacknet_node_level_cost: "nnL"
	, hacknet_node_ram_cost: "nnR"
	, hacknet_node_core_cost: "nnC"
	, hacknet_node_money: "nn$"
	, work_money: "w$"
	, company_rep: "compRep"
	, crime_money: "crime$"
	, crime_success: "crime%"
	, faction_rep: "facRep"
	, bladeburner_analysis: "bbFA"
	, bladeburner_max_stamina: "bbHP"
	, bladeburner_stamina_gain: "bbHP+"
	, bladeburner_success_chance: "bb%"
}


function getSimpleAugString(aug) {
	return Object.entries(aug).filter(f => shorthandInfo[f[0]] && f[1] != 1).map(([key, value]) => {
		let shorthand = shorthandInfo[key];
		return `${shorthand} ${value}`;
	}).join(", ")

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
		aug.hacking_speed > 1
	);
}