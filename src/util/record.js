import Request from "../network/networkHelper";
import API from '../const/dataApi'

class Record {
  save (ops) {
    let userinfo = JSON.parse(sessionStorage.getItem('USERINFO'))
    console.log(userinfo)
    if (userinfo && ops.url && ops.content) {
      Request.post(API.HISTORY, { url: ops.url, content: ops.content, user: {
        '__type': 'Pointer',
        'className': '_User',
        'objectId': userinfo.objectId}})
        .then(function (res) {
        })
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
