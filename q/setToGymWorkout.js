let numberOfSleeves;

/** @param {NS} ns */
export async function main(ns) {
	let {numSleeves, argRabbit, argParams} = JSON.parse(ns.args[0]);
	numberOfSleeves = numSleeves;

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
	for (let i = 0; i < numberOfSleeves; i++) {
		if (moreArgs)
			myFunction(i, ...moreArgs);
		else
			myFunction(i);
	}
}
