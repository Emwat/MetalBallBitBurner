/** @param {NS} ns */
export async function main(ns) {

	let ops = ns.bladeburner.getBlackOpNames();
	ops = ops.map(m => {
		return {
			rank: ns.bladeburner.getBlackOpRank(m),
			name: m,
			// success: ns.bladeburner.getActionSuccesses("BlackOps", m),
			// count: ns.bladeburner.getActionCountRemaining("BlackOps", m)
		}
	})
	ns.tprint(ops);
	// ns.bladeburner.getActionSuccesses(type: string, name: string): number;
}