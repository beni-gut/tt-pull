<template>
  <div class="home">
    <p>Simple File Reader Application to retrieve TT2 Raid Information</p>
    <br />
    <p>View one raid at a time at <router-link to="/raidCards">One Raid</router-link></p>
    <p>View multiple raids at a time at <router-link to="/raidsOverview">Overview Raids</router-link></p>
    <p>View general information about this application at <router-link to="/about">About</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style>
.home a {
  font-weight: bold;
  color: #26694e;
}
.home > p {
  font-size: 1.2rem;
}

</style>