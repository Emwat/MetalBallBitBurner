/** @param {NS} ns */
import ToDollars from "./im/carat"
import ZeroLeft from "./im/zeroLeft"

// let soldiers = []; // to be populated by args

const soldiers = [
	"man09"
	, "man10"
	, "man11"

	// , "man02"
	// , "man03"
	// , "man04"
	// , "man05"
	// , "man06"
	// , "man07"
	// , "man08"
];

export async function main(ns) {
	if (ns.args.length == 0) {
		ns.tprint(`You haven't entered any arguments. Acceptable args are ...
			You're not ready for war.
		`);
		return;
	}
	//soldiers = ns.args[1];

	if (ns.args[0] == "c") {
		ContemplateWar(ns);
	} else if (ns.args[0] == "war") {
		ContemplateWar(ns, true);
	} else if (ns.args[0] == "r") {
		Recruit(ns);
	}

}

function ContemplateWar(ns, isCommit) {
	const rivals = [
		"Speakers for the Dead"
		, "The Black Hand"
		, "Slum Snakes"
		, "Tetrads"
		, "The Dark Army"
		, "NiteSec"
	];

	StartWar(ns);
	const myGangInfo = ns.gang.getGangInformation();
	ns.tprint(myGangInfo);
	//ns.tprint(`Power: ${.power}`);
	//jtprint(myGangInfo);

	for (let i = 0; i < rivals.length; i++) {
		const rival = rivals[i];
		ns.tprint(`${rival} Chance to win clash: ${ns.gang.getChanceToWinClash(rival)}`);
		jtprint(ns, ns.gang.getOtherGangInformation()[rival]);
	}

	if (isCommit) {
		ns.gang.setTerritoryWarfare(true);
		return;
	}

	Disengage(ns);
}

function StartWar(ns) {
	for (let i = 0; i < soldiers.length; i++) {
		const soldier = soldiers[i];
		if (ns.gang.setMemberTask(soldier, "Territory Warfare")) {
			ns.tprint(`${soldier} is now in Territory Warfare.`);
		}
	}
}

function Disengage(ns) {
	for (let i = 0; i < soldiers.length; i++) {
		const soldier = soldiers[i];
		if (ns.gang.setMemberTask(soldier, "Train Combat")) {
			ns.tprint(`${soldier} is now in combat training.`);
		}
	}
}

function Recruit(ns) {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	let alive = ns.gang.getMemberNames();
	for (let i = 0; i < numbers.length; i++) {
		const unit = ZeroLeft(numbers[i]);
		if (alive.indexOf(unit) > -1) {
			// he's alive
		} else {
			ns.recruitMember("man" + unit);
		}
	}
}

function jtprint(ns, obj) {
	Object.entries(obj).forEach(entry => {
		const [key, value] = entry;
		ns.tprint("   " + key + ": " + value);
	});
}