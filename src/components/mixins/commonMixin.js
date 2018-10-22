const paginationMixin = {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    processedTableData() {
      const data = this.currentTableData;
      return data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  watch: {
    tableData(data) {
      // 判断当前页是否有数据，如果没有则显示上一页
      if (data.length <= (this.currentPage - 1) * this.pageSize) {
        this.currentPage = this.currentPage === 1 ? this.currentPage : this.currentPage - 1;
      }
    }
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
  }
};

const filterMixin = {
  data() {
    return {
      filter: {}
    };
  },
  computed: {
    currentTableData() {
      let filterData = this.tableData;
      Object.keys(this.filter).forEach(i => {
        if (this.filter[i] && this.filter[i].length > 0) {
          // filterData = this.tableData.filter(item => {
          //   // if (Array.isArray(this.filter[i])) {
          //   //   if (this.filter[i].includes(item[i])) {
          //   //     return true;
          //   //   }
          //   // } else {
          //   //   // if(item[i].toLowerCase().includes(this.filter[i].toLowerCase())){
          //   //   //     return true;
          //   //   // }
          //   //   // if (item[i].includes(this.filter[i])) {
          //   //   //   return true;
          //   //   // }
          //   //   return this.filterFn(item, i);
          //   //   // return item['vm'][i].includes(this.filter[i]);
          //   // }
          //   // return false;
          //   // 判断方法无法固定
          //   return this.filterFn(item, i);
          // });
          filterData = this.tableData.filter(item => this.filterFn(item, i));
        }
      });
      return filterData;
    }
  }
};

const webSocketMixin = {
  data() {
    return {
      websock: null,
      heartCheck: {
        timeout: 10000, // 1分钟发一次心跳
        timeoutObj: null,
        serverTimeoutObj: null,
        errorTimeObj: null,
        reset: () => {
          clearTimeout(this.heartCheck.timeoutObj);
          clearTimeout(this.heartCheck.serverTimeoutObj);
          clearTimeout(this.heartCheck.errorTimeObj);
        },
        start: () => {
          this.heartCheck.timeoutObj = setTimeout(() => {
            // 这里发送一个心跳，后端收到后，返回一个心跳消息，
            // onmessage拿到返回的心跳就说明连接正常
            this.websocketsend('ping');
            this.heartCheck.serverTimeoutObj = setTimeout(() => { // 如果超过一定时间还没重置，说明后端主动断开了
              this.initWebsocket(); // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, this.heartCheck.timeout);
          }, this.heartCheck.timeout);
        }
      }
    };
  },
  created() {
    this.initWebsocket();
  },
  destroyed() {
    // console.log('guanbi');
    this.heartCheck.reset();
    this.websock.close();
  },
  methods: {
    initWebsocket() {
      // const wsuri = 'ws://121.40.165.18:8800';
      // const wsuri = process.env.WS_API + '/test';
      this.websock = new WebSocket('ws://localhost:8095/', 'echo-protocol-aaa');
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      // this.websock. = this.websocket;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    sendMessage() {
      // 参数
      const agentData = 'mymessage';
      // 若是ws开启状态
      if (this.websock.readyState === this.websock.OPEN) {
        this.websocketsend(agentData);
      } else if (this.websock.readyState === this.websock.CONNECTING) { // 若是 正在开启状态，则等待300毫秒
        const that = this; // 保存当前对象this
        setTimeout(() => {
          that.websocketsend(agentData);
        }, 300);
      } else { // 若未开启 ，则等待500毫秒
        this.initWebSocket();
        const that = this; // 保存当前对象this
        setTimeout(() => {
          that.websocketsend(agentData);
        }, 500);
      }
    },
    websocketonopen() {
      // console.log('连接成功');
      this.heartCheck.reset();
      this.heartCheck.start();
      const actions = { test: '12345' };
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      // console.log('连接失败');
      // this.initWebsocket();
      this.heartCheck.errorTimeObj = setTimeout(() => { // 如果超过一定时间还没重置，说明后端主动断开了
        this.initWebsocket(); // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, 10000);
    },
    websocketonmessage(e) {
      console.log('获取数据', e);
      this.heartCheck.reset();
      this.heartCheck.start();
      // const redata = JSON.parse(e.data);
      // console.log(redata);
    },
    websocketsend(Data) {
      // console.log('发送数据');
      this.websock.send(Data);
    },
    websocketclose(e) {
      // console.log('连接成功')
      console.log('断开连接', e);
      this.websock.close();
      // this.initWebsocket();
    },
  }
};


// eslint-disable-next-line
export { paginationMixin, filterMixin, webSocketMixin };