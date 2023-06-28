/** @param {NS} ns */

import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"

// timeA
// timeB
// target
// weakAmt
// growAmt
// hackAmt
const betaTxt = "beta.txt";

export async function main(ns) {
	if (ns.args.length == 0) {
		ns.tprint(`You have not entered any arguments. Acceptable arguments are 
			[server]
		`)
		return;
	}
	const target = ns.args[0];
	ns.scp(betaTxt, "home", target);

	let r = JSON.parse("[" + ns.read(betaTxt).slice(0, -1) + "]");
	let sums = { w: 0, g: 0, h: 0 };

	for (let i = 0; i < r.length && i < 100; i++) {
		const row = r[i];
		const time = new Date(row.timeB) - new Date(row.timeA);
		sums.g += row.growAmt || 0;
		sums.w += row.weakAmt || 0;
		sums.h += row.hackAmt || 0;
		ns.tprint(NumLeft(i, 3) +
			` time: ${StrLeft(msToTime(time), 5)}` +
			` w: ${FormatAmt(row.weakAmt, "w")}` +
			` g: ${FormatAmt(row.growAmt, "g")}` +
			` h: ${FormatAmt(row.hackAmt, "h")}` +
			` target: ${row.target}`)
	}

	ns.tprint(`w: ${sums.w || ""} g: ${sums.g || ""} h: ${sums.h || ""}`);
	ns.tprint("book.js end")
}

function FormatAmt(amt, category){
	const s = 5;
	if (!amt)
		return category == "h" ? StrLeft("", 15) : StrLeft("", s);

	if (category == "h")
		return NumLeft(Math.floor(amt), 15);

	return NumLeft(Math.floor(amt * 100), s);
}

function msToTime(ms) {
	var minutes = Math.floor(ms / 60000);
	var seconds = ((ms % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}