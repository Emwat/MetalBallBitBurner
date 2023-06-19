/** @param {NS} ns */
export default function main(server, target, myHackingLevel) {
	const white = "\u001b[37m";
	const yellow = "\u001b[33m";
	const brightGreen = "\u001b[32;1m";
	const red = "\u001b[31m";
	const black = "\u001b[30m";
	const brightBlack = "\u001b[30;1m";
	const cyan ="\u001b[36m";
	const green = "\u001b[32m";
	const reset = "\u001b[0m";

	if (server.hostname == "Totals")
		return reset;
	if (server.ramUsed == 0 && server.maxRam > 0)
		return white;
	if (myHackingLevel && server.requiredHackingSkill > myHackingLevel / 2)
		return black;
	if (!server.hasAdminRights)
		return brightBlack;
	if (server.hostname == target)
		return red;
	if (server.minDifficulty + 5 < Math.floor(server.hackDifficulty))
		return yellow;
	if (server.cpuCores > 1)
		return brightGreen;
	
	return reset;
}