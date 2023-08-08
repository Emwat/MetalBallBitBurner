/** @param {NS} ns */
export async function main(ns) {

	if (ns.args[0] == "r") {
		ns.exec("blade.js", "home", 1, "bp");
		

	} else {
		ns.bladeburner.stopBladeburnerAction();
		ns.scriptKill("blade.js", "home");
		ns.scriptKill("chrg.js", "home");
		ns.scriptKill("gabr.js", "home");
		ns.scriptKill("gabp.js", "home");
		ns.exec("chll.js", "home", 1, "k");
		ns.exec("nnet.js", "home", 1, "k");
		ns.exec("fill.js", "home", 1, "target");
		ns.exec("call.js", "home", 1, "target", "a");
		ns.tprint(`Offline Activities:
			Work at Faction
			Work at Job
			Uni
			Crime
	`);
	}
}