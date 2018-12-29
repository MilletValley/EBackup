<template>
  <ul>
    <li v-for="(item, key) in items" :key="key"  @click="selectFn(item.value)" :class="{active: isEqual(defaultSort, item.value) }">
      <span>{{item.label}}</span>
      <i-icon name="xuanzhong" class="iconClass" v-show="isEqual(defaultSort, item.value)"></i-icon>
    </li>
  </ul>
</template>

<script>
import IIcon from '@/components/IIcon.vue';
import isEqual from 'lodash/isEqual';
export default {
  name: 'sort-list',
  components: {
    IIcon
  },
  props: {
    default: {
      type: Object
    },
    items: {
      type: Array
    },
    display: {
      type: String
    }
  },
  data() {
    return {
      isEqual
    };
  },
  computed: {
    defaultSort: {
      get() {
        return this.default;
      },
      set(val) {
        this.$emit('update:default', val);
      }
    },
    hiddenContent: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit('update:display', val);
      }
    }
  },
  methods: {
    selectFn(data) {
      this.defaultSort = data;
      this.hiddenContent = '';
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul{
  list-style: none;
  font-size: 13px;
  padding-left: 0;
  /* margin: 0; */
  /* #3190e8 */
}
ul li {
  line-height: 8vw;
  position: relative;
}
.iconClass{
  right: 10px;
  /* margin-right: 10px; */
  position: absolute;
  top: 18%;
}
.active{
  color: #3190e8;
  font-weight: 700;
  /* background-color: #edf5ff !important; */
}
</style>
