<template>
  <section>
    Oracle Details {{ $route.params}} {{id}}
  </section>
</template>
<script>
export default {
  name: 'OracleDetail',
  props: ['id'],
};
</script>
<style scoped>

</style>
