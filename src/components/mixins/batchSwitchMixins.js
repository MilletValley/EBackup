import { createOne } from '../../api/switch';

const batchSwitchMixin = {
  data() {
    return {
      switchDialog: false,
      flag: 0
    };
  },
  watch: {
    switchDialog(newVal) {
      if (newVal) {
        this.clearTimer();
      } else {
        this.setTimer();
      }
    }
  },
  methods: {
    handleBtnClick(command) {
      if (command === 'switchBtn') {
        this.batchSwitch();
      } else if (command === 'listBtn') {
        this.switchList();
      }
    },
    batchSwitch() {
      this.switchDialog = true;
    },
    switchList() {
      this.$router.push({ name: 'oracleSwitchList' });
    },
    addSwitchPlan(data) {
      this.btnLoading = true;
      createOne(data)
        .then(res => {
          const { data: switchPlan } = res.data;
          // this.$message.success(message);
          this.fetchData();
          this.$router.push({
            name: 'oracleSwitchDetail',
            params: { id: switchPlan.id }
          });
          this.switchDialog = false;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    }
  },
  computed: {
    switchLinks() {
      return this.links ? this.links.map(item => {
        const linkIds = item.databaseLinks.filter(databaseLink => databaseLink.state !== 1).map(i => i.id);
        return Object.assign({ flag: this.flag, linkIds }, item);
      }) : [];
    }
  }
};
export default batchSwitchMixin;
