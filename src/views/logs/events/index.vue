<template>
  <div class="app-container">
    <!-- HEADER -->
    <div class="title-container">
      <h1 class="page-title">Events</h1>
    </div>

    <!-- BUTTON FOR SMALL MEDIA -->
    <div class="page-button-media">
      <el-tooltip content="Filter" placement="top">
        <el-button class="button-icon primary" @click="dialogFilter=true"><i class="fa-solid fa-filter" /></el-button>
      </el-tooltip>
    </div>

    <!-- FILTER -->
    <div class="filter-container">
      <el-form class="filter-form">
        <!-- <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventAdmUsrRegnum" placeholder="Description" clearable @change="handleFilter" />
        </el-form-item> -->
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventModule" placeholder="Module" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventFunction" placeholder="Function" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-select v-model="listQuery.eventSeverity" placeholder="Severity" clearable @change="handleFilter">
            <el-option v-for="item,index in severityList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventType" placeholder="Type" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-date-picker v-model="listQuery.dateFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd" type="date" clearable placeholder="Start Date" @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-date-picker v-model="listQuery.dateTo" :picker-options="dateBetween" value-format="yyyy-MM-dd" type="date" clearable placeholder="End Date" @change="handleFilter" />
        </el-form-item>
      </el-form>
    </div>

    <!-- FILTER DIALOG FOR SMALL MEDIA -->
    <el-dialog title="Filter" :visible.sync="dialogFilter" class="dialog-small">
      <el-form>
        <el-form-item>
          <el-input v-model="listQuery.eventAdmUsrRegnum" placeholder="Description" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.eventModule" placeholder="Module" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.eventFunction" placeholder="Function" clearable />
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.eventType" placeholder="Severity" clearable>
            <el-option v-for="item,index in severityList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.lastLoginFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd" type="date" clearable placeholder="Start Date" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="button-custom small primary" @click="handleFilter">Search</el-button>
      </div>
    </el-dialog>

    <!-- TABLE -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="dataList"
      fit
      @sort-change="sortChange"
    >
      <el-table-column label="Description" prop="event_desc" sortable="custom" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.event_description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Module" prop="event_module" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.event_module }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Function" prop="event_function" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.event_function }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Severity" prop="event_severity" sortable="custom">
        <template slot-scope="{row}">
          <span class="colored-status" :class="row.event_severity | colorFilter">{{ row.event_severity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" prop="event_type" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.event_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Created At" prop="event_time" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.event_time|dateFilter }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

    <!-- PAYLOAD DIALOG -->
    <el-dialog title="Payload" :visible.sync="dialogPayload" class="dialog-small">
      <el-card class="card-square">
        {{ tempDesc }}
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import Pagination from '@/components/Pagination'
import { getEventLogs } from '@/api/logs'

export default {
  components: { Pagination },
  filters: {
    dateFilter: function(date) {
      if (moment(date).isValid()) {
        return moment.utc(date).format('DD MMM YYYY HH:mm')
      } else {
        return '-'
      }
    },
    colorFilter: function(status) {
      const statusMap = {
        'Low': 'success',
        'Medium': 'warning',
        'High': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      // filter date
      dateBetween: { disabledDate: this.disabledOtherDate },

      // query var
      listQuery: {
        page: 1,
        pagesize: 10,
        order: 'event_time desc',
        start: 1,
        eventModule: '',
        eventFunction: '',
        eventType: '',
        eventSeverity: '',
        dateFrom: '',
        dateTo: ''
      },

      // table var
      tableKey: 0,
      listLoading: true,
      total: 0,
      dataList: [],

      // dropdown var
      severityList: ['LOW', 'MEDIUM', 'HIGH'],

      // dialog var
      tempDesc: '',
      dialogFilter: false,
      dialogPayload: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // DISABLE DATE
    disabledOtherDate(time) {
      var maxDate = moment()._d
      var isAfterMaxDate = time.getTime() > maxDate
      return isAfterMaxDate
    },
    getList() {
      this.listLoading = true

      getEventLogs(this.listQuery).then(response => {
        this.dataList = response.data.data
        this.total = response.data.total_records
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
          this.listQuery.order = 'event_time desc'
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
