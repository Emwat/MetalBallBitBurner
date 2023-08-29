import StrLeft from './im/strLeft'
import NumLeft from './im/numLeft'
import StrRight from './im/strRight'
import ToDollars from './im/carat'
import ZeroLeft from './im/zeroLeft'

/** @param {NS} ns */
export async function main(ns) {
	ns.killall("home");
	let install = ns.getMoneySources().sinceInstall;

	ns.exec("cct.js", "home", 1, "a");
	// ns.exec("off.js", "home", 1);
	if (install.gang > 0)
		ns.exec("gli.js", "home", 1, "t");
	ns.exec("sli.js", "home", 1, "i");

	ns.exec("wse.js", "home", 1, "l");
	ns.exec("wse.js", "home", 1, "k");
	ns.exec("wse.js", "home", 1, "s"); await ns.sleep(200);
	ns.exec("wse.js", "home", 1, "xp");
	ns.exec("wse.js", "home", 1, "xl");

	// ns.exec("power.js", "home", 1, "reset");
	if (install.gang > 0) {
		ns.scriptKill("gabr.js", "home");
		ns.scriptKill("gabp.js", "home");
	}
	install = ns.getMoneySources().sinceInstall;
	jtprintd(ns, install);

	ns.tprint("--------------------------------------------");
	ns.tprint(" Did you...");
	if (install.gang > 0) {
		ns.tprint("		equip your gang");
		ns.tprint("		ascend your gang");
	}
	ns.tprint("		donate to servers");
	ns.tprint("		upgrade home server");
	ns.tprint("		spend hashnet points");
	ns.tprint("		install augments for sleeves");
	ns.tprint("		find Serenity with Stanek's Gift");
	ns.tprint("--------------------------------------------");

}

function jtprintd(ns, obj) {
	Object.entries(obj).forEach(entry => {
		const [key, value] = entry;
		ns.tprint("   " + StrRight(key, 22) + " " + StrLeft(ToDollars(value), 9));
	});
}

// test.js:    bladeburner: 0
// test.js:    casino: 0
// test.js:    class: -34368
// test.js:    codingcontract: 0
// test.js:    corporation: 0
// test.js:    crime: 0
// test.js:    gang: 49774716298.229385
// test.js:    hacking: 11341098515.44219
// test.js:    hacknet: 5639741.699547565
// test.js:    hacknet_expenses: -2911494.694393403
// test.js:    hospitalization: 0
// test.js:    infiltration: 0
// test.js:    sleeves: -11178787200
// test.js:    stock: -21128437892.01478
// test.js:    total: 9714296702.64387
// test.js:    work: 413102.00080954545
// test.js:    servers: -33000000
// test.js:    other: -314400000
// test.js:    augmentations: -18750000000
