/** @param {NS} ns */

const folder = "freeram"; // NOT DRY, please also set it in set.js

export default async function main(ns, input) {
	let [dumpName, fnName, arg1, arg2, arg3] = input;
	// ns.exec("set.js", "home", 1, [fnName, arg1, arg2, arg3]);
	ns.exec("set.js", "home", 1, dumpName, fnName, arg1, arg2, arg3);
	await ns.sleep(200);
	//return ns.read("ramaround/dump.txt");
		return JSON.parse(ns.read(`${folder}/${dumpName}.txt`));

	if (isObject)
		return JSON.parse(ns.read(`${folder}/${dumpName}.txt`));
	else
		return ns.read(`${folder}/${dumpName}.txt`);
}
