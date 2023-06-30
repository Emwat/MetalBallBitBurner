/** @param {NS} ns */

const savedFrags = [
	[
		{ x: 0, y: 0, rotation: 0, id: 101 }
		, { x: 0, y: 2, rotation: 0, id: 105 }
		, { x: 1, y: 1, rotation: 0, id: 6 } // hack
		, { x: 2, y: 4, rotation: 0, id: 20 } // hacknet production
		, { x: 3, y: 2, rotation: 0, id: 21 } // hacknet cost
		, { x: 4, y: 0, rotation: 1, id: 101 }
	]
];

export async function main(ns) {


	// InitPlaces(ns);
	const arg0 = ns.args[0];
	if (!arg0){
		ns.tprint(`You have not entered any arguments. Valid arguments are 
		g >> get, prints all fragments
		i >> init, places all fragments
		b [x || 1]>> batch, executes chrg.js x number of times
		`);
	}
	else if (arg0 == "a") {
		// ns.tprint(ns.stanek.acceptGift());
	}
	else if (arg0 == "g") {
		GetFrags(ns);
	} else if (arg0 == "i") {
		InitFrags(ns);
	}
	else if (arg0 == "b") {
		const numberOfExecutions = ns.args[1] || 1;
		ns.tprint("numberOfExecutions: " + numberOfExecutions);

		for (let i = 0; i < numberOfExecutions; i++) {
			ns.exec("chrg.js", "home", 1);
		}
	} else {
		ns.tprint("no valid arguments.")
	}
	ns.tprint(`sg.js ${ns.args.concat()} ended. ${new Date().toLocaleString()}`);
}


function InitFrags(ns) {
	for (let i = 0; i < savedFrags.length; i++) {
		let f = savedFrags[i];
		ns.stanek.placeFragment(f.x, f.y, f.rotation, f.id);
	}

}
function GetFrags(ns) {
	let myFrags = [];
	const maxX = 5;
	for (let x = 0; x < maxX; x++) {
		for (let y = 0; y < maxX; y++) {
			let frag = ns.stanek.getFragment(x, y);
			// if(frag)
			// 	jtprint(ns, frag);
			if (frag && !myFrags.includes(frag)) {
				myFrags.push(frag);

			}
		}
	}

	ns.tprint("Length: " + myFrags.length);

	let output = "\r\n";
	for (let i = 0; i < myFrags.length; i++) {
		let f = myFrags[i];
		if (f == void 0)
			break;
		//output += jtprints(f) + "\r\n";
		output += (`, { x: ${f.x}, y: ${f.y}, rotation: ${f.rotation}, id: ${f.id}} \r\n`)
	}
	ns.tprint(output);

}

function jtprint(ns, obj) {
	Object.entries(obj).forEach(entry => {
		const [key, value] = entry;
		ns.tprint("   " + key + ": " + value + ", ");
	});
}

