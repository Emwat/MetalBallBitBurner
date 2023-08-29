import NumLeft from "./im/numLeft"
import StrLeft from "./im/strLeft"
import StrRight from "./im/strRight"
import ToDollars from "./im/carat"
import FormatTime from "./im/time"
import tickers from './static/symbols'
// import GetProgramLevel from "./im/files"

const Fee = 10 ** 7;
let LotsArray = [];
let LotsCostsDebugTxt = "lotsCosts.txt";
let LotsPortfolioTxt = "lotsPortfolio.txt";
let ForStockTxt = "forStock.txt";
let LastClockTime = new Date();;
const Cap = 20;
const SellRatioCeiling = 1.07;
const SellRatioFloor = 0.93;
let myMoneyCeiling = 10 ** 8 * 5;
let myMoneyFloor = 10 ** 6 * 2.5;

// ticker
// hostname
// organizationName

/** @param {NS} ns */
export async function main(ns) {
	let arg0 = ns.args[0];
	if (ns.args.length == 0) {
		myMoneyCeiling = SimpleNumber(getMoney(ns)) / 5;
		myMoneyFloor = SimpleNumber(getMoney(ns)) / 10;
		
		ns.tprint(`MoneyFloor: ${ToDollars(myMoneyFloor)} MoneyCeiling: ${ToDollars(myMoneyCeiling)}`)
		LotsArray = [];
		ns.tprint(`You started with ${ToDollars(getMoney(ns))} at ${new Date().toLocaleTimeString()}`)
		ns.disableLog("sleep");
		ns.disableLog("getServerMoneyAvailable");
		ns.disableLog("getHackingLevel");
		ns.disableLog("exec");

		ns.write(LotsCostsDebugTxt, "[]", "w");
		ns.write(ForStockTxt, JSON.stringify({
			"dateCreated": new Date(),
			initialMoney: getMoney(ns),
			profit: 0, g: 0, l: 0
		}), "w");
		// ns.write(LotsPortfolioTxt, "[]", "w");
		ns.tprint("measuring...");
		await RecordSellTickBuy(ns);
		ns.tprint("commiting...");
		while (true) {
			await RecordSellTickBuy(ns, true);
		}

	} else if (arg0 == "S") {
		SellThings(ns, () => true);
	} else if (arg0 == "sw") {
		SellThings(ns, SellWinners);
	} else if (arg0 == "sl") {
		SellThings(ns, SellLosers);
	} else if (arg0 == "l") {
		while (true) {
			ns.disableLog("disableLog");
			ns.disableLog("sleep");
			await PeekAtThings(ns);
			await ns.sleep(6000);
		}
	} else if (arg0 == "la") {
		await PeekAtThings(ns, true);
	} else if (arg0 == "txt") {
		ReadForStockTxt(ns);
	} else if (arg0 == "x") {
		ns.write(LotsPortfolioTxt, "[]", "w");
		ns.tprint(`${LotsPortfolioTxt} is now empty.`)
	} else {
		ns.tprint(`Invalid command.`)
	}

}

/** @param {NS} ns */
async function RecordSellTickBuy(ns, part2 = false) {
	let i = 0;
	while (i < Cap) {
		let symbols = ns.stock.getSymbols()
			.map(sym => {
				return {
					iSym: sym,
					date: new Date(),
					price: ns.stock.getPrice(sym)
					// bear: ns.stock.getPurchaseCost(sym, 100, "Short"),
					// bull: ns.stock.getPurchaseCost(sym, 100, "Long"),
				}
			});
		LotsArray.push(symbols);
		if (LotsArray.length > Cap * 2) {
			LotsArray = LotsArray.slice(Math.floor(LotsArray.length / 2));
		}

		ns.write(LotsCostsDebugTxt, JSON.stringify(LotsArray), "w");
		if (part2) {
			SellThings(ns);
			TickTockThings(ns);
			BuyThings(ns);
		}
		if (i == 0) {
			ns.print(`${i} LotsArray.length: ${LotsArray.length}`)
		}
		await ns.sleep(6000);
		i++;
	}
}

