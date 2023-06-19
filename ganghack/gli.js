/** @param {NS} ns */
export async function main(ns) {
	const arg = ns.args[0];
	let members = ns.gang.getMemberNames();
	let total = 0;
	for (let i = 0; i < members.length; i++) {
		const member = members[i];
		total += gliHelper(ns, arg, member);
	}
	ns.tprint(`${total} members are working on ${gliKey(arg)}`);
}

function gliKey(arg) {
	if (false) {

	}
	else if (arg == "e") {
		return "Ethical Hacking";
	}
	else if (arg == "l") {
		return "Money Laundering";
	}
	else if (arg == "c") {
		return "Cyberterrorism";
	}
	else if (arg == "t") {
		return "Train Hacking";
	}
	return "";
}

function gliHelper(ns, arg, member) {
	return ns.gang.setMemberTask(member, gliKey(arg)) ? 1 : 0;
}
