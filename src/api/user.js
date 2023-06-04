import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getUser(emp_no) {
  return request({
    url: '/employee/' + emp_no,
    method: 'get',
  })
}

export function getTokenRefresh() {
  return request({
    url: '/auth/refreshtoken',
    method: 'post',
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  })
}

