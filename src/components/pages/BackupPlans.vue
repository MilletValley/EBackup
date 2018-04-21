<template>
　　<AddBackupPlan :backupStrategyParent="backupStrategyParent"  :timeStrategyParent="timeStrategyParent"></AddBackupPlan>
</template>
<script>
import AddBackupPlan from './AddBackupPlan.vue'
export default{
　　data(){
　　return{
    backupStrategyParent:[{ value: false}, { value: true}, { value: false}],
    timeStrategyParent:[{ value: false}, { value: false}, { value: false}, { value: false}, { value: false}],   
　　}
  },
　　components:{AddBackupPlan}
  }
</script>