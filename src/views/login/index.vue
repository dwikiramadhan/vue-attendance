<template>
  <div>
    <div class="login-container">
      <div class="brand-container">
        <img src="@/assets/logo/pins.png" style="width: 70%;" alt="">
      </div>
      <div class="form-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              ref="password"
              v-model="loginForm.password"
              :type="isShowPassword?'text':'password'"
              placeholder="Password"
              name="password"
              tabindex="2"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="isShowPassword = !isShowPassword">
              <svg-icon :icon-class="isShowPassword ? 'eye-open' : 'eye'" />
            </span>
          </el-form-item>
          <el-button class="button-custom full primary" :loading="loading" @click.native.prevent="handleLogin">Login</el-button>
        </el-form>
      </div>
      <!-- <p class="text-center"><b>Pre</b>diktif - Respon<b>si</b>bilitas - Transparan<b>si</b> - Berkeadilan</p> -->
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import CryptoJS from 'crypto-js'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('Please enter the correct password'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }]
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      isShowPassword: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      logo: process.env.BASE_URL + 'logomss.png'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.$route.params.code === 204) {
      this.$notify({
        title: 'Success',
        message: 'Logout successfully!',
        type: 'success',
        duration: 1000
      })
    }else if(this.$route.params.code === 440){
      this.$notify({
        title: 'Error',
        message: 'Session expired, please login again!',
        type: 'error',
        duration: 1000
      })
    }

    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const tempData = Object.assign({}, this.loginForm)
          // tempData.password = this.encrypt(tempData.password)
          this.$store.dispatch('user/login', tempData)
          .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

$primary: #4c81b3;
$secondary: #E6FBFF;
$hover: #3e72a3;
$title: #147B8F; 

@keyframes slide {
  0% {
    transform:translateX(-25%);
  }
  100% {
    transform:translateX(25%);
  }
}

.bg {
  animation:slide 3s ease-in-out infinite alternate;
  background-image: linear-gradient(-60deg, #051438 50%, #091f4e 50%);
  bottom:0;
  left:-50%;
  opacity:.8;
  position:fixed;
  right:-50%;
  top:0;
  z-index:-1;
}

.bg2 {
  animation-direction:alternate-reverse;
  animation-duration:8s;
}

.bg3 {
  animation-duration:9s;
}

.login-container{
  padding: 10vh 40px 40px 40px;
  width: 100vw;
  min-height: 100vh;
  height: auto;
  // background-image: url("../../assets/login-bg.png");
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;

  .form-container{
    width: 30vw;
    margin: auto;
    border-radius: 10px;
    padding: 25px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 24px;
    // background: #FFF;

    .title-container{
      .logo-container{
        // position: relative;
        // width: 395px;
        .title{
          font-size: 45px;
          font-weight: 500;
          line-height: 59px;
          color: #d6d6f2;
          margin-bottom: 12px;
          font-family: 'Roboto', sans-serif;
        }

        .subtitle{
          // position: absolute;
          top: 60px;
          // right: 32px;
          text-align: center;
          font-size: 16px;
          line-height: 19px;
          color: #494949;
          margin-bottom: 12px;
          font-weight: bold;
        }
      }
    }
  }

  .brand-container{
    width: 30vw;
    margin: auto;
    text-align: center;
    margin-bottom: 20px;

    .title-container{
      text-align: center;
      margin-bottom: 20px;

      .logo-container{
        position: relative;
        // width: 395px;
        .title{
          font-size: 40px;
          font-weight: 500;
          line-height: 59px;
          letter-spacing: -0.05em;
          color: #d6d6f2;
          margin-bottom: 12px;
          font-family: 'Roboto', sans-serif;
        }

        .subtitle{
          // position: absolute;
          top: 60px;
          // right: 32px;
          text-align: center;
          font-size: 16px;
          line-height: 19px;
          color: #494949;
          margin: 12px 0 12px 0;
          font-weight: bold;
        }
      }
    }
  }
}

@media(max-width:600px){
  .login-container .form-container{
    width: 245px;

    .title-container .logo-container{
      width: 245px;

      .title{
        font-size: 32px;
      }

      .subtitle{
        font-size: 14px;
        top: 50px;
        right: 20px;
      }
    }
  }
}
</style>
