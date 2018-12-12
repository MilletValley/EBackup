<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               custom-class="min-width-dialog"
               @open="modalOpenFn"
               @cancel="cancelButtonClick">
      <span slot="title">
        请选择恢复文件
      </span>
      <div id="areaTree">
        <div class="tree-box">
          <div class="zTreeDemoBackground left">
            <ul id="resultTreeDemo" class="ztree"></ul>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirmBtnClick">确定</el-button>
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import $ from 'jquery';
import "../../../../plugins/ztree/js/jquery.ztree.core.min.js";
import "../../../../plugins/ztree/js/jquery.ztree.excheck.min.js";
import { fmtSizeFn } from '@/utils/common';
import dayjs from 'dayjs';
import { fetchChildNodes } from '@/api/file';
export default {
  name: 'ResultSourcePath',
  props: {
    visible: {
      type: Boolean
    },
    fatherNodes: {
      type: Array,
      default: function() {
        return [];
      }
    },
    hostId: {
      type: Number
    }
  },
  data() {
    return {
      nodes: [],
      checkedNodes: [],
      setting: {
        check: {
            enable: true,
            chkboxType: { "Y": "", "N": "" }
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'sourcePath',
            pIdKey: 'sourceParentPath'
          },
          key: {
            name: 'sourceFileName'
          }
        },
        callback: {
          onClick: this.zTreeOnClick,
          onExpand: this.zTreeOnExpand,
          onCheck: this.zTreeOnCheck,
          beforeCheck: this.zTreeBeforeCheck
        },
      },
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      }
    },
    firstNodes() {
      return this.fatherNodes.map(node => {
        node.isParent = (Number(node.documentType) === 2);
        return node;
      })
    }
  },
  methods: {
    confirmBtnClick() {
      this.$emit('selectNodes', this.checkedNodes);
      this.modalVisible = false;
    },
    modalOpenFn(){
      this.$nextTick(() => {
        $.fn.zTree.init($('#resultTreeDemo'), this.setting, this.firstNodes);
      })
    },
    cancelButtonClick() {
      // this.$emit('selectNodes', []);
      this.modalVisible = false;
    },
    fetchNextNodes(treeNode) {
      var treeObj = $.fn.zTree.getZTreeObj("resultTreeDemo");
      const selectPath = treeNode.sourcePath;
      const _this= this;
      if(treeNode.isParent){
        fetchChildNodes({ id: this.hostId, path: selectPath })
          .then(res => {
            const { data } = res.data;
            _this.nodes = data.map(node => {
              node.isParent = (Number(node.documentType) === 2);
              return node;
            })
            if(!treeNode.children&&treeNode.isParent) {
              treeObj.addNodes(treeNode, this.nodes);
            }
          })
          .catch(error => {
            this.$message.error(error);
          })
      }
    },
    zTreeOnClick(event, treeId, treeNode) {
      this.fetchNextNodes(treeNode);
    },
    zTreeOnExpand(event, treeId, treeNode) {
      this.fetchNextNodes(treeNode);
    },
    zTreeOnCheck(event, treeId, treeNode) {
      var treeObj = $.fn.zTree.getZTreeObj("resultTreeDemo");
      this.checkedNodes = treeObj.getCheckedNodes(true);
    },
    zTreeBeforeCheck(treeId, treeNode) {
      if(this.checkedNodes.length === 10 && !treeNode.checked) {
        this.$message.warning('请选择10个以内的文件数量！')
        return false;
      }
      return true;
    },
  }
}
</script>
<style>
@import '../../../../plugins/ztree/css/zTreeStyle/zTreeStyle.css';
#areaTree {
  border: 1px solid #e5e5e5;
  margin-bottom: 2px;
  border-radius: 4px;
  overflow-y: auto;
  max-height: 300px;
}
</style>

