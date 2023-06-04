<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    chartData:{
      type: Array,
    },
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(chartData){
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          position: function (point) {
              return [point[0], point[1]];
          },
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color:['#668EAB','#3866AB'],
        series: [
          {
            name: 'Service',
            type: 'pie',
            radius: [0, 70],
            center: ['100px', '80px'],
            data: chartData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            itemStyle : {
                normal : {
                    label : {
                        show : false
                    },
                    labelLine : {
                        show : false
                    }
                }
            },
          }
        ]
      })
    }
  }
}
</script>
