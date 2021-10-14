<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.deviceCode" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="设备编码" clearable />
			<el-input v-model="listQuery.deviceAddress" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="设备地址" clearable />
			<el-input v-model="listQuery.userName" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="处理人名称" clearable />
			<el-select v-model="listQuery.status" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="工单状态" clearable @keyup.enter.native="handleFilter">
				<el-option v-for="item in tags" :key="item.id" :label="item.title" :value="item.id" />
			</el-select>
			<el-button type="primary" style="margin-right: 20px ;" class="filter-item" @click="handleFilter"
				icon="el-icon-search" v-if="buttonVerifAuthention(':sys:workOrder:findWorkOrderList')">查询</el-button>


			<!-- 	<div style="margin: 15px 0;">
				<el-button style="margin-right: 20px ;" type="primary" @click="showAdd = true">新增设备</el-button>
			</div> -->

			<el-table v-loading="listLoading" :key="tableKey" :data="list" element-loading-text="拼命加载中......" border fit
				highlight-current-row style="width: 100%;" align="center">

				<el-table-column type="expand" width="100">
					<template slot-scope="props">
						<el-form label-position="left" class="demo-table-expand">
							<el-form-item label="确认时间">
								<span>{{ props.row.affirmTime }}</span>
							</el-form-item>
							<el-form-item label="需要完成时间">
								<span>{{ props.row.requireTime | formatDate }}</span>
							</el-form-item>
							<el-form-item label="完成时间">
								<span>{{ props.row.finishTime | formatDate }}</span>
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
				<el-table-column prop="orderCode" label="工单号" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="deviceCode" label="设备号" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="deviceTypeName" label="设备类型" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="deviceAddress" label="设备地址" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="isChange" label="是否更换" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-tag type="danger" v-if="scope.row.isChange == 0">否</el-tag>
						<el-tag type="success" v-if="scope.row.isChange == 1">是</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="deviceFault" label="设备故障" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="describes" label="故障描述" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="beforeImage" label="维修前图片" align="center" width="150">
					<template slot-scope="scope">
						<div class="demo-image__preview">
							<el-image style="width: 100px; height: 100px" :src="scope.row.beforeImage[0]"
								@click="onbeforeImage(scope.row)" :preview-src-list="beforeImage"
								v-if="scope.row.status == 2" @click.stop="handleClickItem">
							</el-image>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="laterImage" label="维修后图片" align="center" width="150">
					<template slot-scope="scope">
						<div class="demo-image__preview">
							<el-image style="width: 100px; height: 100px" :src="scope.row.laterImage[0]"
								@click="onlaterImage(scope.row)" :preview-src-list="laterImage"
								v-if="scope.row.status == 2" @click.stop="handleClickItem">
							</el-image>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="sendTime" label="派单时间" align="center" sortable :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.sendTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="工单状态" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-tag type="info" v-if="scope.row.status == 0">待确认</el-tag>
						<el-tag type="warning" v-if="scope.row.status == 1">待维修</el-tag>
						<el-tag type="success" v-if="scope.row.status == 2">已维修</el-tag>
						<el-tag type="info" v-if="scope.row.status == 3">已取消</el-tag>
						<el-tag type="danger" v-if="scope.row.status == 4">已逾期</el-tag>
					</template>
				</el-table-column>
                <el-table-column prop="adminFullname" label="处理人" align="center" :show-overflow-tooltip="true">
                </el-table-column>


			
				<!-- <el-table-column prop="affirmTime" label="	确认时间" align="center" sortable :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.affirmTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="requireTime" label="需要完成时间" align="center" sortable :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.requireTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="finishTime" label="完成时间" align="center" sortable :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.finishTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.createTime | formatDate }}</span>
					</template>
				</el-table-column> -->



				<el-table-column label="操作" align="center" fixed="right" width="200">
					<template slot-scope="scope">
						<el-button type="danger" @click="del(scope.row.id)" style="margin-left: 10px;"
							icon="el-icon-delete" v-if="buttonVerifAuthention(':sys:workOrder:deleteWorkOrder')">删除
						</el-button>
						<div style="margin-top: 10px;"></div>
						<el-button type="primary" @click="onupdateWorkOrder(scope.row.id)" style="margin-left: 10px;" v-if="buttonVerifAuthention(':sys:workOrder:updateWorkOrder') && scope.row.status == 0">撤销
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
					:total="total" background layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>


			<!-- 新增设备 -->
			<el-dialog :visible.sync="showAdd" title="新增设备" @close="showAdd = false">
				<el-form ref="addData" :model="addData" label-position="left" label-width="100px"
					style="width: 600px; margin-left:50px;" :rules="rules">
					<el-form-item :label="'设备名称'" prop="roleName">
						<el-input v-model="addData.roleName" placeholder="请输入设备名称" clearable />
					</el-form-item>
					<el-form-item :label="'设备编码'" prop="roleRemark">
						<el-input v-model="addData.roleRemark" placeholder="请输入设备编码" clearable />
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



		</div>
	</div>
