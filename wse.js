/** @param {NS} ns */
import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"
import ToDollars from "./im/carat"


// stock.getOrders: You must either be in BitNode-8 or have Source-File 8 Level 3.
// const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(sym);

// Forecast
// --- <=29
// --  <=32
// -   <=45
// +   >=51, <=59
// ++  >=60
// +++ >=65

const portfolioTxt = "portfolio.txt";
const profitsTxt = "profits.txt";
const reqAbvForecast = 59;
const reqBelForecast = reqAbvForecast - 3;

export async function main(ns) {
	// ns.tprint(ns.stock.getPosition("FNS")[0] > 0);
	// ns.tprint(ns.stock.getPosition("CTYS")[0] > 0);
	// ns.tprint(ns.stock.getPosition("CTYS"));
	if (ns.args.length == 0) {
		ns.tprint(`You have not entered any arguments. Acceptable arguments are 
			b >> WHILE LOOP, BatchBuyAndSell
			info [abc] >> alphabetically
			info [a] >> ask price
			info [f] >> forecast
			info [p] >> price
			info [me] >> me
			s >> SellsEverything
			k >> Kills wse.js
			l >> SeeLogs
			x >> Reset files. Does not sell anything.
		`);
		return;
	}
	ns.disableLog("getServerMoneyAvailable");
	const iHasAccess = ns.stock.hasTIXAPIAccess();
	const iHasData = ns.stock.has4SDataTIXAPI();

	if (!iHasAccess) {
		ns.tprint("I don't have access to the stock market api yet.");
		return;
	}
	if (!iHasData) {
		ns.tprint("I don't have access to the data yet.");
		return;
	}

	let symbols = ns.stock.getSymbols();

	ns.tprint(`You have \$${ToDollars(getMoney(ns))} on ${new Date().toLocaleString()}`);
	if (false) { }
	else if (ns.args[0] == "b") {
		ns.tprint(`WHILE LOOP STARTED. You must kill this program to end it.`)
		let waitTime = 1000 * 7;
		await BatchBuyAndSell(ns, waitTime);
	}
	else if (ns.args[0] == "i") {
		if (false) { }
		else if (ns.args[1] == "abc") symbols = symbols.sort();
		else if (ns.args[1] == "a") symbols = symbols.sort((a, b) => ns.stock.getAskPrice(a) - ns.stock.getAskPrice(b));
		else if (ns.args[1] == "f") symbols = symbols.sort((a, b) => ns.stock.getForecast(a) - ns.stock.getForecast(b));
		else if (ns.args[1] == "p") symbols = symbols.sort((a, b) => ns.stock.getPrice(a) - ns.stock.getPrice(b));
		else if (ns.args[1] == "v") symbols = symbols.sort((a, b) => ns.stock.getVolatility(a) - ns.stock.getVolatility(b));
		else if (ns.args[1] == "pcl") symbols = symbols.sort((a, b) => ns.stock.getPurchaseCost(a, 1, "Long") - ns.stock.getPurchaseCost(b, 1, "Long"));
		else if (ns.args[1] == "pcs") symbols = symbols.sort((a, b) => ns.stock.getPurchaseCost(a, 1, "Short") - ns.stock.getPurchaseCost(b, 1, "Short"));
		else if (ns.args[1] == "me") symbols = symbols.filter(f => ns.stock.getPosition(f)[0] > 0);

		PrintInfo(ns, symbols);
	}
	else if (ns.args[0] == "k") {
		ns.kill("wse.js", "home", "b");
	}
	else if (ns.args[0] == "l") {
		SeeLogs(ns);
	}
	else if (ns.args[0] == "s") {
		SellEverything(ns);
	}
	else if (ns.args[0] == "xp") {
		ns.write(portfolioTxt, "[]", "w");
	}
	else if (ns.args[0] == "xl") {
		ns.write(profitsTxt, "[]", "w");
	}

	ns.tprint(`wse.js ${ns.args.concat()} has ended. ${new Date().toLocaleString()}`);
	// jtprint(ns, ns.stock.getOrders()); 
	//ftprint(ns, symbols);
	//jtprint(ns, ns);

}

function getMoney(ns) {
	return ns.getServerMoneyAvailable("home");
}


