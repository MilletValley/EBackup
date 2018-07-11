<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item>
        <el-radio-group v-model="radio" @change="switchEnvironment">
          <el-radio-button label="生产环境"></el-radio-button>
          <el-radio-button label="易备环境"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button icon="el-icon-refresh"
                   @click="refreshData">刷新</el-button>
      </el-form-item>
      <el-form-item style="float: right">
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
    <el-row :gutter="50" class="clearfix">
      <el-col :span="12" v-show="this.radio==='生产环境'" style="float: left">
					<canvas ref="leftDire"></canvas>
      </el-col>
      <el-col :span="12" v-show="this.radio==='易备环境'" style="float: right">
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
        <el-button type="primary" @click="createProductionData" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import {   fetchProduction, fetchEbackup, createProduction } from '../../api/backuprestore';
export default {
  name: 'BackupRecoverView',
  data() {
    return {
      radio: '生产环境',
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
    },
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchProduction()
      .then(res => {
        this.productionData = res.data.data;
        this.applicationData = this.productionData.salesInfo;
        this.drawArrow(this.leftDire.getContext('2d'),280,30,170,140,45,10,3,'#27ca27',0);
      })
      .catch(error => {
        error => Promise.reject(error);
      });
      fetchEbackup()
      .then(res => {
        this.ebackupData = res.data.data;
      })
      .catch(error => {
        error => Promise.reject(error);
      });
    },
    createProductionData() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.btnLoading=true;
          this.formData.hostIp = this.productionData.hostIp;
          this.formData.serviceIp = this.productionData.serviceIp;
          createProduction(this.formData)
            .then(response => {
              this.$message.success(response.data.message);
              this.dialogVisible = false;
              this.productionData.salesInfo.push(response.data.data.salesInfo);
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
          if(this.radio==='生产环境') {
            this.applicationData = this.productionData;
            this.drawArrow(this.leftDire.getContext('2d'),280,30,170,140,45,10,3,'#27ca27',0);
          } else {
            this.applicationData = this.ebackupData;
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
    switchEnvironment() {
      if(this.radio === '易备环境') {
        this.drawArrow(this.rightDire.getContext('2d'),20,30,130,140,45,10,3,'#27ca27',1);
        this.applicationData = this.ebackupData.salesInfo;
      } else {
        this.drawArrow(this.leftDire.getContext('2d'),280,30,170,140,45,10,3,'#27ca27',0);
        this.applicationData = this.productionData.salesInfo;
      }
    },
    // 绘图环境，起点坐标，终点坐标，三角斜边-直线夹角，三角斜边长度，箭头线宽度，箭头颜色，方向
    drawArrow(ctx, fromX, fromY, toX, toY,theta,headlen,width,color,dire) {
      this.leftDire.getContext('2d').clearRect(0,0,this.leftDire.width,this.leftDire.height);
      this.rightDire.getContext('2d').clearRect(0,0,this.rightDire.width,this.rightDire.height);
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
        // 绘制直线
        if(iLenX-toX!=0) {
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
        } else if(times===0){   //绘制箭头
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
.el-table {
  margin-top: -20px;
}
.el-card-head {
  text-align: center;
  font-weight: 700;
}
canvas {
  height: 200px;
  width: 100%;
}
</style>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
