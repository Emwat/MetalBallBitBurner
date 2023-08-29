import tickers from './static/symbols'
import GetProgramLevel from "./im/files"

// ticker
// hostname
// organizationName

const tickRam = 1.75 + 0.15;
const tockRam = 1.7 + 0.15;

// expect to be used by wse.js and wsy.js

/** @param {NS} ns */
export async function main(ns) {
	return;
	let portfolio = JSON.parse(ns.args[0]);
	const myProgramsLevel = GetProgramLevel(ns);
	const myHackingLevel = ns.getHackingLevel();
	let home = ns.getServer("home");
	let homeRam = home.maxRam - home.ramUsed;

	let influencingServers = [];

	for (let p of portfolio) {
		let targetTicker = p.iSym;
		if (targetTicker == "WDS")
			continue;
		let target = tickers.find(t => t.ticker == targetTicker)?.hostname;
		if (!target) {
			ns.tprint(`Cannot find ${targetTicker}`);
			continue;
		}

		let targetServer = ns.getServer(target);
		if (myProgramsLevel < targetServer.numOpenPortsRequired)
			continue;
		if (myHackingLevel < targetServer.requiredHackingSkill)
			continue;
		if (ns.ps("home").find(p => p.args.includes(target)))
			continue;


		influencingServers.push({ hostname: target, isLong: p.isLong || p.iForecast > 51 })
	}

	homeRam = homeRam / influencingServers.length;

	for (let target of influencingServers) {
		let threads = 0;
		if (target.isLong) {
			threads = Math.floor(homeRam / tickRam);
		} else {
			threads = Math.floor(homeRam / tockRam);
		}

		if (threads <= 0) {
			continue;
		}
		if (threads > 2000)
		{
			threads = 2000;
		}

		if (target.isLong) {
			ns.exec("tick.js", "home", threads, target.hostname);
		} else {
			ns.exec("tock.js", "home", threads, target.hostname);
		}
	}

}

