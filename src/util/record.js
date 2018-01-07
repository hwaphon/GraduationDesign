import { request, post } from "../network/network";
import API from '../const/Api'

class Record {
  save (ops) {
    if (ops.url && ops.content) {
      post(API.RECORD, { url: ops.url, content: ops.content }, function (res) {})
    }
  }

  get () {
    return new Promise(function (resolve, reject) {
      request(API.HISTORY, {}, function (res) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject()
        }
      })
    })
  }
}

export default new Record()
