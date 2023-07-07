/** @param {NS} ns */

const fragTxt = "frag.txt";

export async function main(ns) {

	// InitPlaces(ns);
	const arg0 = ns.args[0];

	if (!arg0) {
		ns.tprint(`You have not entered any arguments. Valid arguments are 
		frag >> print every frag name in frag.txt
		g >> get, prints all fragments
		i [X || 0] >> init, takes X and places it
		rm [X || 0] >> remove, deletes X
		b [T || 1] [X] >> batch, executes chrg.js with T threads
		k >> kill all chrg.js
		upgrade >> imports var savedFrags inside this js file to frag.txt
		`);
	}
	else if (arg0 == "a") {
		// ns.tprint(ns.stanek.acceptGift());
	}
	else if (arg0 == "update") {
		let fragData = ns.read(fragTxt);
		fragData = !fragData ? [] : JSON.parse(fragData);
		let s = 0;
		for (let i = 0; i < savedFrags.length; i++) {
			const savedFrag = savedFrags[i];
			const existing = fragData.filter(f => f.name == savedFrag.name);
			if (existing.length > 0) {
				ns.tprint(`${savedFrag.name} already exists. Nothing has been done there.`)
				continue;
			}
			fragData.push(savedFrag);
			s++;
		}
		ns.tprint(`Saved ${s} fragData.`);
		ns.write(fragTxt, JSON.stringify(fragData), "w");
	}
	else if (arg0 == "frag") {
		let fragData = ns.read(fragTxt);
		fragData = !fragData ? [] : JSON.parse(fragData);
		for (let i = 0; i < fragData.length; i++) {
			const fragD = fragData[i];
			ns.tprint(fragD.name);
		}
	}
	else if (arg0 == "g") {
		const [ignoreMe, fragName] = ns.args;
		if (!fragName) {
			ns.tprint("You forgot an argument: NAME")
			ns.tprint("sg.js end.")
			return;
		}
		let myNewFrag = GetFrags(ns);
		myNewFrag = { name: fragName, date: new Date(), frag: myNewFrag };
		let fragData = ns.read(fragTxt);
		fragData = !fragData ? [] : JSON.parse(fragData);
		if (fragData.filter(f => f.name == fragName).length > 0) {
			const yesOverwrite = await ns.prompt(`${fragName} already exists. Overwrite ${fragName}?`);
			if (yesOverwrite) {
				fragData = fragData.filter(f => f.name != fragName);
			} else {
				ns.tprint(`Did not overwrite ${fragName}. Ending sg.js.`);
				return;
			}
		}
		fragData.push(myNewFrag);
		fragData = fragData.sort((a, b) => a.name.localeCompare(b.name));
		ns.write(fragTxt, JSON.stringify(fragData), "w");
		ns.tprint(`FragData ${fragName} saved. ${new Date().toLocaleString()}`)
	} else if (arg0 == "i" || arg0 == "init") {
		const [ignoreMe, fragName] = ns.args;
		if (!fragName) {
			ns.tprint("You forgot an argument: NAME")
			ns.tprint("sg.js end.")
			return;
		}
		let fragData = ns.read(fragTxt);
		fragData = !fragData ? [] : JSON.parse(fragData);
		fragData = fragData.filter(f => f.name == fragName)[0];
		ns.stanek.clearGift();
		InitFrags(ns, fragData.frag);
		ns.exec("chrg.js", "home", 1, JSON.stringify(fragData.frag));
	}
	else if (arg0 == "b") {
		let [ignoreMe, threads, fragName] = ns.args;
		if (!fragName) {
			ns.tprint("You forgot an argument: NAME")
			ns.tprint("sg.js end.")
			return;
		}
		const loadedFrag = JSON.parse(ns.read(fragTxt)).filter(f => f.name == fragName)[0]?.frag;
		if (!loadedFrag) {
			ns.tprint(`Frag ${fragName} not found.`)
			ns.tprint("sg.js end.")
			return;
		}
		if (threads == "max")
		{
			let maxRam = ns.getServerMaxRam("home");
			//let usedRam = ns.getServerUsedRam("home");
			threads = Math.floor((maxRam - 64)/2);
		}
		ns.exec("chrg.js", "home", threads, JSON.stringify(loadedFrag));
		ns.tprint(`Applied ${threads} threads to chrg.js for ${fragName}`);
	} else if (arg0 == "k") {
		if (ns.scriptKill("chrg.js", "home"))
			ns.tprint("killed chrg.js");
		else
			ns.tprint("couldn't find chrg.js to kill.");

	} else if (arg0 == "rm") {
		const [ignoreMe, fragName] = ns.args;
		if (!fragName) {
			ns.tprint("You forgot an argument: NAME")
			ns.tprint("sg.js end.")
			return;
		}
		let fragData = ns.read(fragTxt);
		fragData = !fragData ? [] : JSON.parse(fragData);
		if (fragData.length == 0) {
			ns.tprint(`Error: There is no fragData in ${fragTxt}.`)
			ns.tprint(`sg.js ${ns.args.concat()} end. ${new Date().toLocaleString()}`)
			return;
		}
		fragData = fragData.filter(f => f.name != fragName);
		ns.write(fragTxt, JSON.stringify(fragData), "w");
		ns.tprint(`FragData ${fragName} deleted. ${new Date().toLocaleString()}`)
	}
	else {
		ns.tprint("no valid arguments.")
	}
	ns.tprint(`sg.js ${ns.args.concat()} ended. ${new Date().toLocaleString()}`);
}


