let numSleeves;

/** @param {NS} ns */
export async function main(ns) {
	numSleeves = ns.args[0];
	let argParams = ns.args[1];

	ns.tprint(`Gym`);
	let gyms = ["Powerhouse Gym"];
	let stats = ["str", "def", "dex", "agi"]
	let gym = gyms[0];
	let stat = stats.find(f => f == argParams);
	ns.tprint(`${gym} ${stat}`);
	if (argParams == "all") {
		let i = 0;
		let s = 0;
		while (i < numSleeves) {
			if (s >= stats.length)
				s = 0;
			ns.sleeve.setToGymWorkout(i, gym, stats[s]);
			i++;
			s++;
		}
	} else {
		loop(ns, ns.sleeve.setToGymWorkout, [gym, stat]);
	}
	// setToGymWorkout(sleeveNumber, gymName, stat) 	Set a sleeve to workout at the gym.

}

function loop(ns, myFunction, moreArgs) {
	for (let i = 0; i < numSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}
