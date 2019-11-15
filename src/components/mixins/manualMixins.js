const manualPageMixin = {
  methods: {
    toGuide(name, query) {
      const routeData = this.$router.resolve({
        name,
        query: { aId: query }
      });
      window.open(routeData.href, '_blank');
    }
  }
};

const manualDetailMixin = {
  mounted() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    onScroll(currentScrollTop) {
      const navContents = document.querySelectorAll('.anchor');
      const offsetTopArr = [];
      const offsetHeightArr = [];
      navContents.forEach(item => {
        offsetTopArr.push(item.offsetTop);
        offsetHeightArr.push(item.offsetHeight);
      });
      let navIndex = 0;
      for (let n = 0; n < offsetTopArr.length; n++) {
        // 此处是为了减去第一个块的offsetTop偏移量
        // 若当前页面的scrollTop大于第n个页面对应的scrollTop时，内容应该在第n个锚点块内了
        if ((currentScrollTop > offsetTopArr[n] - offsetTopArr[0]) && (currentScrollTop < offsetTopArr[n] - 62 + offsetHeightArr[n])) {
          navIndex = n;
        }
      }
      this.$emit('func', navContents[navIndex].id);
    },
    fetchData() {
      const str = `#${this.$route.query.aId}`;
      document.querySelector(str).scrollIntoView({ block: 'start' });
    },
  }
};

export {
  manualPageMixin,
  manualDetailMixin
};
