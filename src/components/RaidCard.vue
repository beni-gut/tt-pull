<template>
  <div class="raidCards">
    <h1>Raid: {{ tierMsg }}-{{ levelMsg }}</h1>
    <ul>
      <li><b>Buff:</b></li>
      <li>{{ raidBuffType }} {{ raidBuffAmount }}</li>
    </ul>
    <ul>
      <li><b>Base HP:</b></li>
      <li>{{ raidBaseHealthPoints }}</li>
    </ul>
    <ul>
      <li><b>Sequence:</b></li>
      <li>{{ raidSequence }}</li>
    </ul>
    <div>
      <TitanCard v-for="titan in raidTitans" :raidTitan="titan.value" :key="titan.id" />
    </div>
  </div>
</template>

<script>
import json from "../json-files/raid_seed_20210919.json";
import TitanCard from "./TitanCard";

export default {
  name: 'RaidCard',
  components: {TitanCard},
  props: {
    tierMsg: String,
    levelMsg: String
  },
  data() {
    return {
      raidBuffType: null,
      raidBuffAmount: null,
      raidSequence: null,
      raidBaseHealthPoints: null,
      raidTitans: []
    }
  },
  methods: {
    updateData: function () {
      this.$nextTick(function () {
        console.log(this.levelMsg)
        if (this.levelMsg === null) {
          this.raidBuffType = null;
          this.raidBuffAmount = null;
          this.raidSequence = null;
          this.raidTitans = [];
        }
        if (this.tierMsg !== null && this.levelMsg !== null) {
          this.raidTitans = [];
          json.forEach(
              x => {
                if (x.tier === this.tierMsg && x.level === this.levelMsg) {
                  // retrieve the raid-sequence and save it as String
                  let sequence = x["spawn_sequence"];
                  this.raidSequence = sequence.toString().replaceAll(",", ", ");

                  // retrieve "Titans" Array and push it to raidTitans
                  let titans = x["titans"];
                  this.raidBaseHealthPoints = titans[0]["total_hp"].toLocaleString();
                  titans.forEach(
                      x => {
                        this.raidTitans.push({ id: x["enemy_id"], value: x });
                      }
                  )

                  try {
                    let buff = x["area_buffs"];
                    buff.forEach(
                        x => {
                          this.raidBuffType = x["bonus_type"] + ", ";
                          this.raidBuffAmount = x["bonus_amount"];
                          console.log(this.raidBuffType, this.raidBuffAmount)
                        }
                    )
                  } catch (error) {
                    this.raidBuffType = "none";
                    this.raidBuffAmount = null;
                  }
                }
              }
          );
        }
      })
    }
  },
  computed: {
    combined() {
      let a = false;
      if (this.levelMsg !== null) {
        a= true;
      }
      return a;
    }
  },
  watch: {
    levelMsg: function (newVal, oldVal) {
      console.log("prop changed. ", newVal, " | was: ", oldVal)
      this.updateData();
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  padding: 0 0 1rem 0;
  border-bottom: 1px solid black;
}
ul {
  list-style-type: none;
  padding: 0 0 1rem 0;
  border-bottom: 1px solid black;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.raidCards {
  border: 2px solid black;
  border-radius: 1em;
  /*background-color: rgb(240, 240, 240);*/
}
</style>