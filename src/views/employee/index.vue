<template>
  <div class="app-container">
    <!-- HEADER -->
    <div class="title-container">
      <h1 class="page-title">Employees</h1>
    </div>

    <!-- BUTTON FOR SMALL MEDIA -->
    <div class="page-button-media">
      <el-tooltip content="Filter" placement="top">
        <el-button class="button-icon primary" @click="dialogFilter = true"
          ><i class="fa-solid fa-filter"
        /></el-button>
      </el-tooltip>
    </div>

    <div class="container" align="right">
      <el-tooltip content="Add Employee" placement="top">
        <el-button class="button-icon success super" icon="el-icon-plus" @click="handleAdd()"/>
      </el-tooltip>
    </div>

    <!-- TABLE -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="dataList"
      fit
      @sort-change="sortChange"
    >
      <!-- <el-table-column label="Emp No" prop="emp_no" sortable="custom" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.emp_no }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="Emp No" prop="emp_no" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.emp_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="name" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.admin_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" prop="email" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.admin_email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Role" prop="role" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.role }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pagesize"
      @pagination="getList"
    />

    <!-- ADD ADMIN DIALOG -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogAddEmp" :close-on-click-modal="false" class="dialog-small">
      <el-form ref="empListForm" :model="empListForm" :rules="empListRules">
        <el-form-item prop="admin_name">
          <el-input ref="admin_name" v-model="empListForm.admin_name" placeholder="Name"
            type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item prop="admin_email">
          <el-input ref="admin_email" v-model="empListForm.admin_email" placeholder="Email" type="text"
            tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item>
          <el-select ref="role" v-model="empListForm.role" placeholder="Role"
            name="role">
            <el-option v-for="item in roleList" :key="item" :label="item"
              :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="button-custom small info" @click="dialogAddAdmin = false">Cancel</el-button>
        <!-- <el-button v-if="userListForm.edit" class="button-custom small success" @click="updateUser">Simpan</el-button> -->
        <el-button class="button-custom small success" @click="createEmp">Simpan</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import { validUsername } from '@/utils/validate'
import Pagination from "@/components/Pagination";
import { listEmployee, postEmployee } from "@/api/user";
import VueEasyLightbox from "vue-easy-lightbox";

export default {
  components: { Pagination, VueEasyLightbox },
  filters: {
    dateFilter: function (date) {
      console.log("date:", date);
      if (moment(date).isValid()) {
        return moment(date).format("DD MMM YYYY HH:mm");
      } else {
        return "-";
      }
    },

    colorFilter: function (status) {
      const statusMap = {
        1: "success",
        2: "info",
      };
      return statusMap[status];
    },
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }

    return {
      dialogAddEmp: false,
      dialogTitle: 'Add Employee',
      // form var
      empListForm: {
        edit: false,
        role: '',
        admin_email: '',
        admin_name: ''
      },
      roleList: ['SUPERADMIN', 'EMPLOYEE'],
      visible: false,
      index: 0, // default: 0
      // filter date
      dateBetween: { disabledDate: this.disabledOtherDate },

      // query var
      listQuery: {
        page: 1,
        pagesize: 10,
        order: "admin_id desc",
        start: 1,
      },

      // table var
      tableKey: 0,
      listLoading: true,
      total: 0,
      dataList: [],
      curImage: "",

      // dropdown var
      severityList: ["LOW", "MEDIUM", "HIGH"],

      // dialog var
      tempDesc: "",
      dialogFilter: false,
      dialogPayload: false,

      empListRules: {
        admin_email: [
          { required: true, trigger: 'blur', validator: validateEmail }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["emp_no", "roles"]),
  },
  created() {
    this.getList();
  },
  methods: {
    handleAdd() {
      this.empListForm.edit = false
      this.dialogTitle = 'Add Employee'
      this.empListForm.admin_name = ''
      this.empListForm.admin_email = ''
      this.empListForm.edit = false
      this.dialogAddEmp = true
    },
    showSingle(img) {
      this.imgs = "http://via.placeholder.com/350x150";
      // or
      this.imgs = {
        title: "this is a placeholder",
        src: "http://via.placeholder.com/350x150",
      };
      this.curImage = img;
      this.show();
    },
    show() {
      this.visible = true;
    },
    handleHide() {
      this.visible = false;
    },
    // DISABLE DATE
    disabledOtherDate(time) {
      var maxDate = moment()._d;
      var isAfterMaxDate = time.getTime() > maxDate;
      return isAfterMaxDate;
    },

    getList() {
      this.listLoading = true;
      listEmployee(this.listQuery)
        .then((response) => {
          this.dataList = response.data.data.data;
          this.total = response.data.data.total_records;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    // button action
    createEmp() {
      this.$refs.empListForm.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.empListForm)

          postEmployee(tempData).then((response) => {
            this.$notify({
              title: 'Success',
              message: 'Success create Employee',
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.dialogAddEmp = false
          }).catch((err) => {
            this.$notify({
              title: 'Error',
              message: 'Failed create Employee',
              type: 'error',
              duration: 2000
            })
          })
        }
      })
    },

    // VIEW DESCRIPTION
    handlePayload(desc) {
      this.tempDesc = desc;
      this.dialogPayload = true;
    },

    // SORT & FILTER
    handleFilter() {
      this.dialogFilter = false;
      this.listQuery.page = 1;
      this.getList();
    },

    sortChange(data) {
      const { prop, order } = data;
      switch (order) {
        case "ascending":
          this.listQuery.order = `${prop} asc`;
          break;
        case "descending":
          this.listQuery.order = `${prop} desc`;
          break;
        default:
          this.listQuery.order = "check_in desc";
          break;
      }
      this.handleFilter();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  padding: 0;
}
</style>
