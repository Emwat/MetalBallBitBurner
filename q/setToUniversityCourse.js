let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	let { numSleeves, argRabbit, argParams } = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;

	//let takeUni = universities[0];
	let takeUni = universities.find(uni => ns.sleeve.getSleeve(argRabbit || 0).city == uni.city).name;
	let takeClass = uniClasses.find(uniClass => uniClass.name[0] == argParams.toUpperCase());

	ns.tprint(`University ${takeUni} ${takeClass}`);

	if (argRabbit || argRabbit == "0")
		ns.sleeve.setToUniversityCourse(argRabbit, takeUni, takeClass);
	else
		loop(ns, ns.sleeve.setToUniversityCourse, [takeUni, takeClass]);
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numberOfSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}

const uniClasses = ["Computer Science", "Data Structures"
	, "Networks", "Algorithms", "Management", "Leadership"];


const universities = [
	{ city: "Sector-12", name: "Rothman University"}
	// ,{ city: "", name: "Summit University"}
	,{ city: "Aevum", name: "ZB Institute of Technology"}
	];
