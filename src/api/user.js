import request from '@/utils/request'

//登录
export function login(data) {
  return request({
    url: '/sys/admin/login',
    method: 'post',
	headers: {
		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	},
	transformRequest: [
		function(data) {
			var ret = ''
			for (var it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
			}
			ret = ret.substring(0, ret.lastIndexOf('&'))
			return ret
		}
	],
    data
  })
}
//获取用户信息
export function getRouter(data) {
  return request({
    url: '/sys/admin/findAdminUserInfo',
    method: 'post',
	headers: {
		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	},
	transformRequest: [
		function(data) {
			var ret = ''
			for (var it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
			}
			ret = ret.substring(0, ret.lastIndexOf('&'))
			return ret
		}
	],
    data
  })
}

