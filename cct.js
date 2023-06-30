/** @param {NS} ns */
import GetAllServers from './im/servers'
import NumLeft from "./im/numLeft"


export async function main(ns) {
	if (ns.args[0] == "a") {
		TakeTreasures(ns);
		ns.tprint(`cct.js ${ns.args.concat()} ended; ${new Date().toLocaleString()}`)
		return;
	}
	if (ns.args[0] == "dummy") {
		ns.codingcontract.createDummyContract(ns.args[1]);
		ns.tprint(`cct.js ended; ${new Date().toLocaleString()}`)
		return;
	}
	// ns.tprint(AlgoStockTraderI(ns, algoStockArr1));
	// ns.tprint(AlgoStockTraderI(ns, [53, 47, 40, 13, 72, 104, 82, 56, 147, 85, 83, 138, 145, 114, 159, 136, 133, 151, 143, 46, 10, 104, 84, 154, 89, 104, 200, 117, 169, 120, 108, 47, 97, 30, 21, 35, 147, 106, 166, 71, 159, 87]))
	// CompressionIExamples(ns);
	// ns.tprint("lllllllllzz => " + CompressionI(ns, "lllllllllzz"));
	// ns.tprint(CompressionI(ns, "uuuuuuuu2zzclllllllllzzfddddddddcccc444444LLbbbbbbbbb33K666HHxNN6UUUUUUUibyyyyy3"));

	// ns.tprint(EncryptionICaesarCipher(ns, ["DEA", 3])); // ABX
	// ns.tprint(EncryptionICaesarCipher(ns, ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1]));
	// ns.tprint(EncryptionICaesarCipher(ns, ["MEDIA FLASH LOGIN SHELL SHIFT", 22]));
	// ns.tprint(EncryptionII(ns, ["DASHBOARD", "LINUX"]));
	// ns.tprint(EncryptionII(ns, ["PRINTEMAILMACROVIRUSMOUSE", "COMPUTING"]));

	ns.tprint(`
 25525511135 -> ["255.255.11.135", "255.255.111.35"]
 1938718066 -> ["193.87.180.66"]
`);
	ns.tprint(GenerateIPAddresses(ns, "25525511135"));
	ns.tprint(GenerateIPAddresses(ns, "1938718066"));
	ns.tprint(GenerateIPAddresses(ns, "1921680101") + " / 192.168.010.1 is not a valid IP.");
	ns.tprint(GenerateIPAddresses(ns, "3520617070"));
	// ns.tprint(HammingCodes(ns, 8));
	// ns.tprint(HammingCodes(ns, 21));
	// ns.tprint(HammingCodes(ns, 65));
	// ns.tprint(HammingCodes(ns, 256));
	// ns.tprint(HammingCodes(ns, 512));

	// ns.tprint(MergeOverlappingIntervals(ns, [[1, 3], [8, 10], [2, 6], [10, 16]]));
	// ns.tprint(MergeOverlappingIntervals(ns, [[25, 33], [17, 18], [8, 18], [9, 11], [15, 23], [4, 7], [6, 16], [2, 6], [2, 8], [12, 19]]));
	// [[2,23],[25,33]]

	// ns.tprint(SanitizeParenthesesInExpression(ns, "()())()"));
	// ns.tprint(SanitizeParenthesesInExpression(ns, "(a)())()"));

	// ns.tprint(TotalWaysToSumII(ns, 177, [1, 2, 4, 6, 7, 8, 9, 12, 13]));
	// ns.tprint(`
	//  Example:
	// 	[[1, 3], [8, 10], [2, 6], [10, 16]]
	// 	would merge into [[1, 6], [8, 16]].`);
	ns.tprint(`cct.js ended; ${new Date().toLocaleString()}`)
}

