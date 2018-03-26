<style>

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
  }

  .main {
    width: 96%;
    margin: 0 2%;
  }

  .label {
    font-size: 16px;
    color: #0073ed;
    cursor: pointer;
    width: 200px;
    height: 35px;
    line-height: 35px;
    margin: 20px auto;
    display: block;
    outline: none;
    text-align: center;
    border: 1px solid #8cc4f0;
  }

  .tip {
    position: absolute;
    width: 100%;
    top: 20px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: #ffffff;
    color: #ed4835;
  }

  #invoice {
    width: 0;
    height: 0;
    outline: none;
  }

  table {
    overflow: auto;
    word-break: normal;
    border-collapse: collapse;
    border-spacing: 0;
  }

  table tr {
    background-color: #fff;
    border-top: 1px solid #ccc;
  }

  table th, table td {
    padding: 5px;
    border: 1px solid #ddd;
  }

  table th {
    font-weight: bold;
    background: #f0f0f0;
    color: #333;
  }

  .info {
    height: 20px;
    line-height: 16px;
    text-align: right;
  }

  .red {
    color: red;
  }

  .btn {
    padding: 6px 10px;
    border-radius: 5px;
    outline: none;
  }
</style>

<template>
  <div id="wrapper">
    <div class="main">

      <label class="label" for="invoice">
        <input id="invoice" type="file" name="invoice" accept="application/pdf" multiple @change="readFile">
        +上传发票
      </label>
      <div v-if="fileMsg" class="tip">{{fileMsg}}</div>
      <table border="0" cellspacing="0" style="width: 100%;">
        <tr>
          <td>
            <div class="info">
              未税金额汇总: {{untaxedAmount.toFixed(2)}} &nbsp;
              进项税额汇总: {{taxedAmount.toFixed(2)}} &nbsp;
              价税汇总: {{priceTax.toFixed(2)}} &nbsp;
            </div>
            <div class="info">
              加载耗时: {{(loadTime/1000).toFixed(2)}}秒 ，
              识别耗时：{{(analyzeTime/1000).toFixed(2)}}秒 ，
              本次识别文件 {{fileLength}} 个，准确率：<span class="red">{{accuracy}}%</span>
            </div>
          </td>
          <td width="200" align="center">
            <button class="btn" disabled @click="exportData">导出数据</button>
          </td>
        </tr>
      </table>
      <table border="0" cellspacing="0" style="width: 100%; margin-top: 10px;">
        <thead>
        <tr>
          <th width="90">车牌号</th>
          <th width="90">开票日期</th>
          <th width="90">通行日期起</th>
          <th width="90">通行日期止</th>
          <th width="120">发票代码</th>
          <th width="100">发票号码</th>
          <th width="240">购方名称</th>
          <th>销方名称</th>
          <th width="70">未税金额</th>
          <th width="70">进项税额</th>
          <th width="70">价税合计</th>
          <th width="50">税率</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in rows">
          <td v-for="item in row">{{item}}</td>
        </tr>
        <tr v-for="row in errList">
          <td colspan="12" class="red">{{row.err}} 文件名: {{row.fileName}} PDF版本：{{row.pdfVersion}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import coreWorker from '../assets/lib/pdf.worker'
  import pdfJS from '../assets/lib/pdf'

  window.core_worker = coreWorker
  export default {
    data () {
      return {
        fileMsg: '',
        rows: [],
        errList: [],
        target: [
          {
            text: '车牌号',
            flag: '车牌号',
            minX: 50,
            minY: 1000
          },
          {
            text: '开票日期',
            flag: '开票日期',
            minX: 100,
            minY: 12,
            format: (text) => {
              return text.replace(/年|月/g, '/').replace('日', '')
            }
          },
          {
            text: '通行日期起',
            flag: '通行日期起',
            minX: 10,
            minY: 0
          },
          {
            text: '通行日期止',
            flag: '通行日期止',
            minX: 10,
            minY: 0
          },
          {
            text: '发票代码',
            flag: '发票代码',
            minX: 100,
            minY: 12
          },
          {
            text: '发票号码',
            flag: '发票号码',
            minX: 50,
            minY: 12
          },
          {
            text: '购方名称', //
            flag: '名称:',
            minX: 50,
            minY: 12
          },
          {
            text: '销方名称', //
            flag: '名称:',
            minX: 50,
            minY: 12
          },
          {
            text: '未税金额',
            flag: '金额',
            minX: 50,
            minY: 0
          },
          {
            text: '进项税额',
            flag: '税额',
            minX: 50,
            minY: 0,
            validate: (val) => {
              return /^[\d|\.{0,1}]*$/i.test(val)
            }
          },
          {
            text: '价税合计',
            flag: '小写',
            minX: 50,
            minY: 12,
            validate: (val) => {
              return /^[\d|\.{0,1}]*$/i.test(val)
            }
          },
          {
            text: '税率',
            flag: '税率',
            minX: 20,
            minY: 0
          }
        ],
        loadTime: 0,
        analyzeTime: 0,
        accuracy: 0,
        fileLength: 0,
        untaxedAmount: 0,
        taxedAmount: 0,
        priceTax: 0
      }
    },
    methods: {
      exportData () {
        let dlWindow = window.open()
        this.$http.post('/api/excel', {data: this.rows}).then((data) => {
          dlWindow.location = data.url
        })
      },
      readFile () {
        this.rows = []
        this.errList = []
        this.loadTime = 0
        this.analyzeTime = 0
        this.accuracy = 0
        this.fileLength = 0
        this.untaxedAmount = 0
        this.taxedAmount = 0
        this.priceTax = 0
        let that = this
        let $file = document.querySelector('#invoice')
        let files = $file.files
        that.fileMsg = '开始读取文件...'
        let startLoad = performance.now()
        let fileLength = files.length
        let loadedIndex = 0
        let analyzeIndex = 0
        let errFileNumber = 0
        let errList = []
        that.fileLength = fileLength
        for (let file of  files) {
          ((file) => {
            let fileReader = new FileReader()
            fileReader.onload = function () {
              if (++loadedIndex === fileLength) {
                that.loadTime = performance.now() - startLoad
              }
              that.fileMsg = '开始解析发票...'
              let typedArray = new Uint8Array(this.result)
              let startAnalyze = performance.now()
              pdfJS.getDocument(typedArray).then((doc) => {
                let numPages = doc.numPages
                // console.log('一共有: ' + numPages + '页\n')
                let lastPromise
                let pdfVersion = ''
                lastPromise = doc.getMetadata().then((data) => {
                  console.log('\n', JSON.stringify(data.info, null, 2), '\n')
                  pdfVersion = data.info.PDFFormatVersion
                })
                let loadPage = function (pageNum) {
                  doc.getPage(pageNum).then(function (page) {
                    // console.log('页码:' + pageNum + '\n')
                    let viewport = page.getViewport(1.0 /* scale */);
                    // console.log('Size: ' + viewport.width + 'x' + viewport.height)
                    page.getTextContent().then(function (content) {
                      // console.log('content:', content)

                      let n = 0
                      let _row = []
                      for (let i = 0, l = that.target.length; i < l; i++) {
                        let tar = that.target[i]
                        for (let j = 0, l = content.items.length; j < l; j++) {
                          let item = content.items[j]
                          if (item.str.replace(/\s/g, '').indexOf(tar.flag) > -1) {
                            tar.w = item.width
                            tar.h = item.height
                            tar.x = item.transform[4]
                            tar.y = item.transform[5]
                            content.items.splice(j, 1) // 移除key值 无计算价值
                            // 开始查找该项的值
                            let value = [], minX = 1000, minY = 1000
                            for (let k = 0, l = content.items.length; k < l; k++) {
                              n++
                              let _temp = content.items[k];
                              if (/\（|\）|\:|\(|\)/g.test(item.str)) {
                                let spaceY = Math.abs(tar.y - _temp.transform[5])
                                let spaceX = _temp.transform[4] - tar.x - tar.w
                                if (spaceY < tar.minY && spaceX > 0 && spaceX < tar.minX) {
                                  value.push(_temp.str)
                                }

                              } else {
                                let spaceY = tar.y - _temp.transform[5]
                                let spaceX = Math.abs(tar.x - _temp.transform[4])
                                // console.log(space, _temp.str)
                                if (spaceY > 0 && spaceY < minY) {
                                  if (spaceX < tar.minX) {
                                    minY = spaceY
                                    value = [_temp.str]
                                  }
                                } else if (spaceY === minY) {
                                  if (spaceX < tar.minX) {
                                    value.push(_temp.str)
                                  }
                                }
                              }
                            }
                            tar.value = ''
                            value.forEach((item) => {
                              if (tar.validate) {
                                if (tar.validate(item)) {
                                  if (tar.format) {
                                    tar.value += tar.format(item)
                                  } else {
                                    tar.value += item
                                  }
                                }
                              } else {
                                if (tar.format) {
                                  tar.value += tar.format(item)
                                } else {
                                  tar.value += item
                                }
                              }
                            })
                            // console.log(tar.text, ':', tar.value)
                            _row.push(tar.value || '--')
                            break
                          }
                        }
                      }
                      if (_row.length) {
                        that.rows.push(_row)
                        that.untaxedAmount += +(_row[8])
                        that.taxedAmount += +(_row[9])
                        that.priceTax += +(_row[10] || 0)
                      } else {
                        ++errFileNumber
                        that.accuracy = (100 - ((errFileNumber / fileLength) * 100)).toFixed(2)
                        that.errList.push({
                          err: '文件解析失败',
                          fileName: file.name,
                          pdfVersion: pdfVersion
                        })
                      }
                      if (++analyzeIndex === fileLength) {
                        that.analyzeTime = performance.now() - startAnalyze
                      }
                      // console.log(n)
                    })
                  })
                }
                for (let i = 1; i <= 1; i++) { //目前假设 当前文档只有1页  i<=numPages
                  lastPromise = lastPromise.then(loadPage.bind(this, i))
                }
                return lastPromise
              }).then(function () {
                // 文档读取完毕
                $file.value = ''
                that.fileMsg = ''
              }, function (err) {
                console.error('Error: ' + err);
              })

            }
            fileReader.readAsArrayBuffer(file)
          })(file)
        }

      },
      findObj (rs, key) {
        if (!rs) {
          return '--'
        }
        for (let i = 0, l = rs.length; i < l; i++) {
          let obj = rs[i]
          if (obj['word_name'] === key) {
            return obj.word || '--'
          }
        }
      }
    }

  }
</script>

