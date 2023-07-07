/** @param {NS} ns */
import StrLeft from './im/strLeft'
import NumLeft from './im/numLeft'

export async function main(ns) {
	const processes = ns.ps("home");
	let w = 0;
	let g = 0;
	let h = 0;
	let a = 0;
	for (let i = 0; i < processes.length; i++) {
		const process = processes[i];
		if (process.filename== "weak.js") w++
		if (process.filename== "grow.js") g++
		if (process.filename== "hack.js") h++
		if (process.filename== "alph.js") a++

		if (["weak.js", "grow.js", "hack.js", "alph.js"].indexOf(process.filename) != -1) {
			continue;
		}
		ns.tprint(NumLeft(process.pid, 6) +
			" " + NumLeft(process.threads, 6) +
			" " + process.filename +
			" "	+ process.args.concat() +
			" "
		);

	}

	ns.tprint(
		" w: " + w +
		" g: " + g +
		" h: " + h +
		" a: " + a +
		""
	);
}