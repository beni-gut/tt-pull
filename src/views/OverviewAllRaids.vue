<template>
  <div class="home">
    <div>
      <p class="information">Shows all raids between the selected "Start" and "End" values</p>
    </div>

    <!-- Start value select -->
    <div id="raid-start-end-select-container">
      <div class="raid-select-container">
        <p class="select-title">Start</p>
        <div class="raidSelect">
          <span>Tier: </span>
          <select v-model="this.tierMsgStart" @change="this.levelMsgStart=null">
            <option v-for="option in optionsTier" :value="option.value" :key="option">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="raidSelect">
          <span>Level: </span>
          <select v-model="this.levelMsgStart" :disabled=this.levelSelectStartDisabled >
            <option v-for="option in optionsLevelStart" :value="option.value" :key="option">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <div id="select-separator"></div>

      <!-- End value select -->
      <div id="raid-select-end" class="raid-select-container">
        <p class="select-title">End</p>
        <div class="raidSelect">
          <span>Tier: </span>
          <select v-model="this.tierMsgEnd" @change="this.levelMsgEnd=null">
            <option v-for="option in optionsTier" :value="option.value" :key="option">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="raidSelect">
          <span>Level: </span>
          <select v-model="this.levelMsgEnd" :disabled=this.levelSelectEndDisabled >
            <option v-for="option in optionsLevelEnd" :value="option.value" :key="option">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Error message if start tier or level is lower than end -->
    <div v-if="isError">
      <p id="errorMessage">End {{ errorMessage }} must be higher or equal to Start {{ errorMessage }}</p>
    </div>

    <!-- Set damage and members for cycle calcs -->
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

    <!-- All raid cards -->
    <RaidCard v-for="cardDetails in raidDetailsForCard" :raidDetails="cardDetails.value" :averageDamage="this.outputAverageDamage" :clanMembers="this.clanMembersOutput" :key="cardDetails.id" />
  </div>
</template>

<script>
import RaidCard from "../components/RaidCard";
import json from "../json-files/raid_seed.json";

