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
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="水压值：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.waterPressure"
															style="min-width: 100px;"></el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
										<el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
											<el-form-item label="环境温度：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.temperatureValue"
															style="min-width: 100px;"></el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="电压：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.batteryValue"
															style="min-width: 100px;">
														</el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="采集周期：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.collectPeriod">
														</el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="连接周期：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.connectPeriod">
														</el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="水压最低警告位：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.warnMin">
														</el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="水压最高警告位：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.warnMax">
														</el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="水压最低采样位：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.samplingMin">
														</el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="水压最高采样位：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.samplingMax">
														</el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="水压变化率：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.chgRate">
														</el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="水压最高采样位：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.samplingMax"
															style="min-width: 100px;">
														</el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
										<el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
											<el-form-item label="上传频率：" label-width="auto">
												<div class="flex">
													<div>
														<el-input disabled v-model="deviceInfo.uploadFrequency">
														</el-input>
													</div>
												</div>
											</el-form-item>
										</el-col>
									</el-row>

								</el-form>
							</div>
						</el-card>
					</div>

					<div style="margin-top: 20px;">
						<el-card class="box-card">
							<div slot="header" class="clearfix">
								<span>设备详情，设备状态：<el-tag type="success" v-if="deviceInfo.status == 1">正常</el-tag>
									<el-tag type="danger" v-if="deviceInfo.status == 0">异常</el-tag>
								</span>
							</div>
							<div>
								<el-form label-width="120px" class="demo-form-inline">
									
									<div class="flex" style="width: 100%;">
										<div style="width: 50%;">
											<el-form-item label="采集周期：" prop="collectPeriod" label-width="300">
												<el-input-number v-model="deviceInfoo.collectPeriod" :min="0"
													:max="65535" :precision="0"  style="width: 70%;"
													@change="handleSelect">
												</el-input-number>
											</el-form-item>
										</div>
										<div style="width: 50%;">
											<el-form-item label="连接周期：" prop="ConnectPeriod" label-width="300">
												<el-input-number v-model="deviceInfoo.ConnectPeriod" :min="0"
													:max="65535" :precision="0" style="width: 70%;"
													@change="handleSelect">
												</el-input-number>
											</el-form-item>
										</div>
									</div>
									
									<div class="flex" style="width: 100%;">
										<div style="width: 50%;">
											<el-form-item label="水压最低警告位："  prop="warnMin" label-width="300">
												<el-input-number v-model="deviceInfoo.warnMin" :min="1"
													:max="65535" :precision="0" style="width: 65%;"
													@change="handleSelect">
												</el-input-number>
											</el-form-item>
										</div>
										<div style="width: 50%;">
											<el-form-item label="水压最高警告位："  prop="warnMax" label-width="300">
												<el-input-number v-model="deviceInfoo.warnMax" :min="0"
													:max="65535" :precision="0" style="width: 65%;"
													@change="handleSelect">
												</el-input-number>
											</el-form-item>
										</div>
									</div>
									
									<div class="flex" style="width: 100%;">
										<div style="width: 50%;">
											<el-form-item label="水压最高采样位："  prop="samplingMax" label-width="300">
												<el-input-number v-model="deviceInfoo.samplingMax" :min="0"
													:max="65535" :precision="0" style="width: 65%;"
													@change="handleSelect">
												</el-input-number>
											</el-form-item>
										</div>
										<div style="width: 50%;">
											<el-form-item label="水压最低采样位："  prop="samplingMin" label-width="300">
												<el-input-number v-model="deviceInfoo.samplingMin" :min="1"
													:max="65535" :precision="0" style="width: 65%;"
													@change="handleSelect">
												</el-input-number>
											</el-form-item>
										</div>
									</div>
									
									<div class="flex" style="width: 100%;">
										<div style="width: 50%;">
											<el-form-item label="水压变化率：" prop="chgRate" label-width="300">
												<el-input-number v-model="deviceInfoo.chgRate" :min="0"
													:max="10000" :precision="0" style="width: 70%;"
													@change="handleSelect">
												</el-input-number>
											</el-form-item>
										</div>
										<div style="width: 50%;">
											<el-form-item label="传感器标称值：" prop="sensorNominal" label-width="300">
												<el-input-number v-model="deviceInfoo.sensorNominal" :min="1"
													:max="10000" :precision="0" style="width: 70%;"
													@change="handleSelect">
												</el-input-number>
											</el-form-item>
										</div>
									</div>

									<el-form-item label=" ">
										<el-button type="primary" @click='editConfirm'>确认设置</el-button>
									</el-form-item>
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
		findDeviceListById,
		pushCommandByFireControl
	} from '@/api/device/deviceList.js'
	import {
		parseTime
	} from '@/utils/index'
	export default {
		name: 'deviceList1',
		data() {
			return {
				deviceCode: '',
				CommandDetails: [],
				startTime: '',
				deviceInfo: {},
				deviceInfoo: {},
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
			//获取设备指令详情
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
			editConfirm() {
				if(this.deviceInfoo.collectPeriod == '' || this.deviceInfoo.collectPeriod == null || this.deviceInfoo.collectPeriod == undefined){
					this.$message.error('请输入采集周期')
					return false
				}
				if(this.deviceInfoo.ConnectPeriod == '' || this.deviceInfoo.ConnectPeriod == null || this.deviceInfoo.ConnectPeriod == undefined){
					this.$message.error('请输入连接周期')
					return false
				}
				if(this.deviceInfoo.warnMin == '' || this.deviceInfoo.warnMin == null || this.deviceInfoo.warnMin == undefined){
					this.$message.error('请输入水压最低警告位')
					return false
				}
				if(this.deviceInfoo.warnMax == '' || this.deviceInfoo.warnMax == null || this.deviceInfoo.warnMax == undefined){
					this.$message.error('请输入水压最高警告位')
					return false
				}
				if(this.deviceInfoo.samplingMax == '' || this.deviceInfoo.samplingMax == null || this.deviceInfoo.samplingMax == undefined){
					this.$message.error('请输入水压最高采样位')
					return false
				}
				if(this.deviceInfoo.samplingMin == '' || this.deviceInfoo.samplingMin == null || this.deviceInfoo.samplingMin == undefined){
					this.$message.error('请输入水压最低采样位')
					return false
				}
				if(this.deviceInfoo.chgRate == '' || this.deviceInfoo.chgRate == null || this.deviceInfoo.chgRate == undefined){
					this.$message.error('请输入水压变化率')
					return false
				}
				if(this.deviceInfoo.sensorNominal == '' || this.deviceInfoo.sensorNominal == null || this.deviceInfoo.sensorNominal == undefined){
					this.$message.error('请输入传感器标称值')
					return false
				}
				let data = {
					deviceCode: this.deviceCode,
					collectPeriod: this.deviceInfoo.collectPeriod,
					ConnectPeriod: this.deviceInfoo.ConnectPeriod,
					warnMin: this.deviceInfoo.warnMin,
					warnMax: this.deviceInfoo.warnMax,
					samplingMin: this.deviceInfoo.samplingMin,
					samplingMax: this.deviceInfoo.samplingMax,
					sensorNominal: this.deviceInfoo.sensorNominal,
					chgRate: this.deviceInfoo.chgRate,
				}
				pushCommandByFireControl(data).then(res => {
					if (res.code == 200) {
						this.$message.success(res.msg)
						this.setInt = setInterval(() => {
							this.onfindDeviceInfoById()
						}, 3000)
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
						let deviceInfoo = JSON.parse(JSON.stringify(res.data))
						this.deviceInfoo = deviceInfoo
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
			}, 3000)
			this.setTime = setTime
			// 指令详情

			// 设备详情参数
			// this.onfindDeviceInfoById()
			let setInt = setInterval(() => {
				this.onfindDeviceInfoById()
			}, 3000)
			this.setInt = setInt
			// 设备详情参数

		},
		destroyed() {
			// 关闭定时刷新
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
		height: 584px;
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
