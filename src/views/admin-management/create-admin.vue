<template>
  <div class="app-container">
    <!-- HEADER -->
    <div class="title-container">
      <h1 class="page-title">Create User</h1>
      <div class="page-button">
        <el-button class="button-custom primary" @click="submit">Simpan</el-button>
        <el-button class="button-custom secondary" @click="$router.go(-1)">Back</el-button>
      </div>
    </div>
    
    <!-- FORM -->
    <el-row :gutter="40">
      <el-col :xs="24" :sm="10" :lg="10">
        <div class="form-card">
          <el-form ref="userDataForm" :model="userDataForm" :rules="userDataFormRules">
            <div class="form-title">Personal Details</div>
            <el-form-item class="form-input" label="First Name" prop="adm_usr_first_name">
              <el-input
                ref="adm_usr_first_name"
                v-model="userDataForm.adm_usr_first_name"
                placeholder="Please enter user first name"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
            <el-form-item class="form-input" label="Last Name" prop="adm_usr_last_name">
              <el-input
                ref="adm_usr_last_name"
                v-model="userDataForm.adm_usr_last_name"
                placeholder="Please enter user last name"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
            <el-form-item class="form-input" label="E-mail" prop="adm_usr_email">
              <el-input
                ref="adm_usr_email"
                v-model="userDataForm.adm_usr_email"
                placeholder="Please enter user e-mail"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
            <el-form-item class="form-input" label="Mobile Number" prop="adm_usr_mobile">
              <el-input
                ref="adm_usr_mobile"
                v-model="userDataForm.adm_usr_mobile"
                placeholder="Please enter user mobile number"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>
            <el-form-item class="form-input" label="Role" prop="adm_usr_role_title">
              <el-select
                ref="adm_usr_role_title"
                v-model="userDataForm.adm_usr_role_title"
                placeholder="Please choose a role"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.adm_role_id"
                  :label="item.adm_role_title"
                  :value="item.adm_role_title"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="form-input" label="Password" prop="adm_usr_pwd">
              <el-input
                ref="adm_usr_pwd"
                v-model="userDataForm.adm_usr_pwd"
                :type="isShowPassword?'text':'password'"
                placeholder="Please enter user password"
                tabindex="1"
              />
              <span class="show-pwd" @click="isShowPassword = !isShowPassword">
                <svg-icon :icon-class="isShowPassword ? 'eye-open' : 'eye'" />
              </span>
            </el-form-item>
            <el-form-item class="form-input" label="Confirm Password" prop="confirmPassword">
              <el-input
                ref="confirmPassword"
                v-model="userDataForm.confirmPassword"
                :type="isShowConfirmPassword?'text':'password'"
                placeholder="Please re-enter the password"
                tabindex="1"
              />
              <span class="show-pwd" @click="isShowConfirmPassword = !isShowConfirmPassword">
                <svg-icon :icon-class="isShowConfirmPassword ? 'eye-open' : 'eye'" />
              </span>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :xs="24" :sm="14" :lg="14">
        <div class="avatar-container">
          <span class="form-title">Avatar Picture</span>
          <img id="avatar" class="avatar-round" src="@/assets/avatar/avatar-1.jpg">
          <span class="form-info">Choose from below image or upload from your device</span>
          <input
            id="userAvatar"
            type="file"
            accept="image/jpg"
            @change="attachPhoto()"
          >
          <div class="avatar-option">
            <label for="userAvatar" class="upload-button-round"><i class="el-icon-upload" /></label>
            <div @click="handleClickImage('sample-1')">
              <img id="sample-1" class="avatar-sample" src="@/assets/avatar/avatar-1.png">
            </div>
            <div @click="handleClickImage('sample-2')">
              <img id="sample-2" class="avatar-sample" src="@/assets/avatar/avatar-2.png">
            </div>
            <div @click="handleClickImage('sample-3')">
              <img id="sample-3" class="avatar-sample" src="@/assets/avatar/avatar-3.png">
            </div>
            <div @click="handleClickImage('sample-4')">
              <img id="sample-4" class="avatar-sample" src="@/assets/avatar/avatar-4.png">
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="page-button-media bottom">
      <el-button class="button-custom primary" @click="submit">Simpan</el-button>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import CryptoJS from 'crypto-js'
import { getAdminRoleDropdown } from '@/api/role-management'
import { validAlphabets, validUsername, validNumeric, validPassword } from '@/utils/validate'
import { postAdminUser } from '@/api/user-management'

