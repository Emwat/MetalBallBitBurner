/** @param {NS} ns */
export async function main(ns) {
	const myArgs = ns.args;

	if (myArgs[0] == "a")
	{
		ns.tprint(`a`);
	}
	if (myArgs[0] == "-a")
	{
		ns.tprint(`-a`);
	} 
	if (myArgs[0] == "b")
	{
		ns.tprint(`b`);
	} 
	if (myArgs[0] == "-b")
	{
		ns.tprint(`-b`);
	} 
}