const contractDictionary = [
	["Find Largest Prime Factor", null]
	, ["Subarray with Maximum Sum", null]
	, ["Total Ways to Sum", null]
	, ["Total Ways to Sum II", null]
	, ["Spiralize Matrix", null]
	, ["Array Jumping Game", null]
	, ["Array Jumping Game II", null]
	, ["Merge Overlapping Intervals", null]
	, ["Generate IP Addresses", null]
	, ["Algorithmic Stock Trader I", AlgoStockTraderI]
	, ["Algorithmic Stock Trader II", null]
	, ["Algorithmic Stock Trader III", null]
	, ["Algorithmic Stock Trader IV", null]
	, ["Minimum Path Sum in a Triangle", null]
	, ["Unique Paths in a Grid I", null]
	, ["Unique Paths in a Grid II", null]
	, ["Shortest Path in a Grid", null]
	, ["Sanitize Parentheses in Expression", null]
	, ["Find All Valid Math Expressions", null]
	, ["HammingCodes: Integer to Encoded Binary", null]
	, ["HammingCodes: Encoded Binary to Integer", null]
	, ["Proper 2-Coloring of a Graph", null]
	, ["Compression I: RLE Compression", CompressionI]
	, ["Compression II: LZ Decompression", null]
	, ["Compression III: LZ Compression", null]
	, ["Encryption I: Caesar Cipher", null]
	, ["Encryption II: Vigenère Cipher", EncryptionII]

];

function FakeTreasure(ns) {
}

function TakeTreasures(ns) {
	const servers = GetAllServers(ns);

	for (let i = 0; i < servers.length; i++) {
		const server = servers[i];
		if (server == "home") continue;
		let files = ns.ls(server, ".cct");
		if (files.length < 1) {
			continue;
		}
		for (let j = 0; j < files.length; j++) {
			let file = files[j];
			let contractType = ns.codingcontract.getContractType(file, server);
			let data = ns.codingcontract.getData(file, server);

			// let description = ns.codingcontract.getDescription(file, server);
			ns.tprint(`${server} ${file} ${contractType} data: ${data}`);

			let program = contractDictionary.filter(f => f[0] == contractType)[0][1];
			// ns.tprint(`${server} ${file} ${contractType}`);

			if (program == null)
				continue;

			ns.tprint(`${server} ${file} ${contractType} data: ${data}`);

			let output = program(ns, data);
			const reward = ns.codingcontract.attempt(output, file, server);
			if (reward) {
				ns.tprint(`Reward: ${reward}`)
			} else {
				ns.tprint(`Failed contract: 
				Server: ${server} 
				File: ${file} 
				ContractType: ${contractType}
				
				${data}`)
			}
		}
	}
}


const algoStockArr1 = [
	98, 29, 192, 25, 64,
	130, 98, 153, 97, 147,
	53, 35, 176, 72, 166,
	73, 127, 152, 73, 108,
	121, 10, 22, 132, 24,
	121, 96, 57, 74, 198,
	41, 164];


// Algorithmic Stock Trader I
// You are attempting to solve a 
// Coding Contract. You have 5 tries
// remaining, after which the contract 
// will self-destruct.

// You are given the following array 
// of stock prices (which are numbers) 
// where the i-th element represents 
// the stock price on day i:



// Determine the maximum possible profit 
// you can earn using at most one transaction 
// (i.e. you can only buy and sell the stock once). 
// If no profit can be made then the answer should be 0. 
// Note that you have to buy the stock before you can sell it

function AlgoStockTraderI(ns, arr) {
	let maxPossibleProfit = 0;
	let bestI = 0;
	let bestJ = 0;
	for (let i = 0; i < arr.length; i++) {
		const buyPrice = arr[i];
		for (let j = i + 1; j < arr.length; j++) {
			const sellPrice = arr[j];
			const possibleProfit = sellPrice - buyPrice;
			ns.print(`(${j}, ${i}) => ` +
				`${NumLeft(sellPrice, 3)} - ${NumLeft(buyPrice, 3)} = ${possibleProfit}`);

			if (possibleProfit > maxPossibleProfit) {
				maxPossibleProfit = possibleProfit;
				bestI = i;
				bestJ = j;
			}
		}
	}
	ns.print(`Buy at ${bestI} \$${arr[bestI]}. Sell at ${bestJ} \$${arr[bestJ]}. Profit: ${maxPossibleProfit}`);
	return maxPossibleProfit;
}


// Compression I: RLE Compression

// Run-length encoding (RLE) is a data compression technique 
// which encodes data as a series of runs of a repeated single character.
// Runs are encoded as a length, followed by the character itself. 
// Lengths are encoded as a single ASCII digit; 
// runs of 10 characters or more are encoded by splitting them into multiple runs.