export default {
  components: { Sticky },
  data() {
    const validateAlphabets = (rule, value, callback) => {
      if (!validAlphabets(value)) {
        callback(new Error('Only allow alphabets'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }
    const validateNumber = (rule, value, callback) => {
      if (!validNumeric(value)) {
        callback(new Error('Only allow numeric'))
      } else {
        callback()
      }
    }
    const isSame = (rule, value, callback) => {
      if (value != this.userDataForm.adm_usr_pwd) {
        callback(new Error('Confirm password does not match! Make sure your password correct'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      const result = validPassword(value)
      if (result == 'complex') {
        callback(new Error('Password must be at least 8 characters contains uppercase, lowercase, number, special character (@$!%*?&:)'))
      } else if (result == 'sequence') {
        callback(new Error('Password can not contain sequence and predictable word (abc, 123, password, etc)'))
      } else if (result == 'repeat') {
        callback(new Error('Password can not contain repeated alphabet or number'))
      } else {
        if (this.userDataForm.adm_usr_first_name && this.userDataForm.adm_usr_last_name && this.userDataForm.adm_usr_email && this.userDataForm.adm_usr_mobile) {
          var regexFirstName = new RegExp('^((?!' + this.userDataForm.adm_usr_first_name + ').)*$', 'i')
          var regexLastName = new RegExp('^((?!' + this.userDataForm.adm_usr_last_name + ').)*$', 'i')
          var regexEmail = new RegExp('^((?!' + this.userDataForm.adm_usr_email + ').)*$', 'i')
          var regexMobile = new RegExp('^((?!' + this.userDataForm.adm_usr_mobile + ').)*$', 'i')
          if (!regexFirstName.test(value) || !regexLastName.test(value) || !regexEmail.test(value) || !regexMobile.test(value)) {
            callback(new Error('Password can not contain personal information'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    return {
      // form var
      isShowPassword: false,
      isShowConfirmPassword: false,
      userDataForm: {
        adm_usr_role_title: '',
        adm_usr_email: '',
        adm_usr_first_name: '',
        adm_usr_last_name: '',
        adm_usr_mobile: '',
        adm_usr_picurl: '',
        adm_usr_pwd: '',
        confirmPassword:'',
      },
      userDataFormRules: {
        adm_usr_role_title: [{ required: true, trigger: 'blur', message: 'Please choose a role' }],
        adm_usr_email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        adm_usr_first_name: [{ required: true, trigger: 'blur', validator: validateAlphabets }],
        adm_usr_last_name: [{ required: true, trigger: 'blur', validator: validateAlphabets }],
        adm_usr_mobile: [{ required: true, trigger: 'blur', validator: validateNumber }],
        adm_usr_pwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: isSame }]
      },
      listQuery: {
        page: 1,
        pagesize: 20,
        order: ''
      },
      isJPG:false,

      // dropdown var
      roleList: [],
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // get data
    getRoleList() {
      getAdminRoleDropdown(this.listQuery).then(response => {
        this.roleList = response.data
        this.handleClickImage('sample-4')
      })
    },

    // button action
    submit() {
      this.$refs.userDataForm.validate((valid) => {
        if (valid) {
          const data = document.getElementById('avatar').getAttribute('src')
          const tempData = Object.assign({}, this.userDataForm)
          if(this.isJPG){
            tempData.adm_usr_picurl = data.replace('data:image/jpeg;base64,', '')
          }
          else{
            tempData.adm_usr_picurl = data.replace('data:image/png;base64,', '')
          }
          
          tempData.adm_usr_pwd = this.encrypt(tempData.adm_usr_pwd)
          postAdminUser(tempData).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Success create user',
              type: 'success',
              duration: 2000
            })
            this.$router.push('/admin-management/list')
          }).catch(() => {
             this.$notify({
              title: 'Error',
              message: 'Create user failed',
              type: 'error',
              duration: 2000
            })
          })
        }
      })
    },

    handleClickImage(id) {
      const path = document.getElementById(id).getAttribute('src')
      this.getImageUrl(path, function(myBase64) {
        document.getElementById('avatar').setAttribute('src', myBase64)
      })
      this.isJPG = false;
    },

    clear() {
      this.confirmPassword = '',
      this.$refs.userDataForm.resetFields()
    },
    back(){
      this.$router.push({name:'UsersList'})
    },
    // functionality
    encrypt(data) {
      const key = 'jXn2r5u8x/A?D(G+KaPdSgVkYp3s6v9y'
      const iv = '314052241041852759327932946263923'
      const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC
      })
      return cipher.toString()
    },

    attachPhoto() {
      var selectedFile = document.getElementById('userAvatar').files
      if(selectedFile.length > 0){
        var file = selectedFile[0]
        const isLt70k = file.size / 1024 < 70
        if (file.type == 'image/jpeg' && isLt70k) {
          this.getBase64(file).then((data) => {
            document.getElementById('avatar').setAttribute('src', data)
            document.getElementById('userAvatar').value = ''
            this.isJPG = true
          }) 
        } else {
          this.$message({
            message: "File size must be JPG file less then 70KB",
            type: "warning",
          });
        }
      }
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    getImageUrl(path, callback) {
      var xhr = new XMLHttpRequest()
      xhr.onload = function() {
        var reader = new FileReader()
        reader.onloadend = function() {
          callback(reader.result)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.open('GET', path)
      xhr.responseType = 'blob'
      xhr.send()
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-container{
  display: flex;
  align-items: center;
  flex-direction: column;

  .form-info{
    font-size: 12px;
    text-align: center;
  }

  .avatar-round{
    object-fit: cover;
    width: 135px;
    height: 135px;
    border-radius: 50%;
    margin: 10px;
  }
  .avatar-option{
    display: flex;
    justify-content: center;
    margin: 15px;
    
    .avatar-sample {
      object-fit: cover;
      width: 60px;
      height: 60px;
      margin: 0 7px;
      transition: 0.2s;

      &:hover{
        cursor: pointer;
        opacity: 0.7;
      }
    }

    .upload-button-round{
    @extend .avatar-sample;
      border-radius: 50%;
      background: #0089C4;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
    }
  }
  
}

@media(max-width: 600px){
  .app-container{
    padding: 20px;
  }

  .avatar-container{
    margin: 20px;
    .avatar-round{
      width: 125px;
      height: 125px;
    }

    .button-fill{
      padding: 7px 20px;
    }

    .avatar-option{
      .avatar-sample{
        width: 50px;
        height: 50px;
        margin: 0 5px;
      }
    }
  }
}
</style>

<style lang="scss">
.el-form-item__error{
  position: relative;
}
</style>
