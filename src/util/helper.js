class Helper {
  split (text, length) {
    return text.toString().substr(0, length)
  }

  formateDate (dateString) {
    let date = new Date(dateString)
    return `${ date.getFullYear() }-${ date.getMonth() + 1}-${ date.getDate() }`
  }
}

export default new Helper()
