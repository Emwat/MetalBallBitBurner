/** @param {NS} ns */
let gangTrainTxt = "";
let gangPowerTaskTxt = "";
let task;
export async function main(ns) {
	let { members } = JSON.parse(ns.args[0]);
	({ gangTrainTxt, gangPowerTaskTxt } = JSON.parse(ns.args[0]));
	await BatchPowerUp(ns, members);
}

/** @param {NS} ns */
async function BatchPowerUp(ns, members) {
	let startingPower = ns.gang.getGangInformation().power;
	task = ns.read(gangPowerTaskTxt) || "t";
	ns.disableLog("sleep");
	ns.disableLog("gang.setMemberTask");
	ns.print({
		timeStarted: new Date().toLocaleString(),
		startingPower: startingPower.toFixed(3),
		currentPower: ns.gang.getGangInformation().power.toFixed(3)
	});

	AssignMembersToTask(ns, "tw", members);
	while (ns.gang.getGangInformation().power == startingPower) {
		await ns.sleep(1000);
	}
	ns.tprint("Power Increments: " + (ns.gang.getGangInformation().power - startingPower).toFixed(3) +
		" - " + new Date().toLocaleTimeString()
	);
	AssignMembersToTask(ns, task, members);
	await ns.sleep(bonus(ns, 17000));
	AssignMembersToTask(ns, "tw", members);
	await ns.sleep(bonus(ns, 4000));

	ns.enableLog("sleep");

	while (!ns.gang.getGangInformation().territoryWarfareEngaged) {
		task = ns.read(gangPowerTaskTxt);

		ns.print({
			task,
			startingPower: Number(startingPower.toFixed(3)),
			currentPower: Number(ns.gang.getGangInformation().power.toFixed(3))
		});
		AssignMembersToTask(ns, task, members, false);
		await ns.sleep(bonus(ns, 18000));
		AssignMembersToTask(ns, "tw", members, false);
		await ns.sleep(bonus(ns, 2000));
	}
	AssignMembersToTask(ns, task, members, false);
	ns.toast(`Engaging in warfare!`, "error");
}

function AssignMembersToTask(ns, arg, members, disablePrint = false) {
	let total = 0;
	let stayInTraining = JSON.parse(ns.read(gangTrainTxt));
	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		// const isSoldier = soldiers.indexOf(member) != -1;
		// if (isSoldier && arg != "t") {
		// 	continue;
		// }
		if (stayInTraining.includes(member))
			continue;

		total += ns.gang.setMemberTask(member, gliKey(arg)) ? 1 : 0;
	}
	let message = `${total} members are now working on ${gliKey(arg)}`;
	if (disablePrint)
		ns.tprint(message);
	else
		ns.print(message);

}

/** @param {NS} ns */
function bonus(ns, time) {
	let bonusTime = ns.gang.getBonusTime();
	if (bonusTime > 0) {
		bonusTime = Math.floor(time / 25);
		if (time < 1000)
			return 2000;
		return bonusTime;
	}
	return time;
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
	else if (arg == "terror" || arg == "p") {
		return "Terrorism";
	}
	return "";
}

