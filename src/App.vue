<template>
  <div id="app">
    <HabitList />
  </div>
</template>

<script>
import HabitList from './components/HabitList.vue'

export default {
  name: 'App',
  components: {
    HabitList
  }
}
</script>

<style>
#app {
  padding: 20px;
}
</style>
