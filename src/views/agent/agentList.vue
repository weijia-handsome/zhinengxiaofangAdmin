<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.adminName" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="请输入登录账号" clearable />
			<el-input v-model="listQuery.adminPhone" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="请输入手机号" clearable />
			<el-autocomplete style="width: 200px;margin-right: 20px ;" class="filter-item"
				v-model="listQuery.adminName1" :fetch-suggestions="querySearch" placeholder="请选择角色"
				@select="handleSelect" clearable :debounce='0' @change="changeName"></el-autocomplete>
			<el-button type="primary" style="margin-right: 20px ;" class="filter-item" @click="handleFilter"
				icon="el-icon-search">查询</el-button>
			<el-button type="primary" style="margin-right: 20px ;" class="filter-item" @click='showAdd =true'
				v-if="buttonVerifAuthention(':sys:admin:addAdminUser')">添加管理员
			</el-button>


			<el-table v-loading="listLoading" :key="tableKey" :data="list" element-loading-text="拼命加载中......" border fit
				highlight-current-row style="width: 100%;" align="center">
				<!-- <el-table-column type="selection" align="center" width="55">
				</el-table-column> -->
				<el-table-column type="index" width="55" label="序号" align="center">
					<template scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
				</el-table-column>
				<el-table-column label="登录账号" prop="adminName" align="center">
				</el-table-column>
				<el-table-column label="姓名" prop="adminFullname" align="center">
				</el-table-column>
				<el-table-column prop="adminPhone" label="手机号" align="center" :show-overflow-tooltip='true'>
				</el-table-column>
				<el-table-column prop="roleName" label="角色" align="center" :show-overflow-tooltip='true'>
				</el-table-column>
				<el-table-column prop="lastLoginTime" label="最后登录时间" align="center" sortable
					:show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.lastLoginTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="	创建时间" align="center" sortable :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.createTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="300">
					<template slot-scope="scope">
						<el-button type="primary" style="margin-left: 10px;"
							v-if="buttonVerifAuthention(':agent:agentList:edit')" @click='showDidlaoEditData(scope.row)'
							size="mini">编辑
						</el-button>
						<el-button type="danger" style="margin-left: 10px;"
							v-if="buttonVerifAuthention(':agent:agentList:delete')" @click='del(scope.row.id)'
							size="mini">删除
						</el-button>
						<el-button type="primary" style="margin-left: 10px;" @click='editPassword(scope.row.id)'
							size="mini" v-if="buttonVerifAuthention(':sys:admin:editPasswordAdminUser')">初始化密码
						</el-button>
						<el-button type="primary" style="margin-left: 0px;margin-top: 10px;" size="mini"
							@click='onshowTable(scope.row.id)'
							v-if="buttonVerifAuthention(':sys:admin:findAdminUserSonList')">下一级人员
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
					:total="total" background layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>

			<!-- 添加管理员-->
			<el-dialog :visible.sync="showAdd" title="添加管理员" @close="showAdd = false" style="width: 80%;">
				<el-form ref="addData" :model="addData" label-position="left" label-width="100px"
					style="margin-left:50px;width: 450px;" :rules="rules">
					<el-form-item :label="'登录账号'" prop="adminName">
						<el-input v-model="addData.adminName" placeholder="请输入登录账号" clearable />
					</el-form-item>
					<el-form-item :label="'姓名'" prop="adminFullname">
						<el-input v-model="addData.adminFullname" placeholder="请输入姓名" clearable />
					</el-form-item>
					<el-form-item :label="'手机号'" prop="adminPhone">
						<el-input v-model="addData.adminPhone" placeholder="请输入手机号" clearable />
					</el-form-item>
					<el-form-item :label="'角色'" prop="roleId" style="width: 100%;">
						<el-select v-model="addData.roleId" class="filter-item" placeholder="请选择角色" clearable
							@keyup.enter.native="handleFilter" style="width: 100%;">
							<el-option v-for="item in tags" :key="item.id" :label="item.roleName" :value="item.id" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onaddData('addData')">确定</el-button>
						<el-button @click="showAdd = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>

			<!-- 编辑管理员-->
			<el-dialog :visible.sync="showEdit" title="编辑管理员" @close="showEdit = false" style="width: 80%;">
				<el-form ref="editData" :model="editData" label-position="left" label-width="100px"
					style="margin-left:50px;width: 450px;" :rules="rules">
					<el-form-item :label="'登录账号'" prop="adminName">
						<el-input v-model="editData.adminName" placeholder="请输入登录账号" clearable />
					</el-form-item>
					<el-form-item :label="'姓名'" prop="adminFullname">
						<el-input v-model="editData.adminFullname" placeholder="请输入姓名" clearable />
					</el-form-item>
					<el-form-item :label="'手机号'" prop="adminPhone">
						<el-input v-model="editData.adminPhone" placeholder="请输入手机号" clearable />
					</el-form-item>
					<el-form-item :label="'角色'" prop="roleId" style="width: 100%;">
						<el-select v-model="editData.roleId" class="filter-item" placeholder="请选择角色" clearable
							@keyup.enter.native="handleFilter" style="width: 100%;">
							<el-option v-for="item in tags" :key="item.id" :label="item.roleName" :value="item.id" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onEditData('editData')">确定</el-button>
						<el-button @click="showEdit = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>


			<el-dialog :visible.sync="showTable" title="所有代理商" @close="showTable = false" style="width: 100%;">
				<el-table v-loading="listLoading1" :key="tableKey" :data="list1" element-loading-text="拼命加载中......"
					border fit highlight-current-row style="width: 100%;" align="center">
					<el-table-column type="index" width="55" label="序号" align="center">
						<template scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
					</el-table-column>
					<el-table-column label="登录账号" prop="adminName" align="center">
					</el-table-column>
					<el-table-column label="姓名" prop="adminFullname" align="center">
					</el-table-column>
					<el-table-column prop="adminPhone" label="手机号" align="center" :show-overflow-tooltip='true'>
					</el-table-column>
					<el-table-column prop="roleName" label="角色" align="center" :show-overflow-tooltip='true'>
					</el-table-column>
					<el-table-column prop="lastLoginTime" label="最后登录时间" align="center" sortable
						:show-overflow-tooltip="true">
						<template slot-scope="scope">
							<span>{{ scope.row.lastLoginTime | formatDate }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="	创建时间" align="center" sortable
						:show-overflow-tooltip="true">
						<template slot-scope="scope">
							<span>{{ scope.row.createTime | formatDate }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" fixed="right" width="300">
						<template slot-scope="scope">
							<el-button type="primary" style="margin-left: 10px;"
								v-if="buttonVerifAuthention(':agent:agentList:edit')"
								@click='showDidlaoEditData(scope.row)' size="mini">编辑
							</el-button>
							<el-button type="danger" style="margin-left: 10px;"
								v-if="buttonVerifAuthention(':agent:agentList:delete')" @click='del(scope.row.id)'
								size="mini">删除
							</el-button>
							<el-button type="primary" style="margin-left: 10px;" @click='editPassword(scope.row.id)'
								size="mini" v-if="buttonVerifAuthention(':sys:admin:editPasswordAdminUser')">初始化密码
							</el-button>
							<el-button type="primary" style="margin-left: 0px;margin-top: 10px;" size="mini"
								@click='onshowTable(scope.row.id)'
								v-if="buttonVerifAuthention(':sys:admin:findAdminUserSonList')">下一级人员
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination-container">
					<el-pagination :current-page="listQuery1.page" :page-sizes="[10,20,30, 50]"
						:page-size="listQuery1.limit" :total="total1" background
						layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange1"
						@current-change="handleCurrentChange1" />
				</div>
			</el-dialog>

		</div>
	</div>
</template>

<script>
	import {
		getList,
		updateAdminUser,
		deleteAdminUser,
		addAdminUser,
		editPasswordAdminUser,
		findAdminUserSonList,
		findRoleList
	} from '@/api/agent/agentList.js'
	import {
		parseTime
	} from '@/utils/index'
	export default {
		name: 'agentList1',
		components: {},
		data() {
			let checkNum = (rule, value, callback) => {
				if (!value) {
					return new Error('必填信息')
				} else {
					let regx = /^\d+\.\d+$/;
					if (regx.test(value)) {
						callback(new Error('请输入整数'))
					} else {
						if (parseInt(value) < 0) {
							callback(new Error('不能小于0'))
						} else if (parseInt(value) > 100) {
							callback(new Error('不能大于100'))
						} else {
							callback()
						}
					}
				}
			}
			let checkPhone = (rule, value, callback) => {
				if (!(/^1[34578]\d{9}$/.test(value))) {
					callback(new Error('手机号码格式有误，请重填'))
					return false;
				} else {
					callback()
				}
			}
			return {
				//主表格
				listLoading: true,
				page: 1,
				limit: 10,
				list: [],
				total: 10,
				listQuery: {
					page: 1,
					limit: 10,
					adminName: '',
					adminPhone: ''
				},
				tableKey: 0,
				//名下所有管理员
				listLoading1: true,
				page1: 1,
				limit1: 10,
				list1: [],
				total1: 10,
				listQuery1: {
					page: 1,
					limit: 10,
					parentId: ''
				},

				showAdd: false,
				addData: {
					adminName: '',
					adminFullname: '',
					adminPhone: '',
					roleId: '',
					// interestRate: 0
				},
				showEdit: false,
				editData: {
					adminName: '',
					adminFullname: '',
					adminPhone: '',
					roleId: '',
					// interestRate: 0,
					id: ''
				},
				rules: {
					adminName: [{
						required: true,
						message: '请输入登录账号',
						trigger: 'blur'
					}],
					adminFullname: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					adminPhone: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}, {
						validator: checkPhone,
						trigger: 'blur'
					}],
					roleId: [{
						required: true,
						message: '请输入角色id',
						trigger: 'blur'
					}, ],
				},
				tags: [],
				showTable: false
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
		mounted() {
			let data = {
				page: 1,
				limit: 10
			}
			findRoleList(data).then(res => {
				if (res.code == 200) {
					this.tags = res.data
					this.restaurants = this.tags;
				}
			})
		},
		methods: {
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				let restaurantsText = []
				if (restaurants.length != '') {
					restaurants.forEach((item, index) => {
						let obj = {
							value: '',
							dealerId: ''
						}
						let value = item.roleName
						obj.value = value
						obj.dealerId = item.id
						restaurantsText.push(obj)
					})
				}
				var results = queryString ? restaurantsText.filter(this.createFilter(queryString)) : restaurantsText;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return (restaurant) => {
					return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			handleSelect(item) {
				console.log(item);
				this.listQuery.roleId = item.dealerId + ''
				this.listQuery.adminName1 = item.value + ''
			},
			changeName() {
				if (this.listQuery.adminName1 == '') {
					this.listQuery.roleId = ''
				}
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
			handleSizeChange(val) {
				this.listQuery.limit = val
				this.getLists()
			},
			handleCurrentChange(val) {
				this.listQuery.page = val
				this.getLists()
			},

			handleSizeChange1(val) {
				this.listQuery1.limit = val
				this.AdminUserSonList()
			},
			handleCurrentChange1(val) {
				this.listQuery1.page = val
				this.AdminUserSonList()
			},

			handleFilter() {
				this.listQuery.page = 1
				this.getLists()
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			del(id) {
				this.$confirm('这一操作将永久删除该记录。你想继续吗?', '警告', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning'
				}).then(() => {
					let data = {
						adminUserId: id
					}
					console.log(data)
					deleteAdminUser(data).then(res => {
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
			onaddData(formName) {
				let addData = JSON.parse(JSON.stringify(this.addData))
				console.log(addData)
				this.$refs[formName].validate(valid => {
					console.log(valid)
					if (valid) {
						console.log("通过")
						addAdminUser(addData).then(res => {
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
				this.editData.adminName = item.adminName
				this.editData.adminFullname = item.adminFullname
				this.editData.adminPhone = item.adminPhone
				this.editData.roleId = item.roleId
				this.editData.id = item.id
				this.showEdit = true
				console.log(this.editData)
			},
			onEditData(formName) {
				let editData = JSON.parse(JSON.stringify(this.editData))
				console.log(editData, "this.editData")
				this.$refs[formName].validate(valid => {
					console.log(valid)
					if (valid) {
						console.log("通过")
						updateAdminUser(editData).then(res => {
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
			//初始化密码
			editPassword(adminUserId) {
				this.$confirm('是否初始化密码?', '警告', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning'
				}).then(() => {
					let data = {
						adminUserId
					}
					editPasswordAdminUser(data).then(res => {
						if (res.code == 200) {
							this.$message.success(res.msg)
							this.getLists()
						} else {
							this.$message.error(res.msg)
						}
					})
				})
			},
			getRoleList() {
				let data = {
					page: 1,
					limit: 10
				}
				findRoleList(data).then(res => {
					if (res.code == 200) {
						this.tags = res.data
					}
				})
			},
			onshowTable(id) {
				this.listQuery1.parentId = id
				this.showTable = true
				this.AdminUserSonList()
			},
			AdminUserSonList() {
				this.listLoading1 = true
				findAdminUserSonList(this.listQuery1).then(res => {
					if (res.code == 200) {
						console.log(res)
						this.list1 = res.data
						this.total1 = res.count
						this.listLoading1 = false
					} else {
						this.$message.error(res.msg)
					}
				})
			}
		},
		created() {
			this.getLists()
			this.getRoleList()
		},
	}
</script>

<style>

</style>
