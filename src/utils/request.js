import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getRefreshToken, getToken, setToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const token = getToken()
    if (token) {
      config.headers['x-access-token'] = token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response

    // if the custom code is not 20000, it is judged as an error.
    // if (res.status !== 200 || res.status !== 201) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    // }
    return res
  },
  error => {
    if (error.response.status == 500) {
      router.push('/500')
    } else if (error.response.status == 400 && error.response.data.source_function === 'VerifyTokenJWT') {
      store.dispatch('user/logout')
      router.push({
        nmae: 'Login',
        params: { code: 440 } 
      })
    } else if (error.response.status == 400) {
      Message({
        message: error.response.data.msg,
        type: 'error',
        duration: 3 * 1000
      })
    } else {
      if (error.response) {
        console.log('error.response.data.errors[0].errorcode: ', error.response.data.errors[0].errorcode)
        if (error.response.data.errors[0].errorcode == 11004) {
          const refresh = getRefreshToken()
          setToken(refresh)
          store.dispatch('user/refreshToken').then(() => {
            location.reload()
          })
        } else if (error.response.data.errors[0].errorcode == 401) {
          router.push('/login')
        } else if (error.response.data.errors[0].errorcode == 10302) {
          MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        } else {
          Message({
            message: error.response.data.errors[0].detail,
            type: 'error',
            duration: 5 * 1000
          })
        }
      } else {
        router.push('/500')
      }
    }

    return Promise.reject(error)
  }
)

export default service
