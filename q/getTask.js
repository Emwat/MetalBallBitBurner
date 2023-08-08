let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	let { numSleeves, argRabbit, argParams } = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;

	let myFunc = function (x) { ns.tprint(ns.sleeve.getTask(x)) };
	if (argRabbit || argRabbit == "0")
		myFunc(argRabbit);
	else
		loop(ns, myFunc);
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numberOfSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}