<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input v-model="listQuery.adminName" style="width: 200px;margin-right: 20px ;" class="filter-item"
				placeholder="打卡人" clearable />
			<!-- <el-input v-model="listQuery.userName" style="width: 200px;margin-right: 20px ;" class="filter-item"
					placeholder="打卡情况" clearable/> -->
			<el-button type="primary" style="margin-right: 20px ;" class="filter-item" @click="handleFilter"
				icon="el-icon-search" v-if="buttonVerifAuthention(':sys:attendance:findAttendanceList')">查询</el-button>



			<el-table v-loading="listLoading" :key="tableKey" :data="list" element-loading-text="拼命加载中......" border fit
				highlight-current-row style="width: 100%;" align="center">
				<el-table-column type="index" width="55" label="序号" align="center">
					<template scope="scope"><span>{{scope.$index+(page - 1) * limit + 1}} </span></template>
				</el-table-column>
				<el-table-column prop="adminName" label="打卡人员名称" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="adminFullname" label="打卡人员真实姓名" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="attendancePic" label="图片" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div class="demo-image__preview">
							<el-image style="width: 100px; height: 100px" :src="scope.row.attendancePic"
								@click="onshowImg(scope.row)" :preview-src-list="srcList" @click.stop="handleClickItem">
							</el-image>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="打卡时间" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.createTime | formatDate }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="打卡情况" align="center" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="240">
					<template slot-scope="scope">
						<el-button type="danger" @click="del(scope.row.id)" style="margin-left: 10px;"
							icon="el-icon-delete" v-if="buttonVerifAuthention(':sys:attendance:deleteAttendance')">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
					:total="total" background layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>


			<!-- 查看图片 -->
			<el-dialog :visible.sync="showImg" width="40%" style="text-align: center;">
				<img width="400" :src="imgUrl" alt="" height="400">
			</el-dialog>

		</div>
	</div>
</template>

<script>
	import {
		getList,
		deleteAttendance
	} from '@/api/authority/signList.js'
	import {
		parseTime
	} from '@/utils/index'
	export default {
		data() {
			return {
				srcList: [],
				imgUrl: '',
				showImg: false,
				listLoading: false,
				page: 1,
				limit: 10,
				list: [],
				total: 10,
				listQuery: {
					page: 1,
					limit: 10,
					adminName: ''
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
					title: '离线',
					id: 0,
				}, {
					title: '在线',
					id: 1,
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
			onshowImg(item) {
				this.imgUrl = item.attendancePic
				this.srcList.push(this.imgUrl)
				// this.showImg = true
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
					deleteAttendance(data).then(res => {
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
