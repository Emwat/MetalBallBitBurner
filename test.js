/** @param {NS} ns */

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


export async function main(ns) {
	ns.tprint("start test " + new Date().toLocaleString());
	ns.tprint(GetTarget(ns));
	jtprint(ns, ns.getMoneySources().sinceInstall);
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

	// const processes = ns.ps("pserv-00");
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
	// jtprint(ns, ns);
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


function jtprint(ns, obj) {
	Object.entries(obj).forEach(entry => {
		const [key, value] = entry;
		ns.tprint("   " + key + ": " + value);
	});
}

function ftprint(ns, obj) {
	for (let i = 0; i < obj.length; i++) {
		const o = obj[i];
		ns.tprint(o);
	}
}