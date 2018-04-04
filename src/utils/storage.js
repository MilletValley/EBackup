import Cookies from 'js-cookie';

const TOKEN = 'TOKEN';

const userToken = {
  save(token) {
    Cookies.set(TOKEN, token);
  },
  get() {
    return Cookies.get(TOKEN);
  },
  remove() {
    Cookies.remove(TOKEN);
  },
};

export { userToken };
