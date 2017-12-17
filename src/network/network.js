import axios from 'axios'
import _ from 'underscore'

function params (url, ops) {
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

function request (url, ops, callback) {
	url = params(url, ops)
  axios.get(url).then(function (result) {
    callback(result)
  }, function (error) {
    console.log(error)
  })
}

export default request
