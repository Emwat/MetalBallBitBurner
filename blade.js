import StrRight from './im/strRight'
import NumLeft from './im/numLeft'
import cities from './static/cities'

const successReq = 0.98;

let fs = 0;
const failSafeCap = 9000;
let ttc = 0;
const travelCap = 20;
let currentCity = ""; // only for debug purposes

/** @param {NS} ns */
export async function main(ns) {

	let arg0 = ns.args[0];

	// [t/f/r/d/h/i] 
	if (!arg0 || arg0 == "help") {
		ns.tprint(`No arguments found. Available arguments are
		ba [t/b/r/i/u/s/raid/stealth/a] >> Do Action until success is not guaranteed
		bb [t/b/r/i/u/s/raid/stealth/a] >> Flip between Training/FieldAnalysis and argument
		bp >> batch with priority
		bpi >> debug priority
		bpir >> debug priority everywhere
		r >> Report city chaos
		l >> list BlackOps
		`);
		return;
	}

	if (false) { }
	else if (arg0 == "ba") {
		let action = GetActionOrDefault(ns.args[1]);
		ns.exec("kl.js", "home", 1, "blade", "others");
		StartBladeburnerAction(ns, action);
		await SleepWhile(ns);
		StartBladeburnerAction(ns, healing[0]);
	} else if (arg0 == "bb") {
		let action = GetActionOrDefault(ns.args[1]);
		ns.tprint(`Flipper (ns, ${action.name})`);
		ns.exec("kl.js", "home", 1, "blade", "others");
		await Flipper(ns, action);
	} else if (arg0 == "bp") {
		ns.tprint(`PriorityBB`);
		ns.exec("kl.js", "home", 1, "blade", "others");
		await Flipper(ns, PriorityBBActionOrDefault, "isWillingToTravel")
	} else if (arg0 == "bpi") {
		PriorityBBActionOrDefault(ns, "isDebugging");
	} else if (arg0 == "bpir") {
		await GoToBestCity(ns);
	} else if (arg0 == "r") {
		ns.exec("helperBlade.js", "home", 1, "c"); //print cities
	} else if (arg0 == "l") {
		let nextOp = ops.find(op => ns.bladeburner.getActionCountRemaining("BlackOps", op.name));
		ns.tprint(ops
			.map(o => "	" + o.rank + " " + o.name
				+ (o == nextOp ? " *" : "")).join("\r\n"));
	} else if (arg0 == "test") {
		let nextOperation = ops.map(m => {
			let [successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(m.type, m.name);
			let actionTime = ns.bladeburner.getActionTime(m.type, m.name);
			let count = ns.bladeburner.getActionCountRemaining(m.type, m.name);
			return { id: m.id, name: m.name, type: m.type, successA, successB, actionTime, count, rank: m.rank };
		}).find(op => ns.bladeburner.getActionCountRemaining("BlackOps", op.name));

		ns.tprint(`Priority: ${GetPriorityTest(ns, nextOperation)}`);
	} else {
		ns.tprint(`${arg0} is not a valid argument.`)
	}
	// ns.tprint()
}

/** @param {NS} ns */
async function SleepWhile(ns, name) {
	let type;
	if (!name) {
		({ type, name } = ns.bladeburner.getCurrentAction());
	} else {
		type = healing.concat(actions).find(f => f.name == name).type;
	}
	ns.tprint(`WHILE LOOP - ${type} ${name}`)
	ns.print(`WHILE LOOP - ${type} ${name}`)
	while (true) {
		fs++; if (fs >= failSafeCap) { FailSafely(ns, "SleepWhile"); break; }

		let [successA] = ns.bladeburner.getActionEstimatedSuccessChance(type, name);
		let ms = ns.bladeburner.getActionTime(type, name);
		if (successA < successReq) {
			ns.tprint(`BREAK - ${name} has a Success rate of ${successA}`)
			break;
		}
		let count = ns.bladeburner.getActionCountRemaining(type, name);
		if (count == 0) {
			ns.tprint(`BREAK - There are no more contracts for ${name}`);
			break;
		}

		await ns.sleep(bonus(ns, ms));
		UpgradeBSkills(ns);
	}

	//ns.bladeburner.stopBladeburnerAction();
}

/** @param {NS} ns */
async function Flipper(ns, actionArgument, isWillingToTravel = false) {
	let successA, successB, general;
	let action = actionArgument;
	while (true) {
		fs++; if (fs >= failSafeCap) { FailSafely(ns, "SleepWhile"); break; }
		if (isWillingToTravel) {
			ttc++; if (ttc >= travelCap) { await GoToBestCity(ns, "isQuiet") }
		}
		if (typeof actionArgument == "function")
			action = actionArgument(ns);

		let count = ns.bladeburner.getActionCountRemaining(action.type, action.name);
		if (typeof actionArgument != "function" && count == 0) {
			ns.tprint(`BREAK - There are no more contracts for ${action.name}`);
			break;
		}

		([successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(action.type, action.name));
		while (successA < successReq) {
			fs++; if (fs >= failSafeCap) { FailSafely(ns, "SleepWhile"); break; }

			if (typeof actionArgument == "function")
				action = actionArgument(ns);


			while (isHealthy(ns) == false) {
				general = healing.find(heal => heal.name == "Hyperbolic Regeneration Chamber")
				StartBladeburnerAction(ns, general);

				let ms = ns.bladeburner.getActionTime(general.type, general.name);
				await ns.sleep(bonus(ns, ms));
			}

			general = healing.find(f => f.name == ((successA == successB) ? "Training" : "Field Analysis"));

			StartBladeburnerAction(ns, general);

			let ms = ns.bladeburner.getActionTime(general.type, general.name);
			await ns.sleep(bonus(ns, ms));
			([successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(action.type, action.name));
		}

		StartBladeburnerAction(ns, action);
		let ms = ns.bladeburner.getActionTime(action.type, action.name);
		await ns.sleep(bonus(ns, ms));
		UpgradeBSkills(ns);
		//await SleepWhile(ns);
	}
}

/** @param {NS} ns */
function PriorityBBActionOrDefault(ns, isDebugging, isPrintingDebug = true) {
	let nextOperation = ops.find(op => ns.bladeburner.getActionCountRemaining("BlackOps", op.name));

	let smarterActions = [...actions, nextOperation]
		.map(m => {
			let [successA, successB] = ns.bladeburner.getActionEstimatedSuccessChance(m.type, m.name);
			let actionTime = ns.bladeburner.getActionTime(m.type, m.name);
			let count = ns.bladeburner.getActionCountRemaining(m.type, m.name);
			return { id: m.id, name: m.name, type: m.type, successA, successB, actionTime, count, rank: m.rank };
		});
	smarterActions = smarterActions.sort((a, b) => GetPriority(ns, b) - GetPriority(ns, a));
	if (isDebugging) {
		let output = "\r\n	"
			+ "type".padEnd(12)
			+ "name".padEnd(33)
			+ "id".padStart(3)
			+ "Clr%".padStart(5)
			+ "Clr%".padStart(5)
			+ "Count".padStart(6)
			+ "Priority".padStart(10)
			+ "Time".padStart(7)
			+ "Rank".padStart(7)
			+ "\r\n";
		smarterActions.forEach(a => {
			output += "	"
				+ a.type.padEnd(12)
				+ a.name.padEnd(33)
				+ NumLeft(a.id, 3)
				+ NumLeft(a.successA * 100, 4) + "%"
				+ NumLeft(a.successB * 100, 4) + "%"
				+ NumLeft(a.count, 6)
				+ NumLeft(GetPriority(ns, a), 10)
				+ NumLeft(a.actionTime, 7)
				+ NumLeft(a.rank, 7)
				+ "\r\n";
		});
		if (isPrintingDebug)
			ns.tprint(output);
		ns.print(output);
		return smarterActions;
	}
	ns.print({ smarterAction: smarterActions[0] })
	return smarterActions[0];
}

function GetPriority(ns, x) {
	let total = 1;

	//ns.tprint({name: x.name, type : x.type == "BlackOps", count: x.count > 0, a: x.successA == 1})
	if (x.type == "BlackOps" && x.count > 0 && x.successB == 1) {
		if (ns.bladeburner.getRank() > x.rank)
			return 300;
	}

	if (x.count < 10)
		return -1;


	// total += x.successA * 100;
	if (x.successB == 1)
		total += 20;

	total += x.id * 2;

	// if (["Assassination", "Tracking"].includes(x.name)){
	// 	ns.tprint({name: x.name, successA: x.successA, successA1: x.successA * 100, total})
	// }
	// total += 10 ** 6 - x.actionTime;

	return total;
}


function GetPriorityTest(ns, x) {
	let total = 1;

	//ns.tprint({name: x.name, type : x.type == "BlackOps", count: x.count > 0, a: x.successA == 1})
	ns.tprint({ myRank: ns.bladeburner.getRank(), xRank: x.rank, xType: x.type });

	if (x.type == "BlackOps" && x.count > 0 && x.successB == 1) {
		ns.tprint({ myRank: ns.bladeburner.getRank(), xRank: x.rank });
		if (ns.bladeburner.getRank() > x.rank)
			return 300;
	}

	if (x.count < 10)
		return -1;


	// total += x.successA * 100;
	if (x.successB == 1)
		total += 20;

	total += x.id * 2;

	// if (["Assassination", "Tracking"].includes(x.name)){
	// 	ns.tprint({name: x.name, successA: x.successA, successA1: x.successA * 100, total})
	// }
	// total += 10 ** 6 - x.actionTime;

	return total;
}

function GetActionOrDefault(argValue) {
	let action = actions.find(f => f.name[0] == argValue?.toUpperCase());

	if (["ra", "rai", "raid"].includes(argValue?.toLowerCase()))
		action = actions.find(f => f.name == "Raid");

	if (["stealth"].includes(argValue?.toLowerCase()))
		action = actions.find(f => f.name == "Stealth Retirement Operation");

	if (!action) action = actions.find(f => f.name == "Tracking");
	return action;
}

/** @param {NS} ns */
function bonus(ns, time) {
	let bonusTime = ns.bladeburner.getBonusTime();
	if (bonusTime > 0) {
		bonusTime = Math.floor(time / 5);
		if (bonusTime > 200)
			return bonusTime;
	}
	return time;
}

/** @param {NS} ns */
function StartBladeburnerAction(ns, action) {
	let { name, type } = ns.bladeburner.getCurrentAction();
	if (name == action.name)
		return
	ns.bladeburner.startAction(action.type, action.name);
}

function FailSafely(ns, location) {
	ns.tprint({ line: location, error: "failSafeCap" });
	ns.toast(`Blade FailSafe`, "error");
	StartBladeburnerAction(ns, healing[0])
}

/** @param {NS} ns */
function UpgradeBSkills(ns) {
	let script = "bskills.js";
	let scriptArgs = []
	let ass = actions.find(action => action.name == "Assassination")
	let nextOp = ops.find(op => ns.bladeburner.getActionCountRemaining("BlackOps", op.name));
	let [, successAssB] = ns.bladeburner.getActionEstimatedSuccessChance(ass.type, ass.name);
	let [, successOpB] = ns.bladeburner.getActionEstimatedSuccessChance(nextOp.type, nextOp.name);
	let hasRank = ns.bladeburner.getRank() > nextOp.rank;
	let readyForAss = successAssB >= successReq;
	let readyForOp = successOpB >= successReq;

	if (hasRank && !readyForOp)
		scriptArgs.push("e");
	else if (readyForAss)
		scriptArgs.push("o");
	else
		scriptArgs.push("e");

	scriptArgs.push("quiet");
	// ns.print({hasRank, readyForOp, readyForAss, scriptArgs})

	if (!ns.args.includes("shy"))
		ns.exec(script, "home", 1, ...scriptArgs);
}

async function GoToBestCity(ns, isQuiet = false) {
	let cityTracker = [];
	let myTravelScript = (city) => ns.exec("helperBlade.js", "home", 1, "r", city ?? "", isQuiet ? "quiet" : "");
	for (let city of cities) {
		if (myTravelScript() == 0) {
			ns.tprint(`Could not run helperBlade.js. Check your home RAM.`);
			return;
		}
		await ns.sleep(200);
		let sumSuccess = PriorityBBActionOrDefault(ns, true, false).reduce((a, c) => a + c.successB, 0);
		cityTracker.push({ city, sumSuccess });
	}
	let bestCity = cityTracker.reduce((a, c) => a.sumSuccess > c.sumSuccess ? a : c).city;
	if (!isQuiet)
		ns.tprint("## ## ## ## ## ## ##")
	// ns.tprint(`BestCity: ${bestCity}`)
	if (!isQuiet && currentCity != bestCity) {
		ns.tprint({ "0": "Traveling to ", currentCity, bestCity });
	}
	if (myTravelScript(bestCity) > 0) {
		currentCity = bestCity;
		// ns.tprint(`Traveled to ${bestCity}`);
	} else {
		ns.tprint(`Could not run helperBlade.js. Check your home RAM.`);
		return;
	}
}

function isHealthy(ns) {
	let [currentStamina, maxStamina] = ns.bladeburner.getStamina();
	if (currentStamina > 300)
		return true;
	let abovePercentage = currentStamina / maxStamina > 0.70;
	return abovePercentage;
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

const ops = [
	{ type: "BlackOps", rank: 2500, name: "Operation Typhoon" },
	{ type: "BlackOps", rank: 5000, name: "Operation Zero" },
	{ type: "BlackOps", rank: 7500, name: "Operation X" },
	{ type: "BlackOps", rank: 10000, name: "Operation Titan" },
	{ type: "BlackOps", rank: 12500, name: "Operation Ares" },
	{ type: "BlackOps", rank: 15000, name: "Operation Archangel" },
	{ type: "BlackOps", rank: 20000, name: "Operation Juggernaut" },
	{ type: "BlackOps", rank: 25000, name: "Operation Red Dragon" },
	{ type: "BlackOps", rank: 30000, name: "Operation K" },
	{ type: "BlackOps", rank: 40000, name: "Operation Deckard" },
	{ type: "BlackOps", rank: 50000, name: "Operation Tyrell" },
	{ type: "BlackOps", rank: 75000, name: "Operation Wallace" },
	{ type: "BlackOps", rank: 100000, name: "Operation Shoulder of Orion" },
	{ type: "BlackOps", rank: 125000, name: "Operation Hyron" },
	{ type: "BlackOps", rank: 150000, name: "Operation Morpheus" },
	{ type: "BlackOps", rank: 175000, name: "Operation Ion Storm" },
	{ type: "BlackOps", rank: 200000, name: "Operation Annihilus" },
	{ type: "BlackOps", rank: 250000, name: "Operation Ultron" },
	{ type: "BlackOps", rank: 300000, name: "Operation Centurion" },
	{ type: "BlackOps", rank: 350000, name: "Operation Vindictus" },
	{ type: "BlackOps", rank: 400000, name: "Operation Daedalus" }
]

// Communities do not affect Diplomacy rates.