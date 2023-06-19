/** @param {NS} ns */
export default function main(str, length) {
	return madLeft(str, length);
}

function madLeft(str, length) {
	let output = Math.trunc(str).toString();
	let zeroes = "";
	for (var i = 0; i < length - Math.trunc(str).toString().length; i++) {
		zeroes += "0";
	}
	return zeroes + output;
}
