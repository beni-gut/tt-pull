export default {
    neededPartsForKill: function (titanHP, titanParts) {
        // armour
        let headArmour = null;
        let torsoArmour = null;
        let oneArmArmour = null;
        let oneLegArmour = null;
        // body
        let headHP = null;
        let torsoHP = null;
        let oneArmHP = null;
        let oneLegHP = null;

        // iterate through array and set parts
        // arms and legs should have the same amount of HP and Armour
        titanParts.forEach(
            x => {
                switch (x["part_id"]) {
                    case "ArmorHead":
                        headArmour = x["total_hp"];
                        break;
                    case "BodyHead":
                        headHP = x["total_hp"];
                        break;
                    case "ArmorChestUpper":
                        torsoArmour = x["total_hp"];
                        break;
                    case "BodyChestUpper":
                        torsoHP = x["total_hp"];
                        break;
                    case "BodyArmUpperLeft":
                        oneArmHP = x["total_hp"];
                        break;
                    case "ArmorArmUpperLeft":
                        oneArmArmour = x["total_hp"];
                        break;
                    case "BodyLegUpperRight":
                        oneLegHP = x["total_hp"];
                        break;
                    case "ArmorLegUpperRight":
                        oneLegArmour = x["total_hp"];
                        break;
                }
            }
        );

        /**
         * Checking for different Strategies
         * Checking for:
         *    8 part
         *    7 part (No Head)
         *    7 part (No Torso)
         *    6 part (No Head and No Torso)
         *    6 part (No Legs)
         *    5 part (No Legs and No Torso)
         *    5 part (No Legs and No Head)
         * @type {Map<any, any>} String: Strategy, Number: TotalDmgNeeded
         */
        let differentStrategies = new Map();
        // all parts
        differentStrategies.set("AllParts", (4*oneArmArmour + 2*oneLegArmour + torsoArmour + headArmour + titanHP));
        // Check if titan can be killed, if yes add "No Head"
        if (titanHP - (4*oneArmHP + 2*oneLegHP + torsoHP) <= 0) {
            differentStrategies.set("NoHead", (4*oneArmArmour + 2*oneLegArmour + torsoArmour + titanHP));
        }
        // Check if titan can be killed, if yes add "No Torso"
        if (titanHP - (4*oneArmHP + 2*oneLegHP + headHP) <= 0) {
            differentStrategies.set("NoTorso", (4*oneArmArmour + 2*oneLegArmour + headArmour + titanHP));
        }
        // Check if titan can be killed, if yes add "No Head, No Torso"
        if (titanHP - (4*oneArmHP + 2*oneLegHP) <= 0) {
            differentStrategies.set("NoTorsoNoHead", (4*oneArmArmour + 2*oneLegArmour + titanHP));
        }
        // Check if titan can be killed, if yes add "No Legs"
        if (titanHP - (4*oneArmHP + torsoHP + headHP) <= 0) {
            differentStrategies.set("NoLegs", (4*oneArmArmour + torsoArmour + headArmour + titanHP));
        }
        // Check if titan can be killed, if yes add "No Legs, No Torso"
        if (titanHP - (4*oneArmHP + headHP) <= 0) {
            differentStrategies.set("NoLegsNoTorso", (4*oneArmArmour + headArmour + titanHP));
        }
        // Check if titan can be killed, if yes add "No Legs, No Head"
        if (titanHP - (4*oneArmHP + torsoHP) <= 0) {
            differentStrategies.set("NoLegsNoHead", (4*oneArmArmour + torsoArmour + titanHP));
        }

        // get the Strategy with the least amount of damage needed to kill and return it
        let bestStrategy = [...differentStrategies.entries()].reduce((a, e ) => e[1] < a[1] ? e : a);
        //console.log(bestStrategy);
        return bestStrategy
    }
}