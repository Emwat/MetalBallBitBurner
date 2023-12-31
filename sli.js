const numSleeves = 7; // ns.getNumSleeves();

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

const folder = "/q/";

function emptyArgsError() {
	return `You haven't entered any arguments. Valid arguments are
	[argAction] [argRabbit]
	argAction:

		t >> getTask

		c [crime: s/m/l/h/heist... ]>> commit crime
		g [all/str/def/dex/agi] >> gym
		WIP f >> faction
		j >> job
		b [field analysis
			 recruitment
			 diplomacy
			 Hyperbolic Regeneration Chamber
			 infiltrate synthoids
			 support main sleeve
			 take on contracts
			 		t/b/r] >> bladeburner
		r [city: s/a/v/c/n/i] >> travel 
		s >> shock recovery
		u [c/d/n/a m/l] >> university
		aug >> purchase sleeve augs

		i >> idle
	
	argRabbit: 0/1/2/3/4/5/6
	`;
}

/** @param {NS} ns */
export async function main(ns) {
	// const argRabbit = ns.args[0];
	let [argAction, argParams] = ns.args;
	let argRabbit;
	let toAllSleeves = true; // argRabbit == "max";

	if (!argAction && argAction != "0") {
		ns.tprint(emptyArgsError());
		return;
	}

	if (!isNaN(ns.args[0])) {
		argRabbit = ns.args[0];
		([argRabbit, argAction, ...argParams] = ns.args);
	} else if (!isNaN(ns.args[1])) {
		([argAction, argRabbit] = ns.args);
	} else if (!isNaN(ns.args[2])) {
		([argAction, argParams, argRabbit] = ns.args);
	}

	if (argParams && Array.isArray(argParams) && argParams.length == 1) {
		argParams = argParams[0];
	}

	argParams = JSON.stringify({ numSleeves, argRabbit: argRabbit, argAction, argParams });

	if (false) { }
	else if (argAction == "t") {
		// let myFunc = function (x) { ns.tprint(ns.sleeve.getTask(x)) };
		// if (toAllSleeves) loop(ns, myFunc);
		// else ns.sleeve.getTask(argRabbit);
		ns.exec(`${folder}getTask.js`, "home", 1, argParams);
	}
	else if (argAction == "info") {
		ns.exec(`${folder}getSleeve.js`, "home", 1, argParams);
	}
	else if (argAction == "c") {
		// let crimeType = crimeTypes.find(f => f[0] == argParams.toUpperCase());
		// if (argParams.toLowerCase() == "heist")
		// 	crimeType = "Heist";

		// ns.tprint(`Crime ${crimeType}`);
		// if (toAllSleeves) loop(ns, ns.sleeve.setToCommitCrime, [crimeType]);
		// else ns.sleeve.setToCommitCrime(argRabbit, crimeType);
		ns.exec(`${folder}setToCommitCrime.js`, "home", 1, argParams);

	}
	else if (argAction == "j") {
		// setToCompanyWork(sleeveNumber, companyName) 	Set a sleeve to work for a company.
		ns.exec(`${folder}setToCompanyWork.js`, "home", 1, argParams);
	}
	else if (argAction == "r") {
		// let myCity = argParams.toUpperCase();
		// ns.tprint(`Travel to ${myCity}`);

		// myCity = cities.find(f => f[0] == myCity);
		// if (toAllSleeves) loop(ns, ns.sleeve.travel, [myCity]);
		// else ns.sleeve.travel(argRabbit, myCity);
		ns.exec(`${folder}travel.js`, "home", 1, argParams);
	}
	else if (argAction == "f") {
		ns.tprint(`Faction`);
		ns.tprint("TO DO");
		// setToFactionWork(sleeveNumber, factionName, factionWorkType) 	Set a sleeve to work for a faction.

	}
	else if (argAction == "g") {
		// ns.tprint(`Gym`);
		// let gyms = ["Powerhouse Gym"];
		// let stats = ["str", "def", "dex", "agi"]
		// let gym = gyms[0];
		// let stat = stats.find(f => f == argParams);
		// ns.tprint(`${gym} ${stat}`);
		// if (argParams == "all") {
		// 	let i = 0;
		// 	let s = 0;
		// 	while (i < numSleeves) {
		// 		if (s >= stats.length)
		// 			s = 0;
		// 		ns.sleeve.setToGymWorkout(i, gym, stats[s]);
		// 		i++;
		// 		s++;
		// 	}
		// } else {
		// 	if (toAllSleeves) loop(ns, ns.sleeve.setToGymWorkout, [gym, stat]);
		// 	else ns.sleeve.setToGymWorkout(argRabbit, gym, stat);
		// }
		// // setToGymWorkout(sleeveNumber, gymName, stat) 	Set a sleeve to workout at the gym.
		ns.exec(`${folder}setToGymWorkout.js`, "home", 1, argParams);

	}
	else if (argAction == "s") {
		// ns.tprint("Shock Recovery Time");
		// if (toAllSleeves) loop(ns, ns.sleeve.setToShockRecovery);
		// else ns.sleeve.setToShockRecovery(argRabbit);
		ns.exec(`${folder}setToShockRecovery.js`, "home", 1, numSleeves);
	}
	// else if (argAction == "sy") {
	// 	if (toAllSleeves) loop(ns.sleeve.setToSynchronize);
	// 	else ns.sleeve.setToSynchronize(argRabbit);
	// }
	else if (argAction == "u") {

		//let takeUni = universities[0];
		// let takeUni = "ZB Institute of Technology";
		// let takeClass = uniClasses.find(f => f[0] == argParams.toUpperCase());

		// ns.tprint(`University ${takeUni} ${takeClass}`);
		// if (toAllSleeves) loop(ns, ns.sleeve.setToUniversityCourse, [takeUni, takeClass]);
		// else ns.sleeve.setToUniversityCourse(argRabbit);
		ns.exec(`${folder}setToUniversityCourse.js`, "home", 1, numSleeves);

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

		// let [action, contract] = argParams.argParams;
		// action = actions.find(f => f[0] == action?.toUpperCase());
		// contract = contracts.find(f => f[0] == contract?.toUpperCase());
		// ns.tprint({ action, contract: contract || "" })

		// if (argRabbit || argRabbit == "0") {
		// 	//loop(ns, ns.sleeve.setToBladeburnerAction, ["Support main sleeve"]);
		// 	ns.sleeve.setToBladeburnerAction(1, action, contract);
		// }
		// else {
		// 	loop(ns, ns.sleeve.setToBladeburnerAction, [action]);
		// }
		ns.exec(`${folder}setToBladeburnerAction.js`, "home", 1, argParams);
	} else if (argAction == "b123") {
		let scriptArgs = [
			{ ...argParams, argRabbit: 0, argParams: ["t", "t"] }
			, { ...argParams, argRabbit: 1, argParams: ["t", "b"] }
			, { ...argParams, argRabbit: 2, argParams: ["t", "r"] }
			, { ...argParams, argRabbit: 3, argParams: ["h"] }
			, { ...argParams, argRabbit: 4, argParams: ["f"] }
		];

		for (const scriptArg of scriptArgs) {
			ns.exec(`${folder}setToBladeburnerAction.js`, "home", 1, JSON.stringify(scriptArg));
		}
	} else if (argAction == "i") {
		// ns.tprint("idling...");
		// if (argParams == "all")
		// 	loop(ns, ns.sleeve.setToIdle);
		// else
		// ns.sleeve.setToIdle(0);
		ns.exec(`${folder}setToIdle.js`, "home", 1, argParams);
	} else if (argAction == "aug") {

		ns.exec(`${folder}purchaseSleeveAug.js`, "home", 1, argParams);
	}

	else {
		ns.tprint(`${argAction} is an invalid argument.`)
	}
	//ns.tprint(`sli.js ${ns.args.concat()} ended. ${new Date().toLocaleString()}`)
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



function loopExec(ns, myFunction, moreArgs) {
	for (let i = 0; i < numSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);

	}
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);

	}
}
