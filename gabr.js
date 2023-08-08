import ZeroLeft from "./im/zeroLeft"





/** @param {NS} ns */
export async function main(ns) {
	let {ripTxt, gangTrainTxt, members} = JSON.parse(ns.args[0]);

	ns.tprint("WHILE LOOP started. You must manually kill this script.");
	let dead = JSON.parse(ns.read(ripTxt));
	ns.tprint(`You are waiting for man${ZeroLeft(dead.length + 1, 4)}.`);
	while (true) {

		let newestMember = "man" + ZeroLeft(dead.length + 1, 4);
		if (ns.gang.recruitMember(newestMember)) {
			dead.push({ name: newestMember, date: new Date() });
			ns.write(ripTxt, JSON.stringify(dead), "w");
			if (members.length > 3) {
				let membersToTrain = JSON.parse(ns.read(gangTrainTxt));
				membersToTrain.push(newestMember);
				ns.write(gangTrainTxt, JSON.stringify(membersToTrain), "w");
			}

			if (ns.gang.setMemberTask(newestMember, "Train Combat"))
				ns.tprint(`${newestMember} (the new hire) is now training in combat.`);

		}
		await ns.sleep(1000 * 10);
	}
}