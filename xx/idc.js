/** @param {NS} ns */
export async function main(ns) {
	for(let i = 0; i < 1000; i++){
		ns.exec("weak.js", "home", 100, "the-hub");
	}
}