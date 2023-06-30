/** @param {NS} ns */

const savedFrags = [
	[
		{ x: 0, y: 0, rotation: 0, id: 101 }
		, { x: 0, y: 2, rotation: 0, id: 105 }
		, { x: 1, y: 1, rotation: 0, id: 6 } // hack
		, { x: 2, y: 4, rotation: 0, id: 20 } // hacknet production
		, { x: 3, y: 2, rotation: 0, id: 21 } // hacknet cost
		, { x: 4, y: 0, rotation: 1, id: 101 }
	]
];

export async function main(ns) {
	const frags = savedFrags[0];
	
	while (true) {
		ns.print(new Date().toLocaleString());
		for (let i = 0; i < frags.length; i++) {
			const { x, y, id } = frags[i];
			if (id > 100)
				continue;
			await ns.stanek.chargeFragment(x, y);
		}
	}
}