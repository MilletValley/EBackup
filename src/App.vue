<template>
  <div id="app" v-cloak>
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
[v-cloak] {
  display: none;
}
.icon {
  width: 1.3em;
  height: 1.3em;
  /* vertical-align: -0.45em; */
  /* margin-right: 5px; */
  fill: rgb(208, 208, 208);
  overflow: hidden;
}
/* 详情页面头部CSS */
.detail-header {
  background-color: #ffffff;
  margin: -20px -20px 0 -20px;
  padding: 10px 10px 50px 10px;
}
.detail-icon {
  display: block;
  margin: 0.5em auto;
  width: 70%;
  height: 3.125em; /* 兼容浏览器的字体大小不同而引起的图标错位问题*/
  min-width: 30px;
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
  /* width: 40%; */
}
.min-width-dialog {
  min-width: 740px;
}
.monitorClass{
  width: 24px;
  height: 28px;
  margin-right: 10px;
  vertical-align: bottom;
  cursor: pointer;
}
.monitorClass:hover{
  opacity: 0.8
}
</style>
