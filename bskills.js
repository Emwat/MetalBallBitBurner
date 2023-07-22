/** @param {NS} ns */
export async function main(ns) {

	let myPoints = ns.bladeburner.getSkillPoints();
	let bbSkills = skillNames.map(m => { return { name: m, cost: ns.bladeburner.getSkillUpgradeCost(m) } })
	let bbSkillWithMinCost = bbSkills.sort((a, b) => a.cost - b.cost)[0];
	// bbSkillWithMinCost = bbSkills.reduce((output, r) => { return r.cost < output.cost ? r : output;});
  // ns.tprint(`${bbSkillWithMinCost.name} ${bbSkillWithMinCost.cost}`);
	// return;

	while (true) {
		myPoints = ns.bladeburner.getSkillPoints();
		bbSkills = skillNames.map(m => { return { name: m, cost: ns.bladeburner.getSkillUpgradeCost(m) } })
		// bbSkillWithMinCost = bbSkills.sort((a, b) => a.cost - b.cost)[0];
		bbSkillWithMinCost = bbSkills.reduce((output, r) => {
			return r.cost < output.cost ? r : output;
		});

		if (bbSkillWithMinCost.name == "Overclock" && bbSkillWithMinCost.cost == 258){
			bbSkills = bbSkills.filter(f => f.name != "Overclock");

			bbSkillWithMinCost = bbSkills.reduce((output, r) => {
			return r.cost < output.cost ? r : output;
		});
		}

		
		if (bbSkillWithMinCost.cost > myPoints)
			break;
		if (ns.bladeburner.upgradeSkill(bbSkillWithMinCost.name))
			ns.tprint(`Upgraded ${bbSkillWithMinCost.name}`)
		else {
			ns.tprint(`Could not upgrade ${bbSkillWithMinCost.name}`);
			break;
		}
		await ns.sleep(20);
	}

	myPoints = ns.bladeburner.getSkillPoints();
	ns.tprint(`The next skill "${bbSkillWithMinCost.name}" costs ${bbSkillWithMinCost.cost}.` +
	` You have ${myPoints} skill points.`);
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
	// "Cyber's Edge",
	"Hands of Midas",
	"Hyperdrive"]