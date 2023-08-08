let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	ns.tprint("idling...")
	let {numSleeves, argRabbit, argParams} = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;

	if (argRabbit|| argRabbit == "0")
		ns.sleeve.setToIdle(argRabbit);
	else
		loop(ns, ns.sleeve.setToIdle);
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numberOfSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}
