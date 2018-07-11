<template>
  <section>
    <el-form inline
             size="small"
             class="clearfix">
      <el-form-item style="float: right;">
        <el-button icon="el-icon-refresh"
                   @click="refreshData">刷新</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary"
                   @click="addProduction()">添加</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix el-card-head">
          <i-icon name="application"
                        class="envIcon"></i-icon>
          <span>应用界面</span>
        </div>
        <el-table :data="this.applicationData">
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="position"
            label="职位"
            align="center"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="entrytime"
            label="入职时间"
            align="center"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="counttime"
            label="统计时间"
            align="center"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="salesamount"
            label="销售金额"
            align="center"
            min-width="180">
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
    <el-row :gutter="50">
      <el-col :span="12">
					<canvas ref="leftDire"></canvas>
      </el-col>
      <el-col :span="12">
					<canvas ref="rightDire"></canvas>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix el-card-head">
            <i-icon name="production-env"
                          class="envIcon"></i-icon>
            <span>生产环境</span>
            <el-tooltip placement="right"
                        effect="light"
                        v-show="this.productionData.serviceIp!==''">
              <div slot="content">
                提供服务中
                <br/>服务IP：{{this.productionData.serviceIp}}
              </div>
              <i-icon class="serviceIcon"
                      name="service"></i-icon>
            </el-tooltip>
          </div>
          <el-table :data="this.productionData.salesInfo">
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="position"
              label="职位"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="entrytime"
              label="入职时间"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="counttime"
              label="统计时间"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="salesamount"
              label="销售金额"
              align="center"
              min-width="50">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix el-card-head">
            <i-icon name="ebackup-env"
                          class="envIcon"></i-icon>
            <span>易备环境</span>
            <el-tooltip placement="right"
                        effect="light"
                        v-show="this.ebackupData.serviceIp!==''">
              <div slot="content">
                提供服务中
                <br/>服务IP：{{this.ebackupData.serviceIp}}
              </div>
              <i-icon class="serviceIcon"
                      name="service"></i-icon>
            </el-tooltip>
          </div>
          <el-table :data="this.ebackupData.salesInfo">
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="position"
              label="职位"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="entrytime"
              label="入职时间"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="counttime"
              label="统计时间"
              align="center"
              min-width="50">
            </el-table-column>
            <el-table-column
              prop="salesamount"
              label="销售金额"
              align="center"
              min-width="50">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="添加数据"
      :visible.sync="dialogVisible">
      <el-form :model="formData"
          label-width="110px"
          ref="formData"
          size="small">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="formData.position"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入职时间" prop="entrytime">
              <el-date-picker type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            v-model="formData.entrytime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统计时间" prop="counttime">
              <el-date-picker type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            v-model="formData.counttime"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="销售金额" prop="salesamount">
          <el-input-number v-model="formData.salesamount" :step="1"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createFormData" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import {   fetchProduction, fetchEbackup, createItem } from '../../api/takeoverview';
