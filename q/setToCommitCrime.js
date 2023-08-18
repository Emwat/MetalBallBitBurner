let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	let { numSleeves, argRabbit, argParams } = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;

	let crimeType = crimeTypes.find(f => f[0] == argParams.toUpperCase());
	if (argParams.toLowerCase() == "heist")
		crimeType = "Heist";

	ns.tprint(`Crime ${crimeType}`);
	if (argRabbit || argRabbit == "0")
		ns.sleeve.setToIdle(argRabbit, crimeType);
	else
		loop(ns, ns.sleeve.setToCommitCrime, [crimeType]);
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numberOfSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}

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