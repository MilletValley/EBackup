<template>
  <section>
    <db-create-backup-plan db-type="sqlserver" :db-id=1000 @confirm="createBackupPlan" :visible.sync="dialogCreateVisible"></db-create-backup-plan>
    <db-update-backup-plan db-type="sqlserver" :db-id=1000 @confirm="updateBackupPlan" :visible.sync="dialogUpdateVisible" :backup-plan="backupPlanDb"></db-update-backup-plan>
    <el-button type="primary" @click="dialogCreateVisible = true" >添加数据库备份配置</el-button>
    <el-button type="primary" @click="dialogUpdateVisible = true" >修改数据库备份配置</el-button>
  </section>
</template>
<script>
import AddBackupPlan from '../AddBackupPlan.vue';
import UpdateBackupPlan from '../UpdateBackupPlan.vue';
export default {
  data() {
    return {
      dialogCreateVisible: false,
      dialogUpdateVisible: false,
       // 从oracle列表中筛选出对应的一条记录
      backupPlanDb: {
        "id": 117,
        "nama": "一条需要修改的数据库备份计划",
        	"config": {
            "startTime": "2006-03-28 03:53:38",
            "backupStrategy": 0,
            "timeStrategy": 3,
            "singleTime": "2018-09-15 12:00:00",
            "timePoints": [
              "23:47",
	        		"04:04",
            ],
            "weekPoints": [],
            "datePoints": [],
            "timeInterval": 21,
            "backupUrl": "mid://fhvr.mn/uju"
          }, 
      },
    };
  },
  components: {
    'db-create-backup-plan': AddBackupPlan,
    'db-update-backup-plan': UpdateBackupPlan,
  },
  methods: {
    createBackupPlan(data) {
      console.log('添加成功后的回调：');
      console.log(data);
    },
    updateBackupPlan(data) {
      console.log('修改成功后的回调：');
      console.log(data);
    },
  },
};
</script>