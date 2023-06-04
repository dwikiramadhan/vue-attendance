<template>
  <div class="app-container">
    <!-- HEADER -->
    <div class="title-container">
      <h1 class="page-title">Report</h1>
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
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventAdmUsrRegnum" placeholder="Column 1" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventModule" placeholder="Column 2" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventFunction" placeholder="Column 3" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-input v-model="listQuery.eventFunction" placeholder="Column 4" clearable @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-date-picker v-model="listQuery.lastLoginFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd" type="date" clearable placeholder="Start Date 1" @change="handleFilter" />
        </el-form-item>
        <el-form-item class="filter-form-item input-small">
          <el-date-picker v-model="listQuery.lastLoginFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd" type="date" clearable placeholder="Start Date 2" @change="handleFilter" />
        </el-form-item>
      </el-form>
      <el-tooltip content="Download XLS" placement="top">
        <el-button class="button-icon success filter-button super" @click="getList"><i class="fa-solid fa-file-excel" /></el-button>
      </el-tooltip>
    </div>

    <!-- FILTER DIALOG FOR SMALL MEDIA -->
    <el-dialog title="Filter" :visible.sync="dialogFilter" class="dialog-small">
      <el-form>
        <el-form-item>
          <el-input v-model="listQuery.eventAdmUsrRegnum" placeholder="Column 1" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.eventModule" placeholder="Column 2" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.eventFunction" placeholder="Column 3" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.eventFunction" placeholder="Column 4" clearable />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.lastLoginFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd" type="date" clearable placeholder="Start Date 1" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="listQuery.lastLoginFrom" :picker-options="dateBetween" value-format="yyyy-MM-dd" type="date" clearable placeholder="Start Date 2" />
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
      <el-table-column label="Column 1" prop="column1" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.column1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Column 2" prop="column2" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.column2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Column 3" prop="column3" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.column3 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Column 4" prop="column4" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.column4 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Qty" prop="qty" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.qty }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date 1" prop="date1" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.date1|dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date 2" prop="date2" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.date2|dateFilter }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />
  </div>
</template>

<script>
import moment from 'moment'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    dateFilter: function(date) {
      if (moment(date).isValid()) {
        return moment(date).format('DD MMM YYYY')
      } else {
        return '-'
      }
    }
  },
  data() {
    return {
      // filter date
      dateBetween: { disabledDate: this.disabledOtherDate },

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
      dialogFilter: false
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
      this.dataList = [
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        },
        {
          column1: 'Row',
          column2: 'Longer Row',
          column3: 'Usually this part is description or long text',
          column4: 'Usually this part is description or long text',
          qty: '1,234',
          date1: new Date(),
          date2: new Date()

        }
      ]
      this.total = this.dataList.length
      this.listLoading = false
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
