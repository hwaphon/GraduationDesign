// 缓存系统，可在模板文件中直接调用，不过在引用时需要初始化
class Cache {
  constructor (global) {
    this._ = global.sessionStorage
  }

  save (key, data, added = false) {
    let isExsit = this.exsit(key)
    let tmpData = []
    if (isExsit) {
      tmpData = this.getItemByKey(key)
    }
    if (added) {
      tmpData = [].concat(data, tmpData)
    } else {
      tmpData = tmpData.concat(data)
    }
    this._.setItem(key, JSON.stringify(tmpData))
  }

  get (key, page, limit) {
    let result = this.getItemByKey(key)
    let start = limit * page
    return result.slice(start, start + limit)
  }

  getItemByKey (key) {
    return JSON.parse(this._.getItem(key))
  }

  exsit (key, page = 0, limit = 0, countKey = '') {
    let result = this.getItemByKey(key)
    let requiredLength = page * limit
    let count = JSON.parse(sessionStorage.getItem(countKey))
    if (!result) {
      return false
    } else if (count && count === result.length) {
      return true
    } else {
      let localCount = 0
      result.forEach((item) => {
        if (item['local']) {
          localCount += 1
        }
      })
      if (requiredLength >= result.length - localCount) {
        return false
      }
    }
    return true
  }
}

export default new Cache(window)
