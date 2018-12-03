<template>
    <div id="areaTree">
        <div class="tree-box">
            <div class="zTreeDemoBackground left">
                <ul id="treeDemo" class="ztree"></ul>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import "../../../plugins/ztree/js/jquery.ztree.core.min.js";
import "../../../plugins/ztree/js/jquery.ztree.excheck.min.js";
import {
  fetchAll,
  fetchOriginPath,
} from '@/api/fileHost';
export default {
  name: 'zTree',
  data: function() {
    return {
      setting: {
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'parentId',
            rootPId: 0,
          },
          key: {
            name: 'fileName'
          }
        },
      },
      zNodes: [],
    };
  },
  methods: {
    freshArea: function() {
      this.zNodes = this.fileHostOriginPath;
      $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes);
    },
    getOriginPath() {
      // 测试数据
      fetchOriginPath(123)
        .then(res => {
          const { data: fileHostPath } = res.data;
          this.zNodes = fileHostPath;
          $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
  },
  mounted() {
    this.getOriginPath();
    // $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes);
  },
};
</script>

<style>
@import '../../../plugins/ztree/css/zTreeStyle/zTreeStyle.css';
#areaTree {
  border: 1px solid #e5e5e5;
  margin-bottom: 2px;
  border-radius: 4px;
  overflow: hidden;
}
</style>
