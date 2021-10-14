<template>
	<div>
		<div class="dashboard-editor-container">
			<panel-group  :chart-data="panelData" />
		
			<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
				<line-chart :chart-data="lineChartData" />
			</el-row>
			<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
				<line-chart1 :chart-data="lineChartData1" />
			</el-row>
		</div>
		<!-- <div id="GDMap" style="height:850px;width: 1820px"></div> -->
	</div>
</template>

<script>
	import GithubCorner from '@/components/GithubCorner'
	import PanelGroup from './components/PanelGroup'
	import LineChart from './components/LineChart'
	import LineChart1 from './components/LineChart1'
	import RaddarChart from './components/RaddarChart'
	import PieChart from './components/PieChart'
	import BarChart from './components/BarChart'
	import TransactionTable from './components/TransactionTable'
	import TodoList from './components/TodoList'
	import BoxCard from './components/BoxCard'
	import {
		findIndexCount,
		reportStatisticsByDevice
	} from '@/api/index/index.js'
	// import loadMap from "../../../utils/loadMap.js";
	var map
	export default {
		name: 'DashboardAdmin1',
		components: {
			GithubCorner,
			PanelGroup,
			LineChart,
			LineChart1,
			RaddarChart,
			PieChart,
			BarChart,
			TransactionTable,
			TodoList,
			BoxCard
		},
		data() {
			return {
				lineChartData: {
					onlineDeviceCount: [],
					unInstallDeviceCount: [],
					deviceCount: [],
					unlineDeviceCount:[],
					month:[]
				},
				lineChartData1: {
					onlineDeviceCount: [],
					unInstallDeviceCount: [],
					deviceCount: [],
					unlineDeviceCount:[],
					DAY:[]
				},
				panelData: {
					
				},
				totalDevice: '',
				totalUser: '',
				totalMoney: '',
				totalOrder: '',

				// 地图实例
				GDMap: null,
				// 加载的一些插件
				// 更多参考：https://lbs.amap.com/api/javascript-api/guide/abc/plugins#plugins
				plugins: [
					"AMap.Autocomplete",
					"AMap.PlaceSearch",
					"AMap.OverView",
					"AMap.MouseTool",
					"AMap.PolyEditor",
					"AMap.RectangleEditor",
					"AMap.DistrictLayer",
					"AMap.CustomLayer"
				],
				key: '87331a23c6a4e734969f8621bc166eff',
				// key: '160cab8ad6c50752175d76e61ef92c50',
				// 地图版本
				v: "1.4.4",

			}
		},
		created() {
			this.onreportStatisticsByDevice()
		},
		methods: {
			onreportStatisticsByDevice(){
				reportStatisticsByDevice().then(res=>{
					if(res.code == 200){
						let countInfoByMonth = res.data.countInfoByMonth || []
						let lineChartData = {
							onlineDeviceCount: [],
							unInstallDeviceCount: [],
							deviceCount: [],
							unlineDeviceCount:[],
							month:[]
						}
						if (countInfoByMonth.length != 0) {
							countInfoByMonth.forEach((item, index) => {
								lineChartData.onlineDeviceCount.push(item.onlineDeviceCount)
								lineChartData.unInstallDeviceCount.push(item.unInstallDeviceCount)
								lineChartData.deviceCount.push(item.deviceCount)
								lineChartData.unlineDeviceCount.push(item.unlineDeviceCount)
								lineChartData.month.push(item.month)
							})
						}
						this.lineChartData= lineChartData
						
						
						let countInfoByDay = res.data.countInfoByDay || []
						let lineChartData1 = {
							onlineDeviceCount: [],
							unInstallDeviceCount: [],
							deviceCount: [],
							unlineDeviceCount:[],
							DAY:[]
						}
						if (countInfoByDay.length != 0) {
							countInfoByDay.forEach((item, index) => {
								lineChartData1.onlineDeviceCount.push(item.onlineDeviceCount)
								lineChartData1.unInstallDeviceCount.push(item.unInstallDeviceCount)
								lineChartData1.deviceCount.push(item.deviceCount)
								lineChartData1.unlineDeviceCount.push(item.unlineDeviceCount)
								lineChartData1.DAY.push(item.DAY)
							})
						}
						this.lineChartData1= lineChartData1
						
						
						this.panelData=res.data.countInfo
					}
				})
				
			},
			handleSetLineChartData(type) {
				this.lineChartData = lineChartData[type]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dashboard-editor-container {
		padding: 32px;
		background-color: rgb(240, 242, 245);
		position: relative;

		.github-corner {
			position: absolute;
			top: 0px;
			border: 0;
			right: 0;
		}

		.chart-wrapper {
			background: #fff;
			padding: 16px 16px 0;
			margin-bottom: 32px;
		}
	}

	@media (max-width:1024px) {
		.chart-wrapper {
			padding: 8px;
		}
	}
</style>

<style>
	.deviceCode {
		width: 280px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		/* display: inline-block; */
		padding: 0px;
		margin: 0px;
	}
	.line{
		color: #13CE66;
	}
	.unline{
		color: red;
	}
</style>
