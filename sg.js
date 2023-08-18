// Remember to press Ctrl + K, Ctrl + 0

import StrLeft from './im/strLeft'
import StrRight from './im/strRight'

const fragTxt = "frag.txt"; // Contains all saved fragment batches
const lastGiftTxt = "forStanek1.txt"; // Stores the last saved fragment batch

let maxStanekSize = 5;

function MainHelp(ns, index) {
	ns.tprint(`You have not entered any arguments. Valid arguments are 
		l >> list, print every frag name in frag.txt
		s [name] >> save, gets all fragments as NAME and appends to ${fragTxt}
		o [name] >> open, loads NAME from ${fragTxt} and places it
		rm [name] >> delete, deletes NAME
		b [T/max] >> batch, executes chrg.js with T threads.
				If T is not provided, default to home's free ram < 64 ? -11 : -40
		k >> kill all chrg.js
		upgrade >> imports var savedFrags inside this js file to frag.txt
		`);
}

/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length == 0) {
		MainHelp(ns);
		return;
	}

	for (let i = 0; i < ns.args.length; i++) {
		await MainHelper(ns, ns.args[i], i);
	}

	ns.tprint(`sg.js ${ns.args.concat()} ended. ${new Date().toLocaleString()}`);
}



async function MainHelper(ns, arg, index) {
	ns.print({ arg, index });
	if (false) { }
	else if (["help"].includes(arg)) { MainHelp(ns, index); }
	else if (["l", "list"].includes(arg)) { MainListFrags(ns, index); }
	else if (["s", "save"].includes(arg)) { await MainSaveFrags(ns, index); }
	else if (["o", "open"].includes(arg)) { MainPlacesFrags(ns, index); }
	else if (["rm"].includes(arg)) { MainDeleteFrags(ns, index); }
	else if (["b"].includes(arg)) { MainBatch(ns, index); }
	else if (["w", "write"].includes(arg)) {
		let myOldFrag = GetFrags(ns);
		WriteMostRecentFrag(ns, myOldFrag);
	}
	else if (["k"].includes(arg)) {
		if (ns.scriptKill("chrg.js", "home"))
			ns.tprint("killed chrg.js");
		else
			ns.tprint("couldn't find chrg.js to kill.");
	}
	// else {
	// 	ns.tprint(`${arg} is an invalid argument`)
	// }
}

function PlacesFrags(ns, frags) {
	for (let i = 0; i < frags.length; i++) {
		let f = frags[i];
		ns.stanek.placeFragment(f.x, f.y, f.rotation, f.id);
	}
}

