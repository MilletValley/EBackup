<template>
  <section>
    <template>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="bie-card">
            <div slot="header" class="clearfix">
              <span class="card-title">数据备份</span>
            </div>
            <div class="text item">
              <div id="backupTotal" :style="{marginTop: '-30px', width: '100%', height: '300%'}"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="bie-card">
            <div slot="header" class="clearfix">
              <span class="card-title">恢复演练</span>
            </div>
            <div class="text item">
              <div id="restoreTotal" :style="{marginTop: '-30px', width: '100%', height: '300%'}"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="bie-card">
            <div slot="header" class="clearfix">
              <span class="card-title">一键接管</span>
            </div>
            <div class="text item">
              <div id="initConn" :style="{marginTop: '-30px', width: '100%', height: '300%'}"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card" style="width: 100%">
            <div slot="header" class="clearfix">
              <span class="card-title">空间使用情况</span>
            </div>
            <div class="text item" v-show="Object.keys(spaceDetail).length">
              <el-row>
                <el-col :span="Object.keys(spaceDetail).length > 1 ? 12 : 24" ref="col">
                  <div  ref="space1">
                    <cylinder :data="spaceChartData[0]"></cylinder>
                  </div>
                </el-col>
                <el-col :span="12" v-if="Object.keys(spaceDetail).length > 1">
                  <div  ref="space2">
                    <cylinder :data="spaceChartData[1]"></cylinder>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div :class="$style.nfsNotUsed" v-show="!Object.keys(spaceDetail).length">
              <span>暂未使用</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" style="width: 100%">
            <div slot="header" class="clearfix">
              <span class="card-title">存储1已使用空间分配情况</span>
            </div>
            <div class="text item" v-show="nfsAssignedSpace&&nfsAssignedSpace.length>0">
              <div id="spaceRatio" :style="{width: '100%', height: '300%', margin: '0 auto'}"></div>
            </div>
            <div :class="$style.nfsNotUsed" v-show="!(nfsAssignedSpace&&nfsAssignedSpace.length>0)">
              <span>暂未使用</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </section>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>
