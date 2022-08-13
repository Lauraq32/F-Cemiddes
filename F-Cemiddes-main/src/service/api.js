import axios from 'axios'

const baseURL= "http://localhost:8080/api/";

const headers =  {
  Authorization: localStorage.getItem('token')
}

const config = { baseURL, headers }

const instance = axios.create(config);

export default instance;