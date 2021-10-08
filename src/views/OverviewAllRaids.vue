<template>
  <div class="home">
    <div>
      <p class="information">Show all raids between the selected "Start" and "End" values</p>
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

    <div v-if="isError">
      <p id="errorMessage">End {{ errorMessage }} must be lower than Start {{ errorMessage }}</p>
    </div>

    <!-- All raid cards -->
    <RaidCard :raid-details="this.raidDetailsForCard" />
  </div>
</template>

<script>
import RaidCard from "../components/RaidCard";
import json from "../json-files/raid_seed_20211010.json";

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
        {text: 1, value: '1'},
        {text: 2, value: '2'},
        {text: 3, value: '3'},
        {text: 4, value: '4'}
      ],
      optionsLevelStart: [],
      optionsLevelEnd: [],
      raidDetailsForCard: null,
      isError: false,
      errorMessage: null
    }
  },
  methods: {
    // get the possible raid levels for the selected raid tier in "start"
    getRaidLevelsStart: function () {
      //null values
      this.optionsLevelStart = [];
      this.raidDetailsForCard = null;

      // if tier is selected, get all possible levels for it
      if (this.tierMsgStart !== null) {
        json.forEach(
            x => {
              if (x["tier"] === this.tierMsgStart) {
                this.optionsLevelStart.push({text: x["level"], value: x["level"]});
              }
            }
        );
        this.levelSelectStartDisabled = false;
      }
    },
    // get the possible raid levels for the selected raid tier in "end"
    getRaidLevelsEnd: function () {
      //null values
      this.optionsLevelEnd = [];
      this.raidDetailsForCard = null;

      // if tier is selected, check if value is smaller or equal to "Start"
      if (this.tierMsgEnd !== null) {
        if (this.tierMsgStart !== null && this.tierMsgEnd >= this.tierMsgStart) {
          this.isError = false;
          this.errorMessage = null;
          // get all possible levels for selected tier it
          json.forEach(
              x => {
                if (x["tier"] === this.tierMsgEnd) {
                  this.optionsLevelEnd.push({text: x["level"], value: x["level"]});
                }
              }
          );
          this.levelSelectEndDisabled = false;
        } else {
          this.levelSelectEndDisabled = true;
          this.isError = true;
          this.errorMessage = "Tier";
        }
      }
    },
    // get the details of all raids between the selected start and end raid
    getRaidCardDetails: function () {
      if (this.tierMsgStart !== null && this.levelMsgStart !== null && this.tierMsgEnd !== null && this.levelMsgEnd !== null) {
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
  // watch the two tier and level selects for changes
  watch: {
    tierMsgStart: function () {
      this.getRaidLevelsStart();
    },
    tierMsgEnd: function () {
      this.getRaidLevelsEnd();
    },
    levelMsgStart: function () {
      this.getRaidCardDetails();
    },
    levelMsgEnd: function () {
      this.getRaidCardDetails();
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