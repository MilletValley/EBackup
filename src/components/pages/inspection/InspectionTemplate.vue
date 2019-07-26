<template>
  <iframe :src="`http://${inspectWeb.ip}:${inspectWeb.port}/ebackup/template`"
          width="100%"
          height="800"
          frameborder="0"></iframe>
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
  mounted() {
  },
  methods: {
  }
}
</script>
