let numSleeves;

/** @param {NS} ns */
export async function main(ns) {
		numSleeves = ns.args[0];
		const toAllSleeves = true;

		let myFunc = function (x) { ns.tprint(ns.sleeve.getTask(x)) };
		if (toAllSleeves) loop(ns, myFunc);
		else ns.sleeve.getTask(argRabbit);
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}