<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/raidCards">One Raid</router-link> |
    <router-link to="/raidsOverview">Overview Raids</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <div class="base-container">
    <router-view/>
  </div>
  <footer>
    <b>Current datetime:</b> {{ dateNow }}
  </footer>
</template>
<script>
export default {
  data() {
    return {
      dateNow: null
    }
  },
  created() {
    setInterval(this.getNow, 500)
  },
  methods: {
    getNow: function () {
      let now = new Date();
      this.dateNow = now;
    }
  },
  beforeMount() {
    this.getNow();
  }
}
</script>
<style>
.base-container {
  min-height: 75vh;
}
footer {
  position: sticky;
  padding: 1.65rem 0 1.65rem 0;
  margin-top: 2rem;
  border-top: 1px solid #eeeeee;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  padding: 1.5em;
  margin: 0;
  font-size: 1.1rem;
  background-color: #fff;
  border-bottom: 1px solid #eeeeee;
}
#nav a {
  font-weight: bold;
  color: #26694e;
  /*color: #2c3e50;*/
}
#nav a.router-link-exact-active {
  color: #42b983;
}

@media (max-width: 1199px) {
  #nav {
    padding: 1em;
  }
}
@media (min-width: 1400px) {
  .base-container {
    width: 90%;
    margin: 0 5% 0 5%;
  }
}

</style>
