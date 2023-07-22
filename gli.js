/** @param {NS} ns */
import ToDollars from "./im/carat"
import StrLeft from "./im/strLeft"
import NumLeft from "./im/numLeft"
import ZeroLeft from "./im/zeroLeft"

// https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.gang.md

let myMoney = 0;
// const warScript = "./terr/war.js";
// const ascTxt = "gangcombat/asc.txt";
const ripTxt = "./terr/rip.txt";
const gangAscTxt = "gangAsc.txt";
const gangTrainTxt = "gangTrain.txt";

export async function main(ns) {
	if (ns.args.length == 0) {
		ns.tprint(`You haven't entered any arguments. Acceptable args are ...
			k >> kill all gli.js scripts

			m >> Mug People
			s >> strongarm civilians
			f >> traffick illegal arms
			h >> human trafficking
			v >> vigilante justice
			t >> train combat
			th >> train hacking
			tc >> train charisma
			tw >> Territorial Warfare
			terror >> Terrorism
			q >> quick vigilante justice and then train

			ba >> WHILE LOOP, batch ascend
			ba [X] >> WHILE LOOP, batch ascend every 10 * X seconds
			br >> WHILE LOOP, batch recruit

			a ["print-all"] >> ascend
			an >> ascend only the members in ${gangTrainTxt}
			e >> weaponmizeMember
			qa >> quick vigilante justice and ascend
			q [m/h/v/t] >> quick vigilante justice and then action
			i >> info
			ia >> see ${gangAscTxt}
			member >> print all member names
			train [44-48/44+] >> write to ${gangTrainTxt}
		`);
		return;
	}

	const arg0 = ns.args[0];

	let members = ns.gang.getMemberNames();
	members = members.map(m => ns.gang.getMemberInformation(m));
	if (arg0 == "k") {
		if (ns.scriptKill("gli.js", "home"))
			ns.tprint("killed gli.js.");
		else
			ns.tprint("didn't kill anything.");
	}
	else if (gliKey(arg0)) {
		assignMembersToTask(ns, arg0, members);
	} else if (arg0 == "q") {
		await quickGetUnwanted(ns, members, ns.args[1]);
	} else if (arg0 == "e") {
		`WeaponizeMembers function does NOT check for prices!!`
		WeaponizeMembers(ns, members);
	} else if (arg0 == "a") {
		ascendBuyAndTrain(ns, members);
	} else if (arg0 == "an") {
		let onlyGangTrain = true;
		ascendBuyAndTrain(ns, members, onlyGangTrain);
	} else if (arg0 == "ba") {
		const seconds = ns.args[1] || 300;
		while (true) {
			ascendBuyAndTrain(ns, members);
			await ns.sleep(1000 * seconds);
		}
	} else if (arg0 == "i") {
		GetInfo(ns, members);
	} else if (arg0 == "ia") {
		SeeBeforeAscNotes(ns);
	} else if (["member", "members"].includes(arg0)) {
		PrintMembers(ns, members);
	} else if (arg0 == "br") {
		await BatchRecruit(ns);
	} else if (arg0 == "train") {
		SetMembersToTrain(ns, members);
	} else {
		ns.tprint("Argument is invalid. Nothing was done.");
	}

	ns.tprint(`gli.js ${ns.args.concat()} ended. ${new Date().toLocaleString()}`);
}



