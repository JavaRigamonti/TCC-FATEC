import axios from 'axios';

let baseURL = ""

if(process.env.NODE_ENV == 'production'){
  baseURL = 'https://flush-api.herokuapp.com/'
}else {
  baseURL = 'http://localhost:3333/'
}

const api = axios.create({
  baseURL
});

export default api;