<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item style="float: right;">
        <el-button type="info"
                   @click="$router.push({name: 'oracleList'})">数据库列表</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary"
                   @click="console.log()">添加</el-button>
      </el-form-item>

    </el-form>
  </section>
</template>
<script>
export default {
  name: 'OracleTakeOver',
};
</script>
