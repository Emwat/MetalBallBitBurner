/** @param {NS} ns */
const numSleeves = 6; // ns.getNumSleeves();
export async function main(ns) {
	const arg0 = ns.args[0];
	const arg1 = ns.args[1];
	const toAllSleeves = ns.args[1] == "max";

	if (!arg0) {
		ns.tprint(emptyArgsError());
		return;
	}

	if (!toAllSleeves && isNaN(ns.args[1])) {
		ns.tprint("You must enter \"max\" or a number for the second argument.")
		ns.tprint(`sli.js ${ns.args.concat()} ended. ${new Date().toLocaleString()}`)
		return;
	}

	if (false) { }
	else if (arg0 == "t") {
		let myFunc = function (x) { ns.tprint(ns.sleeve.getTask(x)) };
		if (toAllSleeves) loop(ns, myFunc);
		else ns.sleeve.getTask(arg1);
	}
	else if (arg0 == "c") {
		// setToCommitCrime(sleeveNumber, crimeType) 	Set a sleeve to commit crime.

	}
	else if (arg0 == "j") {
		// setToCompanyWork(sleeveNumber, companyName) 	Set a sleeve to work for a company.

	}
	else if (arg0 == "r") {
		// travel(sleeveNumber, city) 	Make a sleeve travel to another city.
		let myCity = ns.args[2].ToUpperCase();
		const cities = [
			"Sector-12","Aevum","Volhaven","Chongqing","New Tokyo","Ishima"
		];
		myCity = cities.filter(f => f[0] == myCity)[0];
		if (toAllSleeves) loop(ns, ns.sleeve.travel, [myCity]);
		else ns.sleeve.travel(arg1, myCity);

	}
	else if (arg0 == "f") {
		// setToFactionWork(sleeveNumber, factionName, factionWorkType) 	Set a sleeve to work for a faction.

	}
	else if (arg0 == "g") {
		// setToGymWorkout(sleeveNumber, gymName, stat) 	Set a sleeve to workout at the gym.

	}
	else if (arg0 == "s") {
		if (toAllSleeves) loop(ns.sleeve.setToShockRecovery);
		else ns.sleeve.setToShockRecovery(arg1);
	}
	// else if (arg0 == "sy") {
	// 	if (toAllSleeves) loop(ns.sleeve.setToSynchronize);
	// 	else ns.sleeve.setToSynchronize(arg1);
	// }
	else if (arg0 == "u") {
		// UniversityClassType":{"computerScience":"Computer Science","dataStructures":"Data Structures",
		// "networks":"Networks","algorithms":"Algorithms","management":"Management","leadership":"Leadership"}}}
		// setToUniversityCourse(sleeveNumber, university, className) 	
		// Set a sleeve to take a class at a university.
		const universities = [
				"Summit University"
		];
		const classes = [
			"Computer Science"
			, "Data Structures"
			, "Networks"
			, "Algorithms"
			, "Management"
			, "Leadership"
		]

		if (toAllSleeves) loop(ns.sleeve.setToUniversityCourse);
		else ns.sleeve.setToUniversityCourse(arg1);
	} else {
		ns.tprint(`${arg0} is an invalid argument.`)
	}
	ns.tprint(`sli.js ${ns.args.concat()} ended. ${new Date().toLocaleString()}`)
}

function emptyArgsError() {
	return `You haven't entered any arguments. Valid arguments are
	
	t >> getTask

	c >> commit crime
	f >> faction
	WIP >> g >> gym
	WIP >> j >> job
	r [city] >> travel [s/a/v/c/n/i]
	s >> shock recovery
	u >> university
	

	Make sure to enter the second argument as \"max\" or a number to specify the sleeve.
	`;
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numSleeves; i++) {
		myFunction(i, ...moreArgs);
	}
}

// getSleeveAugmentationPrice(augName) 	Get price of an augmentation.
// getSleeveAugmentationRepReq(augName) 	Get reputation requirement of an augmentation.
// getSleeveAugmentations(sleeveNumber) 	Get augmentations installed on a sleeve.
// getSleevePurchasableAugs(sleeveNumber) 	List purchasable augs for a sleeve.
// purchaseSleeveAug(sleeveNumber, augName) 	Purchase an aug for a sleeve.
// setToBladeburnerAction(sleeveNumber, action, contract) 	Set a sleeve to perform Bladeburner actions.