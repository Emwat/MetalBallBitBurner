/** @param {NS} ns */
export async function main(ns) {
	jtprint(ns, ns.getBitNodeMultipliers(), ns.args[0] == "all");
}



function jtprint(ns, obj, showAll) {
	const white = "\u001b[37m";
	const yellow = "\u001b[33m";
	const brightGreen = "\u001b[32;1m";
	const red = "\u001b[31m";
	const black = "\u001b[30m";
	const brightBlack = "\u001b[30;1m";
	const cyan = "\u001b[36m";
	const green = "\u001b[32m";
	const reset = "\u001b[0m";

	Object.entries(obj).forEach(entry => {
		const [key, value] = entry;
		function MoreIsBetter(k) { return myDictionary[k] == 1 };
		let color = "";
		if (value == 1) {
			if (showAll)
				color = black;
			else
				return;
		}


		if (value > 10)
			color = "";
		else if (myDictionary[key] == 2)
			color = "";
		else if (MoreIsBetter(key) && value > 1)
			color = cyan;
		else if (MoreIsBetter(key) && value < 1)
			color = red;
		else if (!MoreIsBetter(key) && value > 1)
			color = red;
		else if (!MoreIsBetter(key) && value < 1)
			color = cyan;

		ns.tprint(` ${color}${key}: ${value}${reset}`);
	});
}

const myDictionary = {
	HackingLevelMultiplier: 1
	, StrengthLevelMultiplier: 1
	, DefenseLevelMultiplier: 1
	, DexterityLevelMultiplier: 1
	, AgilityLevelMultiplier: 1
	, CharismaLevelMultiplier: 1
	, ServerGrowthRate: 1
	, ServerMaxMoney: 1
	, ServerStartingMoney: 1
	, ServerStartingSecurity: 0
	, ServerWeakenRate: 1
	, HomeComputerRamCost: 0
	, PurchasedServerCost: 0
	, PurchasedServerSoftcap: 2
	, PurchasedServerLimit: 2
	, PurchasedServerMaxRam: 2
	, CompanyWorkMoney: 1
	, CrimeMoney: 1
	, HacknetNodeMoney: 1
	, ManualHackMoney: 1
	, ScriptHackMoney: 1
	, ScriptHackMoneyGain: 1
	, CodingContractMoney: 1
	, ClassGymExpGain: 1
	, CompanyWorkExpGain: 1
	, CrimeExpGain: 1
	, FactionWorkExpGain: 1
	, HackExpGain: 1
	, FactionPassiveRepGain: 1
	, FactionWorkRepGain: 1
	, RepToDonateToFaction: 1
	, AugmentationMoneyCost: 0
	, AugmentationRepCost: 0
	, InfiltrationMoney: 1
	, InfiltrationRep: 1
	, FourSigmaMarketDataCost: 0
	, FourSigmaMarketDataApiCost: 0
	, CorporationValuation: 1
	, CorporationSoftcap: 2
	, CorporationDivisions: 1
	, BladeburnerRank: 1
	, BladeburnerSkillCost: 0
	, GangSoftcap: 1
	, GangUniqueAugs: 2
	, DaedalusAugsRequirement: 2
	, StaneksGiftPowerMultiplier: 1
	, StaneksGiftExtraSize: 1
	, WorldDaemonDifficulty: 0
};