/** @param {NS} ns */
function SellThings(ns, ratioCallback = false) {
	let portfolio = JParse(ns, LotsPortfolioTxt);
	for (let row of portfolio) {
		let currentPrice = ns.stock.getPrice(row.iSym);
		let ratio = currentPrice / row.price;
		// let longCost = ns.stock.getPurchaseCost(row.iSym, 100, "Long");
		// let shortCost = ns.stock.getPurchaseCost(row.iSym, 100, "Short");
		if (row.isLong === false) {
			ratio = row.price / currentPrice;
		}
		let isRecent = (new Date() - new Date(row.date)) < 60000 * 5;
		let wouldSell = (!isRecent && ratio > SellRatioCeiling) || ratio < SellRatioFloor;
		let soldShares = 0;

		if (ratioCallback)
			wouldSell = ratioCallback({ isLong: row.isLong, ratio });

		if (!wouldSell)
			continue;

		if (row.isLong) {
			soldShares = ns.stock.sellStock(row.iSym, row.purchasingShares)
		} else {
			soldShares = ns.stock.sellShort(row.iSym, row.purchasingShares)
		}
		if (soldShares == 0)
			continue;

		if (row.isLong) {
			IncrementSell(ns, (currentPrice * soldShares) - (row.price * soldShares));
		} else {
			IncrementSell(ns, (row.price * soldShares) - (currentPrice * soldShares));
		}

		let output = "Selling"
			+ " " + row.iSym.padEnd(4) + " "
			+ " " + NumLeft(soldShares, 13) + " "
			+ " " + (row.isLong ? "Stocks" : "Shorts")
			+ " " + " for " + StrLeft(row.price.toFixed(2), 13)
			+ " " + " b/c " + (row.isLong ? "bull" : "bear")
			+ " " + row.stockPriceAtPurchase.toFixed(2) + " -> " + currentPrice.toFixed(2)
			+ " " + " ratio: " + ratio.toFixed(2)
			//+ " " + (row.isLong ? row.iLotBull : row.iLotBear)
			;
		// ns.tprint(output);
		portfolio = portfolio.filter(p => p.iSym != row.iSym);
	}
	ns.write(LotsPortfolioTxt, JSON.stringify(portfolio), "w");
}


/** @param {NS} ns */
function TickTockThings(ns) {
	if (new Date() - new Date(LastClockTime) < 60000 * 5)
		return;
	let portfolio = JParse(ns, LotsPortfolioTxt);
	ns.exec("clock.js", "home", 1, JSON.stringify(portfolio));
	LastClockTime = new Date();
}

/** @param {NS} ns */
function BuyThings(ns) {
	let lotsToBuy = GetLotsToBuy(ns).sort((a, b) => GetPriority(b) - GetPriority(a));
	// ns.tprint(lotsToBuy.map(ltb => `${ltb.name}/${ltb.profit.toFixed(2)}`).slice(0, 3).join(" | "));
	let portfolio = JParse(ns, LotsPortfolioTxt);
	for (let i = 0; i < lotsToBuy.length; i++) {
		const iLot = lotsToBuy[i];
		let newRow = BuyThingsHelper(ns, iLot, portfolio, i)
		if (newRow == null)
			continue;
		let output = "Buying "
			+ " " + newRow.iSym.padEnd(4) + " "
			+ " " + NumLeft(newRow.purchasingShares, 13) + " "
			+ " " + (newRow.isLong ? "Stocks" : "Shorts")
			+ " " + " for " + StrLeft(newRow.price.toFixed(2), 13)
			+ " " + " b/c " + (newRow.isLong ? "bull" : "bear")
			//+ " " + (newRow.isLong ? newRow.iLotBull : newRow.iLotBear)
			;
		//ns.tprint(output);
		portfolio.push(newRow);

	}
	ns.write(LotsPortfolioTxt, JSON.stringify(portfolio), "w");

}

