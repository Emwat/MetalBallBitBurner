/** @param {NS} ns */
export async function main(ns) {
	ns.tprint(ns.args.join());
	let crime = ns.args[0];
	if (crime.length == 1)
		crime = crimeTypes.find(f => f.toLowerCase()[0] == crime)
	ns.tprint(`${crime} Chance: ${ns.singularity.getCrimeChance(crime) * 100}`);
	ns.singularity.commitCrime(crime, false);
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