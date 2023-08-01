let numSleeves;

/** @param {NS} ns */
export async function main(ns) {
	ns.tprint("idling...");
	numSleeves = ns.args[0];
	let argParams = ns.args[1];

	if (argParams == "all")
		loop(ns, ns.sleeve.setToIdle);
	else 
		ns.sleeve.setToIdle(argParams || 0);
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}
