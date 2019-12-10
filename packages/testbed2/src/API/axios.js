// @flow

// eslint-disable-next-line import/no-self-import
import Axios from 'axios';

export default Axios.create({
  baseURL: 'https://api.xzakt.com/api/',
});
