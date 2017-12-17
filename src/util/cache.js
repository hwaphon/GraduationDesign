class Cache {
  constructor (global) {
    this._ = global.sessionStorage
  }

  save (key, data) {
    let isExsit = this.exsit(key)
    let tmpData = []
    if (isExsit) {
      tmpData = this.getItemByKey(key)
    }
    tmpData = tmpData.concat(data)
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

  exsit (key, page = 0, limit = 0) {
    let result = this.getItemByKey(key)
    let requiredLength = page * limit
    if (!result) {
      return false
    } else {
      if (requiredLength >= result.length) {
        return false
      }
    }
    return true
  }
}

export default new Cache(window)
