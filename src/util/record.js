import Request from "../network/networkHelper";
import API from '../const/dataApi'

class Record {
  save (ops) {
    if (ops.url && ops.content) {
      post(API.RECORD, { url: ops.url, content: ops.content }, function (res) {})
    }
  }

  get (callback) {
    return Request.get(API.HISTORY, {})
  }
}

export default new Record()
