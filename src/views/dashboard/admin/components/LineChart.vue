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
				console.log(this.chartData)
			},
			setOptions({
				onlineDeviceCount,
				unInstallDeviceCount,
				deviceCount,
				unlineDeviceCount,
				month
			} = {}) {
				this.chart.setOption({
					xAxis: {
						data: month,
						boundaryGap: false,
						axisTick: {
							show: false
						}
					},
					grid: {
						left: 10,
						right: 10,
						bottom: 20,
						top: 30,
						containLabel: true
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},
						padding: [5, 10]
					},
					yAxis: {
						axisTick: {
							show: false
						}
					},
					title:{
					     text:'设备月总数详情',
					     textStyle:{
					        //文字颜色
					        color:'#000',
					        //字体风格,'normal','italic','oblique'
					        fontStyle:'normal',
					        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
					        fontWeight:'bold',
					        //字体系列
					        fontFamily:'sans-serif',
					        //字体大小
					　　　　 fontSize:18
					    }
					},
					legend: {
						data: ['设备总数', '设备在线总数', '离线设备总数','设备未安装总数']
					},
					series: [{
							name: '设备总数',
							itemStyle: {
								normal: {
									color: '#3888fa',
									lineStyle: {
										color: '#3888fa',
										width: 2
									}
								}
							},
							smooth: true,
							type: 'line',
							data: deviceCount,
							animationDuration: 2800,
							animationEasing: 'cubicInOut'
						},
						{
							name: '设备在线总数',
							smooth: true,
							type: 'line',
							itemStyle: {
								normal: {
									color: '#3888fa',
									lineStyle: {
										color: '#3888fa',
										width: 2
									},
									areaStyle: {
										color: '#f3f8ff'
									}
								}
							},
							data: onlineDeviceCount,
							animationDuration: 2800,
							animationEasing: 'quadraticOut'
						}, {
							name: '离线设备总数',
							smooth: true,
							type: 'line',
							itemStyle: {
								normal: {
									color: '#FF005A',
									lineStyle: {
										color: '#FF005A',
										width: 2
									},
									areaStyle: {
										color: '#f3f8ff'
									}
								}
							},
							data: unlineDeviceCount,
							animationDuration: 2800,
							animationEasing: 'quadraticOut'
						}, {
							name: '设备未安装总数',
							smooth: true,
							type: 'line',
							itemStyle: {
								normal: {
									color: '#FF005A',
									lineStyle: {
										color: '#FF005A',
										width: 2
									},
									areaStyle: {
										color: '#f3f8ff'
									}
								}
							},
							data: unInstallDeviceCount,
							animationDuration: 2800,
							animationEasing: 'quadraticOut'
						}
					]
				})
			}
		}
	}
</script>
