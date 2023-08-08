let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	let { numSleeves, argRabbit, argParams } = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;

	//let takeUni = universities[0];
	let takeUni = "ZB Institute of Technology";
	let takeClass = uniClasses.find(f => f[0] == argParams.toUpperCase());

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


const universities = ["Rothman University", "Summit University", "ZB Institute of Technology"];
