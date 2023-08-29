import NumLeft from './im/numLeft'
import StrLeft from './im/strLeft'
import StrRight from './im/strRight'



/** @param {NS} ns */
export async function main(ns) {

	if (ns.args.length == 0) {
		ns.tprint(`No arguments provided. Valid arguments are
		e >> distributed
		m >> Hands of Midas (${ns.bladeburner.getSkillUpgradeCost("Hands of Midas")})
		o >> Overclock (${ns.bladeburner.getSkillUpgradeCost("Overclock")})
		s >> Cyber's Edge (${ns.bladeburner.getSkillUpgradeCost("Cyber's Edge")})

		You have ${ns.bladeburner.getSkillPoints()} skill points.
		`)

	}
	else if (ns.args[0] == "e") { await DistributeSkillPoints(ns); }
	else if (ns.args[0] == "m") { await DistributeSkillPoints(ns, "Hands of Midas"); }
	else if (ns.args[0] == "o") { await DistributeSkillPoints(ns, "Overclock"); }
	else if (ns.args[0] == "s") { await DistributeSkillPoints(ns, "Cyber's Edge"); }
	else if (ns.args[0] == "l") { ListPriority(ns); }
}

/** @param {NS} ns */
async function DistributeSkillPoints(ns, focusName = "") {
	let myPoints = ns.bladeburner.getSkillPoints();

	let bbSkills = skillNames.map((s) => MapPriority(ns, s));
	let bbSkillWithMinCost = bbSkills.reduce(ReducePriority);
	if (focusName != "Cyber's Edge") {
		bbSkills = bbSkills.filter(f => f.name != "Cyber's Edge")
	}
	// bbSkillWithMinCost = bbSkills.reduce((output, r) => { return r.cost < output.cost ? r : output;});
	// ns.tprint(`${bbSkillWithMinCost.name} ${bbSkillWithMinCost.cost}`);
	// return;
	// const maxOverclockCost = 258; // bn7
	// const maxOverclockCost = 129
	// const maxOverclockCost = 154; // bn9 08/17/2023 02:37 PM wut

	while (true) {

		myPoints = ns.bladeburner.getSkillPoints();
		bbSkills = bbSkills.map((s) => MapPriority(ns, s));
		// bbSkillWithMinCost = bbSkills.sort((a, b) => a.cost - b.cost)[0];
		bbSkillWithMinCost = bbSkills.reduce(ReducePriority);
		if (focusName) {
			bbSkillWithMinCost = bbSkills.find(f => f.name == focusName);
			if (!bbSkillWithMinCost)
				return;
		}

		if (bbSkillWithMinCost.cost > myPoints)
			break;
		if (ns.bladeburner.upgradeSkill(bbSkillWithMinCost.name)) {
			BiPrint(ns, `Spent ${bbSkillWithMinCost.cost} skill points on ${bbSkillWithMinCost.name}`);
		}
		else {
			if (bbSkillWithMinCost.name == "Overclock" && myPoints > 300) {
				bbSkills = bbSkills.filter(f => f.name != "Overclock");
				if (focusName == "Overclock")
					focusName = "Hands of Midas";
			}
			else {
				BiPrint(ns, `Could not upgrade ${bbSkillWithMinCost.name}`);
				break;
			}
		}
		await ns.sleep(20);
	}

	myPoints = ns.bladeburner.getSkillPoints();
	BiPrint(ns, `The next skill "${bbSkillWithMinCost.name}" costs ${bbSkillWithMinCost.cost}.` +
		` You have ${myPoints} skill points.`);
}

function BiPrint(ns, msg) {
	if (ns.args.includes("quiet"))
		ns.print(msg);
	else
		ns.tprint(msg);
}

function MapPriority(ns, skill) {

	let priority;
	let name;
	if (Array.isArray(skill))
		([priority, name] = skill);
	else {
		({ name } = skill);
		priority = skillNames.find(f => f[1] == name);
	}

	let cost = ns.bladeburner.getSkillUpgradeCost(name);
	let addedValue = skillNamesB.find(f => f[1] == name)[0];
	// priority = (cost + addedCost) * (priority - 2);
	priority = cost * -1;
	priority += addedValue;


	if (name == "Datamancer" && cost > 10)
		priority = cost * -3;
	if (name == "Cyber's Edge" && cost > 10)
		priority = -999;
	if (name == "Hyperdrive" && cost > 10)
		priority = cost * -2;

	return {
		name,
		cost,
		priority
	}
}

function ReducePriority(accumulator, currentValue) {
	return accumulator.priority > currentValue.priority ? accumulator : currentValue;
}

function ListPriority(ns) {
	let output = "\r\n";
	let bbSkills = skillNames.filter(f => f[1] != "Cyber's Edge").map((s) => MapPriority(ns, s))
	bbSkills.sort((a, b) => (a.priority - b.priority));
	bbSkills.forEach((s) => {
		output += s.name.padEnd(18)
			+ ` cost ${NumLeft(s.cost, 7)}`
			+ "".padEnd(5)
			+ ` p ${StrLeft(skillNames.find(sn => sn[1] == s.name)[0].toFixed(3), 8)}`
			+ "".padEnd(5)
			+ ` b ${StrLeft(skillNamesB.find(sn => sn[1] == s.name)[0].toFixed(3), 8)}`
			+ "".padEnd(5)
			+ ` sP ${StrLeft(s.priority.toFixed(3), 8)}`
			+ "\r\n"
	});
	ns.tprint(output);
	ns.tprint("ReducePriority: " + bbSkills.reduce(ReducePriority).name);
}

const skillNames = [
	[1.030, "Blade's Intuition"], // increases your success chance for all Contracts, Operations, and BlackOps by 3%
	[1.055, "Cloak"], // increases your success chance in stealth-related Contracts, Operations, and BlackOps by 5.5%
	[1.055, "Short-Circuit"], // increases your success chance in Contracts, Operations, and BlackOps that involve retirement by 5.5%
	[1.040, "Digital Observer"], // skill increases your success chance in all Operations and BlackOps by 4%	
	[1.040, "Tracer"], // increases your success chance in all Contracts by 4%
	[1.100, "Overclock"], // decreases the time it takes to attempt a Contract, Operation, and BlackOp by 1% (Max Level: 90)
	[1.020, "Reaper"], // increases your effective combat stats for Bladeburner actions by 2%
	[1.040, "Evasive System"], // increases your effective dexterity and agility for Bladeburner actions by 4%
	[1.010, "Datamancer"], //  increases your effectiveness in synthoid population analysis and investigation by 5%. 
	// This affects all actions that can potentially increase the accuracy of your 
	// synthoid population/community estimates.
	[1.000, "Cyber's Edge"], // increases your max stamina by 2%
	[1.030, "Hands of Midas"], // increases the amount of money you receive from Contracts by 10%
	[1.000, "Hyperdrive"]// increases the experience earned from Contracts, Operations, and BlackOps by 10%
]

// addedValue
const skillNamesB = [
	[13, "Blade's Intuition"],
	[15, "Cloak"],
	[15, "Short-Circuit"],
	[1, "Digital Observer"],
	[14, "Tracer"],
	[13, "Overclock"],
	[14, "Reaper"],
	[15, "Evasive System"],
	[1, "Datamancer"],
	[1, "Cyber's Edge"],
	[1, "Hands of Midas"],
	[1, "Hyperdrive"]
] 
