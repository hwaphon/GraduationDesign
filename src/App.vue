<template>
  <div id="app">
    <DHeader></DHeader>
    <router-view/>
  </div>
</template>

<script>
  import DHeader from './components/components/header/DHeader.vue'
  export default {
    name: 'app',
    components: {
      DHeader
    }
  }
</script>

<style>
</style>
