import StrLeft from "./im/strLeft.js"
import NumLeft from "./im/numLeft.js"
import ToDollars from "./im/carat.js"

/** @param {NS} ns */
export async function main(ns) {
	const crimes = crimeTypes.map(crimeName => {
		return {
			name: crimeName,
			chance: ns.singularity.getCrimeChance(crimeName),
			stats: ns.singularity.getCrimeStats(crimeName),
		}
	});

	let output = "\r\n";
	for (const crime of crimes) {
		const { name, chance, stats } = crime;
		output += name.padStart(20) +
			+ chance;
			//+ NumLeft(chance, 3);
		for (const [key, value] of Object.entries(stats)) {
			if (value)
				output += `\r\n ${key}: ${value} `;
		}

		output += "\r\n"
	}
	ns.tprint(output);
}


// agility_exp
// agility_success_weight
// charisma_exp
// charisma_success_weight
// defense_exp
// defense_success_weight
// dexterity_exp
// dexterity_success_weight
// difficulty
// hacking_exp
// hacking_success_weight
// intelligence_exp
// karma
// kills
// money
// strength_exp
// strength_success_weight
// time
// type


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