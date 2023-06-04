import request from '@/utils/request'

export function getDashboardHeader(){
  return request ({
    url:'/dashboard/header',
    method: 'get',
  })
}