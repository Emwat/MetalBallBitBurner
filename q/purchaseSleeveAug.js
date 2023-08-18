let numberOfSleeves; // ns.getNumSleeves();

/** @param {NS} ns */
export async function main(ns) {
	let { numSleeves, argRabbit, argParams } = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;

	ns.tprint(`Purchasing augs...`);
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

	let combatSleeves = [0, 1, 2, 3, 4];
	let isCombat = combatSleeves.includes(sleeveNumber);
	let partyLength = (isCombat ? combatSleeves.length : numberOfSleeves - combatSleeves.length);
	if (argParams.includes("max")) {
		partyLength = numberOfSleeves;
	}

	for (let aug of sleeveAugMenu) {
		let myMoney = ns.getServerMoneyAvailable("home");

		if (myMoney < aug.cost * partyLength)
			continue;

		if (!argParams.includes("max")) {
			if (!isCombat && includesCombat(aug))
				continue;

			if (isCombat && !includesCombat(aug))
				continue;
		}


		ns.sleeve.purchaseSleeveAug(sleeveNumber, aug.name);
	}



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