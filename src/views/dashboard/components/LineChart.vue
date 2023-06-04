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
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData:{
      type: Object
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
      handler() {
        this.initChart()
      }
    }
  },
  mounted() {
    this.initChart()
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
    setOptions({ date, hit } = {}) {
      this.chart.setOption({
        backgroundColor: '#1B354E',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 95,
          top: 10,
          containLabel: true,
        },
        xAxis: {
          data: date,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#253E57'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel:{
            textStyle:{
              color: '#A4B6C8'
            },
          },
        },

        
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              color: '#253E57'
            }
          },
           axisLine: {
            lineStyle: {
              color: '#253E57'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#253E57'
            }
          },
          axisLabel:{
            textStyle:{
              color: '#A4B6C8'
            },
          },
          splitArea: {
            show: false
          }
        },
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [0],
          bottom: 55,
          start: 0,
          end: 100,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '100%',
          handleStyle: {
            color: '#A4B6C8'
          },
          borderColor: '#1B354E'
        }],
        series: [{
          name: 'Generate',
          smooth: true,
          type: 'line',
          symbolSize: 5,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: '#A6CEE3',
              lineStyle: {
                color: '#A6CEE3',
                width: 2
              },
            }
          },
          data: hit,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