function PrintInfo(ns, symbols) {

	ns.tprint("" +
		" " + LeftStr(5, "sym") +
		" " + LeftStr(25, "Organication") +
		" " + LeftStr(6, "Ask") +
		" " + LeftStr(6, "Bid") +
		" " + LeftStr(6, "Price") +
		//" " + LeftStr(10, "Pos") +
		" " + LeftStr(6, "4cast") +
		" " + LeftStr(6, "vola") +
		" " + LeftStr(7, "Short") +
		" " + LeftStr(7, "Long") +
		" " + LeftStr(8, "Short") +
		" " + LeftStr(8, "Long") +
		""
	);

	for (let i = 0; i < symbols.length; i++) {
		let sym = symbols[i];
		// const [sharesLong, avgLongPrice, sharesShort, avgShortPrice] = ns.stock.getPosition(sym);

		ns.tprint("" +
			" " + LeftStr(5, sym) +
			" " + LeftStr(25, ns.stock.getOrganization(sym)) +
			" " + LeftNum(6, ns.stock.getAskPrice(sym)) +
			" " + LeftNum(6, ns.stock.getBidPrice(sym)) +
			" " + LeftNum(6, ns.stock.getPrice(sym)) +
			//" " + LeftStr(10, ns.stock.getPosition(sym)) +
			" " + LeftNum(6, ns.stock.getForecast(sym) * 100) +
			" " + LeftNum(6, ns.stock.getVolatility(sym) * 10000) +
			" " + LeftNum(7, ns.stock.getPurchaseCost(sym, 1, "Short")) +
			" " + LeftNum(7, ns.stock.getPurchaseCost(sym, 1, "Long")) +
			" " + LeftNum(8, ns.stock.getSaleGain(sym, 1, "Short")) +
			" " + LeftNum(8, ns.stock.getSaleGain(sym, 1, "Long")) +
			""
		);
	}
}


function LeftStr(a, b) {
	return StrLeft(b, a);
}

function LeftNum(a, b) {
	return NumLeft(b, a);
}

function jtprint(ns, obj) {
	Object.entries(obj).forEach(entry => {
		const [key, value] = entry;
		ns.tprint("   " + key + ": " + value);
	});
}

function ftprint(ns, obj) {
	for (let i = 0; i < obj.length; i++) {
		const o = obj[i];
		ns.tprint(o);
	}
}

function PrintActivity(ns, shares, iSym, price, iForecast, iData) {
	// 06/24/2023 11:01 PM
	// LeftDol crashes the game and idk why
	function LeftDol(left, amount) {
		return StrLeft(ToDollars(amount), left);
	}
	let isBuying = iData == null;

	let str = (isBuying ? "buying  " : "selling ") +
		`${StrLeft(ToDollars(shares), 13)} ${StrLeft(iSym, 5)} shares` +
		` for ${StrLeft(ToDollars(price * shares), 10)} (Price: ${StrLeft(ToDollars(price), 7)})` +
		` b/c forecast is ${iForecast}.`;

	if (iData)
		str += ` Profit is ${StrLeft(ToDollars(iData.myShares * price - iData.myShares * iData.buyPrice), 8)}`;
	ns.tprint(str);
}

function SellThings(ns, mySymbols, myPortfolio, myLogs) {
	if (mySymbols.length != myPortfolio.length) {
		let err = `SellThings()` +
			` Mismatch mySymbols.length == ${mySymbols.length}` +
			` and myPortfolio.length == ${myPortfolio.length}`;
		ns.tprint(err);
		myPortfolio = FixMismatch(ns);
		// throw err;
	}

	if (mySymbols.length <= 0)
		return [myPortfolio, myLogs];

	for (let i = 0; i < mySymbols.length; i++) {
		const iSym = mySymbols[i];
		const iData = myPortfolio.filter(f => f.iSym == iSym)[0];
		const iForecast = Math.floor(ns.stock.getForecast(iSym) * 100);

		if (iForecast < reqBelForecast) {
			const sellPrice = ns.stock.sellStock(iSym, iData.myShares);
			if (sellPrice > 0) {
				PrintActivity(ns, iData.myShares, iSym, sellPrice, iForecast, iData);
				myPortfolio = myPortfolio.filter(f => f.iSym != iSym);
				const newRow = { iSym, myShares: iData.myShares, sellPrice, iForecast };
				myLogs.push(newRow);
			}
		}
	}

	return [myPortfolio, myLogs];
}

