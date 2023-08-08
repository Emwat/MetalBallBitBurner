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
}

/** @param {NS} ns */
async function DistributeSkillPoints(ns, focusName = "") {
	let myPoints = ns.bladeburner.getSkillPoints();

	let bbSkills = skillNames.map(m => { return { name: m, cost: ns.bladeburner.getSkillUpgradeCost(m) } })
	let bbSkillWithMinCost = bbSkills.sort((a, b) => a.cost - b.cost)[0];
	if (focusName != "Cyber's Edge") {
		bbSkills = bbSkills.filter(f => f.name != "Cyber's Edge")
	}
	// bbSkillWithMinCost = bbSkills.reduce((output, r) => { return r.cost < output.cost ? r : output;});
	// ns.tprint(`${bbSkillWithMinCost.name} ${bbSkillWithMinCost.cost}`);
	// return;
	//const maxOverclockCost = 258; // bn7
	const maxOverclockCost = 129;

	while (true) {

		myPoints = ns.bladeburner.getSkillPoints();
		bbSkills = bbSkills.map(m => { return { name: m.name, cost: ns.bladeburner.getSkillUpgradeCost(m.name) } })
		// bbSkillWithMinCost = bbSkills.sort((a, b) => a.cost - b.cost)[0];
		bbSkillWithMinCost = bbSkills.reduce((output, r) => {
			return r.cost < output.cost ? r : output;
		});
		if (focusName) {
			bbSkillWithMinCost = bbSkills.find(f => f.name == focusName);
			if (!bbSkillWithMinCost)
				return;
		}



		if (bbSkillWithMinCost.name == "Overclock" && bbSkillWithMinCost.cost == maxOverclockCost) {
			if (focusName == "Overclock") {
				BiPrint(ns, "Overclock is maxed out.");
				// return;
			}
			bbSkills = bbSkills.filter(f => f.name != "Overclock");

			bbSkillWithMinCost = bbSkills.reduce((output, r) => {
				return r.cost < output.cost ? r : output;
			});
		}


		if (bbSkillWithMinCost.cost > myPoints)
			break;
		if (ns.bladeburner.upgradeSkill(bbSkillWithMinCost.name)) {
			BiPrint(ns, `Spent ${bbSkillWithMinCost.cost} skill points on ${bbSkillWithMinCost.name}`);
		}
		else {
			BiPrint(ns, `Could not upgrade ${bbSkillWithMinCost.name}`);
			break;
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


const skillNames = ["Blade's Intuition",
	"Cloak",
	"Short-Circuit",
	"Digital Observer",
	"Tracer",
	"Overclock",
	"Reaper",
	"Evasive System",
	"Datamancer",
	"Cyber's Edge",
	"Hands of Midas",
	"Hyperdrive"]

