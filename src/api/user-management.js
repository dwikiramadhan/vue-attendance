import request from '@/utils/request'

export function getAdminUserList(query) {
  return request({
    url: '/admin/users',
    method: 'get',
    params: query
  })
}
export function getAdminUserListDetail() {
  return request({
    url: '/admin/user',
    method: 'get'
  })
}
export function postAdminUser(data) {
  return request({
    url: '/admin/user',
    method: 'post',
    data
  })
}
export function putAdminUser(data, admUsrId) {
  return request({
    url: '/admin/user/' + admUsrId,
    method: 'put',
    data
  })
}
export function putAdminUserPassword(data, admUsrId) {
  return request({
    url: '/admin/password/' + admUsrId,
    method: 'put',
    data
  })
}
export function deleteAdminUser(admUsrId) {
  return request({
    url: '/admin/user/' + admUsrId,
    method: 'delete'
  })
}
