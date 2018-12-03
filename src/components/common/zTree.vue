<template>
    <div id="areaTree">
        <div class="box-title">
            <a href="#" @click="freshArea">列表<i class="fa  fa-refresh" @click="freshArea"></i></a>
        </div>
        <div class="tree-box">
            <div class="zTreeDemoBackground left">
                <ul id="treeDemo" class="ztree"></ul>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import "../../../plugins/ztree/js/jquery.ztree.core.min.js"
import "../../../plugins/ztree/js/jquery.ztree.excheck.min.js"
// import {data} from './path';
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
            pIdKey: 'pId',
            rootPId: 0,
          },
        },
      },
      zNodes: [
        { id: 1, pId: 0, name: '父节点1' },
        { id: 11, pId: 1, name: '子节点1' },
        { id: 12, pId: 1, name: '子节点2' },
      ],
      fileHostOriginPath: []
    };
  },
  methods: {
    freshArea: function() {
      console.log(111)
      console.log(this.fileHostOriginPath)
      this.zNodes = this.fileHostOriginPath.map(e => {
        return {
          id: e.id,
          pId: e.parentId,
          name: e.fileName
        }
      })
      $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes);
    },
    getOriginPath() {
      fetchOriginPath(123)
        .then(res => {
          const { data: fileHostPath } = res.data;
          this.fileHostOriginPath = fileHostPath;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
  },
  mounted() {
    // console.log(data)
    this.getOriginPath()
    $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes);
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
.box-title {
  border-radius: 3px 3px 0 0;
  background-color: #f5f5f5;
}
.box-title a {
  color: #2fa4e7;
  text-decoration: none;
  font-size: 14px;
  display: block;
  padding: 8px 15px;
  cursor: pointer;
}
.box-title .fa {
  float: right;
  line-height: 20px;
}
</style>
