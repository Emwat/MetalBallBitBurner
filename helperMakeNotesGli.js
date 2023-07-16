/** @param {NS} ns */
import ToDollars from './im/carat'
const gangAscTxt = "gangAsc.txt";

export async function main(ns) {

	let arg0 = ns.args[0]
	if (arg0 == void 0) {
		MakeNotes(ns);

	} else if (["i", "info"].includes(arg0)) {
		ReadNotes(ns);

	}
}

function MakeNotes(ns) {
	let members = ns.gang.getMemberNames();
	let gangInfo = ns.gang.getGangInformation();
	// let penalty = ns.formulas.wantedPenalty(gangInfo);
	let moneyGains = 0;
	let tasks = ns.gang.getTaskStats("Traffick Illegal Arms");
	for (let i = 0; i < members.length; i++) {
		let member = members[i];
		member = ns.gang.getMemberInformation(member);
		moneyGains += ns.formulas.gang.moneyGain(gangInfo, member, tasks);
	}
	let existingData = JSON.parse(ns.read(gangAscTxt));
	existingData.push({ date: new Date(), moneyGains })
	ns.write(gangAscTxt, JSON.stringify(existingData), "w");
	ns.tprint(`MoneyGains: ${ToDollars(moneyGains)}`)
}

function ReadNotes(ns) {
	let existingData = JSON.parse(ns.read(gangAscTxt)).reverse();
	for (let i = existingData.length - 1; i >= 0 && i < 10; i--) {
		let data = existingData[i];
		ns.tprint(`${i} ${new Date(data.date).toLocaleString()} ${ToDollars(data.moneyGains)}`)
	}
}