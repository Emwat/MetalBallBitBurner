/** @param {NS} ns */
import StrRight from './im/strRight'
import NumLeft from './im/numLeft'



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
		let [general, action] = GetActionOrDefault(ns.args[1], ns.args[2]);
		ns.tprint(`Flipper (ns, ${general.name}, ${action.name})`)
		await Flipper(ns, general, action);
	} else if (arg0 == "bp") {
		ns.tprint(`PriorityBB`)
		await PriorityBB(ns);
	} else if (arg0 == "bpi") {
		ns.tprint(`PriorityBB isDebugging`)
		await PriorityBB(ns, true);
	}else if (arg0 == "r") {
		ns.exec("helperBlade.js", "home", 1, "c");
	}
	// ns.tprint()
}

async function DoWhile(ns) {
	let { type, name } = ns.bladeburner.getCurrentAction();
	ns.tprint(`WHILE LOOP - ${type} ${name}`)
	while (true) {
		let [successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(type, name);
		// let [currentStamina, maxStamina] = ns.bladeburner.getStamina();
		let ms = ns.bladeburner.getActionTime(type, name);
		if (successA < 0.99) {
			ns.tprint(`BREAK ${name} has a Success rate of ${successA}`)
			break;
		}
		await ns.sleep(ms);
	}

	//ns.bladeburner.stopBladeburnerAction();
}

async function Flipper(ns, general, action) {
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
			([successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(action.type, action.name));
			await ns.sleep(ms)
		}
		ns.bladeburner.startAction(action.type, action.name);
		await DoWhile(ns);
	}

}

async function PriorityBB(ns, isDebugging) {
	while (true) {
		let smarterActions = actions.map(m => {
			let [successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(m.type, m.name);
			let actionTime = ns.bladeburner.getActionTime(m.type, m.name);
			let count = ns.bladeburner.getActionCountRemaining(m.type, m.name);
			return { id: m.id, name: m.name, type: m.type, successA, successB, actionTime, count };
		})
		smarterActions = smarterActions.sort((a,b) => GetPriority(a) - GetPriority(b));
		if(isDebugging) {
			let output = "Name/Success/Action/Count \r\n"; 
			smarterActions.forEach(a => {
					output += "	" + 
					StrRight(a.name, 33) +
					NumLeft(a.successA, 4) +
					NumLeft(a.actionTime, 6) +
					NumLeft(a.count, 6) +
					NumLeft(GetPriority(a),8) + 
					"\r\n";
			} );
			ns.tprint(output);
			return;
		}
		let theMove = smarterActions[0];
		if (theMove.successA < 1)
			break;
		ns.bladeburner.startAction(theMove.type, theMove.name);
		let [currentSuccessA, currentSuccessB] =
			ns.bladeburner.getActionEstimatedSuccessChance(theMove.type, theMove.name);
		while (currentSuccessA < 0.99) {
			([currentSuccessA, currentSuccessB] =
				ns.bladeburner.getActionEstimatedSuccessChance(theMove.type, theMove.name));
			await ns.sleep(ms)
		}
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