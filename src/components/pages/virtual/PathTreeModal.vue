<template>
  <section>
    <el-dialog title="选择分组"
               :visible.sync="modalVisible"
               @open="modalOpenFn">
      <div id="areaTree">
        <div class="tree-box">
          <div class="zTreeDemoBackground left">
            <ul id="treeDemo" class="ztree"></ul>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm">确定</el-button>
        <el-button @click="modalVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import dialogMixin from '@/components/mixins/dialogMixins';
import $ from 'jquery';
import "../../../../plugins/ztree/js/jquery.ztree.core.min.js";
import "../../../../plugins/ztree/js/jquery.ztree.excheck.min.js";
export default {
  name: 'PathTreeModal',
  mixins: [dialogMixin],
  props: ['visible', 'paths', 'selectedPath'],
  data() {
    return {
      setting: {
        check: {
          enable: true,
          chkStyle: "radio",
          chkboxType: { "Y":"s","N":"s"},
          radioType: "all"
        },
        data: {
          simpleData: {
            enable: false
          },
          key: {
            name: 'name',
            children: 'data'
          }
        },
        view: {
          addDiyDom: this.addDiyDom
        },
        callback: {
          onClick: this.zTreeOnClick,
          onCheck: this.zTreeOnCheck
        },
      },
      selectedNode: null
    }
  },
  computed: {
    nodes() {
      return this.paths;
    }
  },
  methods: {
    modalOpenFn(){
      this.$nextTick(() => {
        $.fn.zTree.init($('#treeDemo'), this.setting, this.nodes);
        this.fixIcon();
      })
    },
    fixIcon() {
      const treeObj = $.fn.zTree.getZTreeObj("treeDemo");
      var folderNode = treeObj.transformToArray(treeObj.getNodes());
      folderNode.forEach(node => {
        node.isParent = true;
        if(node.path === this.selectedPath) {
          this.selectedNode = node;
          node.checked = true;
          treeObj.expandNode(node, true, false, true);
        }
      });
      treeObj.refresh();
    },
    addDiyDom(treeId, treeNode) {
      let aObj = $("#" + treeNode.tId + "_a");
      aObj.addClass('text-color');
    },
    zTreeOnClick(event, treeId, treeNode) {
      const treeObj = $.fn.zTree.getZTreeObj("treeDemo");
      treeObj.expandNode(treeNode);
    },
    zTreeOnCheck(event, treeId, treeNode) {
      this.selectedNode = treeNode;
    },
    confirm() {
      this.modalVisible = false;
      this.$emit('confirm', this.selectedNode);
    }
  }
}
</script>
<style>
@import '../../../../plugins/ztree/css/zTreeStyle/zTreeStyle.css';
</style>
<style scoped>
#areaTree {
  border: 1px solid #e5e5e5;
  margin-bottom: 2px;
  border-radius: 4px;
  overflow-y: auto;
  max-height: 300px;
}
#areaTree li {
  position: relative;
}
</style>