export default {
  name: 'TakeOverView',
  data() {
    return {
      productionData: {},
      ebackupData: {},
      applicationData: [],
      dialogVisible: false,
      btnLoading: false,
      formData: {
        name: '',
        position: '',
        entrytime: '',
        counttime: '',
        salesamount: 0,
        hostIp: '',
        serviceIp: '',
      },
    }
  },
  computed: {
    leftDire() {
      return this.$refs.leftDire;
    },
    rightDire() {
      return this.$refs.rightDire;
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchProduction()
      .then(res => {
        this.productionData = res.data.data;
        if(this.productionData.serviceIp!=='') {
          this.applicationData = this.productionData.salesInfo;
          this.drawArrow(this.leftDire.getContext('2d'),280,30,170,140,45,10,3,'#27ca27',0);
        }
      })
      .catch(error => {
        error => Promise.reject(error);
      });
      fetchEbackup()
      .then(res => {
        this.ebackupData = res.data.data;
        if(this.ebackupData.serviceIp!=='') {
          this.applicationData = this.ebackupData.salesInfo;
          this.drawArrow(this.rightDire.getContext('2d'),20,30,130,140,45,10,3,'#27ca27',1);
        }
      })
      .catch(error => {
        error => Promise.reject(error);
      });
    },
    createFormData() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.btnLoading=true;
          if(this.productionData.serviceIp!=='') {
            this.formData.serviceIp = this.productionData.serviceIp;
            this.formData.hostIp = this.productionData.hostIp;
          } else {
            this.formData.serviceIp = this.ebackupData.serviceIp;
            this.formData.hostIp = this.ebackupData.hostIp;
          }
          createItem(this.formData)
            .then(response => {
              this.$message.success(response.data.message);
              this.dialogVisible = false;
              this.productionData.salesInfo.push(response.data.data.salesInfo);
              this.ebackupData.salesInfo.push(response.data.data.salesInfo)
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.btnLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    addProduction() {
      this.dialogVisible = true;
       this.$nextTick(() => {
        this.$refs.formData.resetFields();
      });
    },
    refreshData() {
      const opt = {
        type: 'info',
        message: '正在更新中，请等待...',
        duration: 0,
      };
      const { close } = this.$message(opt);
      Promise.all([
        fetchProduction(),
        fetchEbackup(),
      ])
        .then(resArr => {
          this.productionData = resArr[0].data.data;
          this.ebackupData = resArr[1].data.data;
          if(this.productionData.serviceIp!=='') {
            this.applicationData = this.productionData.salesInfo;
            this.drawArrow(this.leftDire.getContext('2d'),280,30,170,140,45,10,3,'#27ca27',0);
          } else {
            this.applicationData = this.ebackupData.salesInfo;
            this.drawArrow(this.rightDire.getContext('2d'),20,30,130,140,45,10,3,'#27ca27',1);
          }
        })
        .then(() => {
          opt.type = 'success';
          opt.message = '更新成功';
          setTimeout(close, 1000);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    drawArrow(ctx, fromX, fromY, toX, toY,theta,headlen,width,color,dire) {
      this.rightDire.getContext('2d').clearRect(0,0,this.rightDire.width,this.rightDire.height);
      this.leftDire.getContext('2d').clearRect(0,0,this.leftDire.width,this.leftDire.height);
      theta = typeof(theta) != 'undefined' ? theta : 30;
      headlen = typeof(theta) != 'undefined' ? headlen : 10;
      width = typeof(width) != 'undefined' ? width : 1;
      color = typeof(color) != 'color' ? color : '#000';
      var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
      angle1 = (angle + theta) * Math.PI / 180,
      angle2 = (angle - theta) * Math.PI / 180,
      topX = headlen * Math.cos(angle1),
      topY = headlen * Math.sin(angle1),
      botX = headlen * Math.cos(angle2),
      botY = headlen * Math.sin(angle2);
      ctx.save();
      ctx.beginPath();
      var iLenX=fromX;
      var arrowX = fromX - topX,
      arrowY = fromY - topY;
      var times = 0;
      window.clearInterval(intervalLine);
      var intervalLine = window.setInterval(function () {
        if(iLenX-toX!=0) {	// 绘制直线
          ctx.moveTo(fromX, fromY);
          if(dire===1)
          {
            ctx.lineTo(++fromX,++fromY);
            iLenX++;
          } else {
            ctx.lineTo(--fromX,++fromY);
            iLenX--;
          }
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.stroke();
        } else if(times===0){ //绘制箭头
          ctx.moveTo(arrowX, arrowY);
          arrowX = toX + topX;
          arrowY = toY + topY;
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(toX, toY);
          arrowX = toX + botX;
          arrowY = toY + botY;
          ctx.lineTo(arrowX, arrowY);
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.stroke();
          times=1;
        }
      }, 5);
      ctx.restore();
    },
  },
  components: {
    IIcon
  },
};
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
}
.envIcon {
  vertical-align: -0.3em;
}
.el-card-head {
  text-align: center;
  font-weight: 700;
}
canvas {
  height: 200px;
  width: 100%;
}
.clearfix {
  overflow: hidden;
}
.serviceIcon {
  position: absolute;
  margin-left: 100px;
  margin-top: -0.5em;
  width: 2em;
  height: 2em;
  transition: all 0.5s ease;
}
.serviceIcon:hover {
  transform: scale(1.2);
}
</style>
