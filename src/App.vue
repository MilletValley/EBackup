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
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
.icon {
  width: 1.3em;
  height: 1.3em;
  vertical-align: -0.45em;
  margin-right: 5px;
  fill: rgb(208, 208, 208);
  overflow: hidden;
}
/* 详情页面头部CSS */
.detail-header {
  background-color: #ffffff;
  margin: -20px -20px 0 -20px;
  padding: 10px 10px 50px 10px;
}
.detail-header .icon {
  position: relative;
  top: 17px;
  right: 0;
  font-size: 1.7em;
}
.detail-header .content {
  margin-left: 20px;
}
.action {
  text-align: right;
}
.item-info .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 40%;
}
</style>
