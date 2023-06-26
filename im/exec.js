// import CopyNukeExe from 'exec'

/** @param {NS} ns */
const myScript = "alph.js";
const scriptRam = 2.2;
export default function main(ns, targetHost, targetMoney, threads = null) {
	return CopyNukeExe(ns, targetHost, targetMoney, threads);
}

function CopyNukeExe(ns, targetHost, targetMoney, threads) {
	const targetHostServer = ns.getServer(targetHost);
	const targetMoneyServer = ns.getServer(targetMoney);

	const moneyThresh = targetMoneyServer.moneyMax * 0.75;
	const securityThresh = targetMoneyServer.minDifficulty + 5;
	if (!threads)
	threads = Math.floor(
		(targetHostServer.maxRam - targetHostServer.ramUsed) / scriptRam);

	ns.scp(myScript, targetHost);
	if (!targetHostServer.hasAdminRights)
		NukeTarget(ns, targetHostServer.numOpenPortsRequired, targetHost);
	if (!targetMoneyServer.hasAdminRights)
		NukeTarget(ns, targetMoneyServer.numOpenPortsRequired, targetMoney);

	if (threads < 1)
		return;

	return ns.exec(myScript, targetHost, threads, targetMoney, moneyThresh, securityThresh);
}

function NukeTarget(ns, ports, target) {
	if (ports >= 1)
		ns.brutessh(target);

	if (ports >= 2)
		ns.ftpcrack(target);

	if (ports >= 3)
		ns.relaysmtp(target);

	if (ports >= 4)
		ns.httpworm(target);

	if (ports >= 5)
		ns.sqlinject(target);

	ns.nuke(target);
}