/** @param {NS} ns */
function BuyThingsHelper(ns, iLot, portfolio, i) {
	let myMoney = getMoney(ns);
	if (myMoney > myMoneyCeiling)
		myMoney = myMoneyCeiling;

	if (myMoney < myMoneyFloor)
		return null;

	let myShares = portfolio.filter(p => p.iSym == iLot.iSym).length;
	if (myShares !== 0)
		return null;

	let price = ns.stock.getPrice(iLot.iSym);
	let isLong = iLot.profit > 1;
	// let longCost = ns.stock.getPurchaseCost(iLot.iSym, 100, "Long");
	// let shortCost = ns.stock.getPurchaseCost(iLot.iSym, 100, "Short");
	//let isLong = iLot.bull > iLot.bear;
	//let iCost = isLong ? iLot.bull : iLot.bear;
	//let cost = isLong ? longCost : shortCost;
	let purchasingShares = Math.floor((myMoney - Fee) / price);
	purchasingShares = Math.floor(purchasingShares * 0.9);
	let stockPriceAtPurchase = 0;
	// purchasingShares = SimpleNumber(purchasingShares);

	if (purchasingShares * price < 10 ** 7)
		return null;

	if (isLong)
		stockPriceAtPurchase = ns.stock.buyStock(iLot.iSym, purchasingShares);
	else
		stockPriceAtPurchase = ns.stock.buyShort(iLot.iSym, purchasingShares);

	if (stockPriceAtPurchase <= 0) {
		ns.print(`Fail. Tried to buy ${purchasingShares} with ${myMoney - Fee}`);
		return null;
	}

	let newRow = {
		iSym: iLot.iSym
		, date: new Date()
		, purchasingShares
		, isLong: isLong
		, price
		// , iLotBull: iLot.bull
		// , iLotBear: iLot.bear
		, stockPriceAtPurchase
	};
	return newRow;
}

function SimpleNumber(num) {
	let input = String(Math.floor(num));
	return Number(input[0].padEnd(input.length, "0"))
}

function GetPriority(lotsToBuy) {
	return Math.abs(lotsToBuy.profit);
	return lotsToBuy.bull > lotsToBuy.bear ? lotsToBuy.bull : lotsToBuy.bear;
}

function GetLotsToBuy(ns) {
	return ns.stock.getSymbols()
		.map((s, i, arr) => {
			let filtered = LotsArray.flat().filter(lc => lc.iSym == s);
			return {
				iSym: s,
				profit: (filtered[filtered.length - 1].price / filtered[0].price)
				//bull: lotsCosts.filter(l => l.iSym == s).reduce((a, c) => a += c.bull, 0),
				//bear: lotsCosts.filter(l => l.iSym == s).reduce((a, c) => a += c.bear, 0)
			};
		});
}

function getMoney(ns) {
	return ns.getServerMoneyAvailable("home");
}

function JParse(ns, filename) {
	let text = ns.read(filename);
	if (text == "")
		return [];
	return JSON.parse(text);
}

function PeekHelper(row, currentPrice, ratio, wouldSell) {
	let { iSym, date, purchasingShares, isLong, price, stockPriceAtPurchase } = row;
	return (iSym.padEnd(6)
		+ " " + StrRight(new Date(date).toLocaleTimeString(), 14)
		+ " " + StrLeft(String(purchasingShares), 13)
		+ " " + (isLong ? "Bull" : "Bear")
		+ " " + StrLeft(ToDollars(price), 7)
		+ " " + StrLeft(ToDollars(stockPriceAtPurchase), 7)
		+ " " + StrLeft(ratio.toFixed(2), 7)
		+ " " + StrLeft(ToDollars(currentPrice), 7)
		+ " " + (iSym.includes("Total") ? StrLeft(ToDollars(currentPrice), 7) : StrLeft(ToDollars(currentPrice * purchasingShares), 7))
		+ " " + wouldSell
		+ "\r\n"
	);
}

