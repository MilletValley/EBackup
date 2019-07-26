const inspectionMixin = {
  computed: {
    configMsg() {
      return this.$store.state.nav.configMsg;
    },
    inspectWeb() {
      if (this.configMsg.inspectWeb) {
        return {
          ip: this.configMsg.inspectWeb.ip,
          port: this.configMsg.inspectWeb.port
        };
      }
      return { ip: null, port: null };
    }
  },
  methods: {
    setIframeHeight(iframe) {
      if (iframe) {
        const iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        iframe.height = 0;
        if (iframeWin.document.body) {
          iframe.height = iframeWin.document.body.scrollHeight;
        }
      }
    }
  },
};

export default inspectionMixin;
