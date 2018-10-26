
import { Message } from 'element-ui';

export default global.install = Vue => {
  Vue.prototype.errorMessage = message => {
    Message({
      message,
      type: 'error',
      duration: 0,
      showClose: true
    });
  };
};

