/** @param {NS} ns */
import StrLeft from "./im/strLeft"

export async function main(ns) {
	
	if (ns.args[0] == "benchmark")
	{
		ns.tprint("Benchmarking... ")
		const karma1 = MainHelper(ns);
		await ns.sleep(60000);
		const karma2 = MainHelper(ns);
		ns.tprint(`You have gotten ${karma2 - karma1} karma in the past minute.`)
		return;
	}
	MainHelper(ns);
}

function MainHelper(ns){
	const karma = Math.floor(ns.heart.break());
	const date = new Date().toLocaleString();

	ns.tprint(`You have ${karma} karma. Goal: -54k karma ${date}`)
	if (ns.args[0] == "info")
		for (let i = 0; i < karmaDictionary.length; i++) {
			const page = karmaDictionary[i];
			//const x = StrLeft(ns.formatNumber((60 * 5) / ToSeconds(ns, page.time)), 7);

			ns.tprint(`${ns.formatNumber(page.value)} ${page.name}`);
		}

	return karma;
}

function ToSeconds(ns, time) {
	let colon = time.indexOf(":");
	let m = time.substring(0, colon);
	let s = time.substring(colon + 1);
	m = Number(m) * 60;
	//ns.tprint(`${m} ${colon} ${s}`)
	//return 0;
	return m + s;
}

const karmaDictionary = [
	{ value: 0.0500, time: "0:02", name: "Shoplifting" },
	{ value: 0.0083, time: "1:00", name: "Robbery" },
	{ value: 0.0625, time: "0:04", name: "Mugging" },
	{ value: 0.0167, time: "1:30", name: "Larceny" },
	{ value: 0.0500, time: "0:10", name: "Drug dealing" },
	{ value: 0.0003, time: "5:00", name: "Bond forgery" },
	{ value: 0.0250, time: "0:40", name: "Trafficking arms" },
	{ value: 1.0000, time: "0:03", name: "Homicide" },
	{ value: 0.0625, time: "1:20", name: "Grand theft auto" },
	{ value: 0.0500, time: "2:00", name: "Kidnapping" },
	{ value: 0.0333, time: "5:00", name: "Assassination" },
	{ value: 0.0250, time: "10:00", name: "The ultimate heist" }
];

// https://bitburner-official.readthedocs.io/en/latest/basicgameplay/factions.html
