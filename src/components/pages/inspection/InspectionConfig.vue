<template>
  <iframe :src="`http://${inspectWeb.ip}:${inspectWeb.port}/inspect/ebackup/system/params/config`"
          width="100%"
          height="800"
          frameborder="0"></iframe>
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
  mounted() {
  },
  methods: {
  }
}
</script>
