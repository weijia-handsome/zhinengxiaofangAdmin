<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.deviceCode" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="请输入设备号" clearable />
			<el-select v-model="listQuery.deviceTypeId" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="请选择设备类型" clearable @keyup.enter.native="handleFilter">
				<el-option v-for="item in tags" :key="item.id" :label="item.title" :value="item.id" />
			</el-select>
			<el-date-picker v-model="listQuery.alarmTimeStart" type="datetime" placeholder="开始时间" align="right"
				style="width: 200px;margin-right: 20px ;" class="filter-item" format="yyyy-MM-dd HH:mm:ss"
				value-format="yyyy-MM-dd HH:mm:ss">
			</el-date-picker>
			<el-date-picker v-model="listQuery.alarmTimeEnd" type="datetime" placeholder="结束时间" align="right"
				style="width: 200px;margin-right: 20px ;" class="filter-item" format="yyyy-MM-dd"
				value-format="yyyy-MM-dd">
			</el-date-picker>
			<el-button type="primary" style="margin-right: 20px ;" class="filter-item" @click="handleFilter"
				icon="el-icon-search" v-if="buttonVerifAuthention(':sys:alarm:findAlarmInfo')">查询</el-button>
			<el-button style="margin-right: 20px ;" type="danger" class="filter-item" @click="onbatchDeleteAlarm" v-if="buttonVerifAuthention(':sys:alarm:batchDeleteAlarm')">批量删除
			</el-button>
			<el-table v-loading="listLoading" :key="tableKey" :data="list" element-loading-text="拼命加载中......" border fit
				highlight-current-row style="width: 100%;" align="center" @select="select" @select-all="selectAll">
				<el-table-column type="selection" align="center">
				</el-table-column>
				<el-table-column type="index" width="55" label="序号" align="center">
					<template slot-scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
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
				<el-pagination :current-page="listQuery.page" :page-sizes="[50,100,150, 200]" :page-size="listQuery.limit"
					:total="total" background layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</div>
	</div>
</template>

<script>
	import {
		getList,
		batchDeleteAlarm
	} from '@/api/warn/warnList.js'
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
					limit: 50,
					deviceTypeId: '',
					deviceCode: '',
					alarmTimeStart: '',
					alarmTimeEnd: ''
				},
				tableKey: 0,
				tags: [{
					title: '消防桩',
					id: 1000,
				}, {
					title: '液位表',
					id: 1001,
				}, {
					title: '智能门磁',
					id: 1002,
				}],
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
				let listQuery=this.listQuery
				if(listQuery.alarmTimeStart == null){
					listQuery.alarmTimeStart=''
				}
				if(listQuery.alarmTimeEnd == null){
					listQuery.alarmTimeEnd=''
				}
				getList(listQuery).then(res => {
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
			//单个选择表格数据
			select(row) {
				console.log(row)
				let ids = ''
				let idarr = []
				if (row.length == 0) {
					ids = ''
				} else {
					row.forEach((item, index) => {
						idarr.push(item.id)
					})
				}
				if (idarr.length != 0) {
					ids = idarr.join(",")
				}
				console.log(ids, idarr)
				this.ids = ids
			},
			//全选表格数据
			selectAll(row) {
				console.log(row)
				let ids = ''
				let idarr = []
				if (row.length == 0) {
					ids = ''
				} else {
					row.forEach((item, index) => {
						idarr.push(item.id)
					})
				}
				if (idarr.length != 0) {
					ids = idarr.join(",")
				}
				console.log(ids, idarr)
				this.ids = ids
			},
			onbatchDeleteAlarm(){
				console.log(this.ids)
				if (this.ids == '' || this.ids == null || this.ids == undefined) {
					this.$message.error("请选择要删除的数据")
					return false
				}
				let data={
					ids:this.ids
				}
				batchDeleteAlarm(data).then(res=>{
					if(res.code == 200){
						this.$message.success(res.msg)
						this.getLists()
					}else{
						this.$message.error(res.msg)
					}
				})
			}
		},
		created() {
			this.getLists()
		},
	}
</script>

<style scoped="scoped">

</style>
