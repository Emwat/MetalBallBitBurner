/** @param {NS} ns */


const rootkits =
	[
		"NUKE Rootkit"
		, "Soulstealer Rootkit"
		, "Demon Rootkit"
		, "Hmap Node"
		, "Jack the Ripper"
	];

export async function main(ns) {
	//ns.tprint(ns.gang.getGangInformation());
	// const gangInfo = ns.gang.getGangInformation();
	// faction: NiteSec
	// isHacking: true
	// moneyGainRate: 0
	// power: 1
	// respect: 23165.67721315869
	// respectGainRate: 0
	// territory: 0.14285714285714451
	// territoryClashChance: 0
	// territoryWarfareEngaged: false
	// wantedLevel: 1
	// wantedLevelGainRate: 0
	// wantedPenalty: 0.9999568345520249

	//formatJSON(ns, gangInfo);	
	//ns.gang.ascendMember()
	function myMoney() {
		return ns.getServerMoneyAvailable("home");
	}

	let members = ns.gang.getMemberNames();
	members = members.map(m => ns.gang.getMemberInformation(m));
	members = members.sort((a, b) => a.hack_mult < b.hack_mult ? a : b)
	const equipmentCost = 61145008;

	//jtprint(ns, members[0]);


	for (let i = 0; i < members.length; i++) {
		const member = members[i];

		//const memberInfo = ns.gang.getMemberInformation(member);
		const ascResult = ns.gang.getAscensionResult(member.name);
		if (myMoney() < equipmentCost && ascResult.hack < 1.5)
			continue;

		ns.gang.ascendMember(member.name);
		Object.values(rootkits).forEach(r => {
			if(!ns.gang.purchaseEquipment(member.name, r))
			ns.tprint(`Could not buy ${r} for ${member.name}`)
		});

		if (ns.gang.setMemberTask(member.name, "Train Hacking"))
			ns.tprint(`${member.name} is now training on hacking.`)
		else
			ns.tprint(`${member.name} is error.`)
	}
	
}

function jtprint(ns, obj) {
	Object.entries(obj).forEach(entry => {
		const [key, value] = entry;
		ns.tprint(key + ": " + value);
	});
}

function ftprint(ns, obj) {
	for (let i = 0; i < obj.length; i++) {
		const o = obj[i];
		ns.tprint(o);
	}
}