// You are given the following input string:
//     qqqqqqqqqqqWWWWWWuRRddiippV66SSSSSSSSSSSSll66663gCqjUGnnl33pppjjjjjjjjjjjjjj
// Encode it using run-length encoding with the minimum possible output length.

function CompressionIExamples(ns) {
	ns.tprint(`
//     aaaaabccc            ->  5a1b3c
//     aAaAaA               ->  1a1A1a1A1a1A
//     111112333            ->  511233
//     zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)
		`);
	ns.tprint(CompressionI(ns, "aaaaabccc")); // 5a1b3c
	ns.tprint(CompressionI(ns, "aAaAaA")); // 1a1A1a1A1a1A
	ns.tprint(CompressionI(ns, "111112333")); //  511233
	ns.tprint(CompressionI(ns, "zzzzzzzzzzzzzzzzzzz")); // 9z9z1z  (or 9z8z2z, etc.)
	ns.tprint(CompressionI(ns, "ppB3eeHHXX"));
}

// Examples:
//     aaaaabccc            ->  5a1b3c
//     aAaAaA               ->  1a1A1a1A1a1A
//     111112333            ->  511233
//     zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)

function CompressionI(ns, str) {
	let output = "";
	let lastChar = str[0];
	let runLength = 0;

	for (let i = 0; i <= str.length; i++) {
		const latestChar = str[i];

		if (lastChar == latestChar)
			runLength++;

		if (runLength == 9) {
			output += runLength + lastChar;
			// ns.tprint("runLength == 9 " + output);
			runLength = 0;
		}
		else if (lastChar != latestChar) {
			if (runLength > 0)
				output += runLength + lastChar;
			// ns.tprint("lastChar != latestChar " + output);
			runLength = 1;
			lastChar = latestChar;
		}

	}
	return output;
}


// Shortest Path in a Grid
// You are located in the top-left corner of the following grid:

//   [[0,0,0,0,1,0,1,1,1],
//    [1,0,0,0,0,0,1,1,1],
//    [0,0,0,0,0,0,0,1,0],
//    [0,0,0,0,0,1,1,0,1],
//    [0,0,1,0,0,1,0,1,0],
//    [0,0,1,0,0,1,0,1,0],
//    [0,0,0,1,1,0,0,1,0],
//    [0,1,1,0,0,1,0,0,0],
//    [0,0,0,0,0,0,0,0,0],
//    [0,0,0,1,0,0,1,1,0]]

// You are trying to find the shortest path
//  to the bottom-right corner of the grid, 
// but there are obstacles on the grid that 
// you cannot move onto. 
// These obstacles are denoted by '1',
// while empty spaces are denoted by 0.

// Determine the shortest path from start to finish,
//  if one exists. The answer should be given as a
//  string of UDLR characters, indicating the moves along the path

// NOTE: If there are multiple equally short paths, 
//       any of them is accepted as answer.
//       If there is no path, the answer should be an empty string.
// NOTE: The data returned for this contract is
//       an 2D array of numbers representing the grid.

// Examples:

//     [[0,1,0,0,0],
//      [0,0,0,1,0]]

// Answer: 'DRRURRD'

//     [[0,1],
//      [1,0]]

// Answer: ''

function ShortestPathInGrid() {

}

// Encryption I: Caesar Cipher
// Caesar cipher is one of the simplest encryption technique. 
// It is a type of substitution cipher in which each letter
//  in the plaintext is replaced by a letter some fixed number
//  of positions down the alphabet.
//  For example, with a left shift of 3,
//  D would be replaced by A, 
//  E would become B, and A would become X (because of rotation).

// You are given an array with two elements:
//   ["MEDIA FLASH LOGIN SHELL SHIFT", 22]
// The first element is the plaintext, the second element is the left shift value.

// Return the ciphertext as uppercase string. Spaces remains the same.

function EncryptionI(ns, arr) {

	const [plainText, leftShiftValue] = arr;
	// ns.tprint(plainText);
	// ns.tprint(leftShiftValue);
	const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let output = "";
	for (let i = 0; i < plainText.length; i++) {
		let insertChar = plainText[i];
		if (insertChar == " ") {
			output += " ";
			continue;
		}
		let shift = abc.indexOf(insertChar);
		shift = shift - leftShiftValue;
		if (shift < 0)
			shift += 26;
		output += abc[shift];
	}
	return output;
}

