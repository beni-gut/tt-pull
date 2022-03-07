<template>
  <div>
    <p>current date: {{ dateNow }}</p>
  </div>
</template>

<script>
export default {
  name: 'InfoPage',
  data() {
    return {
      dateNow: null
    }
  },
  methods: {
    getDate: function () {
      this.dateNow = new Date();
    }
  },
  beforeMount() {
    this.getDate();
  }
}
</script>
