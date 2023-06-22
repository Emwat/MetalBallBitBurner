/** @param {NS} ns */
export default function main(n, excludeDecimal) {
	return numberA(n, excludeDecimal);
}


function numberB(n, excludeDecimal) {
	function ten(p) {
		return Math.pow(10, p);
	}
	function splice(s) {
		let str = s.toString();
		let dot = str.indexOf(".");

		if (dot == -1) {
			if (excludeDecimal)
				return s;
			return s + ".000";
		}

		if (excludeDecimal)
			return (str + "000").substring(0, dot + 3);

		return (str + "000").substring(0,	dot + 3);
	}

	if (false) { }
	else if (n / ten(12) > 1) return splice(n / ten(12)) + "t";
	else if (n / ten(9) > 1) return splice(n / ten(9)) + "b";
	else if (n / ten(6) > 1) return splice(n / ten(6)) + "m";
	else if (n / ten(3) > 1) return splice(n / ten(3)) + "k";
	else return n;
}

function numberA(srcNumber, excludeDecimal) {
	function ten(p) {
		return Math.pow(10, p);
	}
	function splice(s) {
		let str = s.toString();
		let dot = str.indexOf(".");

		if (dot == -1) {
			return s;
		}

		if (excludeDecimal)
			return str.substring(0, dot);

		if (dot + 3 > str.length)
			return s;

		return str.substring(0, dot + 3);
	}
	let n = Math.abs(srcNumber);
	let a = srcNumber < 0 ? "-" : "";

	if (false) { }
	else if (n / ten(12) > 1) return a + splice(n / ten(12)) + "t";
	else if (n / ten(9) > 1) return a + splice(n / ten(9)) + "b";
	else if (n / ten(6) > 1) return a + splice(n / ten(6)) + "m";
	else if (n / ten(3) > 1) return a + splice(n / ten(3)) + "k";
	else return n;
}