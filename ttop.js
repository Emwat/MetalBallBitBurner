/** @param {NS} ns */
import StrLeft from './im/strLeft'
import NumLeft from './im/numLeft'

export async function main(ns) {
	const processes = ns.ps("home");
	for (let i = 0; i < processes.length; i++) {
		const process = processes[i];
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
}