function InitFrags(ns, frags) {
	for (let i = 0; i < frags.length; i++) {
		let f = frags[i];
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

	let output = [];
	for (let i = 0; i < myFrags.length; i++) {
		let f = myFrags[i];
		if (f == void 0)
			break;
		//output += jtprints(f) + "\r\n";
		output.push(f);
		//output += (`, { x: ${f.x}, y: ${f.y}, rotation: ${f.rotation}, id: ${f.id}} \r\n`)
	}
	//ns.tprint(output);
	return output;
}

function jtprint(ns, obj) {
	Object.entries(obj).forEach(entry => {
		const [key, value] = entry;
		ns.tprint("   " + key + ": " + value + ", ");
	});
}


const savedFrags = [
	{
		name: "hacknet0", frag: [
			{ x: 0, y: 0, rotation: 0, id: 101 }
			, { x: 0, y: 2, rotation: 0, id: 105 }
			, { x: 1, y: 1, rotation: 0, id: 6 } // hack
			, { x: 2, y: 4, rotation: 0, id: 20 } // hacknet production
			, { x: 3, y: 2, rotation: 0, id: 21 } // hacknet cost
			, { x: 4, y: 0, rotation: 1, id: 101 }
		]
	},
	{
		name: "hacknet1", frag: [
			{ x: 0, y: 0, rotation: 0, id: 101 }
			, { x: 0, y: 1, rotation: 2, id: 105 }
			, { x: 1, y: 3, rotation: 0, id: 101 }
			, { x: 2, y: 4, rotation: 0, id: 20 } // hacknet production
			, { x: 3, y: 1, rotation: 0, id: 21 } // hacknet cost
			, { x: 4, y: 0, rotation: 1, id: 101 }
		]
	},
	{
		name: "lots0", frag: [
			{ x: 0, y: 0, rotation: 3, id: 5 } // faster hgw
			, { x: 0, y: 3, rotation: 0, id: 25 } // work and faction rep
			, { x: 1, y: 0, rotation: 2, id: 1 } // hack skill
			, { x: 1, y: 2, rotation: 1, id: 104 }
			, { x: 2, y: 1, rotation: 2, id: 106 }
			, { x: 3, y: 0, rotation: 2, id: 7 } // grow skill
			, { x: 4, y: 2, rotation: 3, id: 27 } // work money
		]
	},
	{
		name: "hacky0", frag: [
			{ x: 0, y: 1, rotation: 1, id: 1 } // hack skill
			, { x: 0, y: 3, rotation: 0, id: 0 } // hack skill
			, { x: 2, y: 0, rotation: 3, id: 102 }
			, { x: 2, y: 3, rotation: 2, id: 101 }
			, { x: 3, y: 0, rotation: 2, id: 7 } // grow skill
			, { x: 4, y: 1, rotation: 3, id: 5 } // faster hgw
		]
	}
];