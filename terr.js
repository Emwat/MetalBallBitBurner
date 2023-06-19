/** @param {NS} ns */
import ToDollars from "./im/carat"


let myMoney = 0;

const soldiers = [
	"man09"
	, "man10"
	, "man11"
]

export async function main(ns) {
	if (ns.args.length == 0) {
		ns.tprint(`You have entered no args. Acceptable args are ...
			m >> Mug People
			h >> human trafficking
			v >> vigilante justice
			t >> train combat
		`);
		return;
	}


	let members = ns.gang.getMemberNames();
	members = members.map(m => ns.gang.getMemberInformation(m));
	members = members.sort((a, b) => a.hack_mult < b.hack_mult ? a : b)

	if (ns.args[0] == "a") {
		ascendAndTrain(ns, members);
	} if (ns.args[0] == "ba") {
		while (true) {
			ascendAndTrain(ns, members);
			await ns.sleep(6000);
		}
	}
	else if (ns.args[0] == "info") {
		for (let i = 0; i < members.length; i++) {
			const member = members[i];
			const memberInfo = ns.gang.getMemberInformation(member.name);
			ns.tprint(ns.gang.getAscensionResult(member.name));
			jtprint(ns, memberInfo);
			ns.tprint("----- ----- -----")
		}
	} else {
		ns.tprint("Argument is invalid. Nothing was done.");
	}
}

function jtprint(ns, obj) {
	Object.entries(obj).forEach(entry => {
		const [key, value] = entry;
		ns.tprint("   " + key + ": " + value);
	});
}

const equips = [
	{ category: "w", cost: 1, name: "Baseball Bat" }
	, { category: "w", cost: 12, name: "Katana" }
	, { category: "w", cost: 25, name: "Glock 18C" }
	, { category: "w", cost: 50, name: "P90C" }
	, { category: "w", cost: 60, name: "Steyr AUG" }
	, { category: "w", cost: 100, name: "AK-47" }
	, { category: "w", cost: 150, name: "M15A10 Assault Rifle" }
	, { category: "w", cost: 225, name: "AWM Sniper Rifle" }

	, { category: "a", cost: 2, name: "Bulletproof Vest" }
	, { category: "a", cost: 5, name: "Full Body Armor" }
	, { category: "a", cost: 25, name: "Liquid Body Armor" }
	, { category: "a", cost: 40, name: "Graphene Plating Armor" }

	, { category: "v", cost: 3, name: "Ford Flex V20" }
	, { category: "v", cost: 9, name: "ATX1070 Superbike" }
	, { category: "v", cost: 18, name: "Mercedes-Benz S9001" }
	, { category: "v", cost: 30, name: "White Ferrari" }
];

function GetEquipmentCost(ns, members) {
	// return ["Baseball Bat"
	// 	, "Bulletproof Vest"
	// 	, "Full Body Armor"
	// 	, "Ford Flex V20"
	// 	, "ATX1070 Superbike"
	// ];
	myMoney = ns.getServerMoneyAvailable("home");
	let output = 0;
	let sortedEquips = equips.sort((a, b) => a.cost - b.cost);
	let toBuyList = [];

	for (let i = 0; i < equips.length; i++) {

		let cost = sortedEquips[i].cost * Math.pow(10, 6) * members.length;
		if (output + cost > (myMoney)) {
			break;
		}
		//ns.tprint(sortedEquips[i].name);
		output += cost;
		toBuyList.push(sortedEquips[i].name);

		// ns.tprint(`${ToDollars(cost)} ${sortedEquips[i].name}`)
	}
	return toBuyList;
}

function ascendAndTrain(ns, members) {
	const toBuyList = GetEquipmentCost(ns, members);
	ns.tprint(toBuyList[toBuyList.length - 1]);

	if (toBuyList.length < 0) {
		ns.tprint(`You can't afford ascensions right now.`);
		return;
	}

	for (let i = 0; i < members.length; i++) {
		const member = members[i];

		//const memberInfo = ns.gang.getMemberInformation(member);
		const ascResult = ns.gang.getAscensionResult(member.name);

		if (i == 0) {

			// ns.tprint(ascResult);

		}

		if (!ascResult) {
			ns.gang.setMemberTask(member.name, "Train Combat");
			continue;
		}

		if (ascResult.str < 1.1) {
			ns.gang.setMemberTask(member.name, "Train Combat");
			continue;
		}

		ns.gang.ascendMember(member.name);
		Object.values(toBuyList).forEach(r => {
			if (!ns.gang.purchaseEquipment(member.name, r))
				ns.tprint(`Could not buy ${r} for ${member.name}`)
		});

		if (ns.gang.setMemberTask(member.name, "Train Combat")) {
			ns.tprint(`${member.name} ${member.str} ${member.def} ${member.dex} ${member.agi}`)
			//ns.tprint(`${member.name} is now combat training.`)
		}
		else
			ns.tprint(`${member.name} is error.`)
	}
}
