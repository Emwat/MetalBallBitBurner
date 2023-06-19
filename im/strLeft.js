/** @param {NS} ns */
export default function main(str, length) {
	return sadLeft(str, length);
}

function sadLeft(str, length) {
	let output = str.toString();
	for (var i = 0; i < length - str.length; i++) {
		output = " " + output;
	}
	return output;
}