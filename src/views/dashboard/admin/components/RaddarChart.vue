<template>
	<div :class="className" :style="{height:height,width:width}" />
</template>

<script>
	import echarts from 'echarts'
	require('echarts/theme/macarons') // echarts theme
	import resize from './mixins/resize'

	const animationDuration = 3000

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
		beforeDestroy() {
			if (!this.chart) {
				return
			}
			this.chart.dispose()
			this.chart = null
		},
		mounted() {
			this.$nextTick(() => {
				this.initChart()
			})
		},
		methods: {
			initChart() {
				this.chart = echarts.init(this.$el, 'macarons')
				this.setOptions(this.chartData)
				console.log(this.chartData, "8888")
			},
			setOptions({
				expectedData,
				actualData
			} = {}) {
				this.chart.setOption({
					tooltip: {
						trigger: 'item',
						formatter: function(data) {
							return data.name + '<br/>' + data.seriesName + '：' + (data.value * 100).toFixed(2) +
							'%'; //将小数转化为百分数显示
						}
					},
					legend: {
						orient: 'vertical',
						left: 'left',
					},
					series: [{
						name: '订单占比',
						type: 'pie',
						radius: '50%',
						data: [{
								value: actualData,
								name: '扫码订单'
							},
							{
								value: expectedData,
								name: '刷卡订单'
							},
						],
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				})
			},
			// initChart() {
			// 	this.chart = echarts.init(this.$el, 'macarons')
			// 	this.chart.setOption({
			// 		tooltip: {
			// 			trigger: 'item'
			// 		},
			// 		legend: {
			// 			orient: 'vertical',
			// 			left: 'left',
			// 		},
			// 		series: [{
			// 			name: '订单数量',
			// 			type: 'pie',
			// 			radius: '50%',
			// 			data: [{
			// 					value: 1048,
			// 					name: '扫码订单'
			// 				},
			// 				{
			// 					value: 735,
			// 					name: '刷卡订单'
			// 				},
			// 			],
			// 			emphasis: {
			// 				itemStyle: {
			// 					shadowBlur: 10,
			// 					shadowOffsetX: 0,
			// 					shadowColor: 'rgba(0, 0, 0, 0.5)'
			// 				}
			// 			}
			// 		}]
			// 	})
			// }
		}
	}
</script>