function GetFrags(ns) {
	maxStanekSize = ns.stanek.giftWidth();
	let myFrags = [];
	for (let x = 0; x < maxStanekSize; x++) {
		for (let y = 0; y < ns.stanek.giftHeight(); y++) {
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

async function PromptAndSaveFragData(ns, fragName) {
	let myNewFrag = GetFrags(ns);
	const width = ns.stanek.giftWidth();
	const height = ns.stanek.giftHeight();
	const bn = ns.getResetInfo().currentNode;
	//const holes = CountEmptySpace(ns, width, height);
	myNewFrag = { name: fragName, date: new Date(), frag: myNewFrag, width, height, bn };
	let fragData = ns.read(fragTxt);
	fragData = !fragData ? [] : JSON.parse(fragData);
	if (fragData.filter(f => f.name == fragName).length > 0) {
		const yesOverwrite = await ns.prompt(`${fragName} already exists. Overwrite ${fragName}?`);
		if (yesOverwrite) {
			fragData = fragData.filter(f => f.name != fragName);
		} else {
			ns.tprint(`Did not overwrite ${fragName}. Ending sg.js.`);
			return false;
		}
	}
	fragData.push(myNewFrag);
	fragData = fragData.sort((a, b) => a.name.localeCompare(b.name));
	ns.write(fragTxt, JSON.stringify(fragData), "w");
	return myNewFrag;
}

function DeleteFragData(ns, fragName) {
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

function WriteMostRecentFrag(ns, myOldFrag) {
	if (myOldFrag && myOldFrag[0].x == void 0) {
		throw "WriteMostRecentFrag(ns, myOldFrag) has invalid parameter.";
	}

	ns.write(lastGiftTxt, JSON.stringify(myOldFrag), "w");
	ns.tprint(`Current Stanek's Gift has been saved on ${lastGiftTxt}. ${new Date().toLocaleString()}`)
}

function HasArg(ns, argOption) {
	if (typeof argOption == "string") {
		return ns.args.includes(argOption);
	} else if (typeof argOption == "object") {
		for (const arg in argOption) {
			if (ns.args.includes(arg) || ns.args.includes("-" + arg))
				return arg;
		}
		return false;
	}
	throw "went through all arg options";
}

function MainListFrags(ns, index) {
	let fragData = ns.read(fragTxt);
	let width = ns.stanek.giftWidth();
	let height = ns.stanek.giftHeight();
	fragData = !fragData ? [] : JSON.parse(fragData);
	ns.tprint(`Stanek's Gift is ${width} x ${height} right now.`);
	let output = "";
	for (let i = 0; i < fragData.length; i++) {
		const fragFile = fragData[i];
		output += ("\r\n    " + StrRight(fragFile.name, 20) +
			" " + StrRight((fragFile.width ? fragFile.width + " x " + fragFile.height : ""), 7) +
			" " + StrLeft(String((fragFile?.bn || "")), 5) +
			// " " + StrLeft(String((fragFile?.holes || "")), 3) +
			" " + (fragFile.date == void 0 ? "" : new Date(fragFile.date).toLocaleString()) +
			" "
		);
	}
	ns.tprint(output);
}

async function MainSaveFrags(ns, index) {
	const fragName = ns.args[index + 1];

	if (!fragName) {
		ns.tprint("You forgot an argument: NAME")
		ns.tprint("sg.js end."); return;
	}

	let fragData = await PromptAndSaveFragData(ns, fragName);
	if (fragData == false)
		return;
	ns.tprint(`FragData ${fragName} saved. ${new Date().toLocaleString()}`)
	WriteMostRecentFrag(ns, fragData.frag);
}

function MainPlacesFrags(ns, index) {
	const fragName = ns.args[index + 1];

	if (!fragName) {
		ns.tprint("You forgot an argument: NAME")
		ns.tprint("sg.js end."); return;
	}
	let fragData = ns.read(fragTxt);
	fragData = !fragData ? [] : JSON.parse(fragData);
	fragData = fragData.find(f => f.name == fragName);
	if (!fragData) {
		ns.tprint(`${fragName} not found.`)
		ns.tprint(`sg.js end.`); return;
	}
	ns.stanek.clearGift();
	PlacesFrags(ns, fragData.frag);
	WriteMostRecentFrag(ns, fragData.frag);

	ns.exec("chrg.js", "home", 1, JSON.stringify(fragData.frag));
}

function MainBatch(ns, index) {
	let threads = ns.args[index + 1];

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
}

function MainDeleteFrags(ns, index) {
	const fragName = ns.args[index + 1];
	if (!fragName) {
		ns.tprint("You forgot an argument: NAME")
		ns.tprint("sg.js end.")
		return;
	}
	DeleteFragData(ns, fragName);
}

// Fail. 08/07/2023 10:01 AM
// You have to individually count the empty spaces after a rotation to determine if spaces are empty.
/** @param {NS} ns */
function CountEmptySpace(ns, width, height) {
	// const width = ns.stanek.giftWidth();
	// const height = ns.stanek.giftHeight();
	let output = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let frag = ns.stanek.getFragment(x, y);
			if (!frag) {
				output++;
			}
		}
	}
	return output;
}