// Encryption II: Vigenère Cipher
// Vigenère cipher is a type of polyalphabetic substitution. 
// It uses the Vigenère square to encrypt and decrypt plaintext with a keyword.
//
//   Vigenère square:
//          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
//        +----------------------------------------------------
//      A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
//      B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A
//      C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B
//      D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
//      E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D
//                 ...
//      Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X
//      Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y
//
// For encryption each letter of the plaintext is paired with the
// corresponding letter of a repeating keyword. For example, the 
// plaintext DASHBOARD is encrypted with the keyword LINUX:
//    Plaintext: DASHBOARD
//    Keyword:   LINUXLINU
// So, the first letter D is paired with the first letter of the key L. 
// Therefore, row D and column L of the Vigenère square are used to get 
// the first cipher letter O. This must be repeated for the whole ciphertext.
//
// You are given an array with two elements:
//   ["PRINTEMAILMACROVIRUSMOUSE", "COMPUTING"]
// The first element is the plaintext, the second element is the keyword.
//
// Return the ciphertext as uppercase string.

function EncryptionII(ns, arr) {
	const [plaintext, keyword] = arr;
	const adjustedKeyword = LengthenKeyword(plaintext, keyword);
	function LengthenKeyword(plaintext, keyword) {
		let output = "";
		let i = 0;
		while (output.length < plaintext.length) {
			if (i == keyword.length)
				i = 0;
			output += keyword[i];
			i++;
		}
		return output;
	}
	function GetViSquare() {
		function shift(str) {
			return str.slice(1) + str.slice(0, 1);
		}
		let abc = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
		let output = [];
		for (let i = 0; i < abc.length; i++) {
			abc = shift(abc);
			output.push(abc);
		}
		// ftprint(ns, output);
		return output;
	}
	const ViSquare = GetViSquare();
	const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let ciphertext = "";
	// ns.tprint(`adjustedKeyword: ${adjustedKeyword}`);
	for (let i = 0; i < plaintext.length; i++) {
		const row = abc.indexOf(plaintext[i]);
		const col = abc.indexOf(adjustedKeyword[i]);
		// ns.tprint(`${i} ${plaintext[i]} ${adjustedKeyword[i]} ${row} ${col}`)
		ciphertext += ViSquare[row][col];
	}
	return ciphertext;
}

// Generate IP Addresses

// Given the following string containing only digits,
// return an array with all possible valid IP address
// combinations that can be created from the string:
// 3520617070

// Note that an octet cannot begin with a '0' unless 
// the number itself is actually 0. For example, 
// '192.168.010.1' is not a valid IP.

// Examples:

// 25525511135 -> ["255.255.11.135", "255.255.111.35"]
// 1938718066 -> ["193.87.180.66"]

function GenerateIPAddresses(ns, str) {
	let possible = [];

	function dot(j, str) {
		return str[j] != void 0 ? "." : "";
	}

	function leftToRight(str) {
		let output = "";
		for (let i = 0; i < str.length; i++) {
			let a = str[i];
			let b = str[i + 1];
			let c = str[i + 2];

			if (a == "0")
				continue;

			if (a == "0" && "b" == "0")
				continue;

			// ns.tprint(a + b + c);
			if (a && b && c && Number(a + b + c) <= 255) {
				output += a + b + c + dot(i + 3, str);
				i += 2;
			} else if (a && b) {
				output += a + b + dot(i + 2, str);
				i += 1;
			} else {
				output += a + dot(i + 1, str);
			}
		}
		if (output.split(".").length < 3)
			output += ".0";
			
		return output;
	}

	let idea1 = leftToRight(str);


	possible.push(output);
	return possible;
}

// HammingCodes: Integer to Encoded Binary
// You are given the following decimal Value:
// 6275951140522
// Convert it to a binary representation and 
// encode it as an 'extended Hamming code'. Eg:
// Value 8 is expressed in binary as '1000', 
// which will be encoded with the pattern 'pppdpddd',
// where p is a parity bit and d a data bit. 
// The encoding of 8 is 11110000. 
// As another example, '10101' (Value 21) will
// result into (pppdpdddpd) '1001101011'.
// The answer should be given as a string containing 
// only 1s and 0s.

