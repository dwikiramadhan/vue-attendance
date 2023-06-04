<template>
  <div class="app-container">
    <!-- HEADER -->
    <div class="title-container">
      <h1 class="page-title">Error QR Log</h1>
    </div>

    <!-- BUTTON FOR SMALL MEDIA -->
    <div class="page-button-media">
      <el-tooltip content="Filter" placement="top">
        <el-button class="button-icon primary" @click="dialogFilter=true"><i class="fa-solid fa-filter"></i></el-button>
      </el-tooltip>
    </div>
    
    <!-- FILTER -->
    <div class="filter-container">
      <el-form class="filter-form">
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventAdmUsrRegnum" placeholder="Device ID" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventModule" placeholder="Module" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventFunction" placeholder="Function" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-select v-model="listQuery.eventType" placeholder="Severity" clearable @change="handleFilter">
            <el-option v-for="item,index in severityList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventFunction" placeholder="Response code" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-date-picker v-model="listQuery.lastLoginFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd" type="date" clearable placeholder="Start Date" @change="handleFilter"/>
        </el-form-item>
      </el-form>
    </div>

    <!-- FILTER DIALOG FOR SMALL MEDIA -->
    <el-dialog title="Filter" :visible.sync="dialogFilter" class="dialog-small">
      <el-form>
        <el-form-item>
          <el-input v-model="listQuery.eventAdmUsrRegnum" placeholder="Device ID" clearable />
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
          <el-input v-model="listQuery.eventFunction" placeholder="Response code" clearable />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.lastLoginFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd" type="date" clearable placeholder="Start Date"/>
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
      <el-table-column label="Device ID" prop="deviceId" sortable="custom" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.device_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Module" prop="module" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.module }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Function" prop="function" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.function }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Severity" prop="severity" sortable="custom">
        <template slot-scope="{row}">
          <span class="colored-status" :class="row.severity | colorFilter">{{ row.severity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Response code" prop="responseCode" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.response_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Payload" align="center" width="150px">
        <template slot-scope="{row}">
          <el-tooltip content="View" placement="top">
            <el-button class="table-icon-button primary" @click="handlePayload(row.payload)"><svg-icon icon-class="search" /></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Time" prop="time" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time|dateFilter }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />
  
     <!-- PAYLOAD DIALOG -->
    <el-dialog title="Payload" :visible.sync="dialogPayload" class="dialog-small">
      <el-card class="card-square">
        {{tempDesc}}
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import Pagination from '@/components/Pagination'

export default {
  components:{Pagination},
  filters:{
    dateFilter: function(date) {
      if (moment(date).isValid()) {
        return moment(date).format('DD MMM YYYY HH:mm')
      } else {
        return '-'
      }
    },
    colorFilter: function(status) {
      const statusMap ={
        'LOW': 'success',
        'MEDIUM': 'warning',
        'HIGH': 'danger'
      }
      return statusMap[status]
    },
  },
  data(){
    return{
      // filter date
      dateBetween: {disabledDate: this.disabledOtherDate},

      // query var
      listQuery: {
        page: 1,
        pagesize: 15,
        order: ''
      },
      
      // table var
      tableKey: 0,
      listLoading: true,
      total: 0,
      dataList: [],

      // dropdown var
      severityList:['LOW','MEDIUM','HIGH'],

      // dialog var
      tempDesc:'',
      dialogFilter: false,
      dialogPayload: false,
    }
  },
  created(){
    this.getList()
  },
  methods:{
    // DISABLE DATE
    disabledOtherDate(time) {
        var maxDate = moment()._d;                
        var isAfterMaxDate =  time.getTime() > maxDate; 
        return isAfterMaxDate;
    },
    getList(){
      this.listLoading = true
      this.dataList = [
        {
          device_id:'2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          module:'Lorem Ipsum',
          function:'Lorem ipsum',
          severity:'MEDIUM',
          response_code:'123',
          payload:"{key1:'value 1',key2:'value2'}",
          time:new Date()
        },
        {
          device_id:'2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          module:'Lorem Ipsum',
          function:'Lorem ipsum',
          severity:'LOW',
          response_code:'123',
          payload:"{key1:'value 1',key2:'value2'}",
          time:new Date()
        },
        {
          device_id:'2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          module:'Lorem Ipsum',
          function:'Lorem ipsum',
          severity:'MEDIUM',
          response_code:'123',
          payload:"{key1:'value 1',key2:'value2'}",
          time:new Date()
        },
        {
          device_id:'2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          module:'Lorem Ipsum',
          function:'Lorem ipsum',
          severity:'LOW',
          response_code:'123',
          payload:"{key1:'value 1',key2:'value2'}",
          time:new Date()
        },
        {
          device_id:'2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          module:'Lorem Ipsum',
          function:'Lorem ipsum',
          severity:'HIGH',
          response_code:'123',
          payload:"{key1:'value 1',key2:'value2'}",
          time:new Date()
        },
        {
          device_id:'2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          module:'Lorem Ipsum',
          function:'Lorem ipsum',
          severity:'HIGH',
          response_code:'123',
          payload:"{key1:'value 1',key2:'value2'}",
          time:new Date()
        },
        {
          device_id:'2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          module:'Lorem Ipsum',
          function:'Lorem ipsum',
          severity:'LOW',
          response_code:'123',
          payload:"{key1:'value 1',key2:'value2'}",
          time:new Date()
        },
        {
          device_id:'2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          module:'Lorem Ipsum',
          function:'Lorem ipsum',
          severity:'MEDIUM',
          response_code:'123',
          payload:"{key1:'value 1',key2:'value2'}",
          time:new Date()
        },
        {
          device_id:'2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          module:'Lorem Ipsum',
          function:'Lorem ipsum',
          severity:'HIGH',
          response_code:'123',
          payload:"{key1:'value 1',key2:'value2'}",
          time:new Date()
        },
        {
          device_id:'2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          module:'Lorem Ipsum',
          function:'Lorem ipsum',
          severity:'LOW',
          response_code:'123',
          payload:"{key1:'value 1',key2:'value2'}",
          time:new Date()
        },
      ]
      this.total = this.dataList.length
      this.listLoading = false
    },

    // VIEW DESCRIPTION
    handlePayload(desc){
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
      switch(order){
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
  },
}
</script>

<style lang="scss" scoped>
.el-card{
  padding: 0;
}
</style>