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
	, "Heist"
];

const cities = ["Sector-12", "Aevum", "Volhaven", "Chongqing", "New Tokyo", "Ishima"];

const uniClasses = ["Computer Science", "Data Structures"
	, "Networks", "Algorithms", "Management", "Leadership"];

const universities = ["Rothman University", "Summit University", "ZB Institute of Technology"];

export async function main(ns) {
	// const argRabbit = ns.args[0];
	const [argAction, argParams] = ns.args;
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
		let crimeType = crimeTypes.find(f => f[0] == argParams.toUpperCase());
		if (argParams.toLowerCase() == "heist")
			crimeType = "Heist";

		ns.tprint(`Crime ${crimeType}`);
		if (toAllSleeves) loop(ns, ns.sleeve.setToCommitCrime, [crimeType]);
		else ns.sleeve.setToCommitCrime(argRabbit, crimeType);
	}
	else if (argAction == "j") {
		ns.tprint(`Company Time`);
		ns.tprint(`TO DO`);
		// setToCompanyWork(sleeveNumber, companyName) 	Set a sleeve to work for a company.

	}
	else if (argAction == "r") {
		let myCity = argParams.toUpperCase();
		ns.tprint(`Travel to ${myCity}`);

		myCity = cities.find(f => f[0] == myCity);
		if (toAllSleeves) loop(ns, ns.sleeve.travel, [myCity]);
		else ns.sleeve.travel(argRabbit, myCity);

	}
	else if (argAction == "f") {
		ns.tprint(`Faction`);
		ns.tprint("TO DO");
		// setToFactionWork(sleeveNumber, factionName, factionWorkType) 	Set a sleeve to work for a faction.

	}
	else if (argAction == "g") {
		ns.tprint(`Gym`);
		let gyms = ["Powerhouse Gym"];
		let stats = ["str", "def", "dex", "agi"]
		let gym = gyms[0];
		let stat = stats.find(f => f == argParams);
		ns.tprint(`${gym} ${stat}`);
		if (argParams == "all") {
			let i = 0;
			let s = 0;
			while (i < numSleeves) {
				if (s >= stats.length)
					s = 0;
				ns.sleeve.setToGymWorkout(i, gym, stats[s]);
				i++;
				s++;
			}
		} else {
			if (toAllSleeves) loop(ns, ns.sleeve.setToGymWorkout, [gym, stat]);
			else ns.sleeve.setToGymWorkout(argRabbit, gym, stat);
		}
		// setToGymWorkout(sleeveNumber, gymName, stat) 	Set a sleeve to workout at the gym.

	}
	else if (argAction == "s") {
		ns.tprint("Shock Recovery Time");
		if (toAllSleeves) loop(ns, ns.sleeve.setToShockRecovery);
		else ns.sleeve.setToShockRecovery(argRabbit);
	}
	// else if (argAction == "sy") {
	// 	if (toAllSleeves) loop(ns.sleeve.setToSynchronize);
	// 	else ns.sleeve.setToSynchronize(argRabbit);
	// }
	else if (argAction == "u") {

		//let takeUni = universities[0];
		let takeUni = "ZB Institute of Technology";
		let takeClass = uniClasses.find(f => f[0] == argParams.toUpperCase());

		ns.tprint(`University ${takeUni} ${takeClass}`);
		if (toAllSleeves) loop(ns, ns.sleeve.setToUniversityCourse, [takeUni, takeClass]);
		else ns.sleeve.setToUniversityCourse(argRabbit);
	} else if (argAction == "b") {
		let actions = [
			"Field Analysis"
			, "Recruitment"
			, "Diplomacy"
			, "Hyperbolic Regeneration Chamber"
			, "Infiltrate Synthoids"
			, "Support main sleeve"
			, "Take on contracts"
		]
		let contracts = [
			"Tracking"
			, "Bounty Hunter"
			, "Retirement"
		]
		if (argParams == "help") {
			let output = "";
			for (let x of actions) output += x + "\r\n	";
			output += "---\r\n	";
			for (let x of contracts) output += x + "\r\n	";
			ns.tprint(output);
			return;
		}

		let [ignoreMe, action, contract] = ns.args;
		ns.tprint({ action, contract })
		action = actions.find(f => f[0] == action?.toUpperCase());
		contract = contracts.find(f => f[0] == contract?.toUpperCase());
		ns.tprint(`BladeBurner ${action} ${contract}`);

		if (contract) {
			loop(ns, ns.sleeve.setToBladeburnerAction, ["Support main sleeve"]);
			ns.sleeve.setToBladeburnerAction(1, action, contract);
		}
		else
			loop(ns, ns.sleeve.setToBladeburnerAction, [action]);
	} else if (argAction == "i") {
		ns.tprint("idling...");
		if (argParams == "all")
			loop(ns, ns.sleeve.setToIdle);
		else
		ns.sleeve.setToIdle(0);
	}

	else {
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
		g [all/str/def/dex/agi] >> gym
		WIP >> j >> job
		b >> bladeburner
		r [city: s/a/v/c/n/i] >> travel 
		s >> shock recovery
		u >> university
		b [f/r/d/h/i/s/t] [t/b/r]>> bladeburner
		i >> idle
	
	argRabbit: 
		max
		1/2/3/4/5/6
	`;
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);

	}
}

// getSleeveAugmentationPrice(augName) 	Get price of an augmentation.
// getSleeveAugmentationRepReq(augName) 	Get reputation requirement of an augmentation.
// getSleeveAugmentations(sleeveNumber) 	Get augmentations installed on a sleeve.
// getSleevePurchasableAugs(sleeveNumber) 	List purchasable augs for a sleeve.
// purchaseSleeveAug(sleeveNumber, augName) 	Purchase an aug for a sleeve.
// setToBladeburnerAction(sleeveNumber, action, contract) 	Set a sleeve to perform Bladeburner actions.
