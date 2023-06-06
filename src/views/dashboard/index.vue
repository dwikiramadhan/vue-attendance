<template>
  <div class="app-container">
    <div class="page-subtitle">Welcome,</div>
    <h1 class="page-title">{{ name }}</h1>
    <div class="page-subtitle">{{ new Date() | dateFilter }} | Have a great day!</div><br>
    <el-tag type="warning">{{ roles[0] }}</el-tag>
    <el-row :gutter="40" v-if="roles[0] !== 'SUPERADMIN'">
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <number-card number="1" label="Sudahkah" :emp_no=emp_no />
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <report-card number="1" label="Absensi DATANG Hari ini" :emp_no=emp_no att_type="come_in" />
      </el-col>
      <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <report-card number="1" label="Absensi PULANG Hari ini" :emp_no=emp_no att_type="come_out" />
      </el-col> -->
    </el-row>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import NumberCard from './components/NumberCard'
import ReportCard from './components/ReportCard'
import PieChart from './components/PieChart'
import MostActiveSatpas from './components/MostActiveSatpas'
import SatpasRecord from './components/SatpasRecord'

export default {
  name: 'Dashboard',
  components: { NumberCard, ReportCard, PieChart, MostActiveSatpas, SatpasRecord },
  filters: {
    dateFilter: function(date) {
      if (moment(date).isValid()) {
        return moment(date).format('DD MMMM YYYY')
      } else {
        return '-'
      }
    },
    numberFormat: function(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    numberColor: function(percent) {
      if (percent < 0.1) {
        return 'danger'
      } else if (percent < 0.5) {
        return 'warning'
      }
      return 'success'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'emp_no'
    ])
  },
  data() {
    return {
      statNumbers: [
        // {
        //   number: 0,
        //   label: 'QR Generated'
        // },
        // {
        //   number: 0,
        //   label: 'Enforcer Generated'
        // }
        // {
        //   number:9607,
        //   label: 'Avg QR generated/day'
        // },
        // {
        //   number:8127,
        //   label: 'Avg QR scanned/day'
        // },
      ],
      qrLicenseUsage: [
        {
          name: 'License used',
          value: 1948624
        },
        {
          name: 'QR remaining',
          value: 12051376
        }
      ],
      enforcerLicenseUsage: [
        {
          name: 'License used',
          value: 981803
        },
        {
          name: 'Enforcer remaining',
          value: 18197
        }
      ],
      qrPercentage: 0,
      enforcerPercentage: 0
    }
  },
  created() {
    this.getPercentage()
  },
  methods: {
    getPercentage() {
      this.qrPercentage = this.qrLicenseUsage[1].value / (this.qrLicenseUsage[0].value + this.qrLicenseUsage[1].value)
      this.enforcerPercentage = this.enforcerLicenseUsage[1].value / (this.enforcerLicenseUsage[0].value + this.enforcerLicenseUsage[1].value)
    },
  }
}
</script>

<style lang="scss" scoped>
.page-title {
  margin: 5px 0;
  font-family: 'Quicksand';
  font-weight: 700;
  font-size: 30px;
  line-height: 49px;
  color: #0E436B;
}

.page-subtitle {
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: #828487;
}

.el-card {
  padding: 15px;
  margin-top: 15px;

  .card-title {
    font-family: 'Roboto';
    font-weight: 700;
    font-size: 26px;
    line-height: 30px;
    text-align: right;
    letter-spacing: 0.02em;
    color: #D5E1E7;
  }
}

.chart-wrapper {
  margin-top: 40px;

  .chart {
    float: left;
  }

  .chart-info {
    float: right;
    text-align: right;

    .chart-number {
      font-family: 'Roboto';
      font-weight: 700;
      font-size: 26px;
      line-height: 30px;
      letter-spacing: 0.02em;
      color: #D5E1E7;
      margin-bottom: 7px;

      &.warning {
        color: #DDAA48;
      }

      &.danger {
        color: #CA5750;
      }

      &.success {
        color: #36C591;
      }
    }

    .chart-label {
      margin-bottom: 40px;
    }
  }
}
</style>
