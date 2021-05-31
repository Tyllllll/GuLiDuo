/**
 * 能发送异步ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是Promise对象
 */
import { message } from 'antd'
import axios from 'axios'

export default function ajax(url, data = {}, method = 'GET') {
  return new Promise((resole, reject) => {
    let promise
    switch (method.toUpperCase()) {
      case 'GET':
        promise = axios.get(url, {
          params: data,
        })
        break
      case 'POST':
        promise = axios.post(url, data)
        break
      default:
        break
    }
    promise
      .then((response) => resole(response.data))
      .catch((error) => message.error('请求出错：' + error.message))
  })
}
