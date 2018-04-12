<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script>
export default {
  name: 'IIcon',
  props: ['name'],
  data() {
    return {
      iconName: `#icon-${this.name}`,
    };
  },
};
</script>


