let numSleeves;

/** @param {NS} ns */
export async function main(ns) {
	numSleeves = ns.args[0];
	let argParams = ns.args[1];

	let crimeType = crimeTypes.find(f => f[0] == argParams.toUpperCase());
	if (argParams.toLowerCase() == "heist")
		crimeType = "Heist";

	ns.tprint(`Crime ${crimeType}`);
	loop(ns, ns.sleeve.setToCommitCrime, [crimeType]);
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numSleeves; i++) {
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