</template>

<script>
	import {
		getList,
		deleteWorkOrder,
		updateWorkOrder
	} from '@/api/order/orderList.js'
	import {
		parseTime
	} from '@/utils/index'
	export default {
		data() {
			return {
				beforeImage: [],
				laterImage: [],
				listLoading: false,
				page: 1,
				limit: 10,
				list: [],
				total: 10,
				listQuery: {
					page: 1,
					limit: 10,
					deviceCode: '',
					deviceAddress: '',
					userName: '',
					status: ''
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
				tags: [{
					title: '待确认',
					id: 0,
				}, {
					title: '待维修',
					id: 1,
				}, {
					title: '已维修',
					id: 2,
				}, {
					title: '已取消',
					id: 3,
				}, {
					title: '已逾期',
					id: 4,
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
			onbeforeImage(item) {
				this.beforeImage = item.beforeImage
			},
			onlaterImage(item) {
				this.laterImage = item.laterImage
				console.log(item)
			},
			handleClickItem() {
				// 获取遮罩层dom
				setTimeout(function() {
					let domImageMask = document.querySelector(".el-image-viewer__wrapper");
					if (!domImageMask) {
						return;
					}
					domImageMask.addEventListener("click", (e) => {
						if (e.target.parentNode.className == 'el-image-viewer__actions__inner') {
							return; //如果点击底部菜单，不关闭
						}
						// 点击遮罩层时调用关闭按钮的 click 事件
						document.querySelector(".el-image-viewer__close").click();
					});
				}, 300)
			},
			getLists() {
				this.listLoading = true
				getList(this.listQuery).then(res => {
					if (res.code == 200) {
						console.log(res)
						let list = res.data
						if (list.length != 0) {
							list.forEach((item, index) => {
								if (item.beforeImage) {
									item.beforeImage = item.beforeImage.split(',')
								} else {
									item.beforeImage = []
								}
								if (item.laterImage) {
									item.laterImage = item.laterImage.split(',')
								} else {
									item.laterImage = []
								}
							})
						}
						this.list = list
						this.total = res.count
						this.listLoading = false
					} else {
						this.$message.error(res.msg)
					}
				})
			},
			del(workOrderId) {
				this.$confirm('这一操作将永久删除该记录。你想继续吗?', '警告', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning'
				}).then(() => {
					let data = {
						workOrderId
					}
					console.log(data)
					deleteWorkOrder(data).then(res => {
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
			onupdateWorkOrder(workOrderId){
				this.$confirm('是否撤销工单。你想继续吗?', '警告', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning'
				}).then(() => {
					let data = {
						workOrderId
					}
					console.log(data)
					updateWorkOrder(data).then(res => {
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
						addRole(this.addData).then(res => {
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
