<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               custom-class="min-width-dialog"
               @open="modalOpenFn"
               @cancel="cancelButtonClick">
      <span slot="title">
        请选择恢复路径
      </span>
      <div id="areaTree">
        <div class="tree-box">
          <div class="zTreeDemoBackground left">
            <ul id="treeDemo" class="ztree"></ul>
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
import IIcon from '@/components/IIcon';
import zTree from '@/components/common/zTree';
import { fmtSizeFn } from '@/utils/common';
import dayjs from 'dayjs';
import { fetchChildNodes } from '@/api/file';
export default {
  name: 'FileTree',
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
          onCheck: this.zTreeOnCheck
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
    driverNodes() {
      return this.fatherNodes.map(node => {
        return {
          sourceFileName: node.fileDriver,
          sourcePath: node.fileDriver,
          sourceFileName: node.fileDriver,
          isParent: true
        }
      })
    }
  },
  methods: {
    confirmBtnClick() {
      this.$emit('selectNodes', this.nodes);
      this.modalVisible = false
    },
    modalOpenFn(){
      this.$nextTick(() => {
      $.fn.zTree.init($('#treeDemo'), this.setting, this.driverNodes);
      })
    },
    cancelButtonClick() {
      this.$emit('selectNodes', []);
      this.modalVisible = false;
    },
    selectNodes(nodes) {
      this.nodes = nodes;
    },
    zTreeOnClick(event, treeId, treeNode) {
      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
      const selectPath = treeNode.sourcePath;
      const _this= this;
      if(treeNode.level === 0) {
        const firstNodes = this.fatherNodes.find(node => node.fileDriver === selectPath).fileNodes;
        _this.nodes = firstNodes.map(node => {
          node.isParent = (Number(node.documentType) === 1);
          return node;
        })
        if(!treeNode.children&&treeNode.isParent) {
          treeObj.addNodes(treeNode, this.nodes);
        }
      } else if(treeNode.isParent){
        fetchChildNodes({ id: this.hostId, data: selectPath })
          .then(res => {
            const { data } = res.data;
            _this.nodes = data.map(node => {
              node.isParent = (Number(node.documentType) === 1);
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
    zTreeOnCheck(event, treeId, treeNode) {
      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
      this.$emit('selectNodes', treeObj.getCheckedNodes(true));
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