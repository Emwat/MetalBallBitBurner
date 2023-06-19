// import CopyNukeExe from 'exec'

/** @param {NS} ns */
export default function main(ns, myScript, targetHost, targetMoney) {
	return CopyNukeExe(ns, myScript, targetHost, targetMoney);
}

function CopyNukeExe(ns, myScript, targetHost, targetMoney) {
	const targetHostServer = ns.getServer(targetHost);
	const targetMoneyServer = ns.getServer(targetMoney);

	const moneyThresh = targetMoneyServer.moneyMax * 0.75;
	const securityThresh = targetMoneyServer.minDifficulty + 5;
	const threads = Math.floor(targetHostServer.maxRam / ns.getScriptRam(myScript));

	ns.scp(myScript, targetHost);
	if (!targetHostServer.hasAdminRights)
		NukeTarget(ns, targetHostServer.numOpenPortsRequired, targetHost);
	if (!targetMoneyServer.hasAdminRights)
		NukeTarget(ns, targetMoneyServer.numOpenPortsRequired, targetMoney);

	if (threads == 0)
		return;

	return ns.exec(myScript, targetHost, threads, targetMoney, moneyThresh, securityThresh);
}


function NukeTarget(ns, ports, target) {
	if (ns.hasRootAccess(target))
		return;

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