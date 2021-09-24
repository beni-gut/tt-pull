<template>
  <div class="raidCards">
    <h1>Raid: {{ tierMsg }}-{{ levelMsg }}</h1>
    <div class="raidCards-displayInformation">
      <ul v-if="hasABuff" id="raidCard-raidBuff">
        <li><b>Buff:</b></li>
        <li>{{ raidBuffType }} {{ raidBuffAmount }}</li>
      </ul>
      <ul id="raidCard-raidHP">
        <li><b>Base HP:</b></li>
        <li>{{ raidBaseHealthPoints }}</li>
      </ul>
      <ul id="raidCard-raidSequence">
        <li><b>Sequence:</b></li>
        <li>{{ raidSequence }}</li>
      </ul>
    </div>
    <div class="titanContainer">
      <TitanCard v-for="titan in raidTitans" :raidTitan="titan.value" :key="titan.id" />
    </div>
  </div>
</template>

<script>
import TitanCard from "./TitanCard";

export default {
  name: 'RaidCard',
  components: {TitanCard},
  props: {
    raidDetails: Object
  },
  data() {
    return {
      tierMsg: null,
      levelMsg: null,
      hasABuff: false,
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

        // set all values null when info changes
        if (this.raidDetails === null) {
          this.tierMsg = null;
          this.levelMsg = null;
          this.hasABuff = false;
          this.raidBuffType = null;
          this.raidBuffAmount = null;
          this.raidSequence = null;
          this.raidBaseHealthPoints = null;
          this.raidTitans = [];
        }

        // if values present, get values
        if (this.raidDetails !== null) {
          this.raidTitans = [];
          let raidDetailsRaw = this.raidDetails;

          // set tier and level
          this.tierMsg = raidDetailsRaw["tier"];
          this.levelMsg = raidDetailsRaw["level"];

          // set titan sequence
          this.raidSequence = raidDetailsRaw["spawn_sequence"].toString().replaceAll(",", ", ");

          // get titans and their respective details
          let titans = raidDetailsRaw["titans"];
          this.raidBaseHealthPoints = titans[0]["total_hp"].toLocaleString();
          titans.forEach(
              x => {
                this.raidTitans.push({ id: x["enemy_id"], value: x });
              }
          )

          // try to get the raid buff
          try {
            let buff = raidDetailsRaw["area_buffs"];
            buff.forEach(
                x => {
                  this.raidBuffType = x["bonus_type"] + ", ";
                  this.raidBuffAmount = x["bonus_amount"];
                  this.hasABuff = true;
                }
            )
          } catch (error) {
            this.hasABuff = false;
            this.raidBuffType = "none";
            this.raidBuffAmount = null;
          }
        }
      })
    }
  },
  watch: {
    raidDetails: function () {
      this.updateData();
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