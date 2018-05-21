<template>
  <section>
    <el-input :value="value" :type="hiddenPassword ? 'password' : 'text'" @input="inputChange">
      <i-icon slot="suffix" :name="iconName" @click.native="toggleDisplay"></i-icon>
    </el-input>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';

export default {
  name: 'input-toggle',
  // model: {
  //   prop: 'value',
  //   event: 'input',
  // },
  props: {
    value: String,
  },
  data() {
    return {
      hiddenPassword: true,
    };
  },
  computed: {
    iconName() {
      return this.hiddenPassword ? 'eye-off' : 'eye';
    },
  },
  methods: {
    toggleDisplay() {
      this.hiddenPassword = !this.hiddenPassword;
    },
    inputChange(value) {
      this.$emit('input', value);
    },
  },
  components: {
    'i-icon': IIcon,
  },
};
</script>
<style scoped>
.icon {
  margin-top: 9px;
}
</style>
