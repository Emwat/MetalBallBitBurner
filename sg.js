/** @param {NS} ns */
import StrLeft from './im/strLeft'
import StrRight from './im/strRight'

const fragTxt = "frag.txt"; // Contains all saved fragment batches
const lastGiftTxt = "forStanek1.txt"; // Stores the last saved fragment batch

let maxStanekSize = 5;

export async function main(ns) {

	// InitPlaces(ns);
	const arg0 = ns.args[0];

	if (!arg0) {
		ns.tprint(`You have not entered any arguments. Valid arguments are 
		frag >> print every frag name in frag.txt
		g >> get, prints all fragments
		i [X || 0] >> init, takes X and places it
		rm [X || 0] >> remove, deletes X
		b [T/max] >> batch, executes chrg.js with T threads.
				If T is not provided, default to home's free ram < 64 ? -11 : -40
		k >> kill all chrg.js
		upgrade >> imports var savedFrags inside this js file to frag.txt
		`);
	}
	else if (arg0 == "a") {
		// ns.tprint(ns.stanek.acceptGift());
	}
	else if (arg0 == "frag") {
		let fragData = ns.read(fragTxt);
		fragData = !fragData ? [] : JSON.parse(fragData);
		let output = "";
		for (let i = 0; i < fragData.length; i++) {
			const fragD = fragData[i];
			output += ("\r\n    " + StrRight(fragD.name, 20) +
				" " + StrRight((fragD.width ? fragD.width + " x " + fragD.height : ""), 7) +
				" " + (fragD.date != "" ? new Date(fragD.date).toLocaleString() : ""));
		}
		ns.tprint(output);
	}
	else if (arg0 == "g") {
		const [ignoreMe, fragName] = ns.args;
		if (!fragName) {
			ns.tprint("You forgot an argument: NAME")
			ns.tprint("sg.js end."); return;
		}
		let fragData = await SaveFragData(ns, fragName);
		ns.tprint(`FragData ${fragName} saved. ${new Date().toLocaleString()}`)
		WriteMostRecentFrag(ns, fragData);
	} else if (arg0 == "i" || arg0 == "init") {
		const [ignoreMe, fragName] = ns.args;
		if (!fragName) {
			ns.tprint("You forgot an argument: NAME")
			ns.tprint("sg.js end."); return;
		}
		let fragData = ns.read(fragTxt);
		fragData = !fragData ? [] : JSON.parse(fragData);
		fragData = fragData.filter(f => f.name == fragName)[0];
		if (!fragData) {
			ns.tprint(`${fragName} not found.`)
			ns.tprint(`sg.js end.`); return;
		}
		ns.stanek.clearGift();
		InitFrags(ns, fragData.frag);
		WriteMostRecentFrag(ns, fragData.frag);

		ns.exec("chrg.js", "home", 1, JSON.stringify(fragData.frag));
	} else if (arg0 == "b") {
		let [ignoreMe, threads] = ns.args;

		if (threads == "max" || threads == void 0) {
			let maxRam = ns.getServerMaxRam("home");
			let usedRam = ns.getServerUsedRam("home");
			maxRam -= usedRam;
			if (threads == "max")
				threads = Math.floor((maxRam) / 2);
			else if (maxRam < 64)
				threads = Math.floor((maxRam - 11) / 2);
			else
				threads = Math.floor((maxRam - 40) / 2);
		}
		if (threads < 0) {
			ns.tprint(`You don't have any threads left.`)
			return;
		}
		if (ns.exec("chrg.js", "home", threads, ns.read(lastGiftTxt)) > 0)
			ns.tprint(`Applied ${threads} threads to chrg.js.`);
		else
			ns.tprint(`Fail chrg.js -- threads: ${threads}. ${ns.read(lastGiftTxt)}`);
	} else if (arg0 == "w" || arg0 == "write") {
		let myOldFrag = GetFrags(ns);
		WriteMostRecentFrag(ns, myOldFrag);
	}
	else if (arg0 == "k") {
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
		RemoveFragData(ns, fragName);
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
	maxStanekSize = ns.stanek.giftWidth();
	let myFrags = [];
	for (let x = 0; x < maxStanekSize; x++) {
		for (let y = 0; y < maxStanekSize; y++) {
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

async function SaveFragData(ns, fragName) {
	let myNewFrag = GetFrags(ns);
	let width = ns.stanek.giftWidth();
	let height = ns.stanek.giftHeight();
	myNewFrag = { name: fragName, date: new Date(), frag: myNewFrag, width, height };
	let fragData = ns.read(fragTxt);
	fragData = !fragData ? [] : JSON.parse(fragData);
	if (fragData.filter(f => f.name == fragName).length > 0) {
		const yesOverwrite = await ns.prompt(`${fragName} already exists. Overwrite ${fragName}?`);
		if (yesOverwrite) {
			fragData = fragData.filter(f => f.name != fragName);
		} else {
			ns.tprint(`Did not overwrite ${fragName}. Ending sg.js.`);
		}
	}
	fragData.push(myNewFrag);
	fragData = fragData.sort((a, b) => a.name.localeCompare(b.name));
	ns.write(fragTxt, JSON.stringify(fragData), "w");
	return fragData;
}

function RemoveFragData(ns, fragName) {
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

function WriteMostRecentFrag(ns, myOldFrag){
	ns.write(lastGiftTxt, JSON.stringify(myOldFrag), "w");
	ns.tprint(`Current Stanek's Gift has been saved on ${lastGiftTxt}. ${new Date().toLocaleString()}`)
}