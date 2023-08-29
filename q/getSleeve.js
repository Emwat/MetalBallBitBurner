let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	let { numSleeves, argRabbit, argParams } = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;

	let myFunc = function (x) {
		ns.tprint(`SLEEVE ${x}`);
		ns.tprint(abc(ns.sleeve.getSleeve(x)));
	};
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

function abc(x, pwr = 0) {
	if (Array.isArray(x)) {
		return arrayStr(x, pwr + 1);
	}
	if (typeof x === "object") {
		return objStr(x, pwr + 1);
	}
	return x;
}

function objStr(x, pwr = 0) {
	let output = Object.entries(x).map(([key, value]) => {
		if (key == "mults") return null;
		return (`${"".padStart(pwr, "	")}${key}: ${abc(value, pwr)}`);
	}).join("\r\n");
	return `{\r\n${output}}`;
}

function arrayStr(x, pwr = 0) {
	return `[${x.join(", ")}]`;
}
