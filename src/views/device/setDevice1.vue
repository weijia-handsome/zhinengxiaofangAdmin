<template>
	<div class="app-container">
		<div class="filter-container">
			<el-row :gutter="20">
				<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
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
				<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">


					<div style="margin-top: 0px;">
						<el-card class="box-card">
							<div slot="header" class="clearfix">
								<span>设备详情，在线状态：<el-tag type="success" v-if="deviceInfo.onlineStatus == 1">在线</el-tag>
									<el-tag type="danger" v-if="deviceInfo.onlineStatus == 0">离线</el-tag>
								</span>
							</div>
							<div>
								<el-form label-width="120px" class="demo-form-inline">
									<el-row>
										<el-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
											<el-form-item label="压力低限：">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.pressureLow"
															style="min-width: 100px;"></el-input>
													</div>
													<div style="margin-left: 20px;">
														<el-button type="primary" @click="querypushCommand('71')">查询
														</el-button>
													</div>
												</div>
											</el-form-item>
										</el-col>
										<el-col :xl="12" :lg="24" :md="12" :sm="24" :xs="24">
											<el-form-item label="压力高限：">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.pressureHigh"
															style="min-width: 100px;"></el-input>
													</div>
													<div style="margin-left: 20px;">
														<el-button type="primary" @click="querypushCommand('72')">查询
														</el-button>
													</div>
												</div>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
											<el-form-item label="上传频率：">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.uploadFrequency"
															style="min-width: 100px;">
														</el-input>
													</div>
													<div style="margin-left: 20px;">
														<el-button type="primary" @click="querypushCommand('73')">查询
														</el-button>
													</div>
												</div>
											</el-form-item>
										</el-col>
										<el-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
											<el-form-item label="水压力波动：">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.pressureFluctuate"
															style="min-width: 100px;">
														</el-input>
													</div>
													<div style="margin-left: 20px;">
														<el-button type="primary" @click="querypushCommand('74')">查询
														</el-button>
													</div>
												</div>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
							</div>
						</el-card>
					</div>

					<div style="margin-top: 170px;">
						<el-card class="box-card">
							<div slot="header" class="clearfix">
								<span>设备详情，设备状态：<el-tag type="success" v-if="deviceInfo.status == 1">正常</el-tag>
									<el-tag type="danger" v-if="deviceInfo.status == 0">异常</el-tag>
								</span>
							</div>
							<div>
								<el-form label-width="120px" class="demo-form-inline">
									<el-row>
										<el-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
											<el-form-item label="压力低限：">
												<div class="flex">
													<div>
														<el-input-number v-model="param1" :min="0" :max="2500"
															:precision="0" style="width: 100%" @change="handleSelect">
														</el-input-number>
													</div>
													<div style="margin-left: 20px;">
														<el-button type="primary" @click="setpushCommand('01')">设置
														</el-button>
													</div>
												</div>
											</el-form-item>
										</el-col>
										<el-col :xl="12" :lg="24" :md="12" :sm="24" :xs="24">
											<el-form-item label="压力高限：">
												<div class="flex">
													<div>
														<el-input-number v-model="param2" :min="0" :max="2500"
															:precision="0" style="width: 100%" @change="handleSelect">
														</el-input-number>
													</div>
													<div style="margin-left: 20px;">
														<el-button type="primary" @click="setpushCommand('02')">设置
														</el-button>
													</div>
												</div>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
											<el-form-item label="上传频率：">
												<div class="flex">
													<div>
														<el-input-number v-model="param3" :min="1" :max="24"
															:precision="0" style="width: 100%" @change="handleSelect">
														</el-input-number>
													</div>
													<div style="margin-left: 20px;">
														<el-button type="primary" @click="setpushCommand('03')">设置
														</el-button>
													</div>
												</div>
											</el-form-item>
										</el-col>
										<el-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
											<el-form-item label="水压力波动：">
												<div class="flex">
													<div>
														<el-input-number v-model="param4" :min="0" :max="2500"
															:precision="0" style="width: 100%" @change="handleSelect">
														</el-input-number>
													</div>
													<div style="margin-left: 20px;">
														<el-button type="primary" @click="setpushCommand('04')">设置
														</el-button>
													</div>
												</div>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
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
		name: 'deviceList11',
		data() {
			return {
				deviceCode: '',
				CommandDetails: [],
				startTime: '',
				deviceInfo: {
					deviceStatus: 0
				},
				param1: 1,
				param2: 1,
				param3: 1,
				param4: 1,
				setInt: null,
				setTime: null,
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
			//获取当前时间
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
			//获取设备指令参数详情
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
			querypushCommand(command) {
				let data = {
					deviceCode: this.deviceCode,
					command: command
				}
				pushCommand(data).then(res => {
					if (res.code == 200) {
						this.$message.success(res.msg)
					} else {
						this.$message.error(res.msg)
					}
				})
			},
			//设置设备参数
			setpushCommand(command) {
				let param
				if (command == '01') {
					param = this.param1
				} else if (command == '02') {
					param = this.param2
				} else if (command == '03') {
					param = this.param3
				} else if (command == '04') {
					param = this.param4
				}
				let data = {
					deviceCode: this.deviceCode,
					command: command,
					param: param
				}
				pushCommand(data).then(res => {
					this.setInt = setInterval(() => {
						this.onfindDeviceInfoById()
					}, 2000)
					if (res.code == 200) {
						this.$message.success(res.msg)
					} else {
						this.$message.error(res.msg)
					}
				})
			},
			//查询设备详细数据
			onfindDeviceInfoById() {
				let data = {
					deviceId: this.deviceId
				}
				findDeviceListById(data).then(res => {
					if (res.code == 200) {
						this.deviceInfo = res.data
						this.param1 = parseInt(res.data.pressureLow)
						this.param2 = parseInt(res.data.pressureHigh)
						this.param3 = parseInt(res.data.uploadFrequency)
						this.param4 = parseInt(res.data.pressureFluctuate)
					}
				})
			},
		},
		created() {
			let id = this.$route.query.id
			let deviceImei = this.$route.query.deviceImei
			let deviceCode = this.$route.query.deviceCode
			this.deviceId = id
			this.deviceCode = deviceCode
			this.deviceImei = deviceImei

			// 指令详情
			this.startTime = this.getTime()
			let setTime = setInterval(() => {
				this.findDeviceCommandDetail()
			}, 2000)
			this.setTime = setTime
			// 指令详情

			// 设备详情参数
			this.onfindDeviceInfoById()
			let setInt = setInterval(() => {
				this.onfindDeviceInfoById()
			}, 2000)
			this.setInt = setInt
			// 设备详情参数

		},
		destroyed() {
			// 关闭定时任务
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
