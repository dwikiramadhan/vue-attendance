import request from '@/utils/request'

export function postAttendance(data) {
  return request({
    url: '/attendance',
    method: 'post',
    data
  })
}

export function todayAttendance(emp_no) {
  return request({
    url: '/attendance/get-today/' + emp_no,
    method: 'get'
  })
}

export function listAttendanceByEmpNo(emp_no, query) {
  return request({
    url: '/attendance/' + emp_no,
    method: 'get',
    params: query
  })
}