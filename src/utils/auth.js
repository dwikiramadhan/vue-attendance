import Cookies from 'js-cookie'

const TokenKey = 'Attendance-Token'
const RefreshKey = 'Admin-UMA-Refresh'
const IpKey = 'Admin-IP'

// token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// refresh token
export function getRefreshToken() {
  return Cookies.get(RefreshKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshKey, token)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshKey)
}
