let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	let { numSleeves, argRabbit, argParams } = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;

	const actions = [
		"Field Analysis"
		, "Recruitment"
		, "Diplomacy"
		, "Hyperbolic Regeneration Chamber"
		, "Infiltrate Synthoids"
		, "Support main sleeve"
		, "Take on contracts"
	]
	const contracts = [
		"Tracking"
		, "Bounty Hunter"
		, "Retirement"
	]

	let [action, contract] = argParams;
	action = actions.find(f => f[0] == action?.toUpperCase());
	contract = contracts.find(f => f[0] == contract?.toUpperCase());
	//ns.tprint({ action, contract: contract ?? "" })
	if (action == "Tracking" && !contract) {
		ns.tprint(`contract is undefined`);
		return;
	}

	if (argRabbit || argRabbit == "0") {
		if (ns.sleeve.setToBladeburnerAction(argRabbit, action, contract))
			ns.tprint(`Sleeve ${argRabbit} ${action} ${contract ?? ""}`)
			else 
			ns.tprint(`- Fail - Sleeve ${argRabbit} ${action} ${contract} - Fail -`)
	}
	else {
		ns.tprint(action);
		loop(ns, ns.sleeve.setToBladeburnerAction, [action]);
	}
}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numberOfSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}
