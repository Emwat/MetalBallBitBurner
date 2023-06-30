/** @param {NS} ns */
export async function main(ns) {
	const w = "\u001b[37m";
	const r = "\u001b[0m"; //reset
	const yw = "\u001b[33m";

	let output = sourceMan();
	output = output.replaceAll(")", `)${w}`);
	output = output.replace(/(?:\r\n|\r|\n)/g, `${r}\r\n`);
	
	ns.tail();
	await ns.sleep(0);
	let myWindowW = 1900;
	let myWindowH = 900;
	let widthAdjustment = 600;
	let heightAdjustment = 470; //10px per line
	let x = myWindowW - widthAdjustment;
	let y = myWindowH - heightAdjustment;
	ns.resizeTail(widthAdjustment, heightAdjustment);
	ns.moveTail(x, 0);
	ns.print(output);
}

function sourceMan(){
	return `
hack(hostname[,{threads, stock}])
	The amount of money stolen if the hack is successful, and zero otherwise.
grow(hostname[,{threads, stock}])
	returns The number by which the money on the server was multiplied for the growth
weaken(hostname[,{threads, stock}])
	returns The amount by which the target server’s security level was decreased. 
	This is equivalent to 0.05 multiplied by the number of script threads.

kill(filename, hostname, args) returns true/false
exec(script, hostname, threadOrOptions, args) returns pid/0
write(filename, data, mode) returns void`;
	}