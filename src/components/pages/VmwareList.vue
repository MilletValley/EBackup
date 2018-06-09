<template>
  <section>
    <el-table :data="vmItems"
              style="width: 100%">
      <el-table-column label="名称"
                       fixed
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="`${scope.row.vmId}`"
                         append
                         :class="$style.link">{{scope.row.vmName}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="vmPath"
                       label="IP"
                       min-width="200"
                       align="center"></el-table-column>
      <el-table-column prop="vmHostName"
                       label="主机名"
                       min-width="200"
                       align="center"></el-table-column>
    </el-table>
  </section>
</template>
<script>
import { fetchAll } from '../../api/virtuals';

export default {
  name: 'VMwareList',
  data() {
    return {
      vmItems: [],
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.vmItems = data;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
  }
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
