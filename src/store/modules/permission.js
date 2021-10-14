import { asyncRoutes, constantRoutes } from '@/router'
import { getRouter } from '@/api/user'
/* Layout */
// import Layout from '../../views/layout/Layout.vue'
import Layout from '@/layout'
import store from '@/store'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {

  const accessedRouters = constantRoutes.filter(route => {
	console.log()
    // if (route.component === 'Layout') {
    //   route.component = Layout
    // } else if (typeof route.component === 'string' || route.component instanceof String) {
    //   var str = route.component
  	 //  console.log(str,"123465")
    //   route.component = () => import(`@/views/${str}`)
    // }
    // if (hasPermission(roles, route)) {
    //   if (route.children && route.children.length) {
    //     route.children = filterAsyncRouter(route.children, roles)
    //   }
    //   return true
    // }
    return false
  })
  return accessedRouters
}

const state = {
  meunList:[],
  authentionList:[],
  adminUser:[],
  addRoutes:[],
  routes:[]
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  setMeunList(state, meunList){
	  state.meunList = meunList
  },
  setAuthentionList(state, authentionList){
	   state.authentionList = authentionList
  },
  setAdminUser(state, adminUser){
	   state.adminUser = adminUser
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
	  getRouter().then(res=>{
		  if(res.code == 200){
			  let meunList=res.data.meunList
			  let authentionList=res.data.authentionList
			  let adminUser=res.data.adminUser
			  console.log(meunList,authentionList,adminUser)
			  commit('setMeunList', meunList)
			  commit('setAuthentionList', authentionList)
			  commit('setAdminUser', adminUser)
		  }else{
			  
		  }
	  })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
