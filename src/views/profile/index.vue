<template>
  <div class="app-container">
    <el-card class="card-round">
      <div class="name" v-if="!isEdit">{{name}}</div>
      <div v-else>
        <el-form ref="editForm" :model="editForm" :rules="userListRules">
          <el-form-item prop="adm_usr_first_name">
            <el-input ref="adm_usr_first_name" placeholder="Firstname" v-model="editForm.adm_usr_first_name" tabindex="1" auto-complete="on"/>
          </el-form-item>
          <el-form-item prop="adm_usr_last_name">
            <el-input ref="adm_usr_last_name" placeholder="Lastname" v-model="editForm.adm_usr_last_name" tabindex="1" auto-complete="on"/>
          </el-form-item>
          <el-form-item prop="adm_usr_mobile">
            <el-input ref="adm_usr_mobile" placeholder="Phone number" v-model="editForm.adm_usr_mobile" tabindex="1" auto-complete="on"/>
          </el-form-item>
          <el-form-item prop="adm_usr_email">
            <el-input ref="adm_usr_email" placeholder="Email" v-model="editForm.adm_usr_email" tabindex="1" auto-complete="on"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="role" v-if="!isEdit">{{roles[0]}}</div>
      <div class="username" v-if="!isEdit">{{ email }}</div>
      <div v-if="!isEdit">
        <el-button class="button-custom full primary" @click="handleEdit">Edit Data</el-button>
        <el-button class="button-custom full info" @click="dialogChangePassword = true">Change Password</el-button>
      </div>
      <div v-else>
        <el-button class="button-custom full success" @click="updateUser">Save</el-button>
        <el-button class="button-custom full info" @click="isEdit=!isEdit">Cancel</el-button>
      </div>
    </el-card>

    <!-- CHANGE PASSWORD DIALOG -->
    <el-dialog title="Change Password" :visible.sync="dialogChangePassword" :close-on-click-modal="false" class="dialog-small">
      <el-form>
        <el-form-item>
          <el-input
            :type="isShowCurrentPassword?'text':'password'"
            placeholder="Old Password"
            name="password"
            tabindex="2"
          />
          <span class="show-pwd" @click="isShowCurrentPassword = !isShowCurrentPassword">
            <svg-icon :icon-class="isShowCurrentPassword ? 'eye-open' : 'eye'" />
          </span>
        </el-form-item>
        <el-form-item>
          <el-input
            :type="isShowPassword?'text':'password'"
            placeholder="New Password"
            name="password"
            tabindex="2"
          />
          <span class="show-pwd" @click="isShowPassword = !isShowPassword">
            <svg-icon :icon-class="isShowPassword ? 'eye-open' : 'eye'" />
          </span>
        </el-form-item>
         <el-form-item>
          <el-input
            :type="isShowConfirmPassword?'text':'password'"
            placeholder="Confirm Password"
            name="password"
            tabindex="2"
          />
          <span class="show-pwd" @click="isShowConfirmPassword = !isShowConfirmPassword">
            <svg-icon :icon-class="isShowConfirmPassword ? 'eye-open' : 'eye'" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="button-custom small info" @click="dialogChangePassword = false">Cancel</el-button>
        <el-button class="button-custom small success">Simpan</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validNumeric, validPassword, validUsername, validAlphabets } from '@/utils/validate'
import { mapGetters } from 'vuex'
import { putAdminUser } from '@/api/user-management'

