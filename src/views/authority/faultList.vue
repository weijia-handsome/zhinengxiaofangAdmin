<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.adminName" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="故障上报人" clearable />
			<el-select v-model="listQuery.status" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="处理状态" clearable @keyup.enter.native="handleFilter">
				<el-option v-for="item in tags" :key="item.id" :label="item.title" :value="item.id" />
			</el-select>
			<el-button type="primary" style="margin-right: 20px ;" class="filter-item" @click="handleFilter"
				icon="el-icon-search" v-if="buttonVerifAuthention(':sys:deviceFeeback:findDeviceFeeBackList')">查询
			</el-button>


			<el-table v-loading="listLoading" :key="tableKey" :data="list" element-loading-text="拼命加载中......" border fit
				highlight-current-row style="width: 100%;" align="center">
				<el-table-column type="index" width="55" label="序号" align="center">
					<template scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
				</el-table-column>
				<el-table-column prop="deviceTypeName" label="设备类型" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="deviceCode" label="设备号" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="feebackCause" label="设备故障原因" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="adminName" label="故障上报人" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="adminFullname" label="上报人真实姓名" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="createTime" label="故障提交时间" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.createTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="处理状态" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-tag type="danger" v-if="scope.row.status == 0">未解决</el-tag>
						<el-tag type="success" v-if="scope.row.status == 1">已解决</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="240">
					<template slot-scope="scope">
						<el-button type="primary" @click="" style="margin-left: 10px;"
							@click="showSendWorkOrder(scope.row)"
							v-if="buttonVerifAuthention(':sys:workOrder:sendWorkOrder') && scope.row.status == 0">派单
						</el-button>
						<el-button type="danger" @click="del(scope.row.id)" style="margin-left: 10px;"
							icon="el-icon-delete" v-if="buttonVerifAuthention(':sys:deviceFeeback:deleteFeeBack')">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
					:total="total" background layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>

			<!-- 派单 -->
			<el-dialog :visible.sync="showSend" title="派单" @close="showSend = false">
				<el-form ref="sendData" :model="sendData" label-position="left" label-width="130px"
					style="width: 600px; margin-left:50px;" :rules="rules">
					<el-form-item :label="'设备号'" prop="deviceCode">
						<el-input v-model="sendData.deviceCode" placeholder="请输入设备号" clearable disabled />
					</el-form-item>
					<el-form-item :label="'处理人'" prop="userId">
						<el-select v-model="sendData.userId" style="width: 100%;" class="filter-item" placeholder="处理人"
							clearable>
							<el-option v-for="item in userList" :key="item.id" :label="item.adminName"
								:value="item.id" />
						</el-select>
					</el-form-item>
					<el-form-item :label="'要求完成时间'" prop="requireTime">
						<el-date-picker v-model="sendData.requireTime" type="datetime" placeholder="要求完成时间"
							align="right" style="width: 100%;margin-right: 20px ;" class="filter-item"
							format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSend('sendData')">确定</el-button>
						<el-button @click="showSend = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>


		</div>
	</div>
</template>

<script>
	import {
		getList,
		deleteFeeBack,
		sendWorkOrder,
		findAdminUserByDevice
	} from '@/api/authority/faultList.js'
	import {
		findAdminUser,
	} from '@/api/device/deviceList.js'
	import {
		parseTime
	} from '@/utils/index'
	export default {
		data() {
			return {
				listLoading: false,
				page: 1,
				limit: 10,
				list: [],
				total: 10,
				listQuery: {
					page: 1,
					limit: 10,
					adminName: '',
					status: ''
				},
				tableKey: 0,
				rules: {
					deviceCode: [{
						required: true,
						message: '请输入设备号',
						trigger: 'blur'
					}],
					userId: [{
						required: true,
						message: '请选择处理人',
						trigger: 'blur'
					}],
					requireTime: [{
						required: true,
						message: '请选择要求完成时间',
						trigger: 'change'
					}],
				},
				tags: [{
					title: '未解决',
					id: 0,
				}, {
					title: '已解决',
					id: 1,
				}],
				showSend: false,
				sendData: {
					deviceCode: '',
					userId: '',
					requireTime: '',
				},
				userList: []
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
			del(id) {
				this.$confirm('这一操作将永久删除该记录。你想继续吗?', '警告', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning'
				}).then(() => {
					let data = {
						id
					}
					console.log(data)
					deleteFeeBack(data).then(res => {
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
			showSendWorkOrder(item) {
				this.getfindAdminUserByDevice(item.deviceId)
				this.showSend = true
				this.sendData.deviceCode = item.deviceCode
				let requireTime=this.getLocalTime(1)
				requireTime=requireTime+' '+'18:00:00'
				console.log(requireTime)
				this.sendData.requireTime=requireTime
			},
			getLocalTime(addNum){
			  var today,ms,thatDay, y, m, d,endDate;
			  today = new Date().getTime();
			  ms = today + addNum*24*60*60*1000;
			  thatDay = new Date(ms);
			  y = thatDay.getFullYear();
			  m = thatDay.getMonth()+1;
			  d = thatDay.getDate();
			  endDate = y+"-"+m+"-"+d;
			  return endDate
			},
			getfindAdminUserByDevice(deviceId) {
				let data={
					deviceId
				}
				findAdminUserByDevice(data).then(res => {
					if (res.code == 200) {
						let userList = res.data || []
						if(userList.length != 0){
							userList.forEach((item,index)=>{
								item.adminName=item.adminFullname+'('+item.adminName+')'
							})
						}
						this.userList=userList
					}
				})
			},
			onSend(formName) {
				this.$refs[formName].validate(valid => {
					console.log(valid)
					if (valid) {
						console.log("通过",this.sendData)
						this.Loading = true
						sendWorkOrder(this.sendData).then(res => {
							this.Loading = false
							if (res.code == 200) {
								this.showSend = false
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
