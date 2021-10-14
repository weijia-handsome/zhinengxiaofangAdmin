<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.deviceCode" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="设备编码" clearable />
			<el-select v-model="listQuery.status" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="设备状态" clearable @keyup.enter.native="handleFilter">
				<el-option v-for="item in tags" :key="item.id" :label="item.title" :value="item.id" />
			</el-select>
			<el-button type="primary" style="margin-right: 20px ;" class="filter-item" @click="handleFilter"
				icon="el-icon-search" v-if="buttonVerifAuthention(':sys:device:findDeviceList')">查询</el-button>


			<div style="margin: 15px 0;">
				<el-button style="margin-right: 20px ;" type="primary" @click="showAdd = true"
					v-if="buttonVerifAuthention(':sys:device:addDevice')">新增设备</el-button>
				<el-button style="margin-right: 20px ;" type="primary" class="filter-item" @click="handleDownload1"
					:loading="downloadLoading" icon="el-icon-download"
					v-if="buttonVerifAuthention(':sys:device:uploadDeviceExcel')">模板下载
				</el-button>
				<el-button style="margin-right: 20px ;" type="primary" class="filter-item" @click="showExcel=true"
					icon="el-icon-upload" v-if="buttonVerifAuthention(':sys:device:uploadDeviceExcel')">导入Excel
				</el-button>
			</div>

			<el-table v-loading="listLoading" :key="tableKey" :data="list" element-loading-text="拼命加载中......" border fit
				highlight-current-row style="width: 100%;" align="center">

				<el-table-column type="expand" width="100">
					<template slot-scope="props">
						<el-form label-position="left" class="demo-table-expand">
							<el-form-item label="绑定时间">
								<span>{{ props.row.bindingTime | formatDate }}</span>
							</el-form-item>
							<el-form-item label="最后上报数据时间">
								<span>{{ props.row.lastUpdate | formatDate }}</span>
							</el-form-item>
							<el-form-item label="创建时间">
								<span>{{ props.row.createTime | formatDate }}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>

				<el-table-column type="index" width="55" label="序号" align="center">
					<template scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
				</el-table-column>
				<el-table-column prop="deviceCode" label="设备编码" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="deviceImei" label="设备imei" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="deviceTypeName" label="设备类型" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<!-- <el-table-column prop="deviceParam" label="设备参数" align="center" :show-overflow-tooltip="true">
				</el-table-column> -->
				<el-table-column prop="deviceSignal" label="信号强度" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-tag type="danger" v-if="scope.row.deviceSignal == 0">信号极弱</el-tag>
						<el-tag type="danger" v-if="scope.row.deviceSignal == 1">信号不佳</el-tag>
						<el-tag type="success" v-if="scope.row.deviceSignal == 2">信号较好</el-tag>
						<el-tag type="success" v-if="scope.row.deviceSignal == 3">信号很好</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="onlineStatus" label="设备在线状态" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-tag type="danger" v-if="scope.row.onlineStatus == 0">离线</el-tag>
						<el-tag type="success" v-if="scope.row.onlineStatus == 1">在线</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="设备状态" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-tag type="danger" v-if="scope.row.status == 0">未入网</el-tag>
						<el-tag type="success" v-if="scope.row.status == 1">正常</el-tag>
						<el-tag type="danger" v-if="scope.row.status == 2">预警</el-tag>
						<el-tag type="success" v-if="scope.row.status == 3">故障</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="bindingStatus" label="绑定状态" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-tag type="danger" v-if="scope.row.bindingStatus == 0">未绑定</el-tag>
						<el-tag type="success" v-if="scope.row.bindingStatus == 1">已绑定</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="firstAdminFullname" label="区" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="secondAdminFullname" label="社区" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="thirdAdminFullname" label="物业" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="deviceAddress" label="安装地址" align="center" :show-overflow-tooltip="true">
				</el-table-column>

				<!-- <el-table-column prop="deviceAddress" label="安装地址" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="bindingTime" label="绑定时间" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.bindingTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="lastUpdate" label="最后上报数据时间" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.lastUpdate | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center" sortable :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.createTime | formatDate }}</span>
					</template>
				</el-table-column> -->



				<el-table-column label="操作" align="center" fixed="right" width="300">
					<template slot-scope="scope">
						<div class="flex" style="justify-content: space-around;">
							<div>
								<div>
									<el-button type="primary" @click='setDevice(scope.row)' size='mini'
										v-if="buttonVerifAuthention(':sys:setDevice')">
										控制
									</el-button>
								</div>
								<div style="height: 20px;"></div>
								<div>
									<el-button type="danger" @click="del(scope.row.deviceImei)" size='mini'
										v-if="buttonVerifAuthention(':sys:device:deleteDevice')">删除
									</el-button>
								</div>
							</div>
							<div style="">
								<div>
									<el-button type="primary" @click="show_qrcode(scope.row.deviceImei)" size="mini"
										v-if="buttonVerifAuthention(':sys:qrcode')">二维码
									</el-button>
								</div>
								<div style="height: 20px;"></div>
								<div>
									<el-button type="primary" @click="AlarmInfo(scope.row)" size="mini"
										v-if="buttonVerifAuthention(':sys:alarm:findAlarmInfo')">告警列表
									</el-button>
								</div>
							</div>
							<div>
								<allocationDevice :row_data="scope.row" @getLists="getLists"></allocationDevice>
							</div>
						</div>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<div class="pagination-container">
				<el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
					:total="total" background layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>

			<!-- 新增设备 -->
			<el-dialog :visible.sync="showAdd" title="新增设备" @close="showAdd = false">
				<el-form ref="addData" :model="addData" label-position="left" label-width="100px"
					style="width: 600px; margin-left:50px;" :rules="rules">
					<el-form-item :label="'设备imei'" prop="deviceImei">
						<el-input v-model="addData.deviceImei" placeholder="请输入设备imei" clearable />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onaddData('addData')">确定</el-button>
						<el-button @click="showAdd = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>

			<!-- 编辑设备 -->
			<el-dialog :visible.sync="showEdit" title="编辑设备" @close="showEdit = false">
				<el-form ref="editData" :model="editData" label-position="left" label-width="100px"
					style="width: 600px; margin-left:50px;" :rules="rules">
					<el-form-item :label="'设备名称'" prop="roleName">
						<el-input v-model="addData.roleName" placeholder="请输入设备名称" clearable />
					</el-form-item>
					<el-form-item :label="'设备编码'" prop="roleRemark">
						<el-input v-model="addData.roleRemark" placeholder="请输入设备编码" clearable />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onEditData('editData')">确定</el-button>
						<el-button @click="showEdit = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>

			<!-- 二维码 -->
			<el-dialog :visible.sync="showqrCode" @opened="qrCodeCreate" :before-close="qrCodeHandleClose" width="30%">
				<div style="display: flex;justify-content: center;">
					<div>
						<div style="text-align: center;">{{titleStr}}</div>
						<div style="margin-top: 20px;display: flex;justify-content: center;text-align: center;">
							<div>
								<div id="qrCode" ref="qrCode" style="text-align: center;"></div>
								<div style="margin-top: 20px;">
									<el-button @click="print('trueBtn')" type="primary">打印二维码</el-button>
									<el-button @click="downsQRcode" type="primary">下载二维码</el-button>
									<button v-print="'#qrCode'" id="trueBtn" style="display: none">
										打印二维码
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</el-dialog>


			<!-- 导入excel -->
			<el-dialog :visible.sync="showExcel" title="导入Excel" @close="showExcel = false">
				<el-upload drag :multiple="false" :show-file-list="false" :http-request="upload" accept=".xls,.xlsx"
					action="" v-loading.fullscreen.lock="fullscreenLoading">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				</el-upload>
			</el-dialog>

		</div>
	</div>
