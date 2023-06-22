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


export async function main(ns) {
	// ns.tprint(ns.stock.getPosition("FNS")[0] > 0);
	// ns.tprint(ns.stock.getPosition("CTYS")[0] > 0);
	// ns.tprint(ns.stock.getPosition("CTYS"));
	if (ns.args.length == 0) {
		ns.tprint(`You have not entered any arguments. Acceptable arguments are 
			info [abc] alphabetically
			info [a] ask price
			info [f] forecast
			info [p] price
			info [me] me
			batch
		`);
		return;
	}
	const iHas1 = ns.stock.has4SData();
	const iHas2 = ns.stock.has4SDataTIXAPI();
	const iHas3 = ns.stock.hasTIXAPIAccess();
	const iHas4 = ns.stock.hasWSEAccount();

	ns.tprint(`${iHas1} ${iHas2} ${iHas3} ${iHas4}`);
	let symbols = ns.stock.getSymbols();

	let getMoney = () => { return ns.getServerMoneyAvailable("home") };
	ns.tprint(`You have \$${ToDollars(getMoney())} on ${new Date().toLocaleString()}`);
	if (ns.args[0] == "i") {
		if (false) { }
		else if (ns.args[1] == "abc") symbols = symbols.sort();
		else if (ns.args[1] == "a") symbols = symbols.sort((a, b) => ns.stock.getAskPrice(a) - ns.stock.getAskPrice(b));
		else if (ns.args[1] == "f") symbols = symbols.sort((a, b) => ns.stock.getForecast(a) - ns.stock.getForecast(b));
		else if (ns.args[1] == "p") symbols = symbols.sort((a, b) => ns.stock.getPrice(a) - ns.stock.getPrice(b));
		else if (ns.args[1] == "me") symbols = symbols.filter(f => ns.stock.getPosition(f)[0] > 0);

		PrintInfo(ns, symbols);
	}

	if (ns.args[0] == "b") {
		ns.tprint(`WHILE LOOP STARTED. You must kill this program to end it.`)
		let waitTime = 1000 * 7;
		const reqForecast = 59;
		const saveFile = "portfolio.txt";
		if (ns.read(saveFile) == "")
			ns.write(saveFile, "[]", "w");

		while (true) {
			symbols = ns.stock.getSymbols();
			let mySymbols = symbols.filter(f => ns.stock.getPosition(f)[0] > 0);
			let myPortfolio = JSON.parse(ns.read(saveFile));
			// Start selling
			if (mySymbols.length > 0) {
				for (let i = 0; i < mySymbols.length; i++) {
					const iSym = mySymbols[i];
					const iData = myPortfolio.filter(f => f.iSym == iSym)[0];
					const iForecast = Math.floor(ns.stock.getForecast(iSym) * 100);

					if (iForecast < reqForecast) {
						const sellPrice = ns.stock.sellStock(iSym, iData.myShares);
						const str = `Selling ${StrLeft(ToDollars(iData.myShares),13)} ${StrLeft(iSym, 5)} shares` +
						` for ${StrLeft(ToDollars(sellPrice * iData.myShares),10)} (Price: ${StrLeft(ToDollars(sellPrice),7)})` +
						` b/c forecast is ${iForecast}.` +
						` Profit is ${StrLeft(ToDollars(iData.myShares * iData.buyPrice - iData.myShares * sellPrice), 7)}`
						ns.tprint(str);
						myPortfolio = myPortfolio.filter(f => f.iSym != iSym);
					}
				}
				ns.write(saveFile, JSON.stringify(myPortfolio), "w");
			}


			// Start buying

			if (getMoney() < 10 ** 6) {
				await ns.sleep(waitTime);
				continue;
			}

			for (let i = 0; i < symbols.length; i++) {
				let myMoney = getMoney();
				const iSym = symbols[i];
				const iForecast = Math.floor(ns.stock.getForecast(iSym) * 100);
				const price = ns.stock.getPrice(iSym);
				const maxShares = ns.stock.getMaxShares(iSym);
				let myShares = 0;
				if (myPortfolio.length > 0)
				{
					if (myPortfolio.filter(f => f.iSym == iSym).length > 0)
						myShares = myPortfolio.filter(f => f.iSym == iSym)[0].myShares;
				}
					
				let newShares = myMoney / price;
				if (newShares > maxShares)
					newShares = maxShares;

				// ns.tprint(`${myShares} ${iForecast} ${reqForecast} ${ToDollars(newShares * price)} ${ToDollars(myMoney)}`)
				if (myShares == 0 && iForecast >= reqForecast && newShares > 0 && newShares * price > 10 ** 6) {
					const buyPrice = Math.ceil(ns.stock.buyStock(iSym, newShares));
					ns.tprint(`Buying  ${StrLeft(ToDollars(newShares), 13)} ${StrLeft(iSym, 5)} shares` +
					` for ${StrLeft(ToDollars(buyPrice * newShares),10)} (Price: ${StrLeft(ToDollars(buyPrice), 7)})` +
					` b/c forecast is ${iForecast}.`
					);
					const newRow = { iSym, myShares: newShares, buyPrice, iForecast };
					myPortfolio.push(newRow);
				}
			}
			ns.write(saveFile, JSON.stringify(myPortfolio), "w");
			await ns.sleep(waitTime);
		}

	}

	ns.tprint(`wse.js has ended. ${new Date().toLocaleString()}`);
	// jtprint(ns, ns.stock.getOrders()); 
	//ftprint(ns, symbols);
	//jtprint(ns, ns);

}

function SellThings(ns) {

}

function BuyThings(ns) {

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
			" " + LeftNum(7, ns.stock.getPurchaseCost(sym, 10, "Short")) +
			" " + LeftNum(7, ns.stock.getPurchaseCost(sym, 10, "Long")) +
			" " + LeftNum(8, ns.stock.getSaleGain(sym, 10, "Short")) +
			" " + LeftNum(8, ns.stock.getSaleGain(sym, 10, "Long")) +
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