export default {
  data(){
    const validateAlphabets = (rule, value, callback) => {
      if (!validAlphabets(value)) {
        callback(new Error('Only allow alphabets'))
      } else {
        callback()
      }
    }
    const validateNumber = (rule, value, callback) => {
      if (!validNumeric(value)) {
        callback(new Error('Mobile number must be numeric'))
      } else {
        callback()
      }
    }
    const isSameChangePassword = (rule, value, callback) => {
      if (value !== this.changePasswordForm.adm_updated_password) {
        callback(
          new Error(
            'Confirm password does not match! Make sure your password correct'
          )
        )
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      const result = validPassword(value)
      if (result === 'complex') {
        callback(
          new Error(
            'Password must be at least 8 characters contains uppercase, lowercase, number, special character (@$!%*?&)'
          )
        )
      } else if (result === 'sequence') {
        callback(
          new Error(
            'Password can not contain sequence and predictable word (abc, 123, password, etc)'
          )
        )
      } else if (result === 'repeat') {
        callback(
          new Error('Password can not contain repeated alphabet or number')
        )
      } else {
        if (
          this.editForm.adm_usr_first_name &&
          this.editForm.adm_usr_last_name &&
          this.editForm.adm_usr_email &&
          this.editForm.adm_usr_mobile
        ) {
          var regexFirstName = new RegExp(
            '^((?!' + this.editForm.adm_usr_first_name + ').)*$',
            'i'
          )
          var regexLastName = new RegExp(
            '^((?!' + this.editForm.adm_usr_last_name + ').)*$',
            'i'
          )
          var regexEmail = new RegExp(
            '^((?!' + this.editForm.adm_usr_email + ').)*$',
            'i'
          )
          var regexMobile = new RegExp(
            '^((?!' + this.editForm.adm_usr_mobile + ').)*$',
            'i'
          )
          if (
            !regexFirstName.test(value) ||
            !regexLastName.test(value) ||
            !regexEmail.test(value) ||
            !regexMobile.test(value)
          ) {
            callback(
              new Error('Password can not contain personal information')
            )
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }

    return{
      editForm: {},
      roleList:['Role_1','Role_2'],

      // flag var
      isEdit: false,
      isShowCurrentPassword: false,
      isShowPassword: false,
      isShowConfirmPassword: false,

      // dialog var
      dialogChangePassword: false,

      userListRules: {
        adm_usr_first_name: [
          { required: true, trigger: 'blur', message: 'Please enter the firstname' }
        ],
        adm_usr_last_name: [
          { required: true, trigger: 'blur', message: 'Please enter the lastname' }
        ],
        adm_usr_email: [
          { required: true, trigger: 'blur', message: 'Please enter the email' }
        ],
        adm_usr_mobile: [
          { required: true, trigger: 'blur', validator: validateNumber }
        ],
      }
    }
  },
  computed:{
    ...mapGetters([
      'name',
      'first_name',
      'last_name',
      'phone_number',
      'email',
      'status',
      'id',
      'roles',
    ])
  },
  methods:{
    handleEdit(){
      this.editForm = {
        name: this.name,
        adm_usr_email: this.email,
        adm_usr_role_title: this.roles[0],
        adm_usr_first_name: this.first_name,
        adm_usr_last_name: this.last_name,
        adm_usr_mobile: this.phone_number,
        adm_usr_active: this.status,
        id: this.id,
        role: this.roles[0],
      }
      
      this.isEdit = !this.isEdit
    },

    updateUser() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.editForm)

          console.log('this.editForm: ', this.editForm);

          putAdminUser(tempData, this.editForm.id).then(async (response) => {
            await this.$notify({
              title: 'Success',
              message: 'Successfully update user, please login again!',
              type: 'success',
              duration: 3000
            })
            
            await this.$store.dispatch('user/logout')
            this.$router.push('/login')
            // this.cancelForm()
          }).catch((err) => {
            this.$notify({
              title: 'Error',
              message: 'Failed update user',
              type: 'error',
              duration: 2000
            })
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.app-container{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 94vh;
}

.card-round{
  text-align: left;
  .name{
    font-family: 'Roboto';
    font-weight: 700;
    font-size: 42px;
    line-height: 49px;
    color: #D5E1E7;
    margin-bottom: 7px;
  }

  .role{
    font-family: 'Roboto';
    font-weight: 600;
    font-size: 26px;
    line-height: 30px;
    letter-spacing: 0.02em;
    color: #668EAB;
    margin-bottom: 20px;
  }

  .username{
    font-family: 'Quicksand';
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.02em;
    color: #668EAB;
    margin-bottom: 40px;
  }

  .el-button{
    margin: 7px 0;
  }
}

@media(max-width: 450px){
  .card-round{
    padding: 20px 10px;
    .name{
      font-size:26px;
      margin-bottom: 5px;
      line-height: 25px;
    }

    .role{
      font-size: 16px;
      margin-bottom: 10px;
    }

    .el-button{
      padding: 12px;
    }
  }
}
</style>