export default {
  name: 'Select number of Raids',
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
        {text: '1', value: 1},
        {text: '2', value: 2},
        {text: '3', value: 3},
        {text: '4', value: 4}
      ],
      // level options for start raid and end raid
      optionsLevelStart: [],
      optionsLevelEnd: [],
      // details for creating raid cards
      raidDetailsForCard: [],
      // error message for start raid higher than end raid
      isError: false,
      errorMessage: null,
      // for calculating average damage
      inputAverageDamage: null,
      outputAverageDamage: null,
      clanMembersInput: 50,
      clanMembersOutput: 50,
      clanMemberError: false
    }
  },
  methods: {
    /**
     * get the possible raid levels for the selected raid tier in "start"
     * returns nothing
     * set error message, depending on what {@link checkRaidTier} returns
     * set possible raid levels for the start by evoking {@link getLevelForTier}
     * dis-/enable select for level in "start"
     */
    getRaidLevelsStart: function () {
      //null values
      this.optionsLevelStart = [];
      this.raidDetailsForCard = [];

      // if tier is selected, check that start tier is lower than end tier
      if (this.checkRaidTier()) {
        // get all possible levels for selected tier it
        this.optionsLevelStart = this.getLevelForTier(this.tierMsgStart);

        // enable the level select and delete possible errors
        this.isError = false;
        this.errorMessage = null;
        this.levelSelectStartDisabled = false;
      } else {
        // disable the level select and set errors
        this.levelSelectStartDisabled = true;
        this.isError = true;
        this.errorMessage = "Tier";
      }
    },
    /**
     * get the possible raid levels for the selected raid tier in "end"
     * returns  nothing
     * set error message, depending on what {@link checkRaidTier} returns
     * set possible raid levels for the start by evoking {@link getLevelForTier}
     * dis-/enable select for level in "end"
     */
    getRaidLevelsEnd: function () {
      //null values
      this.optionsLevelEnd = [];
      this.raidDetailsForCard = [];

      // if tier is selected, check if value is smaller or equal to "Start"
      if (this.checkRaidTier()) {
        // get all possible levels for selected tier it
        this.optionsLevelEnd = this.getLevelForTier(this.tierMsgEnd);

        // enable the level select and delete possible errors
        this.isError = false;
        this.errorMessage = null;
        this.levelSelectEndDisabled = false;
      } else {
        // disable the level select and set errors
        this.levelSelectEndDisabled = true;
        this.isError = true;
        this.errorMessage = "Tier";
      }
    },
    /**
     * comparing tiers, if start is smaller than end
     * @returns {boolean} which decides if an error message is shown or not in {@link getRaidLevelsStart} and {@link getRaidLevelsEnd}
     */
    checkRaidTier: function () {
      // if both tiers selected, check if start is smaller or equal to end, if so return true (displays no error)
      if (this.tierMsgStart !== null && this.tierMsgEnd !== null && this.tierMsgStart <= this.tierMsgEnd) {
        return true;
      }
      // if both tiers selected, check if start tier is bigger than end tier, if so return false (displays error message for Tier)
      else if (this.tierMsgStart !== null && this.tierMsgEnd !== null && this.tierMsgStart > this.tierMsgEnd) {
        return false;
      }
      // if only one tier selected, return true (displays no error)
      else if (this.tierMsgStart === null || this.tierMsgEnd === null) {
        return true;
      }
    },
    /**
     * handles changes to raid level, checking if starting raid is lower than end
     * returns nothing
     * set error message, depending on what {@link checkRaidLevel} returns
     * set details for all raid cards by evoking {@link getRaidCardDetails}
     */
    raidLevelHandling: function () {
      // check if start raid is lower than end raid
      if (this.checkRaidLevel()) {
        // if all previous conditions met, delete possible errors and get all raid cards
        this.isError = false;
        this.errorMessage = null;
        this.getRaidCardDetails();
      } else {
        // if start > end, set errors
        this.isError = true;
        this.errorMessage = "Level";
      }
    },
    /**
     * comparing levels, if start is smaller than end
     * @returns {boolean} which decides if an error message is shown or not in {@link raidLevelHandling}
     */
    checkRaidLevel: function () {
      // if both tiers are the same, check if start level is smaller or equal to end level, if so return true (displays no error)
      if (this.tierMsgStart === this.tierMsgEnd && this.levelMsgStart !== null && this.levelMsgEnd !== null && this.levelMsgStart <= this.levelMsgEnd) {
        return true;
      }
      // if both tiers are the same, check if start level is bigger than end level, if so return false (displays error message for Level)
      else if (this.tierMsgStart === this.tierMsgEnd && this.levelMsgStart !== null && this.levelMsgEnd !== null && this.levelMsgStart > this.levelMsgEnd) {
        return false;
      }
      // if start tier lower than end tier, and both levels selected, return true (displays no error)
      else if (this.tierMsgStart < this.tierMsgEnd && this.levelMsgStart !== null && this.levelMsgEnd !== null) {
        return true;
      }
      // if only one level selected, return true (displays no error)
      else if (this.levelMsgStart === null || this.levelMsgEnd === null) {
        return true;
      }
    },
    /**
     * get all levels for the selected tier
     * evoked by {@link getRaidLevelsStart} and {@link getRaidLevelsEnd}
     * @param tierMsg {Number} of the tier, from which the raid levels should be retrieved
     * @returns {Array} containing all the level options
     */
    getLevelForTier: function (tierMsg) {
      let optionsArray = [];
      json.forEach(
          x => {
            if (tierMsg === Number(x["tier"])) {
              optionsArray.push({text: x["level"], value: Number(x["level"])});
            }
          }
      );
      return optionsArray;
    },
    /**
     * get the details of all raids between the selected start and end raid
     * evoked by {@link raidLevelHandling} if start and end raid have no errors
     */
    getRaidCardDetails: function () {
      this.raidDetailsForCard = [];

      if (this.tierMsgStart !== null && this.tierMsgEnd !== null && this.levelMsgStart !== null && this.levelMsgEnd !== null && this.isError === false) {
        let requestedRaids = this.getAllRaidsBetween();
        requestedRaids.forEach(
            x => {
              json.forEach(
                  y => {
                    if (x["tier"] === Number(y["tier"]) && x["level"] === Number(y["level"])) {
                      this.raidDetailsForCard.push({id: (y["tier"] + "-" + y["level"]), value: y});
                    }
                  }
              );
            }
        );
      }
    },
    getAllRaidsBetween: function () {
      // if same raid tier is used, use numbers from select
      if (this.tierMsgStart === this.tierMsgEnd) {
        let allLevelsSameTier = [];
        this.optionsLevelStart.forEach(
            x => {
              if (this.levelMsgStart <= x["value"] && x["value"] <= this.levelMsgEnd) {
                allLevelsSameTier.push({tier: this.tierMsgStart, level: x["value"]})
              }
            }
        );
        return allLevelsSameTier;
      }
      // if both tiers are "next to each other" (i.e. 3 and 4) all levels of these will be loaded already, use the numbers from both selects
      else if (this.tierMsgStart + 1 === this.tierMsgEnd) {
        let bothTiersLoaded = [];
        this.optionsLevelStart.forEach(
            x => {
              if (this.levelMsgStart <= x["value"]) {
                bothTiersLoaded.push({tier: this.tierMsgStart, level: x["value"]});
              }
            }
        );
        this.optionsLevelEnd.forEach(
            x => {
              if (x["value"] <= this.levelMsgEnd) {
                bothTiersLoaded.push({tier: this.tierMsgEnd, level: x["value"]});
              }
            }
        );
        return bothTiersLoaded;
      }
      // if tier 1 and 3 or 2 and 4 are selected, do this
      else if (this.tierMsgStart + 2 === this.tierMsgEnd) {
        let threeTierLevels = [];
        let middleTier = (this.tierMsgStart+1);
        let middleTierLevels = this.getLevelForTier(middleTier);

        this.optionsLevelStart.forEach(
            x => {
              if (this.levelMsgStart <= x["value"]) {
                threeTierLevels.push({tier: this.tierMsgStart, level: x["value"]});
              }
            }
        );
        middleTierLevels.forEach(
            x => {
              threeTierLevels.push({tier: middleTier, level: x["value"]})
            }
        );
        this.optionsLevelEnd.forEach(
            x => {
              if (x["value"] <= this.levelMsgEnd) {
                threeTierLevels.push({tier: this.tierMsgEnd, level: x["value"]});
              }
            }
        );
        return threeTierLevels;
      }
      // if tier 1 is start and tier 4 end, do this
      else {
        let allTierLevels = [];
        let firstMiddleTier = (this.tierMsgStart+1);
        let secondMiddleTier = (this.tierMsgStart+2);
        let firstMiddleTierLevels = this.getLevelForTier(firstMiddleTier);
        let secondMiddleTierLevels = this.getLevelForTier(secondMiddleTier);

        this.optionsLevelStart.forEach(
            x => {
              if (this.levelMsgStart <= x["value"]) {
                allTierLevels.push({tier: this.tierMsgStart, level: x["value"]});
              }
            }
        );
        firstMiddleTierLevels.forEach(
            x => {
              allTierLevels.push({tier: firstMiddleTier, level: x["value"]})
            }
        );
        secondMiddleTierLevels.forEach(
            x => {
              allTierLevels.push({tier: secondMiddleTier, level: x["value"]})
            }
        );
        this.optionsLevelEnd.forEach(
            x => {
              if (x["value"] <= this.levelMsgEnd) {
                allTierLevels.push({tier: this.tierMsgEnd, level: x["value"]});
              }
            }
        );
        return allTierLevels;
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
  /**
   * watch all inputs for changes, namely the two tier and level selects
   */
  watch: {
    tierMsgStart: function () {
      this.getRaidLevelsStart();
    },
    tierMsgEnd: function () {
      this.getRaidLevelsEnd();
    },
    levelMsgStart: function () {
      this.raidLevelHandling();
    },
    levelMsgEnd: function () {
      this.raidLevelHandling();
    },
    inputAverageDamage: function () {
      this.setAverageDamageRaidCard();
    }
  }
}

</script>

<style>
.information {
  font-size: 1.5rem;
}
#raid-select-end > h1 {
  margin: 0;
}
#errorMessage {
  color: red;
  width: 100%;
}

