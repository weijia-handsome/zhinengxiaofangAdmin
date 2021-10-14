<template>
	<div class="app-container">
		<div class="filter-container">
			<div style="margin: 15px 0;">
				<el-button style="margin-right: 20px ;" type="primary" @click="showAdd = true"
					v-if="buttonVerifAuthention(':permission:role:add')">新增角色</el-button>
			</div>
			<el-table v-loading="listLoading" :key="tableKey" :data="list" element-loading-text="拼命加载中......" border fit
				highlight-current-row style="width: 100%;" align="center">
				<el-table-column type="index" width="55" label="序号" align="center">
					<template scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
				</el-table-column>
				<!-- <el-table-column prop="id" label="id" align="center" width="150">
				</el-table-column> -->
				<el-table-column prop="roleName" label="角色名称" align="center" width="150">
				</el-table-column>
				<el-table-column prop="remark" label="备注" align="center" width="200">
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center" width="240" sortable>
					<template slot-scope="scope">
						<span>{{ scope.row.createTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="updateTime" label="更新时间" align="center" width="240" sortable>
					<template slot-scope="scope">
						<span>{{ scope.row.updateTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button type="primary" @click="" style="margin-left: 10px;"
							@click="showDidlaoEditData(scope.row)"
							v-if="buttonVerifAuthention(':permission:role:edit')">编辑
						</el-button>
						<el-button type="danger" @click="del(scope.row.id)" style="margin-left: 10px;"
							icon="el-icon-delete" v-if="buttonVerifAuthention(':permission:role:delete')">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
					:total="total" background layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>

			<!-- 新增角色 -->
			<el-dialog :visible.sync="showAdd" title="新增角色" @close="showAdd = false">
				<el-form ref="addData" :model="addData" label-position="left" label-width="100px"
					style="width: 600px; margin-left:50px;" :rules="rules">
					<el-form-item :label="'角色名称'" prop="roleName">
						<el-input v-model="addData.roleName" placeholder="请输入角色名称" clearable />
					</el-form-item>
					<el-form-item :label="'角色备注'" prop="roleRemark">
						<el-input v-model="addData.roleRemark" placeholder="请输入角色备注" clearable />
					</el-form-item>
					<el-form-item :label="'角色权限'">
						<el-input v-model="filterTextAdd" placeholder="输入关键字进行过滤" />
						<div style="margin: 20px 0;"></div>
						<el-tree ref="addTree" :data="treeData" :props="defaultProps" :filter-node-method="filterNode"
							show-checkbox node-key="id" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onaddData('addData')" :loading="Loading">确定</el-button>
						<el-button @click="showAdd = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>

			<!-- 编辑角色 -->
			<el-dialog :visible.sync="showEdit" title="编辑角色" @close="showEdit = false">
				<el-form ref="editData" :model="editData" label-position="left" label-width="100px"
					style="width: 600px; margin-left:50px;" :rules="rules">
					<el-form-item :label="'角色名称'" prop="roleName">
						<el-input v-model="editData.roleName" placeholder="请输入角色名称" clearable />
					</el-form-item>
					<el-form-item :label="'角色备注'" prop="roleRemark">
						<el-input v-model="editData.roleRemark" placeholder="请输入角色备注" clearable />
					</el-form-item>
					<el-form-item :label="'角色权限'">
						<el-input v-model="filterTextEdit" placeholder="输入关键字进行过滤" />
						<div style="margin: 20px 0;"></div>
						<el-tree ref="editTree" :data="treeData" :props="defaultProps" :filter-node-method="filterNode"
							show-checkbox node-key="id" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onEditData('editData')" :loading="Loading">确定</el-button>
						<el-button @click="showEdit = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>



		</div>
	</div>
</template>

<script>
	import {
		getList,
		addRole,
		findMenuByRoleId,
		updateRole,
		deleteRole
	} from '@/api/permission/role.js'
	import {
		parseTime
	} from '@/utils/index'
	export default {
		data() {
			return {
				listLoading: true,
				page: 1,
				limit: 10,
				list: [],
				total: 10,
				listQuery: {
					page: 1,
					limit: 10
				},
				tableKey: 0,
				showAdd: false,
				addData: {
					roleName: '',
					roleRemark: '',
					menuIdArray: ''
				},
				showEdit: false,
				editData: {
					myRoleId: '',
					roleName: '',
					roleRemark: '',
					menuIdArray: ''
				},
				rules: {
					roleName: [{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}],
					roleRemark: [{
						required: true,
						message: '请输入角色备注',
						trigger: 'blur'
					}],
					menuIdArray: [{
						required: true,
						message: '请选择角色权限',
						trigger: 'change'
					}],
				},
				defaultProps: {
					children: 'children',
					label: 'title'
				},
				filterTextAdd: '',
				filterTextEdit: '',
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'title'
				},
				ger_role_id:[],
				Loading:false
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
		watch: {
			filterTextAdd(val) {
				this.$refs.addTree.filter(val);
			},
			filterTextEdit(val) {
				this.$refs.editTree.filter(val);
			}
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
			del(roleId) {
				this.$confirm('这一操作将永久删除该记录。你想继续吗?', '警告', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning'
				}).then(() => {
					let data = {
						roleId
					}
					console.log(data)
					deleteRole(data).then(res => {
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
			onaddData(formName) {
				const keys = [
					...this.$refs.addTree.getCheckedKeys(),
					...this.$refs.addTree.getHalfCheckedKeys()
				];
				if (keys.length == 0) {
					this.$message.error('请选择角色权限')
					return false
				}
				const iDStr = keys.join(',');
				console.log(keys, iDStr)
				this.addData.menuIdArray = iDStr
				this.$refs[formName].validate(valid => {
					console.log(valid)
					if (valid) {
						console.log("通过")
						this.Loading=true
						addRole(this.addData).then(res => {
							this.Loading=false
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
				this.ger_role_id=[]
				console.log(item)
				this.editData.myRoleId = item.id
				this.editData.roleName = item.roleName
				this.editData.roleRemark = item.remark
				this.editData.menuIdArray = item.menuIdArray
				let data = {
					roleId: item.id
				}
				findMenuByRoleId(data).then(res => {
					if (res.code == 200) {
						let menuList = res.data
						this.treeData = menuList
						this.showEdit = true
						if (menuList.length != '') {
							this.test_parse(menuList)
						}
						this.$nextTick(() => {
							this.$refs.editTree.setCheckedKeys(this.ger_role_id)
						})
					}
				})
			},
			test_parse(source) {
				for (var key in source) {
					// console.log(source[key].checked)
					if(source[key].checked){
						this.ger_role_id.push(source[key].id)
						// console.log(this.ger_role_id)
					}
					if (source[key].children) {
						this.test_parse(source[key].children)
					}
				}
			},
			onEditData(formName) {
				console.log(this.editData)
				const keys = [
					...this.$refs.editTree.getCheckedKeys(),
					...this.$refs.editTree.getHalfCheckedKeys()
				];
				if (keys.length == 0) {
					this.$message.error('请选择角色权限')
					return false
				}
				const iDStr = keys.join(',');
				console.log(keys, iDStr)
				this.editData.menuIdArray = iDStr
				console.log(this.editData)
				this.$refs[formName].validate(valid => {
					console.log(valid)
					if (valid) {
						console.log("通过")
						this.Loading=true
						updateRole(this.editData).then(res => {
							this.Loading=false
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
			getFindMenuByRoleId(id) {
				let data = {
					roleId: id
				}
				findMenuByRoleId(data).then(res => {
					if (res.code == 200) {
						let menuList = res.data
						let menuList2 = menuList
						this.treeData = menuList
						// this.treeData = [{
						// 	id: 0,
						// 	title: '全部',
						// 	children: menuList2
						// }]
						console.log(this.treeData)
					}
				})
			},
			setCheckedKeys() {
				this.$refs.tree.setCheckedKeys(this.ger_role_id)
			},
			filterNode(value, data) {
				if (!value) return true
				return data.title.indexOf(value) !== -1
			},
		},
		created() {
			this.getLists()
			this.getFindMenuByRoleId(1)
		},
	}
</script>

<style scoped="scoped">

</style>