</template>

<script>
	import {
		getList,
		addDevice,
		deleteDevice,
		uploadExcel
	} from '@/api/device/deviceList.js'
	import QRCode from 'qrcodejs2'
	import {
		parseTime
	} from '@/utils/index'
	import loadMap from "../../utils/loadMap.js";
	import allocationDevice from './allocationDevice'
	export default {
		components: {
			allocationDevice
		},
		data() {
			return {
				fullscreenLoading: false,
				showExcel: false,
				downloadLoading: false,
				listLoading: false,
				page: 1,
				limit: 10,
				list: [],
				total: 10,
				listQuery: {
					page: 1,
					limit: 10,
					deviceCode: '',
					status: '',
					deviceTypeId: 1000
				},
				tableKey: 0,
				showAdd: false,
				addData: {
					deviceImei: '',
					deviceTypeId: 1000
				},
				showEdit: false,
				editData: {

				},
				rules: {
					deviceImei: [{
						required: true,
						message: '请输入设备imei',
						trigger: 'blur'
					}],
				},
				tags: [{
					title: '未入网',
					id: 0,
				}, {
					title: '正常',
					id: 1,
				}, {
					title: '预警',
					id: 2,
				}, {
					title: '故障',
					id: 3,
				}],
				showqrCode: false,
				titleStr: '',
				codeWidth: 260,
				codeHeight: 260,
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
			//导入
			upload(file) {
				// console.log(file.file)
				// 创建FormData对象
				let param = new FormData()
				// 将得到的文件流添加到FormData对象
				param.append('file', file.file)
				console.log(param, "11111")
				this.fullscreenLoading = true
				uploadExcel(param).then(res => {
					this.fullscreenLoading = false
					if (res.code == 200) {
						this.$message.success('上传成功')
						this.showExcel = false
						this.getLists()
					} else {
						this.$message.error('上传失败，原因' + res.msg)
					}
				}).catch((err) => {
					this.$message.error('上传失败，请重试')
					this.fullscreenLoading = false
				})
			},
			//模板下载
			handleDownload1() {
				import('@/vendor/Export2Excel').then(excel => {
					const tHeader = ['设备号', '设备imei', '设备类型(消防栓:1000;液位表:10001;智能门磁:10002)', '管理员电话']
					const data = []
					excel.export_json_to_excel({
						header: tHeader,
						data,
						filename: '设备导入模板'
					})
					this.downloadLoading = false
				})
			},
			//清除二维码
			qrCodeHandleClose() {
				this.showqrCode = false;
				this.qrCode = '';
				let str = 'qrCode'
				document.getElementById(str).innerHTML = '';
			},
			//显示二维码
			show_qrcode(deviceImei) {
				console.log(deviceImei)
				this.showqrCode = true
				this.codeUrl = deviceImei
				this.titleStr = "设备Imei:" + deviceImei
			},
			qrcode(url) {
				let str = 'qrCode'
				let baseUrl = this.Global.codeUrl
				let urls = ''
				urls = baseUrl + '?qrcode=' + url
				this.qrCode = new QRCode(str, {
					text: urls,
					width: this.codeWidth,
					height: this.codeHeight
				})
			},
			qrCodeCreate() {
				let url = this.codeUrl
				this.$nextTick(() => {
					this.qrcode(url);
				})
			},
			//打印
			print(str) {
				console.log(str)
				document.getElementById(str).click();
			},
			//下载图片
			downsQRcode() {
				//找到canvas标签
				let myCanvas = document.getElementById("qrCode").getElementsByTagName("canvas");
				let img = document
					.getElementById("qrCode")
					.getElementsByTagName("img");
				// // //创建一个a标签节点
				let a = document.createElement("a");
				// //设置a标签的href属性（将canvas变成png图片）
				let imgURL = myCanvas[0].toDataURL("image/jpg");
				let ua = navigator.userAgent;
				if (ua.indexOf("Trident") != -1 && ua.indexOf("Windows") != -1) {
					// IE内核 并且  windows系统 情况下 才执行;
					var bstr = atob(imgURL.split(",")[1]);
					var n = bstr.length;
					var u8arr = new Uint8Array(n);
					while (n--) {
						u8arr[n] = bstr.charCodeAt(n);
					}
					var blob = new Blob([u8arr]);
					let name = this.codeUrl
					window.navigator.msSaveOrOpenBlob(blob, name + "." + "png");
				} else if (ua.indexOf("Firefox") > -1) {
					//火狐兼容下载
					let blob = this.base64ToBlob(imgURL); //new Blob([content]);
					let evt = document.createEvent("HTMLEvents");
					evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
					let name = this.codeUrl
					a.download = name; //下载图片名称，如果填内容识别不到，下载为未知文件，所以我这里就不填为空
					a.href = URL.createObjectURL(blob);
					a.dispatchEvent(
						new MouseEvent("click", {
							bubbles: true,
							cancelable: true,
							view: window
						})
					); //兼容火狐
				} else {
					//谷歌兼容下载
					img.src = myCanvas[0].toDataURL("image/jpg");
					// a.href = myCanvas[0].toDataURL('image/png').replace('image/png', 'image/octet-stream')
					a.href = img.src;
					//设置下载文件的名字
					let name = this.codeUrl
					a.download = name;
					//点击
					a.click();
				}
			},
			//跳转控制
			setDevice(item) {
				this.$router.push({
					name: 'setDevice0',
					query: {
						id: item.id,
						deviceCode: item.deviceCode,
						deviceImei: item.deviceImei
					}
				})
			},
			//设备告警
			AlarmInfo(item) {
				this.$router.push({
					name: 'warnDevice',
					query: {
						deviceCode: item.deviceCode,
						deviceTypeId: 1000
					}
				})
			},
			getLists() {
				this.listLoading = true
				getList(this.listQuery).then(res => {
					if (res.code == 200) {
						console.log(res)
						this.list = res.data
						this.total = res.count
						this.listLoading = false
					} else {
						this.$message.error(res.msg)
					}
				})
			},
			del(deviceImei) {
				this.$confirm('这一操作将永久删除该记录。你想继续吗?', '警告', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning'
				}).then(() => {
					let data = {
						deviceImei
					}
					console.log(data)
					deleteDevice(data).then(res => {
						if (res.code == 200) {
							this.$message({
								type: 'success',
								message: res.msg
							})
							this.getLists()
						} else {
							this.$message.error(res.msg)
						}
					})
				})
			},
			handleSizeChange(val) {
				this.listQuery.limit = val
				this.getLists()
			},
			handleCurrentChange(val) {
				this.listQuery.page = val
				this.getLists()
			},
			handleFilter() {
				this.listQuery.page = 1
				this.getLists()
			},
			onaddData(formName) {
				this.$refs[formName].validate(valid => {
					console.log(valid)
					if (valid) {
						console.log("通过")
						this.Loading = true
						addDevice(this.addData).then(res => {
							this.Loading = false
							if (res.code == 200) {
								this.showAdd = false
								this.resetForm(formName)
								this.$message.success(res.msg)
								this.getLists()
							} else {
								this.$message.error(res.msg)
							}
						})
					} else {
						console.log("不通过")
						return false
					}
				})
			},
			showDidlaoEditData(item) {

			},
			onEditData(formName) {
				this.$refs[formName].validate(valid => {
					console.log(valid)
					if (valid) {
						console.log("通过")
						this.Loading = true
						updateRole(this.editData).then(res => {
							this.Loading = false
							if (res.code == 200) {
								this.showEdit = false
								this.resetForm(formName)
								this.$message.success(res.msg)
								this.getLists()
							} else {
								this.$message.error(res.msg)
							}
						})
					} else {
						console.log("不通过")
						return false
					}
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
		},
		created() {
			this.getLists()
		},
	}
</script>

<style scoped="scoped">

</style>
