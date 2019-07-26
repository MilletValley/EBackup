const inspectionMixin = {
  computed: {
    configMsg() {
      return this.$store.state.nav.configMsg;
    },
    inspectionWeb() {
      if (this.configMsg.inspectionWeb) {
        return {
          ip: this.configMsg.inspectionWeb.ip,
          port: this.configMsg.inspectionWeb.port
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
