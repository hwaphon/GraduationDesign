<template>
  <div id="app">
    <DHeader></DHeader>
    <div class="main-content">
      <router-view/>
    </div>
    <DFooter></DFooter>
  </div>
</template>

<script>
  import Request from '@/network/networkHelper'
  import API from '@/const/dataApi'
  import DHeader from './components/components/header/DHeader.vue'
  import DFooter from './components/components/footer/DFooter.vue'
  export default {
    name: 'app',
    components: {
      DHeader,
      DFooter
    }
  }
</script>

<style scoped>
  #app {
    display: flex;
    flex-flow: column;
    min-height: 100%;
    min-width: 1210px;
  }
  .main-content {
    flex: 1 1 0px;
  }
</style>
