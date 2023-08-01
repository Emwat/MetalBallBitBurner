let numSleeves;

/** @param {NS} ns */
export async function main(ns) {
	numSleeves = ns.args[0];
	
	loop(ns, ns.sleeve.setToShockRecovery);
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}
