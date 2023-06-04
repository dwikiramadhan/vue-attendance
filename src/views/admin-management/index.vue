<template>
  <div class="app-container">
    <!-- HEADER -->
    <div class="title-container">
      <h1 class="page-title">Admin Management</h1>
    </div>

    <!-- BUTTON FOR SMALL MEDIA -->
    <div class="page-button-media">
      <el-tooltip content="Filter" placement="top">
        <el-button class="button-icon primary" @click="dialogFilter = true"><i class="fa-solid fa-filter" /></el-button>
      </el-tooltip>
    </div>

    <!-- FILTER -->
    <div class="filter-container">
      <h4 class="filter-form filter-title">Filter</h4>
    </div>
    <div class="filter-container">
      <el-form class="filter-form" style="margin-bottom: 10px">
        <el-col :span="7">
          <el-form-item class="filter-form-item input-small">
            <el-input v-model="listQuery.firstName" placeholder="Firstname" clearable @change="handleFilter" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item class="filter-form-item input-small">
            <el-input v-model="listQuery.email" placeholder="Email" clearable @change="handleFilter" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item class="filter-form-item input-small">
            <el-input v-model="listQuery.phoneNumber" placeholder="Phone Number" clearable @change="handleFilter" />
          </el-form-item>
        </el-col>
        <!-- <el-form-item class="filter-form-item input-small">
          <el-select v-model="listQuery.roleTitle" placeholder="Roles" clearable @change="handleFilter">
            <el-option v-for="item, index in roleList" :key="index" :label="item.adm_role_title" :value="item.adm_role_title" />
          </el-select>
        </el-form-item> -->
        <el-col :span="7">
          <el-form-item class="filter-form-item input-small">
            <el-select v-model="listQuery.adminStatus" placeholder="Status" clearable @change="handleFilter">
              <el-option v-for="item, index in statusList" :key="index" :label="item"
                :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="filter-container">
      <el-form class="filter-form">
        <el-col :span="7">
          <el-form-item class="filter-form-item input-small">
            <el-date-picker v-model="listQuery.createdFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd"
              type="date" clearable placeholder="Created Start" @change="handleFilter" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item class="filter-form-item input-small">
            <el-date-picker v-model="listQuery.createdTo" :picker-options="dateBetween" value-format="yyyy-MM-dd"
              type="date" clearable placeholder="Created End" @change="handleFilter" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item class="filter-form-item input-small">
            <el-date-picker v-model="listQuery.lastLoginFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd"
              type="date" clearable placeholder="Last Login Start" @change="handleFilter" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item class="filter-form-item input-small">
            <el-date-picker v-model="listQuery.lastLoginTo" :picker-options="dateBetween" value-format="yyyy-MM-dd"
              type="date" clearable placeholder="Last Login End" @change="handleFilter" />
          </el-form-item>
        </el-col>
      </el-form>
    </div>

    <!-- FILTER DIALOG FOR SMALL MEDIA -->
    <el-dialog title="Filter" :visible.sync="dialogFilter" class="dialog-small">
      <el-form>
        <el-form-item>
          <el-input v-model="listQuery.firstName" placeholder="Firstname" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.email" placeholder="Email" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.phone_number" placeholder="Phone Number" clearable />
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.adminStatus" placeholder="Status" clearable >
            <el-option v-for="item, index in statusList" :key="index" :label="item"
              :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.createdFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd"
            type="date" clearable placeholder="Created Start" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.createdTo" :picker-options="dateBetween" value-format="yyyy-MM-dd"
            type="date" clearable placeholder="Created End" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.lastLoginFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd"
            type="date" clearable placeholder="Last Login Start" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.lastLoginTo" :picker-options="dateBetween" value-format="yyyy-MM-dd"
            type="date" clearable placeholder="Last Login End"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="button-custom small primary" @click="handleFilter">Search</el-button>
      </div>
    </el-dialog>

    <div class="container">
      <el-tooltip content="Add Admin" placement="top">
        <el-button class="button-icon success super" icon="el-icon-plus" @click="handleAdd()" />
      </el-tooltip>
    </div>

    <!-- TABLE -->
    <el-table :key="tableKey" v-loading="listLoading" :data="dataList" fit @sort-change="sortChange">
      <el-table-column label="Firstname" prop="name" sortable="custom">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="editList.adm_usr_first_name" class="edit-input" />
          </template>
          <span v-else>{{ row.adm_usr_first_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" prop="email" sortable="custom">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="editList.adm_usr_email" class="edit-input" />
          </template>
          <span v-else>{{ row.adm_usr_email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone Number" prop="phone_number" sortable="custom">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="editList.adm_usr_mobile" class="edit-input" />
          </template>
          <span v-else>{{ row.adm_usr_mobile }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Role" prop="role" sortable="custom">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="editList.role_id" class="edit-input">
              <el-option v-for="item, index in roleList" :key="index" :label="item.adm_role_title"
                :value="item.adm_role_id" />
            </el-select>
          </template>
          <span v-else>{{ row.adm_role_title }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="Status" prop="status" sortable="custom">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="editList.adm_usr_active" class="edit-input" />
          </template>
          <span v-else>{{ row.adm_usr_active }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Created at" prop="createdAt" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.adm_usr_created_at | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Last Updated" prop="last_updated" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.admin_lastUpdated | dateTimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Last Login" prop="lastLogin" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.adm_usr_last_login | dateTimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" width="150px">
        <template slot-scope="{row}">
          <el-tooltip content="Edit" placement="top">
            <el-button v-show="!row.edit" class="table-icon-button primary" @click="handleEdit(row)"><i
                class="el-icon-edit" /></el-button>
          </el-tooltip>
          <el-tooltip content="Change Password" placement="top">
            <el-button v-show="!row.edit" class="table-icon-button warning" @click="dialogChangePassword = true"><i
                class="el-icon-lock" /></el-button>
          </el-tooltip>
          <el-tooltip content="Delete" placement="top">
            <el-button v-show="!row.edit" class="table-icon-button danger"
              @click="handleDeleteAdmin(row.adm_usr_id, row.adm_usr_first_name, row.adm_usr_email)"><i class="el-icon-delete" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Save" placement="top">
            <el-button v-show="row.edit" class="table-icon-button success"><i class="el-icon-check" /></el-button>
          </el-tooltip>
          <el-tooltip content="Cancel" placement="top">
            <el-button v-show="row.edit" class="table-icon-button danger" @click="cancelEdit(row)"><i
                class="el-icon-close" /></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize"
      @pagination="getList" />

    <!-- ADD ADMIN DIALOG -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogAddAdmin" :close-on-click-modal="false" class="dialog-small">
      <el-form ref="userListForm" :model="userListForm" :rules="userListRules">
        <el-form-item prop="adm_usr_first_name">
          <el-input ref="adm_usr_first_name" v-model="userListForm.adm_usr_first_name" placeholder="Firstname"
            type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item prop="adm_usr_last_name">
          <el-input ref="adm_usr_last_name" v-model="userListForm.adm_usr_last_name" placeholder="Lastname" type="text"
            tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item prop="adm_usr_email">
          <el-input ref="adm_usr_email" v-model="userListForm.adm_usr_email" placeholder="Email" type="text"
            tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item prop="adm_usr_mobile">
          <el-input ref="adm_usr_mobile" v-model="userListForm.adm_usr_mobile" placeholder="Phone Number" type="text"
            tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item>
          <el-select ref="adm_usr_role_title" v-model="userListForm.adm_usr_role_title" placeholder="Role"
            name="adm_usr_role_title">
            <el-option v-for="item in roleList" :key="item.adm_role_id" :label="item.adm_role_title"
              :value="item.adm_role_title" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select ref="adm_usr_active" v-model="userListForm.adm_usr_active" placeholder="Status"
            name="adm_usr_active">
            <el-option v-for="item in statusList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!userListForm.edit" prop="usr_pwd_hash">
          <el-input ref="usr_pwd_hash" v-model="userListForm.usr_pwd_hash" :type="isShowPassword ? 'text' : 'password'"
            placeholder="Password" name="password" tabindex="2" />
          <span class="show-pwd" @click="isShowPassword = !isShowPassword">
            <svg-icon :icon-class="isShowPassword ? 'eye-open' : 'eye'" />
          </span>
        </el-form-item>
        <el-form-item v-if="!userListForm.edit" prop="confirmPassword">
          <el-input ref="confirmPassword" v-model="userListForm.confirmPassword"
            :type="isShowConfirmPassword ? 'text' : 'password'" placeholder="Confirm Password" name="password"
            tabindex="2" />
          <span class="show-pwd" @click="isShowConfirmPassword = !isShowConfirmPassword">
            <svg-icon :icon-class="isShowConfirmPassword ? 'eye-open' : 'eye'" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="button-custom small info" @click="dialogAddAdmin = false">Cancel</el-button>
        <el-button v-if="userListForm.edit" class="button-custom small success" @click="updateUser">Simpan</el-button>
        <el-button v-else class="button-custom small success" @click="createUser">Simpan</el-button>
      </div>
    </el-dialog>

    <!-- CHANGE PASSWORD DIALOG -->
    <el-dialog title="Change Password" :visible.sync="dialogChangePassword" :close-on-click-modal="false"
      class="dialog-small">
      <el-form ref="changePasswordForm" :model="changePasswordForm" :rules="changePasswordFormRules">
        <el-form-item prop="adm_updated_password">
          <el-input ref="adm_updated_password" v-model="changePasswordForm.adm_updated_password"
            :type="isShowPassword ? 'text' : 'password'" placeholder="New Password" name="adm_updated_password"
            tabindex="2" />
          <span class="show-pwd" @click="isShowPassword = !isShowPassword">
            <svg-icon :icon-class="isShowPassword ? 'eye-open' : 'eye'" />
          </span>
        </el-form-item>
        <el-form-item prop="confirmPasswordUpdated">
          <el-input ref="confirmPasswordUpdated" v-model="changePasswordForm.confirmPasswordUpdated"
            :type="isShowConfirmPassword ? 'text' : 'password'" placeholder="Confirm Password" tabindex="2"
            name="confirmPasswordUpdated" />
          <span class="show-pwd" @click="isShowConfirmPassword = !isShowConfirmPassword">
            <svg-icon :icon-class="isShowConfirmPassword ? 'eye-open' : 'eye'" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="button-custom small info" @click="dialogChangePassword = false">Cancel</el-button>
        <el-button class="button-custom small success" @click="changePassword">Simpan</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment'
import Pagination from '@/components/Pagination'
import { validNumeric, validPassword, validUsername, validAlphabets } from '@/utils/validate'
import { MessageBox } from 'element-ui'
import { getAdminUserList, postAdminUser, putAdminUser, deleteAdminUser } from '@/api/user-management'
import { getRoleList } from '@/api/role-management'
import CryptoJS from 'crypto-js'

export default {
  components: { Pagination },
  filters: {
    dateFilter: function (date) {
      if (moment(date).isValid()) {
        return moment(date).format('DD MMM YYYY')
      } else {
        return '-'
      }
    },
    dateTimeFilter: function (date) {
      if (moment(date).isValid()) {
        return moment(date).format('DD MMM YYYY HH:mm')
      } else {
        return '-'
      }
    }
  },
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
        callback(new Error('Mobile number must be numeric'))
      } else {
        callback()
      }
    }
    const isSame = (rule, value, callback) => {
      if (value != this.userListForm.usr_pwd_hash) {
        callback(
          new Error(
            'Confirm password does not match! Make sure your password correct'
          )
        )
      } else {
        callback()
      }
    }
    const isSameChangePassword = (rule, value, callback) => {
      if (value != this.changePasswordForm.adm_updated_password) {
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
      if (result == 'complex') {
        callback(
          new Error(
            'Password must be at least 8 characters contains uppercase, lowercase, number, special character (@$!%*?&)'
          )
        )
      } else if (result == 'sequence') {
        callback(
          new Error(
            'Password can not contain sequence and predictable word (abc, 123, password, etc)'
          )
        )
      } else if (result == 'repeat') {
        callback(
          new Error('Password can not contain repeated alphabet or number')
        )
      } else {
        if (
          this.userListForm.adm_usr_first_name &&
          this.userListForm.adm_usr_last_name &&
          this.userListForm.adm_usr_email &&
          this.userListForm.adm_usr_mobile
        ) {
          var regexFirstName = new RegExp(
            '^((?!' + this.userListForm.adm_usr_first_name + ').)*$',
            'i'
          )
          var regexLastName = new RegExp(
            '^((?!' + this.userListForm.adm_usr_last_name + ').)*$',
            'i'
          )
          var regexEmail = new RegExp(
            '^((?!' + this.userListForm.adm_usr_email + ').)*$',
            'i'
          )
          var regexMobile = new RegExp(
            '^((?!' + this.userListForm.adm_usr_mobile + ').)*$',
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

    return {
      // filter date
      dateBetween: { disabledDate: this.disabledOtherDate },

      // query var
      listQuery: {
        page: 1,
        pagesize: 10,
        order: '',
        email: '',
        start: 1,
        firstName: '',
        adminStatus: '',
        lastName: '',
        phoneNumber: '',
        roleTitle: '',
        createdFrom: '',
        createdTo: '',
        lastLoginFrom: '',
        lastLoginTo: ''
      },

      // table var
      tableKey: 0,
      listLoading: true,
      total: 0,
      dataList: [],
      editList: [],

      // flag var
      isShowPassword: false,
      isShowConfirmPassword: false,

      // dropdown var
      roleList: ['Role 1', 'Role 2'],
      statusList: ['ACTIVE', 'INACTIVE'],

      // dialog var
      dialogFilter: false,
      dialogAddAdmin: false,
      dialogChangePassword: false,
      dialogTitle: 'Add Admin',

      // form var
      userListForm: {
        edit: false,
        user_id: undefined,
        role_id: undefined,
        adm_usr_email: '',
        adm_usr_role_title: '',
        adm_usr_first_name: '',
        adm_usr_last_name: '',
        adm_usr_mobile: '',
        adm_usr_active: '',
        adm_usr_pwd: '',
        usr_pwd_hash: '',
        confirmPassword: ''
      },

      changePasswordForm: {
        adm_updated_password: '',
        confirmPasswordUpdated: '',
        adm_usr_reg_number: ''
      },

      changePasswordFormRules: {
        adm_updated_password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPasswordUpdated: [{ required: true, trigger: 'blur', validator: isSameChangePassword }]
      },

      userListRules: {
        role_id: [
          { required: true, trigger: 'blur', message: 'Please choose a role' }
        ],
        adm_usr_email: [
          { required: true, trigger: 'blur', validator: validateEmail }
        ],
        adm_usr_first_name: [
          { required: true, trigger: 'blur', validator: validateAlphabets }
        ],
        adm_usr_last_name: [
          { required: true, trigger: 'blur', validator: validateAlphabets }
        ],
        adm_usr_mobile: [
          { required: true, trigger: 'blur', validator: validateNumber }
        ],
        usr_pwd_hash: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: isSame }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    // DISABLE DATE
    disabledOtherDate(time) {
      var maxDate = moment()._d
      var isAfterMaxDate = time.getTime() > maxDate
      return isAfterMaxDate
    },

    getRoles() {
      if (this.listQuery.page == 1) {
        this.listQuery.start = 1
      } else {
        this.listQuery.start = this.listQuery.pagesize * (this.listQuery.page-1) + 1
      }
      getRoleList(this.listQuery).then(response => {
        this.roleList = response.data.roles
        this.getList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: 'Failed fetch role data'
        })
      })
    },

    convertRoles(roleId) {
      for (var i = 0; i < this.roleList.length; i++) {
        if (roleId === this.roleList[i].role_id) {
          return this.roleList[i].role_title
        }
      }
    },

    getList() {
      this.listLoading = true
      getAdminUserList(this.listQuery).then(response => {
        this.dataList = response.data.data
        for (var i = 0; i < this.dataList.length; i++) {
          this.dataList[i].role_id = this.convertRoles(this.dataList[i].role_id)
        }
        this.total = response.data.total_records
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // button action
    createUser() {
      this.$refs.userListForm.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.userListForm)
          tempData.user_id = +this.userListForm.user_id
          // tempData.usr_created_by = 'SYSTEM'
          // tempData.usr_created_at = new Date()
          // tempData.usr_status = 'ACTIVE'
          console.log('tempData Before: ', tempData)
          tempData.adm_usr_pwd = this.encrypt(this.userListForm.usr_pwd_hash)
          console.log('tempData: ', tempData)

          postAdminUser(tempData).then((response) => {
            if (response.err_details === 'admin user already exist') {
              this.$notify({
                title: 'Error',
                message: 'Admin user already exist',
                type: 'error',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'Success',
                message: 'Successfully create user',
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.dialogAddAdmin = false
              // this.cancelForm()
            }
          }).catch((err) => {
            this.$notify({
              title: 'Error',
              message: 'Failed create user',
              type: 'error',
              duration: 2000
            })
          })
        }
      })
    },

    updateUser() {
      this.$refs.userListForm.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.userListForm)
          tempData.user_id = +this.userListForm.user_id
          console.log('tempData: ', tempData)

          putAdminUser(tempData, this.userListForm.user_id).then((response) => {
            this.$notify({
              title: 'Success',
              message: 'Successfully update user',
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.dialogAddAdmin = false
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

    // BUTTON ACTION
    handleEdit(row) {
      this.editList = JSON.parse(JSON.stringify(row))
      this.userListForm.edit = true
      this.dialogTitle = 'Edit Admin'
      this.userListForm.user_id = row.adm_usr_id
      this.userListForm.adm_usr_first_name = row.adm_usr_first_name
      this.userListForm.adm_usr_last_name = row.adm_usr_last_name
      this.userListForm.adm_usr_email = row.adm_usr_email
      this.userListForm.adm_usr_mobile = row.adm_usr_mobile
      this.userListForm.adm_usr_role_title = row.adm_role_title
      this.userListForm.role_id = row.role_id
      this.userListForm.adm_usr_active = row.adm_usr_active
      this.dialogAddAdmin = true
      row.edit = !row.edit
      console.log('userListForm: ', this.userListForm.edit)
    },

    handleAdd() {
      this.userListForm.edit = false
      this.dialogTitle = 'Add Admin'
      this.userListForm.adm_usr_first_name = ''
      this.userListForm.adm_usr_last_name = ''
      this.userListForm.adm_usr_email = ''
      this.userListForm.adm_usr_mobile = ''
      this.userListForm.usr_pwd_hash = ''
      this.userListForm.confirmPassword = ''
      this.userListForm.role_id = undefined
      this.userListForm.adm_usr_role_title = ''
      this.userListForm.adm_usr_active = ''
      this.userListForm.edit = false
      this.dialogAddAdmin = true
    },

    handleChangePassword(id) {
      getAdminUserListDetail(id).then(response => {
        this.editUserForm = response.data
      })
      this.changePasswordForm.adm_usr_reg_number = id
      this.dialogChangePasswordVisible = true
    },
    handleCancelChangePassword() {
      this.dialogChangePasswordVisible = false
      this.$refs.changePasswordForm.resetFields()
    },

    changePassword() {
      this.$refs.changePasswordForm.validate((valid) => {
        if (valid) {
          this.loadingChange = true
          const tempData = Object.assign({}, this.changePasswordForm)
          tempData.adm_current_password = this.encrypt(tempData.adm_current_password)
          tempData.adm_udpated_password = this.encrypt(tempData.adm_udpated_password)
          putAdminUserPassword(tempData, tempData.adm_usr_reg_number).then(() => {
            this.loadingChange = false
            this.$notify({
              title: 'Success',
              message: 'Successfully Change',
              type: 'success',
              duration: 2000
            })
            this.$router.go('/admin/users')
          }).catch(() => {
            this.loadingChange = false
          })
        }
      })
    },

    cancelEdit(row) {
      row.edit = false
      // this.getList()
    },

    handleDeleteAdmin(id, name, username) {
      MessageBox.confirm(`Are you sure you want to delete admin ${name} (${username})? Your action can not be undone.`, 'Delete Confirmation', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteAdminUser(id).then((response) => {
          this.$notify({
            title: 'Success',
            message: 'Successfully delete user',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch((err) => {
          this.$notify({
            title: 'Error',
            message: 'Failed update user',
            type: 'error',
            duration: 2000
          })
        })
      }).catch(() => { })
    },

    cancelForm() {
      const view = this.$route.path
      this.$store
        .dispatch('tagsView/delView', view)
        .then(({ visitedViews }) => {
          const view2 = visitedViews.slice(-1)[0]
          this.$store.dispatch('tagsView/delView', view2)
          this.$router.go('admin-management/list')
        })
    },

    // functionality
    encrypt(data) {
      const key = ')H@McQfTjWnZr4u7w!z%C*F-JaNdRgUk'
      const iv = '514012241051832769327432916264923'
      const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC
      })

      return cipher.toString()
    },

    // SORT & FILTER
    handleFilter() {
      this.dialogFilter = false
      this.listQuery.page = 1
      this.getList()
    },

    sortChange(data) {
      const { prop, order } = data
      switch (order) {
        case 'ascending':
          this.listQuery.order = `${prop} asc`
          break
        case 'descending':
          this.listQuery.order = `${prop} desc`
          break
        default:
          this.listQuery.order = ''
          break
      }
      this.handleFilter()
    }

  }
}
</script>
