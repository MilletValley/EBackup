<template>
    <div>
      <ul id="ipAddress" :class="{active: addClass,updateCol}">
        <li v-for="(item,index) in ipAddress">
          <input type="text" @input = "checkVal(item, index)"
                            @change = "sendMsg(item, index)"
                            @focus = "addColor()"
                            @blur = "delColor()"
                            @keydown = "turnDire(item,index,$event)"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            v-model = "item.value"
                            onkeypress = "return event.keyCode>=48&&event.keyCode<=57"
                            onblur = "return event.keyCode>=48&&event.keyCode<=57"
                            ref = "ipInput">
          <div></div>
        </li>
      </ul>
    </div>
</template>

<script>
export default {
  name: 'InputIp',
  props: ['ipmodel'],
  data() {
    return {
      temp: [],
      addClass: false,
      updateCol: false,
      ipAddress: [{
          value: ''
      }, {
          value: ''
      }, {
          value: ''
      }, {
          value: ''
      }],
    }
  },
  mounted: function() {
    if(!this.ipmodel){
      for(let j=0; j<this.ipmodel.split('.').length; j++){
        this.ipAddress[j].value = this.ipmodel.split('.')[j];
      }
    }
  },
  methods: {
    sendMsg: function(item,index) {
      console.log("ok");
      for(let i=0; i<this.ipAddress.length; i++){
        this.temp[i] = this.ipAddress[i].value;
      }
      this.$emit("updata:ipmodel",this.temp.join('.'));
      this.updateCol = true;
    },
    addColor: function() {
      this.addClass = true
    },
    delColor: function() {
      this.addClass = false
    },
    checkVal: function(item, index) {
      let val = item.value;
      if(val<0) {
        item.value = 0;
      } else if(val>255) {
        item.value = 255;
        alert(val+"不是有效项。请指定一个介于1和255间的值。")
      } else {
        item.value = val;
      }
      this.ipAddress[index].value = val;
    },
    turnDire: function(item, index, event) {
      let self = this;
      let ev = event || window.event;
      if((ev.keyCode == 37 || ev.keyCode == 40) && index != 0) {
        self.$refs.ipInput[index - 1].focus();
      }
      if(ev.keyCode == 8 && index != 0 && item.value=="") {
        self.$refs.ipInput[index - 1].focus();
      }
      if(ev.keyCode == 39 || ev.keyCode == 38) {
        self.$refs.ipInput[index + 1].focus();
      }
      if(item.value.toString().length >= 3 && index<3) {
        self.$refs.ipInput[index + 1].focus();
      }
    }
  },
}
</script>

<style>
#app .active {
  border-color: #409eff;
}
#app .updateCol {
  border-color: #67c23a;
}
#ipAddress {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  display: inline-block;
  height: 32px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  cursor: auto;
  font: 13.3333px Arial;
  display: flex;
  margin: 0;
}
#ipAddress li {
  display: inline-block;
  position: relative;
  align-self: center;
}
#ipAddress li input {
  width: 30px;
  text-align: center;
  border: none;
  margin-right: 1px;
  color: #606266;
  font-size: 12px;
  margin-left: 0;
  padding: 0;
}
#ipAddress div {
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: #606266;
  position: absolute;
  bottom: 3px;
  right: 0;
}
#ipAddress li:last-child div {
  width: 0;
  height: 0;
}
#ipAddress li:last-child input {
  margin-right: 0;
}
#ipAddress input:focus {
    outline: none;
}
</style>
