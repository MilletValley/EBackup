<template>
  <div style="width: 100%; height: 100%;">
    <iframe :src="`http://${inspectWeb.ip}:${inspectWeb.port}/inspect/ebackup/inspection`"
            width="100%"
            height="800"
            frameborder="0"
            ref="inspectionTask"></iframe>
  </div>
</template>

<script>
import inspectionMixin from '@/components/mixins/inspectionMixins';
import { fetchAll as fetchAllOracle } from '@/api/oracle';
import { fetchAll as fetchAllSqlserver } from '@/api/sqlserver';
export default {
  name: 'InspectionTask',
  mixins: [inspectionMixin],
  watch: {
    // height(val) {
    //   const iframe = this.$refs['inspectionTask'];
    //   iframe.height = val;
    // },
    theme() {
      const iframe = this.$refs['inspectionTask'];
      iframe.src = iframe.src.split('#')[0] + `#theme=${this.theme}`;
    }
  },
  methods: {
    sendMsg() {
      const iframe = this.$refs['inspectionTask'];
      this.sendTheme(iframe);
      // this.height = this.setIframeHeight(iframe);
    }
  }
}
</script>
