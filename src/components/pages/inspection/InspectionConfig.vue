<template>
  <iframe :src="`http://localhost:8089/inspect/ebackup/system/params/config`"
          width="100%"
          class="iframe"
          scrolling="auto"
          frameborder="0"
          ref="inspectionConfig"></iframe>
</template>

<script>
import inspectionMixin from '@/components/mixins/inspectionMixins';
export default {
  name: 'InspectionConfig',
  mixins: [inspectionMixin],
  data() {
    return {
    };
  },
  watch: {
    theme() {
      const iframe = this.$refs['inspectionConfig'];
      iframe.src = iframe.src.split('#')[0] + `#theme=${this.theme}`;
    }
  },
  methods: {
    sendMsg() {
      const iframe = this.$refs['inspectionConfig'];
      this.sendTheme(iframe);
      // this.height = this.setIframeHeight(iframe);
    }
  }
}
</script>
<style scoped lang="scss">
.iframe {
  height: calc(100vh - 110px);
  width: calc(100% + 20px);
}
</style>