async function PeekAtThings(ns, doTPrint = false) {
	let output = "\r\n";
	let portfolio = JParse(ns, LotsPortfolioTxt);
	let totalA = {
		iSym: "TotalA", date: new Date(),
		purchasingShares: 0, isLong: true, price: 0, stockPriceAtPurchase: 0,
		currentPrice: 0, ratio: 1
	};
	let totalB = { ...totalA, iSym: "TotalB", isLong: false };
	let totalC = { ...totalA, iSym: "TotalC"};
	for (let row of portfolio) {
		let currentPrice = ns.stock.getPrice(row.iSym);
		let ratio = currentPrice / row.price;
		if (row.isLong === false) {
			ratio = row.price / currentPrice;
		}
		let wouldSell = ratio > SellRatioCeiling;
		function PeekTotalHelper(total) {
			total.purchasingShares += row.purchasingShares;
			total.price += row.purchasingShares * row.price;
			total.currentPrice += row.purchasingShares * currentPrice;
			total.stockPriceAtPurchase += row.purchasingShares * row.stockPriceAtPurchase;
		}
		if (row.isLong) {
			PeekTotalHelper(totalA);
		} else {
			PeekTotalHelper(totalB);
		}
		PeekTotalHelper(totalC);


		// TO DO: Need to calculate shorts into total.currentPrice
		output += PeekHelper(row, currentPrice, ratio, wouldSell);
	}
	output += "\r\n"
	function PeekTotalHelper(total) {
		return PeekHelper(total, total.currentPrice, total.currentPrice / total.price, false);
	}
	output += PeekTotalHelper(totalA);
	output += PeekTotalHelper(totalB);
	output += PeekTotalHelper(totalC);

	output = ("\r\n" + "iSym".padEnd(6)
		+ " " + StrRight("date", 14)
		+ " " + StrRight("ownedShares", 13)
		+ " " + StrLeft("isL", 4)
		+ " " + StrLeft("pricTxt", 7)
		+ " " + StrLeft("s$@PTxT", 7)
		+ " " + StrLeft("ratio", 7)
		+ " " + StrLeft("pricNow", 7)
		+ " " + StrLeft("value", 7)
		+ " " + StrRight("isSelling", 7)
	) + output;

	if (doTPrint) {
		ns.tprint(PeekTotalHelper(totalA));
		ns.tprint(PeekTotalHelper(totalB));
		ns.tprint(PeekTotalHelper(totalC));
	} else {
		await tailPrint(ns, output);
	}
}

async function tailPrint(ns, output) {
	ns.tail();
	await ns.sleep(0);
	let myWindowW = 1900;
	let myWindowH = 900;
	let widthAdjustment = 1000;
	let heightAdjustment = 470; //10px per line
	let x = myWindowW - widthAdjustment;
	let y = myWindowH - heightAdjustment;
	ns.resizeTail(widthAdjustment, heightAdjustment);
	ns.moveTail(x, 0);
	ns.print(output);
}

function SellWinners({ isLong, ratio }) {
	if (ratio > 1.02)
		return true;

	return false;
}

function SellStale({ isLong, ratio }) {
	if (ratio < 1.04 && ratio > 0.97)
		return true;

	return false;
}

function SellLosers({ isLong, ratio }) {
	if (ratio < 0.97)
		return true;

	return false;
}

/** @param {NS} ns */
function IncrementSell(ns, profit) {
	let forStock = JSON.parse(ns.read(ForStockTxt));
	forStock.profit += profit;
	if (profit > 0)
		forStock.g += 1;
	else
		forStock.l += 1;
	forStock.lastUpdated = new Date();
	ns.write(ForStockTxt, JSON.stringify(forStock), "w");
}

/** @param {NS} ns */
function ReadForStockTxt(ns) {
	let forStock = JSON.parse(ns.read(ForStockTxt));
	let output = `
	${new Date(forStock.dateCreated).toLocaleTimeString()} - ${new Date(forStock.lastUpdated).toLocaleTimeString()}
	initialMoney: \$ ${ToDollars(forStock.initialMoney)}
	 gains: ${forStock.g}
	 losses: ${forStock.l}
	`
	ns.tprint(output);
}

