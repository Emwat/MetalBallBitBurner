/** @param {NS} ns */
export async function main(ns) {

	const w = "\u001b[37m";
	const r = "\u001b[0m"; //reset
	const y = "\u001b[33m";

	let output = sourceMan();
	output = output.replaceAll(">>", `${w}>>`);
	output = output.replaceAll(".js", `${y}`);
	output = output.replace(/(?:\r\n|\r|\n)/g, `${r}\r\n`);
	

	ns.tprint(output);
}

function sourceMan() {
	return `Last Updated: 06/19/2023 09:44 AM

CSEC          CyberSec (1 port, hack 59)
avmnite-02h   NiteSec (2 ports, hack 219)
I.I.I.I       Black Hand (3 ports, hack 360)
run4theh111z  Bitrunners (4 ports, hack 550)

	afteraugs.js (no args needed) >> applies alpha.js to mostly one server.
	alph.js [target] [securityThresh] [moneyThresh]
	batch.js >> unused. WHILE Loop, applies w/g/h topTargets evenly on every server except home.
	cct.js contracts()
	
	crack.js [server]
	dummy.js >> WHILE LOOP, all servers hack themselves, home applies half w, half g, k if unneeded
	expert.js >> WHILE LOOP, all servers hack themselves, home applies idk
	focus.js [a/g/w/h, target] >> Kills everything, all servers apply a/g/w/h on one server
	focus.js [k] >> Kills everything
	focus.js [b] >> WHILE LOOP, kills everything, all servers cycles through w, g, h all for one server
	gli.js [e/l/c/t]
	heartb.js Gangs needs an insane amount of bad karma.
	homeHelper.js many >> execute and distribute alpha
	homeHelper.js one >> does NOT apply, gives copy paste script for a/w/g/h
	homeHelper.js [server] >> does NOT apply, gives copy paste script for a/w/g/h
	homeHelper.js [server] [a/w/g/h] >> applies
	hunt.js [server]
	lazy.js >> await many scripts
	length.js [minutes]
	net.js >> buys 8 nodes and upgrades to level 100
	net.js [l/r/c] >> upgrades to 200/16/8
	net.js [numberOfNodes] >> will also fully upgrade them
	net.js [max] >> Buys nodes based on money and then fully upgrade
	nite.js >> ascend gang members based on hacking
	print.js >> defaults to sort by required hacking skill (exclude 1.25x difficulty)
	print.js all >> show all
	print.js h >> sort by hack difficulty
	print.js m >> sort by money max
	print.js r >> sort by required hacking skill
	print.js [server]
	pserv.js rename
	pserv.js script >> applies g/w/h and leftover h
	pserv.js script [target] [a/w/g/h]
	pserv.js upgrade
	pserv.js calc
	pserv.js max
	purchase.js (no args needed) >> applies alpha.js
	purchase.js i >> find the last purchased server index
	purchase.js p >> (same as no args. purchases 25 servers of 8 GB)
	
	richnet.js [numberOfNodes]
	
	sortTarget.js (no args needed) >> prints servers by TopTarget value. not really working tho.
	`;
}