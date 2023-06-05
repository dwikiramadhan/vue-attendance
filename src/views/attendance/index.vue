<template>
  <div class="app-container">
    <!-- HEADER -->
    <div class="title-container">
      <h1 class="page-title">Attendance</h1>
    </div>

    <!-- BUTTON FOR SMALL MEDIA -->
    <div class="page-button-media">
      <el-tooltip content="Filter" placement="top">
        <el-button class="button-icon primary" @click="dialogFilter=true"><i class="fa-solid fa-filter" /></el-button>
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
      <el-table-column label="Time" prop="check_in" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.check_in | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" prop="status" sortable="custom">
        <template slot-scope="{row}">
          <span class="colored-status" :class="row.status | colorFilter">{{ row.status == 1 ? "Datang" : "Pulang" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Attendance" prop="status" sortable="custom">
        <template slot-scope="{row}">
          <span v-if="row.status == 1">
            <el-tag type="success" v-if="row.late_count == 0">Discipline</el-tag>
            <el-tag type="danger" v-else>Undiscipline</el-tag>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="Latitude" prop="latitude" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Longitude" prop="longitude" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.longitude }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Selfie" align="center">
        <template slot-scope="{row}">
          <el-tooltip content="View" placement="top">
            <el-button class="table-icon-button primary" @click="showSingle(row.selfie)"><i class="el-icon-picture-outline" /></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <vue-easy-lightbox
      escDisabled
      moveDisabled
      :visible="visible"
      :imgs="'data:image/jpeg;base64, ' + curImage"
      :index="index"
      @hide="handleHide"
    ></vue-easy-lightbox>

    <!-- Pagination -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import Pagination from '@/components/Pagination'
import { listAttendanceByEmpNo } from '@/api/attendance'
import VueEasyLightbox from 'vue-easy-lightbox'

export default {
  components: { Pagination, VueEasyLightbox },
  filters: {
    dateFilter: function(date) {
      console.log("date:", date);
      if (moment(date).isValid()) {
        return moment(date).format('DD MMM YYYY HH:mm')
      } else {
        return '-'
      }
    },

    colorFilter: function(status) {
      const statusMap = {
        '1': 'success',
        '2': 'info',
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      visible: false,
      index: 0,   // default: 0
      // filter date
      dateBetween: { disabledDate: this.disabledOtherDate },

      // query var
      listQuery: {
        page: 1,
        pagesize: 10,
        order: 'check_in desc',
        start: 1,
      },

      // table var
      tableKey: 0,
      listLoading: true,
      total: 0,
      dataList: [],
      curImage: "",

      // dropdown var
      severityList: ['LOW', 'MEDIUM', 'HIGH'],

      // dialog var
      tempDesc: '',
      dialogFilter: false,
      dialogPayload: false
    }
  },
  computed: {
    ...mapGetters([
      'emp_no'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    showSingle(img) {
      this.imgs = 'http://via.placeholder.com/350x150'
      // or
      this.imgs = { title: 'this is a placeholder', src: 'http://via.placeholder.com/350x150' }
      this.curImage = img
      this.show()
    },
    show() {
      this.visible = true
    },
    handleHide() {
      this.visible = false
    },
    // DISABLE DATE
    disabledOtherDate(time) {
      var maxDate = moment()._d
      var isAfterMaxDate = time.getTime() > maxDate
      return isAfterMaxDate
    },

    getList() {
      this.listLoading = true

      listAttendanceByEmpNo(this.emp_no, this.listQuery).then(response => {
        this.dataList = response.data.data.data
        this.total = response.data.data.total_records
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    // VIEW DESCRIPTION
    handlePayload(desc) {
      this.tempDesc = desc
      this.dialogPayload = true
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
          this.listQuery.order = 'check_in desc'
          break
      }
      this.handleFilter()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card{
  padding: 0;
}
</style>
