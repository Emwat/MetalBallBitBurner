let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	numberOfSleeves = numSleeves;
	let myCity = ns.args[1].toUpperCase();

	let myCity = cities.find(f => f[0] == myCity);
	loop(ns, ns.sleeve.travel, [myCity]);
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numberOfSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}

const cities = ["Sector-12", "Aevum", "Volhaven", "Chongqing", "New Tokyo", "Ishima"];
