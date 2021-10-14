<template>
	<div>
		<!-- <div class="dashboard-editor-container">
			<panel-group  :chart-data="panelData" />
		
			<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
				<line-chart :chart-data="lineChartData" />
			</el-row>
			<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
				<line-chart1 :chart-data="lineChartData1" />
			</el-row>
		</div> -->
		<div id="GDMap" style=""></div>
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
	import loadMap from "../../../utils/loadMap.js";
	var map
	export default {
		name: 'index',
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
			
		},
		mounted() {
			console.log("执行")
			this.onfindIndexCount()
		},
		methods: {
			markerClick(e) {
				this.infoWindow.setContent(e.target.content);
			    this.infoWindow.open(map, e.target.getPosition());
			},
			onfindIndexCount() {
				findIndexCount().then(res => {
					console.log(res)
					if (res.code == 200) {
						let list = res.data || []
						if (list.length != 0) {
							loadMap(this.key, this.plugins, this.v).then(AMap => {
								map = new AMap.Map("GDMap", {
									resizeEnable: true,
									center: [116.397428, 39.90923],
									zoom: 4
								});
								this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
								list.forEach((item, index) => {
									let position=new Array(2)
									if(item.addressLongitude){
										position[0]=parseFloat(item.addressLongitude)
										position[1]=parseFloat(item.addressLatitude)
										var marker = new AMap.Marker({
											position: position,
											map: map
										});
										let deviceTypeName = item.deviceTypeName
										let deviceImei=item.deviceImei ? item.deviceImei : ''
										let onlineStatus=item.onlineStatus
										let statusText='离线'
										if(onlineStatus == 1){
											statusText= "<span class='line'>在线</span>"
										}else{
											statusText= "<span class='unline'>离线</span>"
										}
										let deviceAddress=item.deviceAddress ? item.deviceAddress : ''
										let str1 = "设备类型:" + deviceTypeName+'</br>'
										let str2 = "<span class='deviceCode'>设备Imei:" + deviceImei + "</span>"+'</br>'
										let str3 = "设备状态:" +statusText+'</br>'
										let str4 = "设备地址:" + deviceAddress+'</br>'
										marker.content =str1+str2+str3+str4
										marker.on('click', this.markerClick);
										marker.emit('click', {
											target: marker
										});
									}
								})
								map.setFitView();
							})
						}else{
							loadMap(this.key, this.plugins, this.v).then(AMap => {
								map = new AMap.Map("GDMap", {
									resizeEnable: true,
									center: [116.397428, 39.90923],
									zoom: 4
								});
								map.setFitView();
							})
						}
					}else{
						loadMap(this.key, this.plugins, this.v).then(AMap => {
							map = new AMap.Map("GDMap", {
								resizeEnable: true,
								center: [116.397428, 39.90923],
								zoom: 4
							});
							map.setFitView();
						})
					}
				})
				
			},
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
	#GDMap{
		height:850px;
		width: 1820px
	}
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
	.amap-info-content{
		font-size: 18px;
	}
</style>
