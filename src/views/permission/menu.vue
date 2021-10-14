<template>
	<div class="app-container">
		<div class="filter-container">
			<div style="margin: 15px 0;">
				<el-button style="margin-right: 20px ;" type="primary" @click="addPMeun"
					v-if="buttonVerifAuthention(':permission:menu:add')">新增菜单</el-button>
			</div>
			<el-table v-loading="listLoading" :key="tableKey" :data="list" element-loading-text="拼命加载中......" border fit
				highlight-current-row style="width: 100%;" align="center" row-key="id"
				:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
				<el-table-column type="index" width="55" label="序号" align="center">
					<template scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
				</el-table-column>
				<el-table-column prop="id" label="id" align="center">
				</el-table-column>
				<el-table-column prop="title" label="菜单名称" align="center">
				</el-table-column>
				<el-table-column prop="icon" label="图标" align="center" width="150">
					<template slot-scope="scope" style="text-align: center;height: 40px;">
						<i :class="scope.row.icon" style="font-size: 26px;"></i>
					</template>
				</el-table-column>
				<el-table-column prop="href" label="资源地址" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="perms" label="权限标识" align="center">
				</el-table-column>
				<el-table-column prop="parentId" label="父级Id" align="center">
				</el-table-column>
				<el-table-column prop="sorting" label="排序" align="center" sortable>
				</el-table-column>
				<el-table-column prop="grade" label="菜单等级" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right">
					<template slot-scope="scope">
						<el-button type="primary" @click="" style="margin-left: 10px;"
							@click="showDidlaoEditData(scope.row)"
							v-if="buttonVerifAuthention(':permission:menu:edit')">编辑
						</el-button>
						<div style="margin-top: 10px;">
							<el-button type="danger" @click="del(scope.row.id)" style="margin-left: 10px;"
								icon="el-icon-delete" v-if="buttonVerifAuthention(':permission:menu:delete')">删除
							</el-button>
						</div>
						<div style="margin-top: 10px;">
							<el-button type="primary" @click="addCMeun(scope.row.id)" style="margin-left: 10px;"
								v-if="buttonVerifAuthention(':permission:menu:addChild')">添加子菜单
							</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>

			<!-- 新增菜单 -->
			<el-dialog :visible.sync="showAdd" title="新增菜单" @close="showAdd = false">
				<el-form ref="addData" :model="addData" label-position="left" label-width="100px"
					style="width: 600px; margin-left:50px;" :rules="rules">
					<el-form-item :label="'菜单名称'" prop="title">
						<el-input v-model="addData.title" placeholder="请输入菜单名称" clearable />
					</el-form-item>
					<el-form-item :label="'资源路径'" prop="href">
						<el-input v-model="addData.href" placeholder="请输入资源路径" clearable />
					</el-form-item>
					<el-form-item :label="'权限标识'" prop="perms">
						<el-input v-model="addData.perms" placeholder="请输入权限标识" clearable />
					</el-form-item>
					<el-form-item :label="'排序'" prop="sorting">
						<el-input v-model="addData.sorting" placeholder="请输入排序" clearable type="number" />
					</el-form-item>
					<el-form-item :label="'图标'" prop="icon">
						<el-select v-model="addData.icon" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in cities"
						      :key="index"
						      :label="item"
						      :value="item">
							  <div style="text-align: center;">
								  <i :class="item" style="font-size: 26px;"></i>
							  </div>
						    </el-option>
						  </el-select>
						  
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onaddData('addData')">确定</el-button>
						<el-button @click="showAdd = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>

			<!-- 编辑菜单 -->
			<el-dialog :visible.sync="showEdit" title="编辑菜单" @close="showEdit = false">
				<el-form ref="editData" :model="editData" label-position="left" label-width="100px"
					style="width: 600px; margin-left:50px;" :rules="rules">
					<el-form-item :label="'菜单名称'" prop="title">
						<el-input v-model="editData.title" placeholder="请输入菜单名称" clearable />
					</el-form-item>
					<el-form-item :label="'资源路径'" prop="href">
						<el-input v-model="editData.href" placeholder="请输入资源路径" clearable />
					</el-form-item>
					<el-form-item :label="'权限标识'" prop="perms">
						<el-input v-model="editData.perms" placeholder="请输入权限标识" clearable />
					</el-form-item>
					<el-form-item :label="'排序'" prop="sorting">
						<el-input v-model="editData.sorting" placeholder="请输入排序" clearable type="number" />
					</el-form-item>
					<el-form-item :label="'图标'" prop="icon">
						<el-select v-model="editData.icon" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in cities"
						      :key="index"
						      :label="item"
						      :value="item">
						     <div style="text-align: center;">
						     	<i :class="item" style="font-size: 26px;"></i>
						     </div>
						    </el-option>
						  </el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onEditData('editData')">确定</el-button>
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
		addMenu,
		updateMenu,
		deleteMenu,
	} from '@/api/permission/menu.js'
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
					parentId: '',
					title: '',
					href: '',
					perms: '',
					sorting: '',
					icon:''
				},
				cities:['el-icon-platform-eleme',
				'el-icon-s-custom',
				'el-icon-user-solid',
				'el-icon-user',
				'el-icon-s-goods',
				'el-icon-goods',
				'el-icon-sold-out',
				'el-icon-full-screen',
				'el-icon-postcard',
				'el-icon-connection',
				'el-icon-notebook-1',
				'el-icon-notebook-2',
				'el-icon-star-on',
				'el-icon-star-off',
				'el-icon-s-help',
				'el-icon-help',
				'el-icon-reading',
				'el-icon-pie-chart',
				'el-icon-data-line',
				'el-icon-s-finance',
				'el-icon-wallet',
				'el-icon-coin',
				'el-icon-document',
				'el-icon-shopping-cart-full',
				'el-icon-shopping-cart-1',
				'el-icon-sell',
				'el-icon-collection',
				'el-icon-shopping-cart-2',
				'el-icon-copy-document',
				'el-icon-set-up',
				'el-icon-s-fold',
				'el-icon-s-operation',
				'el-icon-s-management',
				'el-icon-eleme',
				'el-icon-s-tools',
				'el-icon-setting',
				'el-icon-s-home',
				'el-icon-s-data',
				'el-icon-s-grid',
				'el-icon-menu',
				'el-icon-date',
				'el-icon-edit',
				'el-icon-edit-outline'
				],
				showEdit: false,
				editData: {
					id: '',
					title: '',
					href: '',
					perms: '',
					sorting: '',
					icon:''
				},
				rules: {
					title: [{
						required: true,
						message: '请输入菜单名称',
						trigger: 'blur'
					}],
					// href: [{
					// 	required: true,
					// 	message: '请输入资源路径',
					// 	trigger: 'blur'
					// }],
					perms: [{
						required: true,
						message: '请输入权限标识',
						trigger: 'blur'
					}, ],
					sorting: [{
						required: true,
						message: '请输入排序',
						trigger: 'blur'
					}, ],
				},
				defaultProps: {
					children: 'children',
					label: 'title'
				},
				filterText: '',
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'title'
				}
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
			filterText(val) {
				this.$refs.tree.filter(val);
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
			del(menuId) {
				this.$confirm('这一操作将永久删除该记录。你想继续吗?', '警告', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning'
				}).then(() => {
					let data = {
						menuId
					}
					console.log(data)
					deleteMenu(data).then(res => {
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
			addPMeun() {
				this.addData.parentId = 0
				this.showAdd = true
			},
			addCMeun(id) {
				this.addData.parentId = id
				this.showAdd = true
			},
			onaddData(formName) {
				this.$refs[formName].validate(valid => {
					console.log(valid)
					if (valid) {
						console.log("通过")
						addMenu(this.addData).then(res => {
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
				console.log(item)
				this.editData.title = item.title
				this.editData.href = item.href
				this.editData.perms = item.perms
				this.editData.sorting = item.sorting
				this.editData.id = item.id
				this.editData.icon = item.icon
				this.showEdit = true
			},
			onEditData(formName) {
				this.$refs[formName].validate(valid => {
					console.log(valid)
					if (valid) {
						console.log("通过")
						updateMenu(this.editData).then(res => {
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
		},
	}
</script>

<style scoped="scoped">

</style>
