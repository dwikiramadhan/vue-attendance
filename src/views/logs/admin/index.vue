<template>
  <div class="app-container">
    <!-- HEADER -->
    <div class="title-container">
      <h1 class="page-title">Admin Log</h1>
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
          <el-input v-model="listQuery.eventAdmUsrRegnum" placeholder="Username" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventModule" placeholder="Name" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventFunction" placeholder="Action" clearable @change="handleFilter" />
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
          <el-input v-model="listQuery.eventAdmUsrRegnum" placeholder="Username" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.eventModule" placeholder="Name" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.eventFunction" placeholder="Action" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.eventFunction" placeholder="Response code" clearable />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.lastLoginFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd" type="date" clearable placeholder="Start Date" @change="handleFilter"/>
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
      <el-table-column label="Username" prop="username" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.log_username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="name" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.log_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" prop="action" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.log_action }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Response code" prop="responseCode" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.log_responseCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Time" prop="time" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.log_date|dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Description" align="center" width="150px">
        <template slot-scope="{row}">
          <el-tooltip content="View" placement="top">
            <el-button class="table-icon-button primary" @click="handleDescription(row.log_description)"><svg-icon icon-class="search" /></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />
  
     <!-- DESCRIPTION DIALOG -->
    <el-dialog title="Description" :visible.sync="dialogDescription" class="dialog-small">
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

      // dialog var
      tempDesc:'',
      dialogFilter: false,
      dialogDescription: false,
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
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        {
          log_username:'john.doe@email.com',
          log_name:'Test user',
          log_action:'Login',
          log_responseCode:'123',
          log_time:new Date(),
          log_description:'This is detail of error message or success message',
        },
        
      ]
      this.total = this.dataList.length
      this.listLoading = false
    },

    // VIEW DESCRIPTION
    handleDescription(desc){
      this.tempDesc = desc
      this.dialogDescription = true
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