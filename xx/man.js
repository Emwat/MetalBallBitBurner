/** @param {NS} ns */
export async function main(ns) {

	const w = "\u001b[37m";
	const r = "\u001b[0m";
	const y = "\u001b[33m";

	let output = `
Last Updated: 06/13/2023 10:46 PM
CSEC					CyberSec (1 port, hack 59)
avmnite-02h		NiteSec (2 ports, hack 219)
I.I.I.I				Black Hand (3 ports, hack 360)
run4theh111z	Bitrunners (4 ports, hack 550)

	afteraugs.js (no args needed) ${w} >> applies alpha.js to mostly one server. ${r}
	alph.js ${y} [target] [securityThresh] [moneyThresh] ${r}
	batch.js ${w} >> unused. WHILE Loop, applies w/g/h topTargets evenly on every server except home. ${r}
	cct.js ${w} contracts()
	
	crack.js ${y} [server] ${r}
	dummy.js ${w} >> WHILE LOOP, all servers hack themselves, home applies half w, half g, k if unneeded ${r}
	expert.js ${w} >> WHILE LOOP, all servers hack themselves, home applies idk ${r}
	focus.js ${y} [a/g/w/h, target] ${w} >> Kills everything, all servers apply a/g/w/h on one server ${r}
	focus.js ${y} [k] ${w} >> Kills everything ${r}
	focus.js ${y} [b] ${w} >> WHILE LOOP, kills everything, all servers cycles through w, g, h all for one server ${r}
	gli.js ${y} [e/l/c/t] ${r}
	heartb.js ${w} Gangs needs an insane amount of bad karma. ${r}
	homeHelper.js ${y} many ${w} >> execute and distribute alpha ${r}
	homeHelper.js ${y} one ${w} >> does NOT apply, gives copy paste script for a/w/g/h ${r}
	homeHelper.js ${y} [server] ${w} >> does NOT apply, gives copy paste script for a/w/g/h ${r}
	homeHelper.js ${y} [server] [a/w/g/h] ${w} >> applies ${r}
	hunt.js ${y} [server] ${r}
	lazy.js ${w} >> await many scripts ${r}
	length.js (no args needed)
	net.js ${w} >> buys 8 nodes and upgrades to level 100 ${r}
	net.js ${y} [l/r/c] ${w} >> upgrades to 200/16/8 ${r}
	net.js ${y} [numberOfNodes] ${w} >> will also fully upgrade them ${r}
	net.js ${y} [max] ${w} >> Buys nodes based on money and then fully upgrade ${r}
	nite.js ${w} >> ascend gang members based on hacking ${r}
	print.js ${w} >> defaults to sort by required hacking skill ${r}
	print.js ${y} h ${w} >> sort by hack difficulty ${r}
	print.js ${y} r ${w} >> sort by required hacking skill ${r}
	print.js ${y} [server] ${r}
	pserv.js ${y} rename ${r}
	pserv.js ${y} script ${w} >> applies g/w/h and leftover h ${r}
	pserv.js ${y} script [target] [a/w/g/h] ${r}
	pserv.js ${y} upgrade ${r}
	pserv.js ${y} calc ${r}
	pserv.js ${y} max ${r}
	purchase.js (no args needed) ${w} >> applies alpha.js ${r}
	purchase.js ${y} i ${w} >> find the last purchased server index ${r}
	purchase.js ${y} p ${w} >> (same as no args. purchases 25 servers of 8 GB) ${r}
	
	richnet.js ${y} [numberOfNodes] ${r}
	
	sortTarget.js (no args needed) >> prints servers by TopTarget value. not really working tho.
	`;

	ns.tprint(output);
}