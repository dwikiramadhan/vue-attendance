import request from '@/utils/request'

export function getAdminRoleDropdown() {
  return request({
    url: '/admin/dropdown/role',
    method: 'get'
  })
}

export function getRoleList(query) {
  return request({
    url: '/admin/dropdown/role',
    // url: '/admin/userroles',
    method: 'get',
    param: query
  })
}
