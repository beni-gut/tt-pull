<template>
  <div class="home">

    <div id="raid-start-end-select-container">
      <div class="raid-select-container">
        <h1>Start</h1>
        <div id="v-model-tier-select-start" class="raidSelect">
          <span>Tier: </span>
          <select v-model="this.tierMsgStart" @change="this.levelMsgStart=null">
            <option v-for="option in optionsTier" :value="option.value" :key="option">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div id="v-model-level-select" class="raidSelect">
          <span>Level: </span>
          <select v-model="this.levelMsgStart" :disabled=this.levelSelectStartDisabled >
            <option v-for="option in optionsLevelStart" :value="option.value" :key="option">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <div class="raid-select-container">
        <h1>End</h1>
        <div id="v-model-tier-select-end" class="raidSelect">
          <span>Tier: </span>
          <select v-model="this.tierMsgEnd" @change="this.levelMsgEnd=null">
            <option v-for="option in optionsTier" :value="option.value" :key="option">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div id="v-model-level-select" class="raidSelect">
          <span>Level: </span>
          <select v-model="this.levelMsgEnd" :disabled=this.levelSelectEndDisabled >
            <option v-for="option in optionsLevelEnd" :value="option.value" :key="option">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <RaidCard :raid-details="this.raidDetailsForCard" />
  </div>
</template>

<script>
import RaidCard from "../components/RaidCard";
import json from "../json-files/raid_seed_20210919.json";

export default {
  name: 'Home',
  components: {
    RaidCard
  },
  data() {
    return {
      tierMsgStart: null,
      levelMsgStart: null,
      tierMsgEnd: null,
      levelMsgEnd: null,
      raidBuffType: null,
      raidBuffAmount: null,
      levelSelectStartDisabled: true,
      levelSelectEndDisabled: true,
      optionsTier: [
        {text: 1, value: '1'},
        {text: 2, value: '2'},
        {text: 3, value: '3'},
        {text: 4, value: '4'}
      ],
      optionsLevelStart: [],
      optionsLevelEnd: [],
      raidDetailsForCard: null
    }
  },
  methods: {
    // get the possible raid levels for the selected raid tier in "start"
    getRaidLevelsStart: function () {
      //null values
      this.optionsLevelStart = [];
      this.raidDetailsForCard = null;

      // if tier is selected, get all possible levels for it
      if (this.tierMsgIn !== null) {
        json.forEach(
            x => {
              if (x["tier"] === this.tierMsgIn) {
                this.optionsLevel.push({text: x["level"], value: x["level"]});
              }
            }
        );
        this.levelSelectDisabled = false;
      }
    },
    // get the possible raid levels for the selected raid tier in "start"
    getRaidLevelsEnd: function () {
      //null values
      this.optionsLevelEnd = [];
      this.raidDetailsForCard = null;

      // if tier is selected, get all possible levels for it
      if (this.tierMsgIn !== null) {
        json.forEach(
            x => {
              if (x["tier"] === this.tierMsgIn) {
                this.optionsLevel.push({text: x["level"], value: x["level"]});
              }
            }
        );
        this.levelSelectDisabled = false;
      }
    },
    // get the details of the selected raid
    getRaidCardDetails: function () {
      if (this.tierMsgIn !== null && this.levelMsgIn !== null) {
        json.forEach(
            x => {
              if (x["tier"] === this.tierMsgIn && x["level"] === this.levelMsgIn) {
                this.raidDetailsForCard = x;
              }
            }
        );
      }
    }
  },
  // watch the two selects for changes
  watch: {
    tierMsgIn: function () {
      this.getRaidLevels();
    },
    levelMsgIn: function () {
      this.getRaidCardDetails();
    }
  }
}

</script>

<style>
/* containers for selects at top of page */
#raid-start-end-select-container {
  display: flex;
  justify-content: space-around;
}
.raid-select-container {
  display: flex;
  justify-content: center;
}

/* select container */
.raidSelect {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
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

</style>