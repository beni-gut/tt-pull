<template>
  <div class="raidCards">
    <h1 v-if="(this.raidDetails !== null)">Raid: {{ tierMsg }}-{{ levelMsg }}</h1>
    <div v-if="(this.raidDetails !== null)" class="raidCards-displayInformation">
      <ul v-if="hasABuff" id="raidCard-raidBuff">
        <li><b>Buff:</b></li>
        <li>{{ raidBuff }}</li>
      </ul>
      <ul id="raidCard-raidHP">
        <li><b>Number of titans:</b></li>
        <li>{{ numberOfTitans }}</li>
      </ul>
      <ul id="raidCard-raidSequence">
        <li><b>Sequence:</b></li>
        <li>{{ raidSequence }}</li>
      </ul>
    </div>
    <div v-if="(this.raidDetails !== null)" class="raidCards-displayInformation">
      <ul v-if="(this.$props.averageDamage !== null)">
        <li><b>Average damage:</b></li>
        <li>{{ this.$props.averageDamage.toLocaleString("en") }}</li>
      </ul>
      <ul>
        <li><b>Total damage needed to finish:</b></li>
        <li>{{ totalHPNeededString }}</li>
      </ul>
      <ul v-if="(this.cyclesNeeded !== null)">
        <li><b>Cycles needed:</b></li>
        <li>&#126;{{ attacksInLastCycle }} attacks into cycle {{ cyclesNeeded }}</li>
      </ul>
    </div>
    <div class="titanContainer">
      <TitanCard v-for="titan in raidTitans" :raidTitan="titan.value" :key="titan.id" />
      <p v-if="this.raidDetails === null" id="raid-card-placeholder">Select a raid</p>
    </div>
  </div>
</template>

<script>
import TitanCard from "./TitanCard";
import mapBuffDebuff from "./mapBuffDebuff";
import neededParts from "../components/neededParts";