/* containers for selects at top of page */
#raid-start-end-select-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
#select-separator {
  padding: 1.25rem 0 1.25rem 2rem;
  margin: .5rem 2rem 2rem 0;
  border-right: 3px solid black;
}
.raid-select-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

/* select container */
.select-title {
  font-size: 2rem;
  font-weight: bold;
  padding: 1.25rem 2rem;
  margin: 1rem 0 2.5rem 0;
}
.raidSelect {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 1.25rem 2rem;
  margin: 1rem 0 2.5rem 0;
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

@media (max-width: 898px) {
  .select-title, .raidSelect, .information {
    margin: .5rem 0 1rem 0;
    font-size: 1rem;
  }
  .raid-select-container {
    width: 100%;
  }
  .select-title, .raidSelect {
    padding: .25rem 1rem;
  }
  .raidSelect {
    padding: 1.25rem .1rem;
  }
  #select-separator {
    width: 60%;
    padding: 0 0 1rem 0;
    margin: 1rem 1rem 0 1rem;
    border-top: 2px solid black;
    border-right: 0;
  }
}
@media (max-width: 556px) {
  .select-title, .raidSelect, .information {
    font-size: 1rem;
    margin: 0;
  }
  #raid-start-end-select-container {
    margin: 1rem 0;
  }
  .raidSelect {
    padding: 1.25rem .1rem;
  }
  #select-separator {
    width: 100%;
    padding: 0 0 1rem 0;
    margin: 1rem 1rem 0 1rem;
    border-top: 2px solid black;
    border-right: 0;
  }
}

</style>