// NOTE: the endianness of the data bits is reversed
// in relation to the endianness of the parity bits.
// NOTE: The bit at index zero is the overall parity
// bit, this should be set last.
// NOTE 2: You should watch the Hamming Code video from
// 3Blue1Brown, which explains the 'rule' of encoding,
// including the first index parity bit mentioned in the previous note.

// Extra rule for encoding:
// There should be no leading zeros in the 'data bit' section

function HammingCodes(ns, value) {
	let output = "";
	function GetBinary(value) {
		let workingValue = value;
		let binary = "";
		let p = 1;
		while (Math.pow(2, p) < value) {
			p++;
		}
		for (let i = p; i >= 0; i--) {
			// ns.tprint(`${workingValue} - ${Math.pow(2, i)}`);
			if (workingValue - Math.pow(2, i) >= 0) {
				workingValue -= Math.pow(2, i);
				binary += "1";
			} else {
				binary += "0";
			}
		}

		if (binary.slice(0, 1) == "0")
			binary = binary.slice(1);

		return binary;
	}
	let binary = GetBinary(value);

	return binary;

}

// Merge Overlapping Intervals
// Given the following array of arrays 
// of numbers representing a list of 
// intervals, merge all overlapping intervals.

// [[25,33],[17,18],[8,18],[9,11],[15,23],[4,7],[6,16],[2,6],[2,8],[12,19]]

// Example:
// [[1, 3], [8, 10], [2, 6], [10, 16]]
// would merge into [[1, 6], [8, 16]].
// The intervals must be returned in ASCENDING order.
// You can assume that in an interval, 
// the first number will always be smaller than the second.

function MergeOverlappingIntervals(ns, arr) {
	let output = MergeOverlappingIntervalsHelper(ns, arr);
	output = MergeOverlappingIntervalsHelper(ns, output);
	output = MergeOverlappingIntervalsHelper(ns, output);
	return output;
}

function MergeOverlappingIntervalsHelper(ns, arr) {
	let trial = [];
	let output = [];
	let merged = [];
	arr = arr.sort((a, b) => a[0] - b[0]);
	ftprint(ns, arr);
	for (let i = 0; i < arr.length; i++) {
		let a = arr[i][0];
		let b = arr[i][1];
		for (let j = 0 + i; j < arr.length; j++) {
			let x = arr[j][0];
			let y = arr[j][1];
			let isDefinitelyTouching = (x == a || x == b || y == a || y == b);
			let isTouchingX = x > a && x < b;
			let isTouchingY = y < b && y > a;

			// ns.tprint(`[${a}, ${b}] [${x}, ${y}] ${isDefinitelyTouching} ${isTouchingX} ${isTouchingY}`);
			if (isDefinitelyTouching || isTouchingX || isTouchingY) {
				let isAltered = false;
				if (x < a) {
					a = x;
					isAltered = true;
				}
				if (y > b) {
					b = y;
					isAltered = true;
				}
				if (isAltered) {
					merged.push(j);
					ns.tprint(`>>  ${a} ${b}`);
				}
			}

		}
		// ns.tprint(`output: [${a},${b}]`);
		trial.push([a, b]);
	}

	for (let i = 0; i < arr.length; i++) {

		if (merged.indexOf(i) != -1)
			continue;
		output.push(trial[i]);
	}
	// ns.tprint("merged:");
	// ftprint(ns, merged);
	// ns.tprint("output2:");
	// ftprint(ns, output2);
	output = output.sort((a, b) => a[0] - b[0]);

	return output;

}

function ftprint(ns, obj) {
	let output = "\r\n	"
	for (let i = 0; i < obj.length; i++) {
		const o = obj[i];
		output += o + "\r\n	";
	}
	ns.tprint(output);
}


// Proper 2-Coloring of a Graph
//
// You are given the following data, representing a graph:
// [10,[[5,6],[0,3],[7,8],[1,3],[1,4],[3,4],[5,7],[0,5],[3,6],[4,7],[1,5],[4,9],[1,8]]]
// Note that "graph", as used here, refers to the field of 
// graph theory, and has no relation to statistics or plotting.
// The first element of the data represents the number of vertices
// in the graph. Each vertex is a unique number between 0 and 9.
// The next element of the data represents the edges of the graph.
// Two vertices u,v in a graph are said to be adjacent if there
// exists an edge [u,v]. Note that an edge [u,v] is the same as
// an edge [v,u], as order does not matter. You must construct a
// 2-coloring of the graph, meaning that you have to assign each
// vertex in the graph a "color", either 0 or 1, such that no two
// adjacent vertices have the same color. Submit your answer in the
// form of an array, where element i represents the color of vertex i.
// If it is impossible to construct a 2-coloring of the given graph,
// instead submit an empty array.

