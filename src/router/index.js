import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true,
		meta: {
			title: '登录',
		},
	},
	{
		path: '/auth-redirect',
		component: () => import('@/views/login/auth-redirect'),
		hidden: true
	},
	{
		path: '/404',
		component: () => import('@/views/error-page/404'),
		hidden: true
	},
	{
		path: '/401',
		component: () => import('@/views/error-page/401'),
		hidden: true
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		children: [{
			path: 'dashboard',
			component: () => import('@/views/dashboard/index'),
			name: 'Dashboard',
			meta: {
				title: '首页',
				icon: 'dashboard',
			}
		}]
	},
	{
		path: '/device',
		component: Layout,
		redirect: '/device/deviceList0',
		alwaysShow: true, // will always show the root menu
		name: 'device',
		meta: {
			title: '设备管理',
			icon: 'peoples',
		},
		children: [{
			path: 'deviceList0',
			component: () => import('@/views/device/deviceList0'),
			name: 'deviceList0',
			meta: {
				title: '消防桩列表',
				icon: 'el-icon-s-check',
			}
		}, {
			path: 'deviceList1',
			component: () => import('@/views/device/deviceList1'),
			name: 'deviceList1',
			meta: {
				title: '液位表列表',
				icon: 'el-icon-s-check',
			}
		}, {
			path: 'deviceList2',
			component: () => import('@/views/device/deviceList2'),
			name: 'deviceList2',
			meta: {
				title: '智能门磁列表',
				icon: 'el-icon-s-check',
			}
		}, {
			path: 'setDevice0',
			component: () => import('@/views/device/setDevice0'),
			name: 'setDevice0',
			meta: {
				title: '设备控制',
				icon: 'el-icon-s-check',
			}
		}, {
			path: 'setDevice1',
			component: () => import('@/views/device/setDevice1'),
			name: 'setDevice1',
			meta: {
				title: '设备控制',
				icon: 'el-icon-s-check',
			}
		}, {
			path: 'setDevice2',
			component: () => import('@/views/device/setDevice2'),
			name: 'setDevice2',
			meta: {
				title: '设备控制',
				icon: 'el-icon-s-check',
			}
		}, {
			path: 'warnDevice',
			component: () => import('@/views/device/warnDevice'),
			name: 'warnDevice',
			meta: {
				title: '设备告警',
				icon: 'el-icon-s-check',
			}
		}]
	},
	{
		path: '/tatistics',
		component: Layout,
		redirect: '/tatistics/statisticsDevice',
		alwaysShow: true, // will always show the root menu
		name: 'tatistics',
		meta: {
			title: '设备统计',
			icon: 'peoples',
		},
		children: [{
			path: 'statisticsDevice',
			component: () => import('@/views/tatistics/statisticsDevice'),
			name: 'statisticsDevice',
			meta: {
				title: '设备统计',
				icon: 'el-icon-s-check',
			}
		}]
	},
	{
		path: '/warn',
		component: Layout,
		redirect: '/warn/warnList',
		alwaysShow: true, // will always show the root menu
		name: 'warn',
		meta: {
			title: '告警管理',
			icon: 'peoples',
		},
		children: [{
			path: 'warnList',
			component: () => import('@/views/warn/warnList'),
			name: 'warnList',
			meta: {
				title: '告警列表',
				icon: 'el-icon-s-check',
			}
		}]
	},
	{
		path: '/authority',
		component: Layout,
		redirect: '/authority/signList',
		alwaysShow: true, // will always show the root menu
		name: 'authority',
		meta: {
			title: '巡检管理',
			icon: 'peoples',
		},
		children: [{
			path: 'signList',
			component: () => import('@/views/authority/signList'),
			name: 'signList',
			meta: {
				title: '考勤列表',
				icon: 'el-icon-s-check',
			}
		}, {
			path: 'faultList',
			component: () => import('@/views/authority/faultList'),
			name: 'faultList',
			meta: {
				title: '故障列表',
				icon: 'el-icon-s-check',
			}
		}]
	},
	{
		path: '/order',
		component: Layout,
		redirect: '/order/orderList',
		alwaysShow: true, // will always show the root menu
		name: 'order',
		meta: {
			title: '工单管理',
			icon: 'peoples',
		},
		children: [{
			path: 'orderList',
			component: () => import('@/views/order/orderList'),
			name: 'orderList',
			meta: {
				title: '工单列表',
				icon: 'el-icon-s-check',
			}
		}]
	},
	{
		path: '/agent',
		component: Layout,
		redirect: '/agent/agentList',
		alwaysShow: true,
		name: 'agent',
		meta: {
			title: '管理员管理',
			icon: 'el-icon-s-fold',
		},
		children: [{
			path: 'agentList',
			component: () => import('@/views/agent/agentList'),
			name: 'agentList',
			meta: {
				title: '管理员列表',
				icon: 'el-icon-s-operation',
			}
		}]
	},
	{
		path: '/permission',
		component: Layout,
		redirect: '/permission/role',
		alwaysShow: true,
		name: 'Permission',
		meta: {
			title: '权限管理',
			icon: 'lock',
		},
		children: [{
				path: 'role',
				component: () => import('@/views/permission/role'),
				name: 'role',
				meta: {
					title: '角色管理',
					icon: 'el-icon-s-custom',
				}
			},
			{
				path: 'menu',
				component: () => import('@/views/permission/menu'),
				name: 'menu',
				meta: {
					title: '菜单管理',
					icon: 'el-icon-s-custom',
				}
			},
			{
				path: 'setPwd',
				component: () => import('@/views/permission/setPwd'),
				name: 'setPwd',
				meta: {
					title: '修改密码',
					icon: 'el-icon-s-management',
				}
			},
		]
	},
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
	path: '*',
	redirect: '/404',
	hidden: true
}]

const createRouter = () => new Router({
	mode: 'history', // require service support
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
