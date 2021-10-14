<template>
	<div class="app-container">
		<div class="filter-container">
			<el-table v-loading="listLoading" :key="tableKey" :data="list" element-loading-text="拼命加载中......" border fit
				highlight-current-row style="width: 100%;" align="center">
				<el-table-column type="index" width="55" label="序号" align="center">
					<template scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
				</el-table-column>
				<el-table-column prop="deviceCode" label="设备号" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="deviceImei" label="设备Imei" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="deviceTypeName" label="设备类型" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="alarmType" label="报警类型" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="alarmDate" label="报警数据" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="deviceAddress" label="安装地址" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="adminFullname" label="归属人" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="alarmTime" label="报警时间" align="center" sortable>
					<template slot-scope="scope">
						<span>{{ scope.row.alarmTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="240">
					<template slot-scope="scope">
						
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
					:total="total" background layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</div>
	</div>
</template>

<script>
	import {
		getList,
		findAlarmInfo
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
					deviceTypeId: '',
					deviceCode: '',
					alarmTimeStart: '',
					alarmTimeEnd: ''
				},
				tableKey: 0,
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
				findAlarmInfo(this.listQuery).then(res => {
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
		},
		created() {
			let deviceCode = this.$route.query.deviceCode
			// let deviceTypeId = this.$route.query.deviceTypeId
			this.listQuery.deviceCode=deviceCode
			// this.listQuery.deviceTypeId=deviceTypeId
			this.getLists()
		},
	}
</script>

<style scoped="scoped">

</style>
