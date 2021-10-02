<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/raidCards">One Raid</router-link> |
    <router-link to="/raidsOverview">Overview Raids</router-link>
  </div>
  <router-view/>
</template>

<style>
/*
body {
  background-color: lightgray;
}
*/

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 2em 1em;
  margin: 0;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}

@media (max-width: 1199px) {
  #nav {
    padding: 1em;
  }
}

</style>