export default {
  name: 'RaidCard',
  components: {TitanCard},
  props: {
    raidDetails: Object,
    averageDamage: Number,
    clanMembers: Number
  },
  data() {
    return {
      tierMsg: null,
      levelMsg: null,
      hasABuff: false,
      raidBuff: null,
      raidSequence: null,
      numberOfTitans: null,
      raidTitans: [],
      totalHPNeededString: null,
      totalHPNeededNumber: null,
      cyclesNeeded: null,
      attacksInLastCycle: null
    }
  },
  methods: {
    updateData: function () {
      this.$nextTick(function () {

        // set all values null when info changes
        if (this.raidDetails === null) {
          this.tierMsg = null;
          this.levelMsg = null;
          this.hasABuff = false;
          this.raidBuff = null;
          this.raidSequence = null;
          this.numberOfTitans = null;
          this.raidTitans = [];
          this.totalHPNeededString = null;
          this.cyclesNeeded = null;
          this.attacksInLastCycle = null;
        }

        // if values present, get values
        if (this.raidDetails !== null) {
          this.raidTitans = [];
          let raidDetailsRaw = this.raidDetails;

          // set tier and level
          this.tierMsg = Number(raidDetailsRaw["tier"]);
          this.levelMsg = Number(raidDetailsRaw["level"]);

          // get titan sequence
          let raidSequence = [];
          raidDetailsRaw["spawn_sequence"].forEach(
              x => {
                raidSequence.push(x);
              }
          )

          // set titan sequence
          this.raidSequence = raidSequence.toString().replaceAll(",", ", ");

          // set number of titans
          this.numberOfTitans = raidSequence.length;

          // get titans and their respective details
          let titans = raidDetailsRaw["titans"];
          let titanHPNameMap = new Map();
          titans.forEach(
              x => {
                let lowestDamageNeededStrategy = neededParts.neededPartsForKill(x["total_hp"], x["parts"]);
                //console.log(lowestDamageNeededStrategy);
                x["bestStrategy"] = lowestDamageNeededStrategy;
                titanHPNameMap.set(x["enemy_name"], lowestDamageNeededStrategy[1]);
                this.raidTitans.push({ id: (x["enemy_id"] + "_" + x["total_hp"]), value: x });
              }
          )

          // try to get the raid buff
          try {
            let buff = raidDetailsRaw["area_buffs"];
            buff.forEach(
                x => {
                  let raidBuffType = x["bonus_type"];
                  let raidBuffAmount = x["bonus_amount"];
                  this.raidBuff = mapBuffDebuff.mapBuffType(raidBuffType, raidBuffAmount);
                  this.hasABuff = true;
                }
            )
          } catch (error) {
            this.hasABuff = false;
            this.raidBuff = "none";
          }

          // set the total HP and AP needed for all titans
          let totalHPNeeded = null;
          raidSequence.forEach(
              x => {
                totalHPNeeded += titanHPNameMap.get(x);
              }
          );
          this.totalHPNeededString = totalHPNeeded.toLocaleString("en");
          this.totalHPNeededNumber = totalHPNeeded;
          if (this.averageDamage !== null) {
            this.updateCyclesNeeded();
          }
        }
      })
    },
    updateCyclesNeeded: function () {
      // set cycles null if no average is given yet
      if (this.averageDamage === null) {
        this.cyclesNeeded = null;
      }
      if (this.clanMembers === null && this.averageDamage !== null) {
        this.cyclesNeeded = NaN;
      }

      // calculate cycles needed if average is given
      if (this.averageDamage !== null && this.totalHPNeededNumber !== null && this.clanMembers !== null && this.tierMsg !== null) {
        // set values to calculate
        let clanMembersNumber = this.clanMembers;
        let averageDamage = this.averageDamage;
        let totalHPNeeded = this.totalHPNeededNumber;
        let attacksPerCycleAndPerson = null;

        // set number of attacks a person can do per cycle according to Raid Tier
        if (this.tierMsg === 1) {
          attacksPerCycleAndPerson = 3;
        } else if (this.tierMsg === 2 || this.tierMsg === 3) {
          attacksPerCycleAndPerson = 4;
        } else if (this.tierMsg === 4) {
          attacksPerCycleAndPerson = 5;
        } else {
          attacksPerCycleAndPerson = NaN;
        }

        // cycles needed is the totalHP divided by the number of people in the clan times attacks times average damage per attack
        let attacksNeeded = totalHPNeeded/averageDamage;
        let cyclesNeededCalc = Math.ceil(attacksNeeded/(clanMembersNumber*attacksPerCycleAndPerson));
        this.cyclesNeeded = cyclesNeededCalc;

        // number of attacks made during last cycle until raid is over
        this.attacksInLastCycle = Math.ceil(attacksNeeded - ((cyclesNeededCalc-1)*clanMembersNumber*attacksPerCycleAndPerson));
      }
    }
  },
  watch: {
    raidDetails: function () {
      this.updateData();
    },
    averageDamage: function () {
      this.updateCyclesNeeded();
    },
    clanMembers: function () {
      this.updateCyclesNeeded();
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  padding: 1rem 0 1rem 0;
  margin: 0;
  border-bottom: 1px solid black;
}
ul {
  list-style-type: none;
  padding: 1rem 0 1rem 0;
  margin: 0;
  border-bottom: 1px solid black;
}
li {
  display: inline-block;
  margin: 0 10px;
  overflow-wrap: anywhere;
}
.raidCards {
  border: 2px solid black;
  border-radius: 1em;
  /*background-color: rgb(240, 240, 240);*/
}
.titanContainer {
  display: flex;
  justify-content: space-between;
}
#raid-card-placeholder {
  margin: 0;
  height: 1rem;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: green;
  text-align: center;
}

@media (max-width: 1199px) {
  .titanContainer {
    flex-direction: column;
    padding: 0;
  }
}
@media (min-width: 1200px) {
  .titanContainer {
    flex-direction: row;
    padding: 1rem calc(5vw / 6);
  }
  .raidCards-displayInformation {
    display: flex;
    justify-content: space-evenly;
    border-bottom: 1px solid black;
  }
  ul {
    border-bottom: 0;
  }
  #raidCard-raidSequence {
    order: 1;
  }
  #raidCard-raidBuff {
    order: 0;
  }
  #raidCard-raidHP {
    order: 2;
  }
}
</style>