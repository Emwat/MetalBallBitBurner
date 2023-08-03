import StrRight from './im/strRight'
import NumLeft from './im/numLeft'


let upg = 0;
const upgradeCounterCap = 3;

/** @param {NS} ns */
export async function main(ns) {

	let arg0 = ns.args[0];

	if (!arg0 || arg0 == "help") {
		ns.tprint(`No arguments found. Available arguments are
		ba >> Do Current Action until success is not guaranteed
		bb >> Swap Between Field Analysis and Tracking
		bb [t/f/r/d/h/i] [t/b/r | i/u/s/raid/stealth/a]>> Swap Between Field Analysis and Tracking
		r >> Report city chaos
		`);
		return;
	} else if (arg0 == "ba") {
		await DoWhile(ns);
	} else if (arg0 == "bb") {
		ns.exec("kl.js", "home", 1, "blade", "others");
		let [general, action] = GetActionOrDefault(ns.args[1], ns.args[2]);
		ns.tprint(`Flipper (ns, ${general.name}, ${action.name})`)
		await Flipper(ns, general, action);
	} else if (arg0 == "bp") {
		ns.tprint(`PriorityBB`)
		while (true) {
			await PriorityBB(ns);
			await DoWhile(ns, "Tracking");
			await ns.sleep(200);
		}
	} else if (arg0 == "bpi") {
		ns.tprint(`PriorityBB isDebugging`)
		await PriorityBB(ns, true);
	} else if (arg0 == "r") {
		ns.exec("helperBlade.js", "home", 1, "c");
	}
	// ns.tprint()
}

/** @param {NS} ns */
async function DoWhile(ns, name) {
	let type;
	if (!name) {
		({ type, name } = ns.bladeburner.getCurrentAction());
	} else {
		type = healing.concat(actions).find(f => f.name == name).type;
	}
	ns.tprint(`WHILE LOOP - ${type} ${name}`)
	while (true) {
		let [successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(type, name);
		// let [currentStamina, maxStamina] = ns.bladeburner.getStamina();
		let ms = ns.bladeburner.getActionTime(type, name);
		if (successA < 0.99) {
			ns.tprint(`BREAK ${name} has a Success rate of ${successA}`)
			break;
		}
		let count = ns.bladeburner.getActionCountRemaining(type, name);
		if (count == 0) {
			ns.tprint(`There are no more contracts for ${name}`);
			break;
		}

		await ns.sleep(ms);
		upg++;
		if (ns.args.includes("buy") && upg >= upgradeCounterCap) {
			ns.exec("bskills.js", "home", 1, "e");
			upg = 0;
		}
	}

	//ns.bladeburner.stopBladeburnerAction();
}


/** @param {NS} ns */
async function Flipper(ns, general, action) {
	let i = 0;
	while (true) {
		let count = ns.bladeburner.getActionCountRemaining(action.type, action.name);
		if (count == 0) {
			ns.tprint(`There are no more contracts for ${action.name}`);
			break;
		}
		ns.bladeburner.startAction(general.type, general.name);
		let [successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(action.type, action.name);
		while (successA < 0.99) {
			let ms = ns.bladeburner.getActionTime(general.type, general.name);
			await ns.sleep(ms);
			([successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(action.type, action.name));
		}
		ns.bladeburner.startAction(action.type, action.name);
		await DoWhile(ns);

	}

}

async function PriorityBB(ns, isDebugging) {
	let i = 0;

	while (true) {
		if (PriorityBBActionOrDefault(ns, isDebugging))
			break;
		await DoWhile(ns);
	}

}

function PriorityBBActionOrDefault(ns, isDebugging) {
	let smarterActions = actions.map(m => {
		let [successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(m.type, m.name);
		let actionTime = ns.bladeburner.getActionTime(m.type, m.name);
		let count = ns.bladeburner.getActionCountRemaining(m.type, m.name);
		return { id: m.id, name: m.name, type: m.type, successA, successB, actionTime, count };
	});
	smarterActions = smarterActions.sort((a, b) => GetPriority(b) - GetPriority(a));
	if (isDebugging) {
		let output = "\r\n	" + "Name".padEnd(33) + "Clr%" + "Action" + "Count".padStart(6) + "Priority" + "\r\n";
		smarterActions.forEach(a => {
			output += "	" +
				a.name.padEnd(33) +
				NumLeft(a.successA, 4) +
				NumLeft(a.actionTime, 6) +
				NumLeft(a.count, 6) +
				NumLeft(GetPriority(a), 8) +
				"\r\n";
		});
		ns.tprint(output);
		return null;
	}
	let theMove = smarterActions[0];
	if (theMove.successA < 0.99) {
		theMove = healing[Math.random() < 0.5 ? 0 : 1];
		ns.bladeburner.startAction(theMove.type, theMove.name);
		return theMove;
	}
	ns.bladeburner.startAction(theMove.type, theMove.name);
	return theMove;
}


function GetPriority(x) {
	let total = 0;
	if (x.successA < 1)
		return 0;
	else
		total += 1;

	total += x.id;
	// total += 10 ** 6 - x.actionTime;

	return total;
}

function GetActionOrDefault(argValue1, argValue2) {
	let general = healing.find(f => f.name[0] == argValue1?.toUpperCase());
	let action = actions.find(f => f.name[0] == argValue2?.toUpperCase());

	if (["ra", "rai", "raid"].includes(argValue2?.toLowerCase()))
		action = actions.find(f => f.name == "Raid");

	if (["stealth"].includes(argValue2?.toLowerCase()))
		action = actions.find(f => f.name == "Stealth Retirement Operation");

	if (!general) general = healing.find(f => f.name == "Field Analysis");
	if (!action) action = actions.find(f => f.name == "Tracking");
	return [general, action]
}

const healing = [
	{ id: 1, type: "General", name: "Training" }
	, { id: 2, type: "General", name: "Field Analysis" }
	, { id: 3, type: "General", name: "Recruitment" }
	, { id: 4, type: "General", name: "Diplomacy" }
	, { id: 5, type: "General", name: "Hyperbolic Regeneration Chamber" }
	, { id: 6, type: "General", name: "Incite Violence" }
]
const actions = [
	{ id: 1, type: "Contracts", name: "Tracking" }
	, { id: 2, type: "Contracts", name: "Bounty Hunter" }
	, { id: 3, type: "Contracts", name: "Retirement" }

	, { id: 4, type: "Operations", name: "Investigation" }
	, { id: 5, type: "Operations", name: "Undercover Operation" }
	, { id: 6, type: "Operations", name: "Sting Operation" }
	, { id: 7, type: "Operations", name: "Raid" }
	, { id: 8, type: "Operations", name: "Stealth Retirement Operation" }
	, { id: 9, type: "Operations", name: "Assassination" }
];

const bSkills = [
	{ type: "Skills", name: "Blade's Intuition" }
	, { type: "Skills", name: "Cloak" }
	, { type: "Skills", name: "Short-Circuit" }
	, { type: "Skills", name: "Digital Observer" }
	, { type: "Skills", name: "Tracer" }
	, { type: "Skills", name: "Overclock" }
	, { type: "Skills", name: "Reaper" }
	, { type: "Skills", name: "Evasive System" }
	, { type: "Skills", name: "Datamancer" }
	, { type: "Skills", name: "Cyber's Edge" }
	, { type: "Skills", name: "Hands of Midas" }
	, { type: "Skills", name: "Hyperdrive" }
]