function SellEverything(ns) {
	let mySymbols = ns.stock.getSymbols().filter(f => ns.stock.getPosition(f)[0] > 0);
	let myPortfolio = JSON.parse(ns.read(portfolioTxt));
	let myLogs = JSON.parse(ns.read(profitsTxt));

	if (mySymbols.length != myPortfolio.length) {
		let mismatch = `SellEverything ` +
			` Mismatch mySymbols.length == ${mySymbols.length}` +
			` and myPortfolio.length == ${myPortfolio.length}`;
		ns.tprint(mismatch);
		myPortfolio = FixMismatch(ns);
		// throw mismatch;
	}

	if (mySymbols.length <= 0) {

		return;
	}

	for (let i = 0; i < mySymbols.length; i++) {
		const iSym = mySymbols[i];
		const iData = myPortfolio.filter(f => f.iSym == iSym)[0];
		const sellPrice = ns.stock.sellStock(iSym, iData.myShares);
		if (sellPrice > 0) {
			PrintActivity(ns, iData.myShares, iSym, sellPrice, iData.iForecast, iData);
			myPortfolio = myPortfolio.filter(f => f.iSym != iSym);
			const newRow = { iSym, myShares: iData.myShares, sellPrice, iForecast: iData.iForecast };
			myLogs.push(newRow);
		}
	}
	ns.write(portfolioTxt, JSON.stringify(myPortfolio), "w");
	ns.write(profitsTxt, JSON.stringify(myLogs), "w");
}

function BuyThings(ns, symbols, fee, myPortfolio, myLogs) {
	let hasBoughtSomething = false;
	symbols = symbols.sort((a, b) => ns.stock.getForecast(b) - ns.stock.getForecast(a));
	for (let i = 0; i < symbols.length; i++) {
		let myMoney = getMoney(ns);
		const iSym = symbols[i];
		const iForecast = Math.floor(ns.stock.getForecast(iSym) * 100);
		const price = ns.stock.getPrice(iSym);
		const maxShares = ns.stock.getMaxShares(iSym);
		let myShares = 0;
		if (myPortfolio.length > 0) {
			if (myPortfolio.filter(f => f.iSym == iSym).length > 0)
				myShares = myPortfolio.filter(f => f.iSym == iSym)[0].myShares;
		}

		let newShares = Math.floor(((myMoney - fee) * 0.98) / price);
		if (newShares > maxShares)
			newShares = maxShares;

		let doNotOwn = myShares == 0;
		let isGoodForecast = iForecast >= reqAbvForecast;
		let isBuying = newShares > 0;
		let isFeePlus = newShares * price > fee;
		// ns.print(`doNotOwn ${doNotOwn ? 1 : 0}` +
		// 	` isGoodForecast: ${isGoodForecast ? 1 : 0}` +
		// 	` isBuying: ${isBuying ? 1 : 0}` +
		// 	` fee+:${isFeePlus ? 1 : 0}` +
		// 	` = ${doNotOwn + isGoodForecast + isBuying + isFeePlus}`
		// );

		if (doNotOwn && isGoodForecast && isBuying && isFeePlus) {
			//ns.tprint(`was gonna buy ${iSym} ${newShares}`);
			const buyPrice = Math.ceil(ns.stock.buyStock(iSym, newShares));
			if (buyPrice > 0) {
				hasBoughtSomething = true;
				PrintActivity(ns, newShares, iSym, buyPrice, iForecast, null);
				const newRow = { iSym, myShares: newShares, buyPrice, iForecast };
				myPortfolio.push(newRow);
				myLogs.push(newRow);
			}
			else {
				ns.print(`Fail Buy ${iSym}
					myMoney: ${NumLeft(myMoney, 13)}
					Assumed: ${NumLeft(newShares * price, 13)}
					newShares: ${newShares}
					price: ${price}
					`);
			}
		}
	}
	// if (hasBoughtSomething) {
	// 	ns.write(portfolioTxt, JSON.stringify(myPortfolio), "w");
	// 	ns.write(profitsTxt, JSON.stringify(myLogs), "w");
	// }
	return [myPortfolio, myLogs];
}

