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
      default: '300px'
    },
		autoResize: {
		  type: Boolean,
		  default: true
		},
		chartData: {
		  type: Object,
		  required: true
		}
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
	setOptions({ expectedData, actualData } = {}) {
	  this.chart.setOption({
	    tooltip: {
	      trigger: 'item',
	      formatter: '{a} <br/>{b} : {c} ({d}%)'
	    },
	    legend: {
	      left: 'center',
	      bottom: '10',
	      data: ['广东', '福建', '湖南', '浙江', '湖北']
	    },
	    series: [
	      {
	        name: '占比',
	        type: 'pie',
	        roseType: 'radius',
	        radius: [15, 95],
	        center: ['50%', '38%'],
	        data: expectedData,
	        animationEasing: 'cubicInOut',
	        animationDuration: 2600
	      }
	    ]
	  })
	},
    // initChart() {
    //   this.chart = echarts.init(this.$el, 'macarons')

    //   this.chart.setOption({
    //     tooltip: {
    //       trigger: 'item',
    //       formatter: '{a} <br/>{b} : {c} ({d}%)'
    //     },
    //     legend: {
    //       left: 'center',
    //       bottom: '10',
    //       data: ['广东', '福建', '湖南', '浙江', '湖北']
    //     },
    //     series: [
    //       {
    //         name: '占比',
    //         type: 'pie',
    //         roseType: 'radius',
    //         radius: [15, 95],
    //         center: ['50%', '38%'],
    //         data: [
    //           { value: 320, name: '广东' },
    //           { value: 240, name: '福建' },
    //           { value: 149, name: '湖南' },
    //           { value: 100, name: '浙江' },
    //           { value: 59, name: '湖北' }
    //         ],
    //         animationEasing: 'cubicInOut',
    //         animationDuration: 2600
    //       }
    //     ]
    //   })
    // }
  }
}
</script>
