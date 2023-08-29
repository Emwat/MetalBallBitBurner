/** @param {NS} ns */
export async function main(ns) {

	const w = "\u001b[37m";
	const r = "\u001b[0m"; //reset
	const y = "\u001b[33m";

	let output = sourceMan();
	output = output.replaceAll(">>", `${w}>>`);
	output = output.replaceAll(".js", `${y}`);
	output = output.replace(/(?:\r\n|\r|\n)/g, `${r}\r\n`);
	if (ns.args[0] == "t") {
		ns.tprint(output);
	} else {
		ns.tail();
		await ns.sleep(0);
		ns.moveTail(960, 10);
		ns.resizeTail(900, 900);
		ns.print(output);
	}

}

function sourceMan() {
	return `Last Updated: 08/20/2023 12:55 AM

	I don't know what I'm doing with brackets. Capital letters = variable

CSEC          CyberSec (1 port, hack 59)
avmnite-02h   NiteSec (2 ports, hack 219)
I.I.I.I       Black Hand (3 ports, hack 360)
run4theh111z  Bitrunners (4 ports, hack 550)

    Hacking Level 80
    Total Hacknet Levels of 100
    Total Hacknet RAM of 8
    Total Hacknet Cores of 4
	
	alph.js [TARGET] [securityThresh] [moneyThresh]
	swap.js --mv [oldAction: all/c/a/g/w/h/k] [oldTarget] [newAction: c/a/g/w/h/k] [newTarget]
	chrg.js [JSON] >> Shouldn't run on its own. Use sg.js or chll.js
	tick.js [TICKER] >> grows once
	tock.js [TICKER] >> hacks once
	kl.js [SCRIPT] >> kills scripts with any arguments. helpful for blade.js
	kl.js [servers] [,,,] >> kills scripts hosted on [,,,] servers
	kl.js [SCRIPT] [old] >> leaves only one SCRIPT on home running
	kl.js [all] >> kills scripts hosted on servers other than home

# TRACKING
	hunt.js >> scans milestone servers.
	hunt.js [SERVER] >> scans [SERVER].

	book.js [SERVER] >> reads record.txt on another server (obsolete)
	power.js >> applies data.txt to every server (obsolete)
	length.js >> shows targeted servers
	length.js [i] >> shows targeted servers, sorted by income
	length.js -w [MINUTES] >> waits until MINUTES and then runs

	print.js >> defaults to sort by required hacking skill (does not print servers with higher req hacking skill)
	print.js all >> show all
	print.js h >> sort by hack difficulty
	print.js m >> sort by money max
	print.js r >> sort by required hacking skill
	print.js [SERVER]
	pi.js >> idk what formulas is supposed to help with...

	ttop.js [server] >> see running scripts on server ?? home

# CONTRACTS
	cct.js contracts()
	cct.js a >> solves contracts automatically
	treasure.js >> looks at files

# HARD HITTING
	batch.js >> unused. WHILE Loop, applies w/g/h topTargets evenly on every server except home.
	dummy.js >> WHILE LOOP, applies alpha everything
	expert.js >> WHILE LOOP, all servers hack themselves, home applies idk
	call.js [many] >> execute and distribute alpha
	call.js [one] >> does NOT apply, gives copy paste script for a/w/g/h
	call.js [target]
	call.js [SERVER] >> does NOT apply, gives copy paste script for a/w/g/h
	call.js [target] [a/w/g/h]
	call.js [SERVER] [a/w/g/h] >> applies a/w/g/h

	fill.js >> fills unused servers w/ alph and w
	fwll.js [a/g/w/h/s] >> fills unused servers w/ a/g/w/h/s... mostly used for s
	focus.js [k] >> Kills everything
	focus.js [a/g/w/h, target] >> Kills everything, all servers apply a/g/w/h on one server
	focus.js [b] >> WHILE LOOP, kills everything, all servers cycles through w, g, h all for one server
	focus.js [max] >> kills everything, applies w, g, h, a on one server
	hq.js [LOOPS] [THREADS] >> goes through home, hacknet, and purchased servers and applies a/w/g/h scripts
	hx.js >> copy of hq.js. idr.
	control.js [thread] [xThread]/[loop] [xLoop]/[act] [w/g/h]>> idr. More specific hq.
	plant.js >> BruteSSH, FTPCrack, RelaySMTP, HTTPWorm, SQLInject

# ASDF
	beforeaugs.js >> kills stock scripts, execs cct, 
	off.js >> turns off blade, kills chrg, gang batch scripts, empties hacknet servers, calls home scripts
	rebirth.js >> Singularity Augs
	rebirth.js [c] >> combat
	rebirth.js [h] >> hack
	rebirth.js [max] >> all

# GANG
	gli.js >> defaults to help
	gli.js [br] >> Batch recruit
	gli.js [bp] >> Batch Territory Warfare + previous gli command
	heartb.js >> Gangs needs an insane amount of bad karma.
	nite.js >> ascend gang members based on hacking
	
# HACKNET
	net.js [l/r/c] [X] >> upgrades [l/r/c] [X] number of times. Can run multiple arguments at once
	richnet.js [numberOfNodes]
	nnet.js >> defaults to help
  nnet.js k >> empty hacknet servers
	
# PRIVATE SERVERS
	pserv.js >> defaults to help
	pserv.js rename
	pserv.js script >> applies g/w/h and leftover h
	pserv.js script [target] PushScriptToMany >> topTargets
	pserv.js script [target] [a/w/g/h] >> PushOneScript(single target)
	pserv.js upgrade
	pserv.js calc
	pserv.js max
	purchase.js >> defaults to help
	purchase.js i >> find the last purchased server index
	purchase.js p >> (same as no args. purchases 25 servers of 8 GB)
	
# BLADE
	blade.js >> defaults to help. Has exec for helperBlade.js
	blade.js bp >> WHILE LOOP, blade with priority
	helperBlade.js [c] >> cities chaos
		Note: I need to incorporate communities
	helperBlade.js [cm] >> city with min chaos
	bskills.js e >> upgrade skills
	bskills.js o >> upgrade skill Overclock
	bskills.js m >> upgrade skill Hands of Midas

# STOCK
	wsy.js >> WHILE LOOP, without 4Sigma data, measure and commit to buying/selling
	wsy.js S >> Sell everything
	wsy.js sw >> Sell winners
	wsy.js sl >> Sell losers
	wsy.js l >> Tail portfolio
	wsy.js la >> Print portfolio totals

	wse.js >> defaults to help.
	wse.js info >> all symbols
	wse.js b >> WHILE LOOP, if good forecast, buy it! If not, sell it!

# SLEEVE
	sli.js >> defaults to help.

# STANEK
	sg.js >> defaults to help.
	`;
}