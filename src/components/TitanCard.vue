<template>
  <div class="hello">
    <h1><b>Titan:</b> {{ titanName }}</h1>
    <p><b>Debuff:</b> {{ titanDebuffType }}</p>
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
      curses: false,
      titanName: null,
      titanDebuffType: null
    }
  },
  methods: {
    displayTitan: function () {
      this.$nextTick(function () {
        if (this.raidTitan !== null) {
          let titanData = this.raidTitan;
          this.titanName = titanData["enemy_name"];
          let debuff = titanData["area_debuffs"][0]["bonus_type"];
          console.log(debuff);
          this.titanDebuffType = debuff;
        }
      })
    }
  },
  mounted() {
    //console.log(this.raidTitan);
    this.displayTitan();
  },
  computed: {
    combined() {
      return this.raidTitan;
    }
  },
  watch: {
    raidTitan: function (oldVal, newVal) {
      console.log("prop changed. ", newVal["enemy_id"], " | was: ", oldVal["enemy_id"])
      this.displayTitan();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>