// Examples:

// Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
// Output: [0, 0, 1, 1]

// Input: [3, [[0, 1], [0, 2], [1, 2]]]
// Output: []




// Sanitize Parentheses in Expression
// Given the following string:
// (()aa(()
// remove the minimum number of invalid parentheses 
// in order to validate the string. If there are
//  multiple minimal ways to validate the string, 
// provide all of the possible results. The answer 
// should be provided as an array of strings. 
// If it is impossible to validate the string the 
// result should be an array with only an empty string.

// IMPORTANT: The string may contain letters, not just parentheses. Examples:
// "()())()" -> ["()()()", "(())()"]
// "(a)())()" -> ["(a)()()", "(a())()"]
// ")(" -> [""]
function SanitizeParenthesesInExpression(ns, str) {
	let output = [];
	let marks = [];
	let hasOpened = false;
	let hasNeverOpened = true;
	let validStr = "";

	// Declare marks
	for (let i = 0; i < str.length; i++) {
		const isLeft = str[i] == "(";
		const isRight = str[i] == ")";
		if (!hasOpened && isLeft) {
			hasOpened = true;
			hasNeverOpened = false;
		}
		else if (!hasOpened && isRight) {
			// ns.tprint(`ded ${i}`);
			if (hasNeverOpened)
				return [""];
			marks.push(i);
		} else if (hasOpened && isRight) {
			hasOpened = false;
		}
	}



	// Declare Valid String
	for (let i = 0; i < str.length; i++) {
		validStr += (marks.indexOf(i) == -1 ? str[i] : "");
	}

	if (hasOpened) {
		function RemoveChar(str, index) {
			return str.slice(0, index - 1) + str.slice(index);
		}
		validStr = RemoveChar(validStr, validStr.lastIndexOf("("));
	}

	output.push(validStr);

	function InsertParen(str, index) {
		return str.slice(0, index - 1) + "(" + str.slice(index - 1);
	}

	// Develop all possible results
	for (let i = 0; i < marks.length; i++) {
		let mark = marks[i];
		for (let j = 0; j < mark; j++) {
			if (validStr[j] == "(")
				output.push(InsertParen(validStr, j));
		}
	}

	return output;
}


// Total Ways to Sum II
// How many different distinct ways 
// can the number 48 be written as a
// sum of integers contained in the set:
// [1,2,7,8,10,13,14,15,16,17,19]?
// You may use each integer in the set zero or more times.
function TotalWaysToSumII(ns, goal, arr) {
	function sum(arr) {
		return arr.reduce((a, b) => a + b, 0);
	}

	function resum(arr) {

	}

	let distinctWays = [];

	for (let i = 0; i < arr.length; i++) {
		let way = [];
		const adjustedArr = i == 0 ? arr : arr.slice(0, i * -1);
		for (let j = adjustedArr.length - 1; j > 0; j--) {
			const jar = adjustedArr[j];
			// ns.tprint(`${sum(way)} + ${jar} < ${goal}`)
			while (sum(way) + jar < goal) {
				ns.tprint(`${sum(way)} + ${jar} < ${goal}`)
				if (jar < 1)
					break;
				way.push(jar);
			}
			if (sum(way) + jar == goal) {
				way.push(jar);
				distinctWays.push(way);
			}
		}

	}

	for (let i = 0; i < distinctWays.length; i++) {
		ns.print(distinctWays[i] + " " + sum(distinctWays[i]));
	}
	return distinctWays.length;
}

// Unique Paths in a Grid I

// You are in a grid with 5 rows and 14 columns, 
// and you are positioned in the top-left corner 
// of that grid. You are trying to reach the
//  bottom-right corner of the grid, but you
//  can only move down or right on each step. 
// Determine how many unique paths there are 
// from start to finish.

// NOTE: The data returned for this contract is an array with the number of rows and columns:

// [5, 14]

function UniquePathsInGrid() {

}
