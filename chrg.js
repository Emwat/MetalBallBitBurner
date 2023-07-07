/** @param {NS} ns */


export async function main(ns) {
	if (ns.args.length == 0)
		throw "no arguments found."

	const frags = JSON.parse(ns.args[0]);

	while (true) {
		ns.print(new Date().toLocaleString());
		for (let i = 0; i < frags.length; i++) {
			const { x, y, id } = frags[i];
			if (id > 99)
				continue;
			await ns.stanek.chargeFragment(x, y);
		}
	}
}