import ToDollars from './im/carat'
import StrLeft from './im/strLeft'
import colors from './im/colors'

/** @param {NS} ns */
export async function main(ns) {
	let arg0 = ns.args[0];
	//let homeServer = ns.getServer("home");
	let homeRam = ns.getServerMaxRam("home")
	let upgRamCost = ToDollars(ns.singularity.getUpgradeHomeRamCost());
	let upgCoreCost = ToDollars(ns.singularity.getUpgradeHomeCoresCost());
	if (false) {
		ns.tprint(``)

	} else if (ns.args.length == 0 || arg0 == "p") {
		ns.tprint(`
	sin u >> help
	sin u p >> help
	sin u Br >> ${`upgrade Ram to ${homeRam * 2}`.padEnd(25)} cost: \$${upgRamCost}
	sin u Bc >> ${`upgrade Core`.padEnd(25)} cost: \$${upgCoreCost}
		`)
	} else if (arg0 == "Br") {
		ns.exec("qsin/upgradeHomeRam.js", "home", 1)
	} else if (arg0 == "Bc") {
		ns.exec("qsin/upgradeHomeCores.js", "home", 1)
	} else {
		ns.tprint(`${arg0} is an invalid argument.`)
	}
}
