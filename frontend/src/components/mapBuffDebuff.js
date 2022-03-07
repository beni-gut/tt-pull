export default {
    mapBuffType: function (raidBuffName, raidBuffAmount) {
        let raidBuff;
        switch (raidBuffName) {
            case "RaidAttackDuration":
                raidBuff = "+" + raidBuffAmount + "s " + raidBuffName;
                break;
            case "AfflictedChance": case "BurstChance":
                raidBuff = "x" + raidBuffAmount + " " + raidBuffName;
                break;
            default:
                raidBuff = raidBuffAmount.toLocaleString("en", {style: "percent", minimumFractionDigits: 0}) + " " + raidBuffName;
                break;
        }
        return raidBuff;
    }
}