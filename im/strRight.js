/** @param {NS} ns */

export default function strRight(str, length) {
	let output = str.toString();
	for (var i = 0; i < length - str.length; i++) {
		output += " ";
	}
	return output;
}