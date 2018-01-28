import Request from "../network/networkHelper";
import API from '../const/dataApi'

class Record {
  save (ops) {
    let userinfo = JSON.parse(localStorage.getItem('USERINFO'))
    if (userinfo && ops.url && ops.content) {
      let param = {
        where: JSON.stringify({
          url: encodeURIComponent(ops.url),
          content: ops.content,
          user: {
            '__type': 'Pointer',
            className: '_User',
            objectId: userinfo.objectId
          }
        })
      }
      // 去重
      Request.get(API.HISTORY, param)
        .then(function (res) {
          if (res.status === 200) {
            if (res.data.results.length < 1) {
              Request.post(API.HISTORY, { url: ops.url, content: ops.content, user: {
                '__type': 'Pointer',
                'className': '_User',
                'objectId': userinfo.objectId}})
                .then(function (res) {})
            } else {
              let id = res.data.results[0].objectId
              Request.put(API.HISTORY + `/${ id }`, { content: ops.content })
                .then(function (res) {})
            }
          }
        })
    }
  }

  get (callback) {
    let userinfo = JSON.parse(localStorage.getItem('USERINFO'))
    let param = {
      where: JSON.stringify({"user":{"__type":"Pointer","className":"_User","objectId": userinfo.objectId }})
    }
    return Request.get(API.HISTORY, param)
  }
}

export default new Record()
