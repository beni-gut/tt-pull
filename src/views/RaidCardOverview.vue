<template>
  <div class="home">
    <div id="raid-select">
      <div id="v-model-tier-select" class="raidSelect">
        <span>Tier: </span>
        <select v-model="this.tierMsgIn" @change="this.levelMsgIn=null">
          <option v-for="option in optionsTier" :value="option.value" :key="option">
            {{ option.text }}
          </option>
        </select>
      </div>
      <div id="v-model-level-select" class="raidSelect">
        <span>Level: </span>
        <select v-model="this.levelMsgIn" :disabled=this.levelSelectDisabled >
          <option v-for="option in optionsLevel" :value="option.value" :key="option">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>

    <RaidCard :tierMsg=this.tierMsgIn :levelMsg=this.levelMsgIn />
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
      tierMsgIn: null,
      levelMsgIn: null,
      raidBuffType: null,
      raidBuffAmount: null,
      levelSelectDisabled: true,
      optionsTier: [
        {text: 1, value: '1'},
        {text: 2, value: '2'},
        {text: 3, value: '3'},
        {text: 4, value: '4'}
      ],
      optionsLevel: []
    }
  },
  methods: {
    getRaidLevels() {
      this.optionsLevel = [];
      if (this.tierMsgIn !== null) {
        json.forEach(
            x => {
              if (x.tier === this.tierMsgIn) {
                this.optionsLevel.push({text: x["level"], value: x["level"]});
              }
            }
        );
        //console.log(this.optionsLevel);
        this.levelSelectDisabled = false;
      }
    }
  },
  beforeUpdate: function () {
    this.getRaidLevels()
  }
}

</script>

<style>
#raid-select {
  display: flex;
  justify-content: center;
}
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

select {
  font-size: 1.5rem;
}

select > option {
  width: 2em;
  font-size: 1.5rem;
}

</style>