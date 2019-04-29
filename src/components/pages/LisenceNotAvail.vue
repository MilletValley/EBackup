<template>
  <div class="body">
    <el-row style="width: 100%">
      <el-col :span="16">
        <div class="leftImg"></div>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'LisenceNotAvail'
}
</script>

<style scoped>
.body {
  background-color: #F0F2F5;
  width: 100%;
  display: flex;
  min-height: 100vh;
}
.leftImg {
  background-image: url("../../assets/lisenceNotAvail.png");
  background-repeat: no-repeat;
  width: 100%;
  max-width: 430px;
  height: 360px;
}
</style>

