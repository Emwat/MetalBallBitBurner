let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	let {numSleeves, argRabbit, argParams} = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;
	
	if (argRabbit || argRabbit == "0")
		ns.sleeve.setToShockRecovery(argRabbit);
	else
		loop(ns, ns.sleeve.setToShockRecovery);
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numberOfSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}
