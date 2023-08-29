import trcString from './im/strTrunc'
import cities from './static/cities'
import companies from './static/company'
import ToDollars from './im/carat'

/** @param {NS} ns */
export async function main(ns) {
	let arg0 = ns.args[0];
	if (ns.args.length == 0) {
		ns.tprint(`
	a >> Apply to megacorps
	l >> list megacorps rep
		`)
	} else if (arg0 == "a") {
		ApplyToMegaCorps(ns);
	} else if (arg0 == "l") {
		ListMegaCorps(ns);
	}
}

/** @param {NS} ns */
function ApplyToMegaCorps(ns) {
	let output = "\r\n";
	for (let { companyName, city } of megaCorps) {
		// let player = ns.getPlayer();
		// if (player.location != city) {
		// 	ns.singularity.travelToCity(city);
		// }
		let isEmployed = ns.singularity.applyToCompany(companyName, "security");
		if (!isEmployed)
			continue;
		output += `\r\nSuccessfully applied to security at ${companyName}`
	}

	ns.tprint(output);
}

/** @param {NS} ns */
function ListMegaCorps(ns) {
	let output = "\r\n";
	for (let { companyName, city } of megaCorps) {
		// let player = ns.getPlayer();
		// if (player.location != city) {
		// 	ns.singularity.travelToCity(city);
		// }
		let rep = ns.singularity.getCompanyRep(companyName);

		output += companyName.padEnd(30) + rep.toFixed(0).padStart(10) + "\r\n";
	}

	ns.tprint(output);
}


function strJoin(reqSkills) {
	return Object.entries(reqSkills)
		.filter((fa, fb) => fb > 0)
		.map(([key, value]) => `${key[0]}: ${value}`).join(", ");
}

function thisDoesntwork() {
	// const positions = ns.singularity.getCompanyPositions(companyName);
	// for (let $field of positions) {
	// 	let { name, nextPosition, requiredReputation, requiredSkills, salary } =
	// 		ns.singularity.getCompanyPositionInfo(companyName, $field);
	// 	let isEmployed = ns.singularity.applyToCompany(companyName, $field)
	// 	if (!isEmployed)
	// 		continue;
	// 	output += (companyName.padEnd(30)
	// 		+ (isEmployed ? "1" : "0").padEnd(3)
	// 		+ trcString(name, 30).padEnd(30)
	// 		+ trcString(nextPosition, 30).padEnd(30)
	// 		+ ToDollars(requiredReputation)?.padEnd(5)
	// 		+ strJoin(requiredSkills)
	// 		+ ToDollars(salary)
	// 		+ "\r\n"
	// 	)
	// }
}


// travelToCity(city) 	Travel to another city.

// getCompanyPositions(companyName) 	Get List of Company Positions.
// quitJob(companyName) 	Quit jobs by company.

class megaCorp {
	constructor(city, companyName) {
		this.city = city;
		this.companyName = companyName;
	}
}

const megaCorps = [
	new megaCorp("Sector-12", "ECorp")
	, new megaCorp("Sector-12", "Blade Industries")
	, new megaCorp("Sector-12", "MegaCorp")
	, new megaCorp("Sector-12", "Four Sigma")
	, new megaCorp("Aevum", "Bachman & Associates")
	, new megaCorp("Aevum", "Clarke Incorporated")
	, new megaCorp("Aevum", "Fulcrum Technologies")
	, new megaCorp("Chongqing", "KuaiGong International")
	, new megaCorp("Volhaven", "NWO")
	, new megaCorp("Volhaven", "OmniTek Incorporated")
]

const idk = [
	"agent0"
	, "agent1"
	, "agent2"
	, "business0"
	, "business1"
	, "business2"
	, "business3"
	, "business4"
	, "business5"
	, "businessConsult0"
	, "businessConsult1"
	, "employee"
	, "IT0"
	, "IT1"
	, "IT2"
	, "IT3"
	, "networkEng0"
	, "networkEng1"
	, "security0"
	, "security1"
	, "security2"
	, "security3"
	, "securityEng"
	, "software0"
	, "software1"
	, "software2"
	, "software3"
	, "software4"
	, "software5"
	, "software6"
	, "software7"
	, "softwareConsult0"
	, "softwareConsult1"
	, "waiter"
	, "waiterPT"
]
