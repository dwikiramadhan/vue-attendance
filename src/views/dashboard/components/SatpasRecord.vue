<template>
  <div class="table-wrapper">
    <div class="title-wrapper">
      <div class="title">Satpas Record</div>
      <router-link to="/satpas-record/satpas-record">
        <el-button class="button-custom small primary">See More</el-button>
      </router-link>
    </div>
    
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="dataList"
      fit
    >
      <el-table-column label="Satpas" prop="satpas" sortable="custom" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.satpas_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Total QR" prop="totalQr" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.satpas_totalQr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Last Active" prop="lastActive" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.satpas_lastActive | dateFilter}}</span>
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
        return moment(date).format('DD MMM YYYY')
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
          satpas_name: 'Satpas Polres Metro Tangerang Kota',
          satpas_totalQr: '357,098',
          satpas_lastActive: new Date()
        },
        {
          satpas_name: 'Satpas Polres Metro Tangerang Kota',
          satpas_totalQr: '357,098',
          satpas_lastActive: new Date()
        },
        {
          satpas_name: 'Satpas Polres Metro Tangerang Kota',
          satpas_totalQr: '357,098',
          satpas_lastActive: new Date()
        },
        {
          satpas_name: 'Satpas Polres Metro Tangerang Kota',
          satpas_totalQr: '357,098',
          satpas_lastActive: new Date()
        },
        {
          satpas_name: 'Satpas Polres Metro Tangerang Kota',
          satpas_totalQr: '357,098',
          satpas_lastActive: new Date()
        },
      ]
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