/** @param {NS} ns */
const folder = "freeram";

export async function main(ns) {
	const [dpName, fnName, arg1, arg2, arg3] = ns.args;
	// const dpName = ns.args[0];
	// const fnName = ns.args[1];
	//  const arg1 = ns.args[2]; 
	//  const arg2 = ns.args[3]; 
	//  const arg3 = ns.args[4];
	ns.tprint(`${fnName} (${arg1},${arg2},${arg3})`)
	let output = "uninitialized";
	output = switchCaseFunction(ns, fnName, arg1, arg2, arg3);
	
	ns.write(`${folder}/${dpName}.txt`, JSON.stringify(output), "w");
}

function switchCaseFunction(ns, fnName, arg1, arg2, arg3){
	
	switch(fnName)
	{
		case "getHackingLevel": return ns.getHackingLevel(); break;
		case "getHackingMultipliers": return ns.getHackingMultipliers(); break;
		case "getHacknetMultipliers": return ns.getHacknetMultipliers(); break;

		// getHackTime(host)
		case "getHackTime": return ns.getHackTime(arg1); break;
		case "getHostname": return ns.getHostname(); break;
		case "getMoneySources": return ns.getMoneySources(); break;
		case "getPlayer": return ns.getPlayer(); break;
		// getPortHandle(portNumber)
		case "getPortHandle": return ns.getPortHandle(arg1); break;
		// getPurchasedServerCost(ram)
		case "getPurchasedServerCost": return ns.getPurchasedServerCost(arg1); break;
		case "getPurchasedServerLimit": return ns.getPurchasedServerLimit(); break;
		case "getPurchasedServerMaxRam": return ns.getPurchasedServerMaxRam(); break;
		case "getPurchasedServers": return ns.getPurchasedServers(); break;
		// getPurchasedServerUpgradeCost(hostname, ram)
		case "getPurchasedServerUpgradeCost": return ns.getPurchasedServerUpgradeCost(arg1, arg2); break;
		case "getRecentScripts": return ns.getRecentScripts(); break;
		case "getResetInfo": return ns.getResetInfo(); break;
		// getRunningScript(filename, hostname, args)
		case "getRunningScript": return ns.getRunningScript(arg1, arg2, arg3); break;
		// getScriptExpGain(script, host, args)
		case "getScriptExpGain": return ns.getScriptExpGain(arg1, arg2, arg3); break;
		// getScriptIncome(script, host, args)
		case "getScriptIncome": return ns.getScriptIncome(arg1, arg2, arg3); break;
		// getScriptLogs(fn, host, args)
		case "getScriptLogs": return ns.getScriptLogs(arg1, arg2, arg3); break;
		case "getScriptName": return ns.getScriptName(); break;
		// getScriptRam(script, host)
		case "getScriptRam": return ns.getScriptRam(arg1, arg2); break;
		// getServer(host)
		case "getServer": return ns.getServer(arg1); break;
		// getServerBaseSecurityLevel(host)
		case "getServerBaseSecurityLevel": return ns.getServerBaseSecurityLevel(arg1); break;
		// getServerGrowth(host)
		case "getServerGrowth": return ns.getServerGrowth(arg1); break;
		// getServerMaxMoney(host)
		case "getServerMaxMoney": return ns.getServerMaxMoney(arg1); break;
		// getServerMaxRam(host)
		case "getServerMaxRam": return ns.getServerMaxRam(arg1); break;
		// getServerMinSecurityLevel(host)
		case "getServerMinSecurityLevel": return ns.getServerMinSecurityLevel(arg1); break;
		// getServerMoneyAvailable(host)
		case "getServerMoneyAvailable": return ns.getServerMoneyAvailable(arg1); break;
		// getServerNumPortsRequired(host)
		case "getServerNumPortsRequired": return ns.getServerNumPortsRequired(arg1); break;
		// getServerRequiredHackingLevel(host)
		case "getServerRequiredHackingLevel": return ns.getServerRequiredHackingLevel(arg1); break;
		// getServerSecurityLevel(host)
		case "getServerSecurityLevel": return ns.getServerSecurityLevel(arg1); break;
		// getServerUsedRam(host)
		case "getServerUsedRam": return ns.getServerUsedRam(arg1); break;
		case "getSharePower": return ns.getSharePower(); break;
		case "getTimeSinceLastAug": return ns.getTimeSinceLastAug(); break;
		case "getTotalScriptExpGain": return ns.getTotalScriptExpGain(); break;
		case "getTotalScriptIncome": return ns.getTotalScriptIncome(); break;
		// getWeakenTime(host)
		case "getWeakenTime": return ns.getWeakenTime(arg1); break;
	}
	throw new Error(`switchCaseFunction(${fnName}) has invalid argument.`);
}