function assignMembersToTask(ns, arg, members) {
	let total = 0;
	let stayInTraining = JSON.parse(ns.read(gangTrainTxt));
	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		// const isSoldier = soldiers.indexOf(member.name) != -1;
		// if (isSoldier && arg != "t") {
		// 	continue;
		// }
		if (stayInTraining.includes(member.name))
			continue;

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
	else if (arg == "s") {
		return "Strongarm Civilians";
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
	else if (arg == "th") {
		return "Train Hacking";
	}
	else if (arg == "t") {
		return "Train Combat";
	}
	else if (arg == "tc") {
		return "Train Charisma";
	}
	else if (arg == "tw") {
		return "Territory Warfare";
	}
	else if (arg == "terror") {
		return "Terrorism";
	}
	return "";
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

async function quickGetUnwanted(ns, members, nextAction) {

	assignMembersToTask(ns, "v", members);
	// while(ns.gang.getGangInformation().wantedLevel != 1)
	// 	await ns.sleep(200);	
	await ns.sleep(Math.pow(10, 4) * 2);
	assignMembersToTask(ns, nextAction ?? "t", members);
}

function ascendBuyAndTrain(ns, members, onlyNewRecruits = false) {
	const toBuyList = GetEquipmentCost(ns, members);
	const stayInTraining = JSON.parse(ns.read(gangTrainTxt));

	if (toBuyList.length < equips.length)
		ns.tprint(`You can afford ${members.length} ${toBuyList[toBuyList.length - 1]}`);

	if (toBuyList.length < 0) {
		ns.tprint(`You can't afford ascensions right now.`);
		return;
	}

	if (onlyNewRecruits && stayInTraining.length > 0)
		MakeBeforeAscNotes(ns, stayInTraining[0]);
	else
		MakeBeforeAscNotes(ns, members[0].name);

	// let ascData = JSON.parse(ns.read("asc.txt"));

	for (let i = 0; i < members.length; i++) {
		if (onlyNewRecruits && !stayInTraining.includes(members[i].name)) {
			continue;
		}
		AscendBuyAndTrainHelper(ns, i, members, toBuyList);
	}
	// ns.write(ascTxt, JSON.stringify(ascData), "w");

}

function AscendBuyAndTrainHelper(ns, i, members, toBuyList) {
	const member = members[i];
	const memberName = member.name;
	//const memberInfo = ns.gang.getMemberInformation(member);
	const ascResult = ns.gang.getAscensionResult(memberName);
	const isPrintingAll = ns.args.includes("print-all");


	if (!ascResult) {
		ns.gang.setMemberTask(memberName, "Train Combat");
		return;
	}

	// if (ascResult.str < 1.1) {
	// 	ns.gang.setMemberTask(memberName, "Train Combat");
	// 	continue;
	// }

	let ascensionInfo = ns.gang.ascendMember(memberName);
	if (ascensionInfo == void 0) {
		ns.tprint(`Could not ascend ${memberName}`);
		return;
	}

	// if (isPrintingAll)
	// 	ns.tprint(beforeAsc);

	// if (!isPrintingAll && i == 0)
	// 	ns.tprint(beforeAsc);

	// if (!isPrintingAll && ns.args.includes("print-last") && i == members.length - 1)
	// 	ns.tprint(beforeAsc);

	WeaponizeMemberHelper(ns, toBuyList, memberName);

	if (ns.gang.setMemberTask(memberName, "Train Combat")) {
		//ns.tprint(`${memberName} is now combat training.`)
	}
	else
		ns.tprint(`${memberName} is error.`)
}

function GetInfo(ns, members) {
	GetInfoHelper(ns, members[0]);
	// for (let i = 0; i < members.length; i++) {
	// 	const member = members[i];
	// 	GetInfoHelper(ns, member);
	// 	ns.tprint("----- ----- ----- ----- ----- -----")
	// }
}

function GetInfoHelper(ns, member) {
	const memberInfo = ns.gang.getMemberInformation(member.name);
	// ns.tprint(ns.gang.getAscensionResult(member.name));
	jtprint(ns, memberInfo);
}

function PrintMembers(ns, members) {
	let output = "\r\n";
	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		output += "	" + NumLeft(i + 1, 2) + ". " + member.name + "\r\n";
	}
	ns.tprint(output);
}

async function BatchRecruit(ns) {
	ns.tprint("WHILE LOOP started. You must manually kill this script.");
	let dead = JSON.parse(ns.read(ripTxt));
	ns.tprint(`You are waiting for man${ZeroLeft(dead.length + 1, 4)}.`);
	while (true) {

		let newestMember = "man" + ZeroLeft(dead.length + 1, 4);
		if (ns.gang.recruitMember(newestMember)) {
			dead.push({ name: newestMember, date: new Date() });
			ns.write(ripTxt, JSON.stringify(dead), "w");
			if (ns.gang.setMemberTask(newestMember, "Train Combat"))
				ns.tprint(`${newestMember} (the new hire) is now training in combat.`);

		}
		await ns.sleep(1000 * 10);
	}
}

// Expecting args[1] to be something like 
// "44-48"
function SetMembersToTrain(ns, members) {
	if (ns.args.length == 1) {
		ns.write(gangTrainTxt, "[]", "w");
		return;
	}


	let membersToTrain = [];
	let theArgString = ns.args[1];
	let parsedStringA = "";
	let parsedStringB = "";
	let x;

	for (let i = 0; i < theArgString.length; i++) {
		let s = theArgString[i];
		if (!parseInt(s))
			break;
		parsedStringA += s;
	}
	x = parseInt(parsedStringA);

	let connector = theArgString[parsedStringA.length];
	if (connector == "-") {
		let y;
		for (let i = parsedStringA.length + 1; i < theArgString.length; i++) {
			let s = theArgString[i];
			if (!parseInt(s))
				break;
			parsedStringB += s;
		}
		y = parseInt(parsedStringB)

		ns.tprint({ x, y })
		for (let i = x; i <= y; i++) {
			membersToTrain.push("man" + ZeroLeft(i, 2));
			membersToTrain.push("man" + ZeroLeft(i, 4));
		}
	} else if (connector == "+") {
		let manX = members.map(m => m.name).indexOf("man" + ZeroLeft(x, 2));
		if (manX == -1)
			manX = members.map(m => m.name).indexOf("man" + ZeroLeft(x, 4));
		
		for(let i = manX; i < members.length; i++){
			membersToTrain.push(members[i].name);
		}
	}

	ns.tprint(membersToTrain.join(" "));
	ns.write(gangTrainTxt, JSON.stringify(membersToTrain), "w");
}

function MakeBeforeAscNotes(ns, memberName) {
	const memberInfo = ns.gang.getMemberInformation(memberName);
	// const ascResult = ns.gang.getAscensionResult(memberName);

	let beforeAsc = {
		"date": new Date(),
		"name": memberName,
		"hack": memberInfo["hack"],
		"str": memberInfo.str,
		"def": memberInfo.def,
		"dex": memberInfo.dex,
		"agi": memberInfo.agi,
		"cha": memberInfo.cha,
		"upgrades": memberInfo.upgrades.length,
		"money": Math.floor(memberInfo["moneyGain"])
	};
	let existingData = JSON.parse(ns.read(gangAscTxt));
	existingData.push(beforeAsc);
	ns.write(gangAscTxt, JSON.stringify(existingData), "w");
	ns.tprint(`MoneyGains: ${ToDollars(beforeAsc.money)}`)
}

function SeeBeforeAscNotes(ns) {
	let existingData = JSON.parse(ns.read(gangAscTxt));
	let output = "\r\n";
	for (let i = 0; i < existingData.length; i++) {
		let eAscData = existingData[i];
		output += StrLeft(new Date(eAscData.date).toLocaleString(), 22) +
			" " + eAscData.name +
			" " + NumLeft(eAscData["hack"], 13) +
			" " + NumLeft(eAscData.str, 13) +
			" " + NumLeft(eAscData.upgrades, 13) +
			" " + NumLeft(eAscData["moneyGain"] || 0, 13) +
			"\r\n";
	}
	output = ("\r\n" + StrLeft("Date", 22) +
		" " + StrLeft("Name", 7) +
		" " + StrLeft("Hack", 13) +
		" " + StrLeft("Str", 13) +
		" " + StrLeft("Upgrades", 13) +
		" " + StrLeft("MoneyGain", 13) +
		output
	);
	ns.tprint(output);
}