function FixMismatch(ns) {
	let mySymbols = ns.stock.getSymbols().filter(f => ns.stock.getPosition(f)[0] > 0);
	let myPortfolio = JSON.parse(ns.read(portfolioTxt));
	// let myLogs = JSON.parse(ns.read(profitsTxt));

	ns.tprint("Removing " + myPortfolio.filter(f => mySymbols.indexOf(f.iSym) == -1).map(m => m.iSym).concat());
	myPortfolio = myPortfolio.filter(f => mySymbols.indexOf(f.iSym) > -1);
	ns.write(portfolioTxt, JSON.stringify(myPortfolio), "w");
	return myPortfolio;
}

async function BatchBuyAndSell(ns, waitTime) {

	if (ns.read(portfolioTxt) == "") ns.write(portfolioTxt, "[]", "w");
	if (ns.read(profitsTxt) == "") ns.write(profitsTxt, "[]", "w");

	let symbols = ns.stock.getSymbols();
	let w = 0;
	let failSafeCap = 9999;
	while (w < failSafeCap) {
		w++;
		let mySymbols = symbols.filter(f => ns.stock.getPosition(f)[0] > 0);
		let myPortfolio = JSON.parse(ns.read(portfolioTxt));
		let myLogs = JSON.parse(ns.read(profitsTxt));
		// Start selling
		[myPortfolio, myLogs] = SellThings(ns, mySymbols, myPortfolio, myLogs);
		const fee = 10 ** 7;

		if (getMoney(ns) < fee) {
			await ns.sleep(waitTime);
			continue;
		}

		// Start buying
		[myPortfolio, myLogs] = BuyThings(ns, symbols, fee, myPortfolio, myLogs);

		ns.write(portfolioTxt, JSON.stringify(myPortfolio), "w");
		ns.write(profitsTxt, JSON.stringify(myLogs), "w");


		await ns.sleep(waitTime);
	}
}

// newRow = { iSym, myShares: newShares, sellPrice, iForecast };
// newRow = { iSym, myShares: newShares, buyPrice, iForecast };

function SeeLogs(ns) {
	let logs = ns.read(profitsTxt);
	if (logs.length < 3) {
		ns.tprint("You have no logs.");
		return;
	}

	logs = JSON.parse(logs);
	let totals = [];
	let output = 0;
	let grossOutput = 0;
	let myPortfolio = JSON.parse(ns.read(portfolioTxt));

	for (let i = 0; i < logs.length; i++) {
		let log = logs[i];
		let foundItem = totals.filter(f => f.iSym == log.iSym);
		if (foundItem)
			foundItem = foundItem[0];

		if (log.sellPrice) {
			if (!foundItem) {
				continue;
			} else {
				foundItem.amount += log.sellPrice * log.myShares;
			}
		}
		if (log.buyPrice) {
			let addMe = (log.buyPrice * log.myShares) * -1;
			if (!foundItem) {
				let total = { iSym: log.iSym, amount: addMe };
				totals.push(total);
			} else {
				foundItem.amount += addMe;
			}
		}
	}

	for (let i = 0; i < totals.length; i++) {
		let total = totals[i];
		let gross = myPortfolio.filter(f => f.iSym == total.iSym);
		output += total.amount;

		if (gross.length == 0) {
			gross = "";
		} else {
			gross = gross[0];
			gross = gross.myShares * ns.stock.getPrice(gross.iSym);
			grossOutput += gross;
		}

		ns.tprint(" " +
			StrLeft(total.iSym, 5) +
			StrLeft(ToDollars(total.amount), 12) +
			StrLeft(ToDollars(gross), 12),
			StrLeft(ToDollars(total.amount + gross), 12)
		);
	}
	ns.tprint("Total:" +
			StrLeft(ToDollars(output), 12) +
			StrLeft(ToDollars(grossOutput), 12),
			StrLeft(ToDollars(output + grossOutput), 12)
		);

}
