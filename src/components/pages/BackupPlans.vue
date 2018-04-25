<template>
  <section>
    <db-create-backup-plan db-type="oracle" :db-id=1000 @confirm="createBackupPlan" :visible.sync="dialogCreateVisible"></db-create-backup-plan>
    <el-button type="primary" @click="dialogCreateVisible = true" >添加数据库备份配置</el-button>
  </section>
</template>
<script>
import AddBackupPlan from '../AddBackupPlan.vue';
export default {
  data() {
    return {
      dialogCreateVisible: false,
    };
  },
  components: {
    'db-create-backup-plan': AddBackupPlan,
  },
  methods: {
    createBackupPlan(data) {
      console.log('添加成功后的回调：');
      console.log(data);
    },
  },
};
</script>