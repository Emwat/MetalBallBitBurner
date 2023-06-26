/** @param {NS} ns */
export async function main(ns) {
	const w = "\u001b[37m";
	const r = "\u001b[0m"; //reset
	const y = "\u001b[33m";

	let output = sourceMan();
	output = output.replaceAll("	", `	${w}`);
	output = output.replace(/(?:\r\n|\r|\n)/g, `${r}\r\n`);
	
	ns.tail();
	await ns.sleep(0);
	ns.moveTail(1590, 10);
	ns.resizeTail(300, 440);
	ns.print(output);
}

function sourceMan(){
	return `
Alt + t 	Terminal
Alt + c 	Stats
Alt + e 	Script Editor
Alt + s 	Active Scripts
Alt + h 	Hacknet Nodes
Alt + w 	City
Alt + j 	Job
Alt + r 	Travel
Alt + f 	Factions
Alt + a 	Augmentations
Alt + g 	Gang
Alt + b 	Bladeburner
Terminal Shortcuts
	`
}