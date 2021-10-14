<template>
	<div class="app-container">
		<div class="filter-container">
			<el-row :gutter="20">
				<el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
					<div>
						<el-card class="box-card">
							<div slot="header" class="clearfix">
								<span>设备通讯，设备号:{{deviceCode}}</span>
							</div>
							<div class="commedBox">
								<div v-for="(item,index) in CommandDetails" :key="index">
									<div class="commedBox_top flex" v-if="item.type == 1">
										<div></div>
										<div class="commedBox_topR">
											<div style="color: #666666;">服务器端 {{item.createTime}}</div>
											<div style="color: #666666;">{{item.commandContent}}</div>
											<div style="color: #999999;">{{item.commandRemarks}}</div>
										</div>
									</div>
									<div class="commedBox_bottom" v-if="item.type == 0">
										<div>
											<div>设备端 {{item.createTime}}</div>
											<div>{{item.commandContent}}</div>
											<div style="color: #999999;">{{item.commandRemarks}}</div>
										</div>
										<div style="height: 20px;"></div>
									</div>
								</div>
								<div style="height: 40px;"></div>
							</div>
						</el-card>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import {
		pushCommand,
		findDeviceCommandDetails,
		findDeviceListById
	} from '@/api/device/deviceList.js'
	import {
		parseTime
	} from '@/utils/index'
	export default {
		name: 'deviceList1',
		data() {
			return {
				deviceCode:'',
				CommandDetails: [],
				startTime: '',
				deviceInfo: {
					deviceStatus:0
				},
				param1:1,
				param2:1,
				param3:1,
				param4:1,
				setInt: null,
				setTime:null,
			}
		},
		filters: {
			formatDate: function(time) {
				if (!time) {
					return ''
				}
				return parseTime(time)
			},
		},
		methods: {
			//滑动到底
			scrollToBottom() {
				this.$nextTick(() => {
					let box = this.$el.querySelector(".commedBox")
					box.scrollTop = box.scrollHeight
				})
			},
			buttonVerifAuthention(perms) {
				return this.permsVerifAuthention(perms, this.$store.getters.authentionList)
			},
			permsVerifAuthention(perms, authentionList) {
				for (var i = 0; i < authentionList.length; i++) {
					if (perms == authentionList[i].perms) {
						return true;
					}
				}
				return false;
			},
			//选择输入框停止读取数据
			handleSelect() {
				console.log('选中输入框')
				clearInterval(this.setInt)
			},
			getTime() {
				var date = new Date()
				var y = date.getFullYear()
				var m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
				var d = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
				var hh = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours())
				var mm = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
				var ss = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
				return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
			},
			findDeviceCommandDetail() {
				let curTime = this.getTime()
				let data = {
					startTime: this.startTime,
					curTime: curTime,
					deviceCode: this.deviceCode
				}
				findDeviceCommandDetails(data).then(res => {
					if (res.code == 200) {
						let CommandDetails = res.data || []
						if (CommandDetails.length != 0) {
							CommandDetails.forEach((item, index) => {
								let time = ''
								let hh = item.createTime.slice(11, 13)
								let mm = item.createTime.slice(14, 16)
								let ss = item.createTime.slice(17, 19)
								time = hh + ':' + mm + ':' + ss
								item.createTime = time
							})
						}
						this.CommandDetails = CommandDetails
						this.scrollToBottom()
					}
				})
			},
			//查询设备参数
			querypushCommand(command){
				let data={
					deviceCode:this.deviceCode,
					command:command
				}
				pushCommand(data).then(res=>{
					this.setInt = setInterval(() => {
						this.onfindDeviceInfoById()
					}, 2000)
					if(res.code == 200){
						this.$message.success(res.msg)
					}else{
						this.$message.error(res.msg)
					}
				})
			},
			//设置设备参数
			setpushCommand(command){
				let param
				if(command == '01'){
					param=this.param1
				}else if(command == '02'){
					param=this.param2
				}else if(command == '03'){
					param=this.param3
				}else if(command == '04'){
					param=this.param4
				}
				let data={
					deviceCode:this.deviceCode,
					command:command,
					param:param
				}
				pushCommand(data).then(res=>{
					this.setInt = setInterval(() => {
						this.onfindDeviceInfoById()
					}, 2000)
					if(res.code == 200){
						this.$message.success(res.msg)
					}else{
						this.$message.error(res.msg)
					}
				})
			},
			//查询设备详细数据
			onfindDeviceInfoById(){
				let data={
					deviceId:this.deviceId
				}
				findDeviceListById(data).then(res=>{
					if(res.code == 200){
						this.deviceInfo=res.data
						this.param1=parseInt(res.data.pressureLow)
						this.param2=parseInt(res.data.pressureHigh)
						this.param3=parseInt(res.data.uploadFrequency)
						this.param4=parseInt(res.data.pressureFluctuate)
					}
				})
			},
		},
		created() {
		   let id = this.$route.query.id
		   let deviceImei=this.$route.query.deviceImei
		   let deviceCode = this.$route.query.deviceCode
		   this.deviceId = id
		   this.deviceCode=deviceCode
		   this.deviceImei=deviceImei
		   
		   // 指令详情
		   this.startTime = this.getTime()
		   let setTime = setInterval(() => {
		   	this.findDeviceCommandDetail()
		   }, 2000)
		   this.setTime = setTime
		   // 指令详情
		   
		   // 设备详情参数
		   // this.onfindDeviceInfoById()
		   // let setInt = setInterval(() => {
		   // 	this.onfindDeviceInfoById()
		   // }, 2000)
		   // this.setInt = setInt
		   // 设备详情参数
		   
		},
		destroyed() {
			clearInterval(this.setInt)
			clearInterval(this.setTime)
			console.log('页面关闭')
		}
	}
</script>

<style scoped="scoped">
	* {
		font-size: 14px;
	}

	.flex {
		display: flex;
	}

	.commedBox {
		height: 520px;
		overflow-y: scroll;
	}

	.commedBox_top {
		justify-content: space-between;
	}

	.commedBox_topR {
		margin-right: 15px;
		text-align: end;
		line-height: 24px;
	}

	.partBox {
		width: 92%;
		/* padding: 2% 4% 20px 4%; */
		margin: 0 auto;
	}

	.partBox1 {
		width: 100%;
		/* padding: 2% 4% 20px 4%; */
		margin: 0 auto;
	}

	.partItem {
		margin-left: 2%;
		width: 12.5%;
		height: 45px;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #EEEEEE;
	}

	.partItem :hover {
		cursor: pointer
	}

	.active {
		border: 1px solid #13CE66 !important;
		color: #13CE66;
	}

	.control_btn_box {
		width: 98%;
		margin: 22px auto;
		/* margin-top: 10px; */
		justify-content: space-around;
		flex-wrap: wrap;
	}

	.control_btn_box div {
		margin-top: 15px;
	}

	.lineBox {
		color: red;
		/* border: 1px solid red; */
		background-color: #E0E0E0;
		color: #333;
	}

	/* .box-card{
		overflow-x: scroll;
	} */
</style>
