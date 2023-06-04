<template>
  <div class="table-wrapper">
    <div class="title-wrapper">
      <div class="title">Error QR Logs</div>
      <router-link to="/logs/error-qr-log">
        <el-button class="button-custom small primary">See More</el-button>
      </router-link>
    </div>
    
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="dataList"
      fit
    >
      <el-table-column label="Device ID" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.device_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Response Code" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.response_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Time" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time | dateFilter}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
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
      activeSatpasList:[],

        // query var
      listQuery: {
        page: 1,
        pagesize: 5,
        order: ''
      },

      // table var
      tableKey: 0,
      listLoading: true,
      total: 0,
      dataList: [],
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
      this.dataList = [
        {
          device_id: '2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          response_code:'123',
          time: new Date()
        },
        {
          device_id: '2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          response_code:'123',
          time: new Date()
        },
        {
          device_id: '2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          response_code:'123',
          time: new Date()
        },
        {
          device_id: '2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          response_code:'123',
          time: new Date()
        },
        {
          device_id: '2305D12EDB8298F3BFB7CF52982159LCE072B6F75BE8AADCACD5B83419798925',
          response_code:'123',
          time: new Date()
        },
      ],
      this.listLoading = false
    }
  },
}
</script>

<style lang="scss" scoped>
.table-wrapper{
  margin-top: 20px;
}
.title{
  font-family: 'Roboto';
  font-weight: 700;
  font-size: 26px;
  line-height: 30px;
  letter-spacing: 0.02em;
  color: #D5E1E7;
  float: left;
}

.button-custom{
  float: right;
}
</style>