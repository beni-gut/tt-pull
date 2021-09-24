<template>
  <div class="titanCard">
    <h2 class="titanCard-titanName"><b>Titan:</b> {{ titanName }}</h2>
    <p><b>Debuff:</b> {{ titanDebuffType }}</p>
    <p v-if="hasCurses"><b>Cursed Parts:</b> {{ cursedParts }}</p>
  </div>
</template>

<script>
export default {
  name: 'TitanCard',
  props: {
    raidTitan: Object
  },
  data() {
    return {
      hasCurses: false,
      cursedParts: "",
      titanName: null,
      titanDebuffType: null
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

          // Get the debuff for the titan
          let debuff;
          try {
            debuff = titanData["area_debuffs"][0]["bonus_type"];
          } catch (e) {
            debuff = "none";
          }
          this.titanDebuffType = debuff;

          // check for cursed parts
          let parts = titanData["parts"];
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
            this.mapParts(cursedPartsRaw);
          }
        }
      })
    },
    mapParts: function (cursedPartsRaw) {
      for (let i = 0; i < cursedPartsRaw.length; i++) {
        // normal switch-case to identify and push respective cursed parts to String
        switch (cursedPartsRaw[i]) {
          case "ArmorHead":
            this.cursedParts += "Head";
            break;
          case "ArmorChestUpper":
            this.cursedParts += "Torso";
            break;
          case "ArmorArmUpperRight":
            this.cursedParts += "Left Shoulder";
            break;
          case "ArmorArmUpperLeft":
            this.cursedParts += "Right Shoulder";
            break;
          case "ArmorHandRight":
            this.cursedParts += "Left Hand";
            break;
          case "ArmorHandLeft":
            this.cursedParts += "Right Hand";
            break;
          case "ArmorLegUpperRight":
            this.cursedParts += "Left Leg";
            break;
          case "ArmorLegUpperLeft":
            this.cursedParts += "Right Leg";
            break;
        }

        // adds a comma if it's not the last part
        if ((i+1) < cursedPartsRaw.length) {
          this.cursedParts += ", ";
        }
      }
      this.hasCurses = true;
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

/* on small screens */
@media (max-width: 1199px) {
  .titanCard {
    border-bottom: 1px solid black;
    padding: 0;
  }
}
/* on big screens */
@media (min-width: 1200px) {
  .titanCard {
    border: 1px solid blue;
    border-radius: 1em;
    width: calc(95vw / 3);
  }
}

</style>
