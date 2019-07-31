const inspectionMixin = {
  data() {
    return {
      height: null
    };
  },
  computed: {
    configMsg() {
      return this.$store.state.nav.configMsg;
    },
    theme() {
      return this.$store.state.nav.theme;
    },
    inspectWeb() {
      if (this.configMsg.inspectWeb) {
        return {
          ip: this.configMsg.inspectWeb.ip,
          port: this.configMsg.inspectWeb.port,
          active: this.configMsg.inspectWeb.active
        };
      }
      return { ip: null, port: null, active: false };
    },
    hasInspectConfig() {
      return this.inspectWeb.ip && this.inspectWeb.port && this.inspectWeb.active;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.sendMsg) {
        this.sendMsg();
      }
    });
  },
  methods: {
    sendTheme(iframe) {
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          iframe.src += `#theme=${this.theme}`;
          // window.addEventListener('message', event => {
          //   if (event.origin.includes(url)) {
          //     if (!isNaN(event.data)) this.height = event.data;
          //     return this.height;
          //   }
          // });
        });
      } else {
        iframe.onload = () => {
          iframe.src += `#theme=${this.theme}`;
          // window.addEventListener('message', event => {
          //   // if (event.origin.includes(url)) {
          //   if (!isNaN(event.data)) this.height = `${Number(event.data) + 200}px`;
          //   return this.height;
          //   // }
          // });
        };
      }
    }
  },
};

export default inspectionMixin;
