<template>
  <div class="titanCard">
    <h2 class="titanCard-titanName"><b>Titan:</b> {{ titanName }}</h2>
    <p class="titanCard-hpAmount titanCard-info"><b>Titan HP:</b> {{ titanHP }}</p>
    <p class="titanCard-info"><b>Debuff:</b> {{ titanDebuffType }}</p>
    <p class="titanCard-info" v-if="hasCurses"><b>Cursed Parts:</b> {{ cursedParts }}</p>
    <p class="titanCard-info" v-if="hasCurses"><b>Curse:</b> {{ numberOfCurses }} x {{ curseAmount }} {{ curseType }}</p>
    <p class="titanCard-strategy"><b>Least damage needed strategy:</b> {{ bestStrategy }}</p>
    <p><b>Total damage needed:</b> {{ totalDamageNeeded }}</p>
  </div>
</template>

<script>
import mapBuffDebuff from "./mapBuffDebuff";

export default {
  name: 'TitanCard',
  props: {
    raidTitan: Object
  },
  data() {
    return {
      hasCurses: false,
      titanName: null,
      titanHP: null,
      titanDebuffType: null,
      cursedParts: "",
      curseType: null,
      curseAmount: null,
      numberOfCurses: null,
      bestStrategy: null,
      totalDamageNeeded: null
    }
  },
  methods: {
    displayTitan: function () {
      this.$nextTick(function () {
        if (this.raidTitan !== null) {
          // get the titanData from the props, probably not needed
          let titanData = this.raidTitan;

          // set the name of the titan
          this.titanName = titanData["enemy_name"];

          // Get the total HP
          let titanHPNumber = titanData["total_hp"];
          this.titanHP = titanHPNumber.toLocaleString("en");

          // Get the debuff for the titan
          let debuff;
          try {
            let titanDebuffType = titanData["area_debuffs"][0]["bonus_type"];
            let titanDebuffAmount = titanData["area_debuffs"][0]["bonus_amount"];
            debuff = mapBuffDebuff.mapBuffType(titanDebuffType, titanDebuffAmount);
          } catch (e) {
            debuff = "none";
          }
          this.titanDebuffType = debuff;

          // check for cursed parts
          let parts = titanData["parts"];

          // get the best Strategy (out of a select few at the moment)
          let neededPartsStrategy = titanData["bestStrategy"];
          this.bestStrategy = neededPartsStrategy[0];
          this.totalDamageNeeded = neededPartsStrategy[1].toLocaleString("en");

          let cursedPartsRaw = [];
          parts.forEach(
              x => {
                try {
                  if (x["cursed"]) {
                    cursedPartsRaw.push(x["part_id"]);
                  }
                } catch {
                  this.hasCurses = false;
                  this.cursedParts = [];
                }
              }
          );

          // if any cursed parts have been found assign the correct description
          if (cursedPartsRaw.length > 0) {
            this.mapCurseType(titanData["cursed_debuffs"][0]);
            this.mapParts(cursedPartsRaw);
            this.hasCurses = true;
          }
        }
      })
    },
    mapParts: function (cursedPartsRaw) {
      for (let i = 0; i < cursedPartsRaw.length; i++) {
        this.numberOfCurses += 1;
        // normal switch-case to identify and push respective cursed parts to String
        // \xa0 is a non-breaking space
        switch (cursedPartsRaw[i]) {
          case "ArmorHead":
            this.cursedParts += "Head";
            break;
          case "ArmorChestUpper":
            this.cursedParts += "Torso";
            break;
          case "ArmorArmUpperRight":
            this.cursedParts += "Left\xa0Shoulder";
            break;
          case "ArmorArmUpperLeft":
            this.cursedParts += "Right\xa0Shoulder";
            break;
          case "ArmorHandRight":
            this.cursedParts += "Left\xa0Hand";
            break;
          case "ArmorHandLeft":
            this.cursedParts += "Right\xa0Hand";
            break;
          case "ArmorLegUpperRight":
            this.cursedParts += "Left\xa0Leg";
            break;
          case "ArmorLegUpperLeft":
            this.cursedParts += "Right\xa0Leg";
            break;
        }

        // adds a comma if it's not the last part
        if ((i+1) < cursedPartsRaw.length) {
          this.cursedParts += ", ";
        }
      }
    },
    mapCurseType: function (curseDebuff) {
      switch (curseDebuff["bonus_type"]) {
        case "BurstDamagePerCurse":
          this.curseType = "All Burst Damage per Curse";
          this.curseAmount = this.parseCurseAmount(curseDebuff["bonus_amount"]);
          break;
        case "AfflictedDamagePerCurse":
          this.curseType = "All Affliction Damage per Curse";
          this.curseAmount = this.parseCurseAmount(curseDebuff["bonus_amount"]);
          break;
      }
    },
    parseCurseAmount: function (curseAmountText) {
      // parsing the number from JSON to a percentage
      return curseAmountText.toLocaleString("en", {style: "percent", minimumFractionDigits: 0}); // should be fully supported
      // return (100*parseFloat(curseAmountText).toFixed(2)+"%") // if not fully supported use this
    }
  },
  beforeMount() {
    this.displayTitan();
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* standard css */
h2 {
  margin: 0;
  padding: 1rem;
}
p {
  margin: 0;
  padding: 0 0 1rem 0;
}
.titanCard-info {
  margin: 0 .3rem 0 .3rem;
}

.titanCard-strategy {
  padding: 1rem 0 1rem 0;
  border-top: 1px solid blue;
}

/* on small screens */
@media (max-width: 991px) {
  .titanCard {
    border-bottom: 1px solid black;
    padding: 0;
    margin: 0 .1rem 0 .1rem;
  }
  .titanCard:nth-last-of-type(1) {
    border-bottom: 0;
  }
  .titanCard-strategy {
    border-top: 1px solid black;
  }
}
/* on big screens */
@media (min-width: 992px) {
  .titanCard {
    border: 1px solid blue;
    border-radius: 1em;
    width: calc(95vw / 3);
    margin: 0 .1rem 0 .1rem;
  }
  .titanCard-titanName {
    border-bottom: 1px solid blue;
  }
  .titanCard-hpAmount {
    padding-top: 1rem;
    margin: 0 .2rem 0 .2rem;
  }
}
@media (min-width: 992px) {
  .titanCard {
    margin: 0 .3rem 0 .3rem;
  }
}

</style>
