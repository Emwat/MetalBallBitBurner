/** @param {NS} ns */
const numSleeves = 6; // ns.getNumSleeves();

const crimeTypes = [
	"Shoplift"
	, "Rob Store"
	, "Mug"
	, "Larceny"
	, "Deal Drugs"
	, "Bond Forgery"
	, "Traffick Arms"
	, "Homicide"
	, "Grand Theft Auto"
	, "Kidnap"
	, "Assassination"
];

const classes = ["Computer Science", "Data Structures", "Networks", "Algorithms", "Management", "Leadership"]

const cities = ["Sector-12", "Aevum", "Volhaven", "Chongqing", "New Tokyo", "Ishima"];

export async function main(ns) {
	// const argRabbit = ns.args[0];
	const argAction = ns.args[0];
	const argParams = ns.args[1];
	const toAllSleeves = true; // argRabbit == "max";

	if (!argAction) {
		ns.tprint(emptyArgsError());
		return;
	}

	if (!toAllSleeves && isNaN(ns.args[1])) {
		ns.tprint("You must enter \"max\" or a number for the second argument.")
		ns.tprint(`sli.js ${ns.args.concat()} ended. ${new Date().toLocaleString()}`)
		return;
	}

	if (false) { }
	else if (argAction == "t") {
		let myFunc = function (x) { ns.tprint(ns.sleeve.getTask(x)) };
		if (toAllSleeves) loop(ns, myFunc);
		else ns.sleeve.getTask(argRabbit);
	}
	else if (argAction == "c") {
		let crimeType = crimeTypes.filter(f => f[0] == argParams.toUpperCase())[0];
		if (toAllSleeves) loop(ns, ns.sleeve.setToCommitCrime, [crimeType]);
		else ns.sleeve.setToCommitCrime(argRabbit, crimeType);
	}
	else if (argAction == "j") {
		// setToCompanyWork(sleeveNumber, companyName) 	Set a sleeve to work for a company.

	}
	else if (argAction == "r") {
		// travel(sleeveNumber, city) 	Make a sleeve travel to another city.
		let myCity = argParams.ToUpperCase();

		myCity = cities.filter(f => f[0] == myCity)[0];
		if (toAllSleeves) loop(ns, ns.sleeve.travel, [myCity]);
		else ns.sleeve.travel(argRabbit, myCity);

	}
	else if (argAction == "f") {
		// setToFactionWork(sleeveNumber, factionName, factionWorkType) 	Set a sleeve to work for a faction.

	}
	else if (argAction == "g") {
		// setToGymWorkout(sleeveNumber, gymName, stat) 	Set a sleeve to workout at the gym.

	}
	else if (argAction == "s") {
		if (toAllSleeves) loop(ns.sleeve.setToShockRecovery);
		else ns.sleeve.setToShockRecovery(argRabbit);
	}
	// else if (argAction == "sy") {
	// 	if (toAllSleeves) loop(ns.sleeve.setToSynchronize);
	// 	else ns.sleeve.setToSynchronize(argRabbit);
	// }
	else if (argAction == "u") {
		// UniversityClassType":{"computerScience":"Computer Science","dataStructures":"Data Structures",
		// "networks":"Networks","algorithms":"Algorithms","management":"Management","leadership":"Leadership"}}}
		// setToUniversityCourse(sleeveNumber, university, className) 	
		// Set a sleeve to take a class at a university.
		const universities = [
			"Summit University"
		];


		if (toAllSleeves) loop(ns.sleeve.setToUniversityCourse);
		else ns.sleeve.setToUniversityCourse(argRabbit);
	} else {
		ns.tprint(`${argAction} is an invalid argument.`)
	}
	ns.tprint(`sli.js ${ns.args.concat()} ended. ${new Date().toLocaleString()}`)
}

	// "Shoplift"
	// , "Mug"
	// , "Larceny"
	// , "Deal Drugs"
	// , "Bond Forgery"
	// , "Traffick Arms"
	// , "Homicide"
	// , "Grand Theft Auto"
	// , "Kidnap"
	// , "Assassination"

function emptyArgsError() {
	return `You haven't entered any arguments. Valid arguments are
	
	argAction:

		t >> getTask

		c [crime: s/m/l/h... ]>> commit crime
		f >> faction
		WIP >> g >> gym
		WIP >> j >> job
		r [city: s/a/v/c/n/i] >> travel 
		s >> shock recovery
		u >> university
	
	argRabbit: 
		max
		1/2/3/4/5/6
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