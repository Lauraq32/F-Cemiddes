const headers =  {
    Authorization: localStorage.getItem('token'),
}

export const getHeaders = () => {
    return { Authorization: localStorage.getItem('token')}
}

export default headers;