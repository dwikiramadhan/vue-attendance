import { login, logout, getUser, getTokenRefresh } from '@/api/user'
import { getToken, setToken, removeToken, setRefreshToken, getRefreshToken, removeRefreshToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import jwt_decode from "jwt-decode";

const state = {
  token: getToken(),
  name: '',
  email: '',
  emp_no: '',
  id: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_EMP_NO: (state, emp_no) => {
    state.emp_no = emp_no
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email: username.trim(), password: password }).then(response => {
        const { data } = response
        setToken(data.data.access)
        // setRefreshToken(data.access_token)
        resolve()
      }).catch(error => {
        console.log("error: ", error);
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      const token = getToken()
      var decoded = jwt_decode(token);
      getUser(decoded.emp_no).then(response => {
        const { admin_id, admin_name, admin_email, emp_no, role } = response.data.data
        const roles = [
          role
        ]
        const data = { 
          name: admin_name, 
          email: admin_email, 
          emp_no: emp_no, 
          id: admin_id,
          roles: roles,
        }

        // commit('SET_REGNUMBER',adm_usr_reg_number)
        commit('SET_EMAIL', admin_email)
        commit('SET_NAME', admin_name)
        commit('SET_EMP_NO', emp_no)
        commit('SET_ID', admin_id)
        commit('SET_ROLES', roles)
        // commit('SET_AVATAR', adm_usr_picurl)
        console.log('data: ', data);
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })

  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_NAME', '')
      commit('SET_EMP_NO', '')
      commit('SET_EMAIL', '')
      commit('SET_ID', '')
      removeToken()
      // removeRefreshToken()
      resetRouter()
      
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })
      
      resolve()
    })
  },

  // refresh token
  refreshToken({ commit }) {
    return new Promise(resolve => {
      getTokenRefresh().then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        setRefreshToken(data.refresh_token)
        resolve(data)
      })
    })
  },

  // reset token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeRefreshToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
