<template>
  <dl>
    <dt>
      {{title}}(可多选)
    </dt>
    <dd @click="buttonClick">
      <div v-for="(item, key) in items" :key="key" class="morefilter" :tag="JSON.stringify(item.value)" :class="{selectTag: selectType.includes(item.value)}">
        <span :tag="JSON.stringify(item.value)">{{item.label}}</span>
      </div>
    </dd>
  </dl>
</template>

<script>
export default {
  name: 'multiple-selection',
  props: {
    selected: {
      type: Array
    },
    title: {
      type: String
    },
    items: {
      type: Array
    }
  },
  computed: {
    selectType: {
      get() {
        return this.selected;
      },
      set(val) {
        this.$emit('update:selected', val);
      }
    }
  },
  methods: {
    buttonClick(e) {
      let params = e.target.attributes.tag && e.target.attributes.tag.value;
      if (!params) {
        return;
      }
      params = JSON.parse(params);
      if (this.selectType.includes(params)) {
        this.selectType = this.selectType.filter(e => e !== params);
      } else {
        this.selectType.push(params);
      }
    },
    // judge
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
dl {
  margin: .266667rem 0;
  margin: 2.666667vw 0;
  overflow: hidden;
}
dt{
  margin-left: 1%;
  font-size: 13px;
  margin-bottom: .2rem;
  margin-bottom: 2vw;
  color: #666;
}
dd{
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  background: #fff;
  position: relative;
  margin-left: 0;
}
.morefilter{
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 31.33%;
  -ms-flex: 0 0 31.33%;
  flex: 0 0 31.33%;
  height: .933333rem;
  height: 9.333333vw;
  font-size: 13px;
  margin: .08rem 1%;
  margin: .8vw 1%;
  background: #fafafa;
}
dd, .morefilter{
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.selectTag{
  color: rgb(49, 144, 232);
  font-weight: 700;
  background-color: #edf5ff !important;
}
</style>
