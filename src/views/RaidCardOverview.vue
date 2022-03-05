<template>
  <div class="home">
    <div class="raid-select-container">
      <div class="one-raid-select">
        <span>Tier: </span>
        <select v-model="this.tierMsg" @change="this.levelMsg=null">
          <option v-for="option in optionsTier" :value="option.value" :key="option">
            {{ option.text }}
          </option>
        </select>
      </div>
      <div class="one-raid-select">
        <span>Level: </span>
        <select v-model="this.levelMsg" :disabled=this.levelSelectDisabled >
          <option v-for="option in optionsLevel" :value="option.value" :key="option">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="raid-select-container">
      <div class="one-raid-select">
        <span>Average Damage per Attack: </span>
        <input type="number" min="0" placeholder="12000000" v-model="this.inputAverageDamage" />
      </div>
      <div class="one-raid-select">
        <span>Clan Members: </span>
        <input type="number" min="1" max="50" placeholder="50" v-model="this.clanMembersInput" @input="this.checkClanMembers()" @touchend="this.checkClanMembers()" />
        <span v-if="this.clanMemberError" class="error-message"> Number of Clan Members must be between 1 and 50</span>
      </div>
    </div>

    <RaidCard :raid-details="this.raidDetailsForCard" :average-damage="this.outputAverageDamage" :clan-members="this.clanMembersOutput" />
  </div>
</template>

<script>
import RaidCard from "../components/RaidCard";
import json from "../json-files/raid_seed.json";

export default {
  name: 'Select and Overview one Raid',
  components: {
    RaidCard
  },
  data() {
    return {
      tierMsg: null,
      levelMsg: null,
      raidBuffType: null,
      raidBuffAmount: null,
      levelSelectDisabled: true,
      optionsTier: [
        {text: 1, value: '1'},
        {text: 2, value: '2'},
        {text: 3, value: '3'},
        {text: 4, value: '4'}
      ],
      optionsLevel: [],
      raidDetailsForCard: null,
      inputAverageDamage: null,
      outputAverageDamage: null,
      clanMembersInput: 50,
      clanMembersOutput: 50,
      clanMemberError: false
    }
  },
  methods: {
    // get the possible raid levels for the selected raid tier
    getRaidLevels: function () {
      //null values
      this.optionsLevel = [];
      this.raidDetailsForCard = null;

      // if tier is selected, get all possible levels for it
      if (this.tierMsg !== null) {
        json.forEach(
            x => {
              if (x["tier"] === this.tierMsg) {
                this.optionsLevel.push({text: x["level"], value: x["level"]});
              }
            }
        );
        this.levelSelectDisabled = false;
      }
    },
    // get the details of the selected raid
    getRaidCardDetails: function () {
      if (this.tierMsg !== null && this.levelMsg !== null) {
        json.forEach(
            x => {
              if (x["tier"] === this.tierMsg && x["level"] === this.levelMsg) {
                this.raidDetailsForCard = x;
              }
            }
        );
      }
    },
    // avg-dmg input turns to "string" if empty, check and set average damage output to raidCard null if true
    setAverageDamageRaidCard: function () {
      if (typeof this.inputAverageDamage === "string") {
        this.outputAverageDamage = null;
      } else {
        this.outputAverageDamage = this.inputAverageDamage;
      }
    },
    checkClanMembers: function () {
      if (typeof this.clanMembersInput === "string") {
        this.clanMembersOutput = null;
        this.clanMemberError = true;
      } else {
        this.clanMemberError = false;
        this.clanMembersOutput = this.clanMembersInput;
      }
    }
  },
  // watch the two selects and the input for changes
  watch: {
    tierMsg: function () {
      this.getRaidLevels();
    },
    levelMsg: function () {
      this.getRaidCardDetails();
    },
    inputAverageDamage: function () {
      this.setAverageDamageRaidCard();
    }
  }
}

</script>

<style>
/* containers of selects at top of page */
.raid-select-container {
  display: flex;
  justify-content: center;
}
.error-message {
  color: red;
}

/* select container */
.one-raid-select {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 1.25rem 2rem;
  margin: 1rem 0 1.5rem 0;
  user-select: none;
  overflow-x: auto;
}

/* set size for select */
select {
  font-size: 1.5rem;
}
select > option {
  width: 2em;
  font-size: 1.5rem;
}
input {
  font-size: 1.5rem;
}

@media (max-width: 556px) {
  .one-raid-select {
    margin: .1rem 0 1rem 0;
  }
  .one-raid-select:nth-last-of-type(1) > * {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    vertical-align: middle;
  }
}
@media (min-width: 1200px) {
  .one-raid-select {
    margin: 1rem 0 2.5rem 0;
  }
}

</style>