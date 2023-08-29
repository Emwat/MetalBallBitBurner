import GetProgramLevel from "./im/files"

import AlphExec from "./im/exec"
import NumLeft from './im/numLeft'
import StrLeft from './im/strLeft'
import StrRight from './im/strRight'
import ZeroLeft from './im/zeroLeft'
import ToDollars from './im/carat'

import GetTarget from './im/target'
import GetTargets from './im/topTarget'
// import GetServers from './static/servers'
import GetServers from './im/servers'

import GetMostAffordableNode from './im/nodeCosts'
import Get from "get.js"

import tickers from "./static/symbols"
import FormatTime from './im/time'
import ParseNumbers from './im/colon'
import operations from './static/blackops'
import cities from './static/cities'
// carat.js
// exec.js
// files.js
// nodeCosts.js
// numLeft.js
// servers.js
// strLeft.js
// strRight.js
// target.js
// topTarget.js
// zeroLeft.js


/** @param {NS} ns */
let lotsCostsDebugTxt = "lotsCosts.txt";
function asdf(ns) {
	let data = JSON.parse(ns.read(lotsCostsDebugTxt)).flat();
	let symbols = ns.stock.getSymbols();
	symbols.map(s => {
		let filtered = data.filter(d => d.name == s);
		let profit = (filtered[filtered.length - 1].price / filtered[0].price);
		return { name: s, profit }
	}).forEach((v, i, arr) => {
		ns.tprint(v.name.padStart(5) + " " + v.profit.toFixed(2));
	})
}


