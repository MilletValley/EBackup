<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
.icon {
  width: 1.5em;
  height: 1.5em;
  /* vertical-align: -0.15em; */
  margin-right: 5px;
  fill: rgb(208, 208, 208);
  overflow: hidden;
}
</style>
