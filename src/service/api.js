import axios from 'axios'

const baseURL= `${process.env.REACT_APP_API_URL}/api`;

const headers =  {
  Authorization: localStorage.getItem('token')
}

const config = { baseURL, headers }

const instance = axios.create(config);

export default instance;