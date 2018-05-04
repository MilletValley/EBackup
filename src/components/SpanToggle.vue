<!-- 可以切换显示状态的span -->
<template>
  <section style="display: inline-block">
    <span>{{ displayValue }}</span>
    <i-icon :name="iconName" @click.native="toggleDisplay"></i-icon>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';

export default {
  name: 'span-toggle',
  props: {
    value: String,
  },
  data() {
    return {
      hiddenPassword: false,
    };
  },
  computed: {
    displayValue() {
      return this.hiddenPassword ? '*'.repeat(this.value.length) : this.value;
    },
    iconName() {
      return this.hiddenPassword ? 'eye-off' : 'eye';
    },
  },
  methods: {
    toggleDisplay() {
      this.hiddenPassword = !this.hiddenPassword;
    },
  },
  components: {
    'i-icon': IIcon,
  },
};
</script>
<style scoped>
.icon {
  margin-left: 50px;
  display: inline-block;
  vertical-align: middle;
}
</style>
