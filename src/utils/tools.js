// 导出表格
export const downloadFile = (data, fileName) => {
  let blob = new Blob([data], {type: 'application/vnd.ms-excel;charset=UTF-8'}) // openxmlformats
  let blobUrl = URL.createObjectURL(blob)
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = blobUrl
  let now = new Date()
  let time = now.getFullYear() + '-' + formatTime(now.getMonth() + 1) + '-' + formatTime(now.getDate()) + '_' +
    formatTime(now.getHours()) + formatTime(now.getMinutes()) + formatTime(now.getSeconds())
  link.download = fileName + '-' + time + '.xls'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function formatTime(time) {
  return (time + '').length < 2 ? 0 + '' + time : time
}
