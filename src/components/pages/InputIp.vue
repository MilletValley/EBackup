<template>
    <div id = "app" class="el-input">
      <ul id="ipAddress" :class="{active: addClass}">
        <li v-for="(item,index) in ipAddress">
          <input type="text" @input = "checkVal(item, index)"
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
  data() {
    return {
      addClass: false,
      input1: '',
          ipAddress: [{
          value: ''
      }, {
          value: ''
      }, {
          value: ''
      }, {
          value: ''
      }]
    }
  },
  methods: {
    addColor() {
      this.addClass = true
    },
    delColor() {
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
      if(item.value.toString().length >= 3) {
        self.$refs.ipInput[index + 1].focus();
      }
    }
  },
}
</script>

<style>
#app {
  color: #2c3e50;
  height: 100vh;
  font-size: 14px;
}
#app .active {
  border-color: #409eff;
}
#ipAddress {
  display: inline-block;
  margin: 200px 500px;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 300px;
  -webkit-rtl-ordering: logical;
  user-select: text;
  cursor: auto;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  text-rendering: auto;
  text-align: start;
  margin: 0em 0em 0em 0em;
  font: 13.3333px Arial;
  display: flex;
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
  font-size: 14px;
  margin-left: 0;
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
