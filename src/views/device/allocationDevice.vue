<template>
	<div>
		<el-button type="primary" @click="onshowallocation" size="mini"
			v-if="buttonVerifAuthention(':sys:device:allocationDevice')">设备分配
		</el-button>
		<!-- 设备分配 -->
		<el-dialog :visible.sync="showallocation" title="设备分配" @close="showallocation = false" :append-to-body="true">
			<el-form ref="allocation" :model="allocation" label-position="left" label-width="120px"
				style="width: 600px; margin-left:50px;" :rules="rules">
				<el-form-item :label="'设备归属人'" prop="dealerId">
					<el-select v-model="allocation.dealerId" style="width: 100%;" placeholder="设备归属人" clearable>
						<el-option v-for="item in userList" :key="item.id" :label="item.readminName" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="showallocation = false">取 消</el-button>
					<el-button type="primary" @click="onallocation('allocation')">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import {
		findAdminUser,
		deviceAllocation
	} from '@/api/device/deviceList.js'
	import QRCode from 'qrcodejs2'
	import {
		parseTime
	} from '@/utils/index'
	import loadMap from "../../utils/loadMap.js";
	export default {
		props: {
			row_data: {
				type: Object,
				default: function() {
					return null
				}
			},
		},
		data() {
			return {
				showallocation: false,
				allocation: {
					deviceId: '',
					dealerId: '',
				},
				rules: {
					dealerId: [{
						required: true,
						message: '设备归属人',
						trigger: 'change'
					}],
				},
				userList: []
			}
		},
		created() {

		},
		mounted() {

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
			onallocation(formName) {
				this.$refs[formName].validate(valid => {
					console.log(valid)
					if (valid) {
						console.log("通过")
						this.Loading = true
						this.allocation.deviceId = this.row_data.id
						deviceAllocation(this.allocation).then(res => {
							this.Loading = false
							if (res.code == 200) {
								this.showallocation = false
								this.resetForm(formName)
								this.$message.success(res.msg)
								this.$emit('getLists')
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
			getfindAdminUser() {
				findAdminUser().then(res => {
					if (res.code == 200) {
						let userList = res.data || []
						// readminName
						if(userList.length != 0){
							userList.forEach((item,index)=>{
								item.readminName=item.adminFullname+'('+item.adminName+')'
							})
						}
						this.userList=userList
					}
				})
			},
			onshowallocation() {
				this.showallocation = true
				this.allocation = {
						deviceId: '',
						dealerId: '',
					},
					this.getfindAdminUser()
			},
		}
	}
</script>

<style>
	#tipinput {
		-webkit-appearance: none;
		background-color: #FFFFFF;
		background-image: none;
		border-radius: 4px;
		border: 1px solid #DCDFE6;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		color: #606266;
		display: inline-block;
		font-size: inherit;
		height: 40px;
		line-height: 40px;
		outline: none;
		padding: 0 15px;
		-webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
		transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
		width: 100%;
	}
</style>
