/** @param {NS} ns */
export async function main(ns) {
	const w = "\u001b[37m";
	const r = "\u001b[0m"; //reset
	const y = "\u001b[33m";
	
	let output = `
20 Augmentations
\$75b
Hacking Level of 850 ${850 - ns.getHackingLevel()}
All Combat Stats of 850
`;
	output = output.replaceAll("	", `	${w}`);
	output = output.replace(/(?:\r\n|\r|\n)/g, `${r}\r\n`);
	
	ns.tprint(output);
}
