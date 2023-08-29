let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	let { numSleeves, argRabbit, argParams } = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;
	let companies = Object.entries(ns.getPlayer().jobs).map(m => m[0]);

	if (argRabbit || argRabbit == "0") {
		let companyName = argParams.companyName;
		ns.sleeve.setToCompanyWork(sleeveNumber, companyName);
		return;
	}
	for (let i = 0; i < companies.length; i++) {
		if (i == numberOfSleeves)
			break;
		const companyName = companies[i];
		const isWorking = ns.sleeve.setToCompanyWork(i, companyName);
		if(!isWorking) return;
		ns.tprint(`Sleeve ${i} is at ${companyName}`)
	}
}
