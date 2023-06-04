import request from '@/utils/request'

export function getEventLogs(query) {
  return request({
    url: '/events',
    method: 'get',
    params: query
  })
}

export function getHighSeverityEvents(query) {
  return request({
    url: '/events/high/severity',
    method: 'get',
    params: query
  })
}


