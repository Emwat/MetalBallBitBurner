/** @param {NS} ns */
import ToDollars from './im/carat'

export async function main(ns) {
    function myMoney() {
        return ns.getServerMoneyAvailable("home");
    }

    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");
    ns.tprint(`You started with \$${ToDollars(myMoney())}.`);

    const cnt = ns.args[0] || 20;
    const maxLevel = 199;
    const maxRam = 64;
    const maxCores = 16;
    var res = null; // idk what this is.

    while (ns.hacknet.numNodes() < cnt) {
        res = ns.hacknet.purchaseNode();
        if (res != -1) ns.print("Purchased hacknet Node with index " + res);
        await ns.sleep(1000);
    };

    ns.tprint("All " + cnt + " nodes purchased")

    for (var i = 0; i < cnt; i++) {
        while (ns.hacknet.getNodeStats(i).level <= maxLevel) {
            var cost = ns.hacknet.getLevelUpgradeCost(i, 1);
            while (myMoney() < cost) {
                ns.print("Need $" + cost + " . Have $" + myMoney());
                await ns.sleep(3000);
            }
            // res = ns.hacknet.upgradeLevel(i, 1);
            ns.hacknet.upgradeLevel(i, 1);
        };
    };

    ns.tprint("All nodes upgraded to level " + maxLevel);

    for (var i = 0; i < cnt; i++) {
        while (ns.hacknet.getNodeStats(i).ram < maxRam) {
            var cost = ns.hacknet.getRamUpgradeCost(i, 1);
            while (myMoney() < cost) {
                ns.print("Need $" + cost + " . Have $" + myMoney());
                await ns.sleep(3000);
            }
            // res = ns.hacknet.upgradeRam(i, 1);
            ns.hacknet.upgradeRam(i, 1);
        };
    };

    ns.tprint("All nodes upgraded to "+ maxRam + "GB RAM");

    for (var i = 0; i < cnt; i++) {
        while (ns.hacknet.getNodeStats(i).cores < maxCores) {
            var cost = ns.hacknet.getCoreUpgradeCost(i, 1);
            while (myMoney() < cost) {
                ns.print("Need $" + cost + " . Have $" + myMoney());
                await ns.sleep(3000);
            }
            // res = ns.hacknet.upgradeCore(i, 1);
            ns.hacknet.upgradeCore(i, 1);
        };
    };

    ns.tprint("All nodes upgraded to " + maxCores + " cores");
}