/** @param {NS} ns */
export async function main(ns) {
	ns.tprint("start test " + new Date().toLocaleString());
	ns.tprint(ToDollars(10 ** 4 * 3))
	
	// ns.tprint(String("01").split(""))
	// ns.tprint(String("01").split("").some(o => ns.tprint(o)))
	// ns.tprint(String("0,1").split("").some(o => "-+,".split("").includes(o)))

	// ns.tprint(ParseNumbers(ns, "1,22,333,4444,55555"));
	// ns.tprint(ParseNumbers(ns, "3-22"));
	// ns.tprint(ParseNumbers(ns, "4+", 10));
	// ns.tprint(ParseNumbers(ns, "0,1"));
	// ns.tprint(ToDollars(1234567890, true))
	// ns.tprint(ToDollars(1234567890, false))
	// ns.tprint(ToDollars(123456789, true))
	// ns.tprint(ToDollars(123456789, false))
	// ns.tprint(ToDollars(12345678, true))
	// ns.tprint(ToDollars(12345678, false))
	// ns.tprint(abc(ns.sleeve.getSleeveAugmentations(0)));
	// await ns.singularity.manualHack();

	// jtprint(ns, ns.getPlayer())
	// let lcities = { "Sector-12": "Sector12", "New Tokyo": "NewTokyo" }

	// let locations = Object.entries(ns.enums.LocationName).map(([key, value]) => {
	// 	let city = cities.reduce((a, c) => {
	// 		if (key.indexOf(c) == 0)
	// 			return c;
	// 		if (lcities[c] && key.indexOf(lcities[c]))
	// 			return c;
	// 		return a;
	// 	}, "");

	// 	return { city, location: value }
	// });
	//abc(JSON.stringify(locations));
	// abc(ns.enums.LocationName);
	//ns.tprint(ns.getScriptRam("wse.js"));
	//ns.tprint(ns.exec("tick.js", "home", 1, "OMTK"));
	// ns.tprint(ns, ["SLRS", "ICRS", "CLRK", "STM", "LXO", "OMTK", "BLD", "OMGA"]
	// .map(s => { return { s, req: ns.getServer(tickers.find(f => f.ticker == s).hostname).requiredHackingSkill}; }))

	// jtprint(ns, ns.getServer("foodnstuff"));
	// asdf(ns);
	//ns.tprint(ParseNumbers(ns, "4"));
	//ns.tprint(ParseNumbers(ns, "6-11"));
	//jtprint(ns, ns.sleeve.getSleeve(0));
	//ns.tprint(ns.bladeburner.getRank());
	//ns.tprint(ns.bladeburner.getActionEstimatedSuccessChance("BlackOps", "Operation Morpheus"));
	//ns.tprint(ns.bladeburner.getBlackOpRank());
	// ns.tprint({shy: ns.args.includes("shy")});
	//ns.tprint([200, 2000, 20000].map(t=>FormatTime(t, "m:s")))
	// jtprint(ns, ns.gang.getGangInformation())
	// ns.tprint(GetTarget(ns));
	//jtprint(ns, ns.sleeve.getSleeve(1).skills)
	//ns.tprint(ns.getServer('w0r1d_d43m0n').requiredHackingSkill);
	//jtprint(ns, ns);
	// jtprint(ns, ns.corporation.getMaterialData("Water"));
	//ns["tprint"](GetTarget(ns));
	// ns.tprint(StrRight("test", 50) + "x");
	// ns.tprint(augs);
	// jtprint(ns, ns.sleeve.getSleeve(0).skills);
	// ftprint(ns, GetTargets(ns))
	// ns.tprint(ns.hacknet.getHashUpgradeLevel("Improve Studying"))
	// ns.tprint(JSON.stringify(GetTickersAndOrganizations(ns)));
	// ftprint(ns, ns.sleeve.getSleevePurchasableAugs(0));

	// jtprint(ns, ns.stanek.fragmentDefinitions()[0])

	// ftprint(ns, ns.codingcontract.getContractTypes());

	// jtprint(ns, ns);
	// jtprint(ns, ns.stanek);
	// let doc = eval("document");

	//ns.tprint(GetServers(ns).indexOf("home"));
	// for(let i = 0; i < 100; i++)
	// ns.tprint(`${i} ${ns.weakenAnalyze(i, 8)}`)
	// ns.tprint(ns.growthAnalyze())
	// ns.tprint(ns.hackAnalyze("megacorp"))
	// ns.tprint(ns.hackAnalyze("ecorp"))
	// ns.tprint(ns.growthAnalyze())
	// ns.tprint(ns.growthAnalyze())
	// ns.tprint(ns.growthAnalyze())
	// ftprint(ns, ns.scan("home"));
	// let members = ns.gang.getMemberNames();
	// members = members.map(m => ns.gang.getMemberInformation(m));
	// jtprint(ns, members[0]);
	// jtprint(ns, ns.getMoneySources().sinceInstall);
	// jtprint(ns, ns.getServer("catalyst"));
	// AlphExec(ns, "home", "n00dles", 1);
	// ns.tprint(arguments); idk wtf this is
	// ns.tprint("Your Ports: " + GetProgramLevel(ns));
	// for(let i = 1; i < 5; i++){
	// 	for (let j = 100; j < 2000; j += 100){
	// 		ns.tprint(`ns.weakenAnalyze(threads: ${j}, cores: ${i}) returns ${ns.weakenAnalyze(j, i)}`);
	// 	}
	// }
	// jtprint(ns, ns.getServer("iron-gym"))

	// ns.tprint(ns.HackingForumlas.hackPercent(GetTarget(ns), ns.getPlayer()));
	// ns.tprint(ns.Gang.createGang(""));
	// ns.tprint(ToDollars(123456, true));
	// ns.tprint(ToDollars(1234567, true));
	// ns.tprint(ToDollars(123456789, false));
	// let topTargets = GetTargets(ns);
	// ns.tprint(topTargets[0]);
	// ns.tprint(topTargets[1]);
	// ns.tprint(topTargets[2]);
	// ns.tprint(Number.isInteger(14));
	// ns.tprint(Number.isInteger("14"));
	// ns.tprint(ZeroLeft(1, 2));
	// ns.tprint(ZeroLeft("1", 2));
	// ns.tprint(ZeroLeft("9", 2));
	// ns.tprint("pserv-01".startsWith("pserv"))
	// jtprint(ns, ns.getServer("n00dles"));
	// ns.tprint(ns.ps("n00dles"));
	// ftprint(ns, ns.gang.getTaskNames());
	// ftprint(ns, GetServers(ns));
	// ns.tprint(GetMostAffordableNode(ns));

	// const processes = ns.ps("home");
	// for (let i = 0; i < processes.length; ++i) {
	// 	ns.tprint(processes[i].filename + ' ' + processes[i].threads);
	// 	ns.tprint(processes[i].args);
	// 	ns.tprint(processes[i].pid);
	// }
	// jtprint(ns, processes[0]);
	// ns.tprint(`ScriptIncome: ${ns.getScriptIncome(processes[0].filename, "iron-gym", ...processes[0].args)}`)
	// ns.tprint("asdf write");
	// ns.write("asdf.txt", JSON.stringify({"a": new Date().toLocaleString(), "b" : "hi"}), "w");
	// ns.tprint("asdf read");
	// ns.tprint(JSON.parse(ns.read("asdf.txt")).a);
	// ns.tprint("lolram");
	// // exec(script, hostname, threadOrOptions, args)

	// let lolram1 = await Get(ns, ["lolram1", "getServerBaseSecurityLevel", "the-hub", -2, -3]);
	// // jtprint(ns, lolram);
	// ns.tprint(lolram1);
	// let lolram2 = await Get(ns, ["lolram2", "getScriptRam", "test.js", "home", -2, -3]);
	// ns.tprint(lolram2)
	// ns.tprint("end lolram");
	// jtprint(ns, ns.enums.CityName);
	// jtprint(ns, ns.enums.CrimeType);
	// jtprint(ns, ns.enums.FactionWorkType);
	// jtprint(ns, ns.enums.GymType);
	// jtprint(ns, ns.enums.LocationName);
	// jtprint(ns, ns.enums.JobName);
	// jtprint(ns, ns.enums.ToastVariant);
	// jtprint(ns, ns.enums.UniversityClassType);
	// jtprint(ns, ns.heart);
	// jtprint(ns, ns.rainbow);
	// jtprint(ns, ns.rainbow("bitburner"));
	// ns.openDevMenu(); // DONT DO IT
	// jtprint(ns, ns.getPlayer());
	// jtprint(ns, ns.formulas);
	// ns.tprint(ns.formulas.hacking.weakenTime(ns.getServer("n00dles"), ns.getPlayer()));
	// ns.tprint(ns.getWeakenTime("n00dles"));
	// jtprint(ns, ns.getBitNodeMultipliers());
	// ns.exploit();
	// await testPrompt(ns);

	ns.tprint("end test.");


}

