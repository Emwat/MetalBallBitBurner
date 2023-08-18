export default InterpretString;

/** @param {NS} ns */
function InterpretString(ns, theArgString) {
	let x = ReadNumber(theArgString);
	let connector = theArgString[x.length];
	let output = [];

	ns.tprint({ x, connector })
	if (!connector) {
		output.push(parseInt(x));
	}
	else if (connector == "-" || connector == ":") {
		let y = ReadNumber(theArgString.slice(x.toString().length + 1));
		ns.tprint({ x, connector, y })
		for (let i = parseInt(x); i <= parseInt(y); i++) {
			output.push(i);
		}
	}
	return output;
}

function ReadNumber(theArgString) {
	let parsedString = "";
	for (let i = 0; i < theArgString.length; i++) {
		let s = theArgString[i];
		// ns.tprint(s)
		if (s !== "0" && !parseInt(s)) {
			break;
		}
		parsedString += String(s);
	}
	return parsedString;
}