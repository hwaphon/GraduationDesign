import Request from "../network/networkHelper";
import API from '../const/dataApi'

class Record {
  save (ops) {
    if (ops.url && ops.content) {
      post(API.RECORD, { url: ops.url, content: ops.content }, function (res) {})
    }
  }

  get (callback) {
    let userinfo = JSON.parse(sessionStorage.getItem('USERINFO'))
    let param = {
      where: JSON.stringify({"user":{"__type":"Pointer","className":"_User","objectId": userinfo.objectId }})
    }
    return Request.get(API.HISTORY, param)
  }
}

export default new Record()