// function GetTickersAndOrganizations(ns){
// 	let output = [];
// 	let tickers = ns.stock.getSymbols().map(m => [m, ns.stock.getOrganization(m)]);
// 	ns.tprint(tickers[0])
// 	const servers = GetServers(ns).map(m => ns.getServer(m));
// 	for (let i = 0; i < servers.length; i++){
// 		let server = servers[i];
// 		let ticker = tickers.find(f => f[1] == server.organizationName);
// 		if(ticker)
// 			output.push({hostname: server.hostname, ticker: ticker[0], organizationName: server.organizationName});
// 	}
// 	return output;
// }

function terminalWidth() {
	let output = "";
	for (let i = 0; i < 400; i++) {
		let str = i.toString();
		str = str[str.length - 1];
		if (i % 10 == 0)
			output += "X"
		else
			output += " ";
	}
	ns.tprint(output);
}

async function testPrompt(ns) {
	const queryA = "Do you enjoy Bitburner?";
	const resultA = await ns.prompt(queryA);
	ns.tprint(`${queryA} ${resultA}`);

	const resultC = await ns.prompt("Please enter your name.", { type: "text" });
	ns.tprint(`Hello, ${resultC}.`);

	const resultD = await ns.prompt("Please select your favorite fruit.", {
		type: "select",
		choices: ["Apple", "Banana", "Orange", "Pear", "Strawberry"]
	});
	ns.tprint(`Your favorite fruit is ${resultD.toLowerCase()}.`);
}

function getRandomInt(max) {
	return Math.floor(Math.random() * (max + 1));
}

function abc(x) {
	if (Array.isArray(x))
		return strArray(x);
	if (typeof x == "object")
		return strObject(x);
	return x;
}

function strObject(x) {
	return Object.entries(x).map(([key, value]) => `	${key}: ${abc(value)}`);
}

function strArray(arr) {
	return "\r\n	" + arr.map(a => abc(a)).join("\r\n	")
}

function FixAugs(augs) {
	let a = [];
	//ns.tprint( typeof augs); return;
	// jtprint(ns, augs[0]);return;
	// ns.tprint(augs.length); return;

	for (let i = 0; i < augs.length; i++) {
		let aug = augs[i];
		let bonuses = {};
		if (aug.bonuses)
			for (let j = 0; j < aug.bonuses.length; j++) {
				let obj = aug.bonuses[j];
				let k = Object.keys(obj)[0];
				let v = Object.values(obj)[0];
				bonuses[k] = v;
			}
		a.push({ ...aug, bonuses });

	}
	ns.tprint(JSON.stringify(a));
}