<template>
  <div>
    <iframe :src="`http://${inspectWeb.ip}:${inspectWeb.port}/inspect/ebackup/template`"
            frameborder="0"
            width="100%"
            height="800"
            ref="inspectionTemplate"></iframe>
  </div>
</template>

<script>
import inspectionMixin from '@/components/mixins/inspectionMixins';
export default {
  name: 'InspectionTemplate',
  mixins: [inspectionMixin],
  data() {
    return {
    };
  },
  watch: {
    // height(val) {
    //   const iframe = this.$refs['inspectionTemplate'];
    //   iframe.height = val;
    // }
    theme: {
      handler() {
        const iframe = this.$refs['inspectionTemplate'];
        iframe.src = iframe.src.split('#')[0] + `#theme=${this.theme}`;
      },
      deep: true
    }
  },
  methods: {
    sendMsg() {
      const iframe = this.$refs['inspectionTemplate'];
      this.sendTheme(iframe);
      // this.height = this.setIframeHeight(iframe);
    }
  }
}
</script>
