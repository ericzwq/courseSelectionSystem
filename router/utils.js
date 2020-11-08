exports.filterQuery = function (query) {
  query.page = parseInt(query.page)
  query.count = parseInt(query.count)
  if (isNaN(query.page) || isNaN(query.count)) {
    query.page = 1;
    query.count = 10000
  }
  return query
}
exports.checkNumParam = function (params) {
  if (Array.isArray(params)) {
    return params.every(v => parseInt(v) === parseInt(v))
  } else if (typeof params === 'string') {
    return parseInt(params) === parseInt(params)
  } else {
    return false
  }
}