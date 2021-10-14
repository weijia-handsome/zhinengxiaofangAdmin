<template>
	<div class="login-container">
        <div class="header">
			<div class="login-form">
				<el-form ref="loginForm" :model="loginForm" :rules="loginRules"  autocomplete="on"
					label-position="left">
					<div class="title-container">
						<h3 class="title">
							智慧消防管理平台
						</h3>
					</div>
					<el-form-item prop="userName" style="background-color: #FFFFFF;border-radius: 5px;">
						<span class="svg-container">
							<svg-icon icon-class="user" />
						</span>
						<el-input ref="userName" v-model="loginForm.userName" :placeholder="$t('login.username')"
							name="userName" type="text" tabindex="1" autocomplete="off" />
					</el-form-item>
					<el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual
						style="background-color: #FFFFFF;border-radius: 5px;">
						<el-form-item prop="passWord">
							<span class="svg-container">
								<svg-icon icon-class="password" />
							</span>
							<el-input :key="passwordType" ref="passWord" v-model="loginForm.passWord" :type="passwordType"
								:placeholder="$t('login.password')" name="passWord" tabindex="2" autocomplete="on"
								@keyup.native="checkCapslock" @blur="capsTooltip = false"
								@keyup.enter.native="handleLogin" />
							<span class="show-pwd" @click="showPwd">
								<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
							</span>
						</el-form-item>
					</el-tooltip>
					<el-button :loading="loading" type="primary"
						style="width:100%;margin-bottom:30px;background-color: #3B29D3;color: #FFFFFF;border: none;height: 45px;font-size: 16px;"
						@click.native.prevent="handleLogin">
						{{ $t('login.logIn') }}
					</el-button>
				</el-form>
				<!-- <div style="color: #FFFFFF;font-size: 14px;">Copyright© 2021 深圳市玖柒物联科技有限公司 All Rights Reserved</div> -->
			</div>
		</div>
	</div>
</template>

<script>
	import {
		validUsername
	} from '@/utils/validate'
	import LangSelect from '@/components/LangSelect'
	import SocialSign from './components/SocialSignin'

	export default {
		name: 'Login',
		components: {
			LangSelect,
			SocialSign
		},
		data() {
			return {
				loginForm: {
					userName: '',
					passWord: ''
				},
				loginRules: {
					userName: [{
						required: true,
						trigger: 'blur',
						message: '请填写账户',
					}],
					passWord: [{
						required: true,
						trigger: 'blur',
						message: '请填写密码',
					}]
				},
				passwordType: 'password',
				capsTooltip: false,
				loading: false,
				showDialog: false,
				redirect: undefined,
				otherQuery: {}
			}
		},
		watch: {
			$route: {
				handler: function(route) {
					const query = route.query
					if (query) {
						this.redirect = query.redirect
						this.otherQuery = this.getOtherQuery(query)
					}
				},
				immediate: true
			}
		},
		created() {

		},
		mounted() {
			// if (this.loginForm.username === '') {
			// 	this.$refs.userName.focus()
			// } else if (this.loginForm.password === '') {
			// 	this.$refs.passWord.focus()
			// }
		},
		destroyed() {

		},
		methods: {
			checkCapslock(e) {
				const {
					key
				} = e
				this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
			},
			showPwd() {
				if (this.passwordType === 'password') {
					this.passwordType = ''
				} else {
					this.passwordType = 'password'
				}
				this.$nextTick(() => {
					this.$refs.password.focus()
				})
			},
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if (valid) {
						this.loading = false
						this.$store.dispatch('user/login', this.loginForm)
							.then((res) => {
								this.loading = false
								window.sessionStorage.setItem("activeMenu", "");
								this.$router.push({
									path: '/'
								})
							})
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			getOtherQuery(query) {
				return Object.keys(query).reduce((acc, cur) => {
					if (cur !== 'redirect') {
						acc[cur] = query[cur]
					}
					return acc
				}, {})
			}
		}
	}
</script>

<style lang="scss">
	/* 修复input 背景不协调 和光标变色 */
	/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

	$bg:#283443;
	$light_gray:#000;
	$cursor: #000;

	@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
		.login-container .el-input input {
			color: $cursor;
		}
	}

	.login-container .el-input input {
		color: #000 !important;
	}

	.inputBox {
		background-color: rgba(0, 0, 0, 0.3);
		
	}

	/* reset element-ui css */
	.login-container {
		.el-input {
			display: inline-block;
			height: 47px;
			width: 85%;

			input {
				background: transparent;
				border: 0px;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 12px 5px 12px 15px;
				color: $light_gray;
				height: 47px;
				caret-color: $cursor;

				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-text-fill-color: $cursor !important;
				}
			}
		}

		.el-form-item {
			border: 1px solid rgba(255, 255, 255, 0.1);
			background: rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			color: #454545;
		}
	}
</style>

<style lang="scss" scoped>
	$bg:#2d3a4b;
	$dark_gray:#889aa4;
	$light_gray:#eee;

	.login-container {
		// min-height: 100%;
		// width: 100%;
		// background-color: $bg;
		// overflow: hidden;
		width: 100%;
		height: 100%;
		background-image: url("../../assets/login/bg4.jpg");
		background-size: cover;
		background-position: center;
		position: relative;
        .header{
			padding-top: 160px;
		}
		.login-form {
			position: relative;
			width: 520px;
			max-width: 100%;
			padding: 45px;
			margin: 0 auto;
			overflow: hidden;
			background-color: rgba(0, 0, 0, 0.3);
		}

		.tips {
			font-size: 14px;
			color: #fff;
			margin-bottom: 10px;

			span {
				&:first-of-type {
					margin-right: 16px;
				}
			}
		}

		.svg-container {
			padding: 6px 5px 6px 15px;
			color: $dark_gray;
			vertical-align: middle;
			width: 30px;
			display: inline-block;
		}

		.title-container {
			position: relative;

			.title {
				font-size: 26px;
				color: $light_gray;
				margin: 0px auto 40px auto;
				text-align: center;
				font-weight: bold;
			}

			.set-language {
				color: #fff;
				position: absolute;
				top: 3px;
				font-size: 18px;
				right: 0px;
				cursor: pointer;
			}
		}

		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: 16px;
			color: $dark_gray;
			cursor: pointer;
			user-select: none;
		}

		.thirdparty-button {
			position: absolute;
			right: 0;
			bottom: 6px;
		}

		@media only screen and (max-width: 470px) {
			.thirdparty-button {
				display: none;
			}
		}
	}
</style>
