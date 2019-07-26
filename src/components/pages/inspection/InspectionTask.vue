<template>
  <section>
    <iframe :src="`http://localhost:8089/inspect/ebackup/inspection`"
            width="100%"
            height="800"
            frameborder="0"
            ref="inspectionTask"></iframe>
  </section>
</template>

<script>
import inspectionMixin from '@/components/mixins/inspectionMixins';
import { fetchAll as fetchAllOracle } from '@/api/oracle';
import { fetchAll as fetchAllSqlserver } from '@/api/sqlserver';
import { Promise } from 'q';
export default {
  name: 'InspectionTask',
  mixins: [inspectionMixin],
  data() {
    return {
      availOrcl: [],
      availSql: []
    };
  },
  computed: {
    configMsg() {
      return this.$store.state.nav.configMsg;
    },
    theme() {
      return this.$store.state.nav.theme;
    },
  },
  mounted() {
    this.sendMsg();
  },
  methods: {
    sendMsg() {
      const iframe = this.$refs['inspectionTask'];
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          iframe.src = iframe.src + `#theme=${this.theme}`;
        })
      } else {
        iframe.onload = () => {
          iframe.src = iframe.src + `#theme=${this.theme}`;
        }
      }
    }
  }
}
</script>
