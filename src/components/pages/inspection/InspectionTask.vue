<template>
  <div style="width: 100%; height: 100%;">
    <iframe :src="`http://${inspectWeb.ip}:${inspectWeb.port}/inspect/ebackup/inspection`"
            width="100%"
            class="iframe"
            frameborder="0"
            scrolling="auto"
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
<style scoped lang="scss">
.iframe {
  height: calc(100vh - 110px);
}
</style>