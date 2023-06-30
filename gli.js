/** @param {NS} ns */
import ToDollars from "./im/carat"
import ZeroLeft from "./im/zeroLeft"
import NumLeft from "./im/numLeft"

// https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.gang.md

let myMoney = 0;


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
			m >> Mug People
			h >> human trafficking
			v >> vigilante justice
			t >> train combat
			q >> quick vigilante justice and then train
			tw >> Territorial Warfare

			---

			a >> ascend
			e >> weaponmizeMember
			qa >> quick vigilante justice and ascend
			q [m/h/v/t] >> quick vigilante justice and then action
			ba >> batch ascend
			ba [X] >> batch ascend every 10 * X seconds
			i >> info
			
			--- WARFARE
			TODO		u >> upgrade people to be up to date
			c >> Contemplate WAR
			war >>  Contemplate WAR and commit
			d >>  Disengage
			br >> WHILE LOOP, batch recruit

		`);
		return;
	}

	const arg = ns.args[0];

	let members = ns.gang.getMemberNames();
	members = members.map(m => ns.gang.getMemberInformation(m));
	if (gliKey(arg)) {
		assignMembersToTask(ns, arg, members);
	} else if (warKey(arg)) {
		const warScript = "./gangcombat/war.js";
		//ns.spawn(warScript, 1, arg);
		ns.exec(warScript, "home", 1, arg);
	} else if (ns.args[0] == "q") {
		await quickGetUnwanted(ns, members, ns.args[1]);
	} else if (ns.args[0] == "e") {
		WeaponizeMembers(ns, members);
	} else if (ns.args[0] == "a") {
		ascendBuyAndTrain(ns, members);
	} else if (ns.args[0] == "ba") {
		const seconds = ns.args[1] || 300;
		while (true) {
			ascendBuyAndTrain(ns, members);
			await ns.sleep(1000 * seconds);
		}
	}
	else if (ns.args[0] == "i") {
		GetInfo(ns, members);
	} else if (ns.args[0] == "br") {
		await BatchRecruit(ns);
	} else {
		ns.tprint("Argument is invalid. Nothing was done.");
	}

	ns.tprint(`gli.js ${ns.args.concat()} ended. ${new Date().toLocaleString()}`);
}



function assignMembersToTask(ns, arg, members) {
	let total = 0;
	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		// const isSoldier = soldiers.indexOf(member.name) != -1;
		// if (isSoldier && arg != "t") {
		// 	continue;
		// }
		total += setTaskGetBit(ns, arg, member.name);
	}
	ns.tprint(`${total} members are now working on ${gliKey(arg)}`);
}

function gliKey(arg) {
	if (false) {

	}
	else if (arg == "m") {
		return "Mug People";
	}
	else if (arg == "f") {
		return "Traffick Illegal Arms";
	}
	else if (arg == "h") {
		return "Human Trafficking";
	}
	else if (arg == "v") {
		return "Vigilante Justice";
	}
	else if (arg == "t") {
		return "Train Combat";
	}
	else if (arg == "tw") {
		return "Territory Warfare";
	}
	return "";
}

function warKey(arg) {
	return (
		arg == "c" ||
		arg == "war" ||
		arg == "r" ||
		arg == "d" ||
		false
	)
}

function setTaskGetBit(ns, arg, member) {
	return ns.gang.setMemberTask(member, gliKey(arg)) ? 1 : 0;
}

function jtprint(ns, obj) {
	Object.entries(obj).forEach(entry => {
		const [key, value] = entry;
		ns.tprint("   " + key + ": " + value);
	});
}

// -----------------------------------------------------------------
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// -----------------------------------------------------------------

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

	, { category: "h", cost: 5, name: "NUKE Rootkit" }
	, { category: "h", cost: 25, name: "Soulstealer Rootkit" }
	, { category: "h", cost: 75, name: "Demon Rootkit" }
	, { category: "h", cost: 40, name: "Hmap Node" }
	, { category: "h", cost: 75, name: "Jack the Ripper" }
];

function WeaponizeMember(ns, member) {
	myMoney = ns.getServerMoneyAvailable("home");
	let ongoingCost = 0;
	let sortedEquips = equips.sort((a, b) => a.cost - b.cost);
	let toBuyList = [];

	for (let i = 0; i < equips.length; i++) {
		const equip = sortedEquips[i];
		if (member.upgrades.indexOf(equip) > -1)
			continue;

		let cost = equip.cost * Math.pow(10, 6);
		if (ongoingCost + cost > myMoney) {
			break;
		}
		//ns.tprint(sortedEquips[i].name);
		ongoingCost += cost;
		toBuyList.push(sortedEquips[i].name);

		// ns.tprint(`${ToDollars(cost)} ${sortedEquips[i].name}`)
	}

	WeaponizeMemberHelper(ns, toBuyList, member.name);

}

function WeaponizeMemberHelper(ns, toBuyList, member) {
	let rejectedMen = [];
	Object.values(toBuyList).forEach(r => {
		if (!ns.gang.purchaseEquipment(member, r) &&
			rejectedMen.indexOf(member) == -1) {
			ns.tprint(`Could not buy ${member} ${r}.`)
			rejectedMen.push(member);
			//ns.print(rejectedMen.concat());
		}
	});
}

function WeaponizeMembers(ns, members) {
	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		WeaponizeMember(ns, member);
	}
}

function GetEquipmentCost(ns, members) {
	// return ["Baseball Bat"
	// 	, "Bulletproof Vest"
	// 	, "Full Body Armor"
	// 	, "Ford Flex V20"
	// 	, "ATX1070 Superbike"
	// ];
	myMoney = ns.getServerMoneyAvailable("home");
	let ongoingCost = 0;
	let sortedEquips = equips.sort((a, b) => a.cost - b.cost);
	let toBuyList = [];

	for (let i = 0; i < equips.length; i++) {

		let cost = sortedEquips[i].cost * Math.pow(10, 6) * members.length;
		if (ongoingCost + cost > myMoney) {
			break;
		}
		//ns.tprint(sortedEquips[i].name);
		ongoingCost += cost;
		toBuyList.push(sortedEquips[i].name);

		// ns.tprint(`${ToDollars(cost)} ${sortedEquips[i].name}`)
	}
	return toBuyList;
}

async function quickGetUnwanted(ns, members, arg2) {

	assignMembersToTask(ns, "v", members);
	// while(ns.gang.getGangInformation().wantedLevel != 1)
	// 	await ns.sleep(200);	
	await ns.sleep(Math.pow(10, 4) * 2);
	assignMembersToTask(ns, arg2 ?? "t", members);
}

function ascendBuyAndTrain(ns, members) {
	const toBuyList = GetEquipmentCost(ns, members);
	if (toBuyList.length < equips.length)
		ns.tprint(`You can afford ${members.length} ${toBuyList[toBuyList.length - 1]}`);

	if (toBuyList.length < 0) {
		ns.tprint(`You can't afford ascensions right now.`);
		return;
	}

	// const ascTxt = "gangcombat/asc.txt";
	// let ascData = JSON.parse(ns.read("asc.txt"));

	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		const memberName = member.name;
		//const memberInfo = ns.gang.getMemberInformation(member);
		const ascResult = ns.gang.getAscensionResult(memberName);
		let beforeAsc = [memberName, 
		"hack", member.hack,
		"str", member.str,
		"def", member.def,
		"dex", member.dex,
		"agi", member.agi,
		"cha", member.cha,
		"upgrades", member.upgrades.length,
		"money", member.moneyGain
		].join();
		beforeAsc = beforeAsc.replaceAll(",", " ");

		if (i == 0) {

			// ns.tprint(ascResult);

		}

		if (!ascResult) {
			ns.gang.setMemberTask(memberName, "Train Combat");
			continue;
		}

		// if (ascResult.str < 1.1) {
		// 	ns.gang.setMemberTask(memberName, "Train Combat");
		// 	continue;
		// }

		let ascensionInfo = ns.gang.ascendMember(memberName);
		if (ascensionInfo == void 0) {
			ns.tprint(`Could not ascend ${memberName}`);
			continue;
		}
		
		if (i == members.length - 1)
			ns.tprint(beforeAsc);
		// member.ascDate = new Date();
		// ascData.push(member);
		WeaponizeMemberHelper(ns, toBuyList, memberName);

		if (ns.gang.setMemberTask(memberName, "Train Combat")) {
			//ns.tprint(`${memberName} is now combat training.`)
		}
		else
			ns.tprint(`${memberName} is error.`)


	}
	// ns.write(ascTxt, JSON.stringify(ascData), "w");

}

function GetInfo(ns, members) {
	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		const memberInfo = ns.gang.getMemberInformation(member.name);
		ns.tprint(ns.gang.getAscensionResult(member.name));
		jtprint(ns, memberInfo);
		ns.tprint("----- ----- ----- ----- ----- -----")
	}
}

async function BatchRecruit(ns) {
	ns.tprint("WHILE LOOP started. You must manually kill this script.");
	const ripFile = "/gangcombat/rip.txt";
	let dead = JSON.parse(ns.read(ripFile));
	ns.tprint(`You are waiting for man${ZeroLeft(dead.length + 1, 2)}.`);
	while (true) {

		let newestMember = "man" + ZeroLeft(dead.length + 1, 2);
		if (ns.gang.recruitMember(newestMember)) {
			dead.push({ name: newestMember, date: new Date() });
			ns.write(ripFile, JSON.stringify(dead), "w");
			if (ns.gang.setMemberTask(newestMember, "Train Combat"))
				ns.tprint(`${newestMember} (the new hire) is now training in combat.`);

		}
		await ns.sleep(1000 * 10);
	}
}
