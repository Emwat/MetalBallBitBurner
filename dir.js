import ZeroLeft from './im/zeroLeft'
import StrLeft from './im/strLeft'

// never finished 08/20/2023 01:48 AM

/** @param {NS} ns */
export async function main(ns) {
	return;
	let output = "\r\n";
	let files = ns.ls("home");
	files = files.map(m => {
		// let inFolder = m.includes("/");
		// let slashIndex = m.indexOf("/");
		return {
			filename: m.includes("/") ? m.substring(m.indexOf("/") + 1) : m
			, ext: m.substring(m.indexOf(".") + 1)
			, folder: m.includes("/") ? m.substring(0, m.indexOf("/")) : "home"
		}
	});
	let order = [
		{ color: "", ext: "folder", }
		, { color: "", ext: "msg" }
		, { color: "", ext: "txt" }
		, { color: "", ext: "exe" }
		, { color: "", ext: "js" }
	];

	files.sort((a, b) =>
		order.indexOf(a.ext) > order.indexOf(b.ext) ? 1 :
			order.indexOf(a.ext) < order.indexOf(b.ext) ? -1 :
				0);

	for (let i = 0; i < files.length; i++) {
		files[i].sortValue = ZeroLeft(i, 3);
	}
	files.sort((a, b) =>
		a.filename > b.filename ? 1 :
			a.filename < b.filename ? -1 :
				0);
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		file.sortValue = ZeroLeft(i, 3) + file.sortValue;
	}
	files.sort((a, b) =>
		a.sortValue > b.sortValue ? 1 :
			a.sortValue < b.sortValue ? -1 :
				0);




	function FindMaxFilenameLength(files){
		return files.reduce((a, b) => {
			return (a.filename.length > b.filename.length) ? a : b
		});
	}
	
	files = files.filter(f => f.folder == "home");
	let columnHeight = 40;
	let columnWidth = 0;
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		if (file.folder != "home")
			continue;

		function Helper(i, file, columnWidth) {
			if (i > files.length)
				return "";

			if (i == 0) {
				let x = (i + 1) * columnHeight;
				columnWidth = files.slice(0, x);
				columnWidth = FindMaxFilenameLength(columnWidth);
				columnWidth = columnWidth.filename.length;
			} else if (i % columnHeight == 0) {
				let x = Math.floor(i / columnHeight);
				let y = (i + 1) * columnHeight;
				columnWidth = files.slice(x, y);
				columnWidth = FindMaxFilenameLength(columnWidth);
				columnWidth = columnWidth.filename.length;
			}

			//  0 -  9
			// 10 - 19
			// 20 - 29
			return [columnWidth, StrLeft(file.filename, columnWidth)];
		}

		//ns.tprint(`${i} ${file.filename} ${columnWidth}`)
		let [newColumnWidth, newText] = Helper(i, files[i], columnWidth);
		//ns.tprint(`${i} ${newColumnWidth} ${newText}`)
		columnWidth = newColumnWidth;
		output += newText;
		if (i % columnHeight == 0)
			output += "\r\n";
	}
	ns.tprint(output);

}

// 16
function debugTerminalWidth() {
	let output = "";
	for (let i = 0; i < 400; i++) {
		let str = i.toString();
		str = str[str.length - 1];
		if (i % 10 == 0)
			output += "X"
		else
			output += " ";
	}
	ns.tprint(output);
}