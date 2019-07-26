<template>
  <section>
    <iframe :src="`http://${inspectionWeb.ip}:${inspectionWeb.port}/ebackup/inspection`"
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
    // Promise.all([fetchAllOracle(), fetchAllSqlserver()])
    //   .then(res => {
    //     const { data: oracles } = res[0].data;
    //     const { data: sqlservers } = res[1].data;
    //     this.availOrcl = oracles;
    //     const availSqlserverHosts = this.$store.getters.sqlserverHosts;
    //     const availSql = availSqlserverHosts.map(host => {
    //       host.databases = sqlservers.filter(sqlserver => sqlserver.host.id === host.id);
    //       return host;
    //     })
    //     this.availSql = availSql.filter(host => host.databases.length);
    //   })
    //   .then(() => {
    //     this.sendMsg();
    //   })
    //   .catch(error => {
    //     this.$message.error(error);
    //   })
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
