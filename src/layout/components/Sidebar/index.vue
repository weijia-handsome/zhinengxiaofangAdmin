<template>
	<div :class="{'has-logo':showLogo}">
		<logo v-if="showLogo" :collapse="isCollapse" />
		<el-scrollbar wrap-class="scrollbar-wrapper">
			<el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
				:text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText"
				:collapse-transition="false" mode="vertical">
				<template v-for="item in list">
					<el-submenu v-if="item.children.length" :index="item.title" :key="item.title">
						<template slot="title">
							<i :class="item.icon" style="color: #FFFFFF;"></i>
							<span style="display: inline-block;margin-left: 10px;">{{ item.title }}</span>
						</template>
						<el-menu-item v-for="(items, key) in item.children" :key="items.href" :index="items.href">
							<div @click="onClick(items.href)">
								<i :class="[items.icon,activeMenu == items.href ? 'active' : 'iconColor']"></i>
								<span>{{ items.title }}</span>
							</div>
						</el-menu-item>
					</el-submenu>
					<el-menu-item v-else :index="item.title" :key="item.title">
						<div @click="onClick(item.href)">
							<i :class="item.icon"></i>
							<span>{{ item.title }}</span>
						</div>
					</el-menu-item>
				</template>
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import Logo from './Logo'
	import SidebarItem from './SidebarItem'
	import variables from '@/styles/variables.scss'
	import subMenu from "./subMenu";
	export default {
		data() {
			return {
				activeMenu: '',
				// list: [
				// 		{
				// 			children: [],
				// 			grade: 1,
				// 			href: "/dashboard",
				// 			icon: "el-icon-platform-eleme",
				// 			id: 6,
				// 			parentId: 0,
				// 			perms: ":dashboard:index",
				// 			sorting: 13,
				// 			title: "首页",
				// 		},
				// 		{
				// 			children: [
				// 				{
				// 					grade: 2,
				// 					href: "/device/deviceList0",
				// 					icon: "el-icon-user-solid",
				// 					id: 260,
				// 					parentId: 257,
				// 					perms: ":user:wxuserList",
				// 					sorting: 99,
				// 					title: "消防桩",
				// 				},
				// 				{
				// 					grade: 2,
				// 					href: "/device/deviceList1",
				// 					icon: "el-icon-user-solid",
				// 					id: 260,
				// 					parentId: 257,
				// 					perms: ":user:wxuserList",
				// 					sorting: 99,
				// 					title: "液位表",
				// 				},
				// 				{
				// 					grade: 2,
				// 					href: "/device/deviceList2",
				// 					icon: "el-icon-user-solid",
				// 					id: 260,
				// 					parentId: 257,
				// 					perms: ":user:wxuserList",
				// 					sorting: 99,
				// 					title: "智能门磁",
				// 				},
				// 			],
				// 			grade: 1,
				// 			href: "",
				// 			icon: "el-icon-user-solid",
				// 			id: 257,
				// 			parentId: 0,
				// 			perms: ":user:wxuserList",
				// 			sorting: 12,
				// 			title: "设备管理",
				// 		},
				// 		{
				// 			children: [
				// 				{
				// 					grade: 2,
				// 					href: "/tatistics/statisticsDevice",
				// 					icon: "el-icon-user-solid",
				// 					id: 260,
				// 					parentId: 257,
				// 					perms: ":user:wxuserList",
				// 					sorting: 99,
				// 					title: "设备统计",
				// 				},
				// 			],
				// 			grade: 1,
				// 			href: "",
				// 			icon: "el-icon-user-solid",
				// 			id: 257,
				// 			parentId: 0,
				// 			perms: ":user:wxuserList",
				// 			sorting: 12,
				// 			title: "设备统计",
				// 		},
				// 		{
				// 			children: [
				// 				{
				// 					grade: 2,
				// 					href: "/warn/warnList",
				// 					icon: "el-icon-user-solid",
				// 					id: 260,
				// 					parentId: 257,
				// 					perms: ":user:wxuserList",
				// 					sorting: 99,
				// 					title: "告警列表",
				// 				},
				// 			],
				// 			grade: 1,
				// 			href: "",
				// 			icon: "el-icon-user-solid",
				// 			id: 257,
				// 			parentId: 0,
				// 			perms: ":user:wxuserList",
				// 			sorting: 12,
				// 			title: "告警管理",
				// 		},
				// 		{
				// 			children: [
				// 				{
				// 					grade: 2,
				// 					href: "/authority/signList",
				// 					icon: "el-icon-user-solid",
				// 					id: 260,
				// 					parentId: 257,
				// 					perms: ":user:wxuserList",
				// 					sorting: 99,
				// 					title: "考勤列表",
				// 				},
				// 				{
				// 					grade: 2,
				// 					href: "/authority/faultList",
				// 					icon: "el-icon-user-solid",
				// 					id: 260,
				// 					parentId: 257,
				// 					perms: ":user:wxuserList",
				// 					sorting: 99,
				// 					title: "故障列表",
				// 				}
				// 			],
				// 			grade: 1,
				// 			href: "",
				// 			icon: "el-icon-user-solid",
				// 			id: 257,
				// 			parentId: 0,
				// 			perms: ":user:wxuserList",
				// 			sorting: 12,
				// 			title: "巡检管理",
				// 		},
				// 		{
				// 			children: [
				// 				{
				// 					grade: 2,
				// 					href: "/order/orderList",
				// 					icon: "el-icon-user-solid",
				// 					id: 260,
				// 					parentId: 257,
				// 					perms: ":user:wxuserList",
				// 					sorting: 99,
				// 					title: "工单列表",
				// 				},
				// 			],
				// 			grade: 1,
				// 			href: "",
				// 			icon: "el-icon-user-solid",
				// 			id: 257,
				// 			parentId: 0,
				// 			perms: ":user:wxuserList",
				// 			sorting: 12,
				// 			title: "工单管理",
				// 		},
				// 	{
				// 		children: [
				// 			{
				// 				grade: 2,
				// 				href: "/agent/agentList",
				// 				icon: "el-icon-user-solid",
				// 				id: 260,
				// 				parentId: 257,
				// 				perms: ":user:wxuserList",
				// 				sorting: 99,
				// 				title: "管理员列表",
				// 			},
				// 		],
				// 		grade: 1,
				// 		href: "",
				// 		icon: "el-icon-user-solid",
				// 		id: 257,
				// 		parentId: 0,
				// 		perms: ":user:wxuserList",
				// 		sorting: 12,
				// 		title: "管理员管理",
				// 	},
				// 	{
				// 		children: [
				// 			{
				// 				grade: 2,
				// 				href: "/permission/role",
				// 				icon: "el-icon-user-solid",
				// 				id: 260,
				// 				parentId: 257,
				// 				perms: ":user:wxuserList",
				// 				sorting: 99,
				// 				title: "角色管理",
				// 			},
				// 			{
				// 				grade: 2,
				// 				href: "/permission/menu",
				// 				icon: "el-icon-user-solid",
				// 				id: 260,
				// 				parentId: 257,
				// 				perms: ":user:wxuserList",
				// 				sorting: 99,
				// 				title: "菜单管理",
				// 			},
				// 		],
				// 		grade: 1,
				// 		href: "",
				// 		icon: "el-icon-user-solid",
				// 		id: 257,
				// 		parentId: 0,
				// 		perms: ":user:wxuserList",
				// 		sorting: 12,
				// 		title: "权限管理",
				// 	}
				// ]
			}
		},
		created() {
			this.activeMenu = window.sessionStorage.getItem("activeMenu");
			console.log(this.activeMenu, "9999")
		},
		methods: {
			onClick(name) {
				console.log(name)
				this.$router.push({
					path: name
				})
				window.sessionStorage.setItem("activeMenu", name);
				this.activeMenu = name;
			}
		},
		components: {
			SidebarItem,
			Logo,
			subMenu
		},
		computed: {
			...mapGetters([
				'permission_routes',
				'sidebar',
			]),
			showLogo() {
				return this.$store.state.settings.sidebarLogo
			},
			variables() {
				return variables
			},
			isCollapse() {
				return !this.sidebar.opened
			},
			list() {
				return this.$store.getters.meunList
			}
		}
	}
</script>
<style>
	#app .hideSidebar .el-submenu>.el-submenu__title {
		padding-left: 20px !important;
	}
</style>
<style scoped>
	.active {
		color: #1890FF;
	}

	.iconColor {
		color: #FFFFFF;
	}
</style>
