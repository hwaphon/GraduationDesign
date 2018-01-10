import axios from 'axios'
import _ from 'underscore'

class NetWork {
	constructor () {
		this.init()
	}

	init () {
		// 以自定义配置生成 axios 实例
		this.http = axios.create({
			timeout: 8000,
			headers: {
				"X-LC-Id": "5XOnPN1PWE6tOMdwNYcE9iLP-gzGzoHsz",
				"X-LC-Key": "ezvcHFroQPn9zUtxsmPzbM2n",
				"Content-Type": "application/json"
			}
		})
	}

	get (url, ops) {
		let _this = this
		return new Promise(function (resolve, reject) {
			_this.http.get(_this.params(url, ops)).then(resolve).catch(reject)
		})
	}

	params (url, ops) {
		let arr = _.pairs(ops)
		let length = arr.length

		for (let i = 0; i < length; i++) {
			if (i === 0) {
	      url += `?${arr[i][0]}=${arr[i][1]}`
			} else {
				url += `&${arr[i][0]}=${arr[i][1]}`
			}
		}
		return url
	}
}

export default new NetWork()