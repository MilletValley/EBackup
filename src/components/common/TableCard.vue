<template>
  <div class="cardDiv">
    <h4 class="name-section">
      <div class="left-tag">{{data.name}}</div>
      <div>
      <!-- <i 
          class="el-icon-success"
          style="color: #27ca27"></i> -->
      <i v-if="data.state === 0"
          class="el-icon-success"
          style="color: #27ca27"></i>
      <i v-else
          class="el-icon-error"
          style="color: #ca2727"></i>
      </div>
    </h4>
    <section>
        <div class="left-tag">数据库名：{{data.}}</div>
        <div>数据库类型：oracle</div>
    </section>
    <section>
        <div class="left-tag">耗时：eqwewqe</div>
        <div>备份集大小</div>
    </section>
    <section>
        <div class="left-tag">备份借宿时间：12321312</div>
    </section>
    <section>
        <div class="left-tag">备份存储路径：啊萨达萨达</div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'table=card',
  props: ['data'],
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cardDiv section{
  font-size: 12px;
  display: flex;
  padding-left:30px;
}
.left-tag{
  flex-grow: 1;
}
.name-section{
  display: flex;
  margin-bottom: 10px;
}
</style>
