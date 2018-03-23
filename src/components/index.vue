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
    padding: 6px 13px;
    border: 1px solid #ddd;
  }

  table th {
    font-weight: bold;
    background: #f0f0f0;
    color: #333;
  }

  .info {
    height: 30px;
    text-align: right;
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
      <div class="info">
        加载耗时: {{(loadTime/1000).toFixed(2)}}秒 ，
        识别耗时：{{(analyzeTime/1000).toFixed(2)}}秒 ，
        本次识别文件{{fileLength}}个，准确率：{{accuracy}}%
      </div>

      <table border="0" cellspacing="0" style="width: 100%;">
        <thead>
        <tr>
          <th width="90">车牌号</th>
          <th width="90">开票日期</th>
          <th width="90">通行日期起</th>
          <th width="90">通行日期止</th>
          <th width="120">发票代码</th>
          <th width="100">发票号码</th>
          <th width="160">购方名称</th>
          <th>销方名称</th>
          <th width="70">未税金额</th>
          <th width="70">进项税额</th>
          <th width="70">价税合计</th>
          <th width="50">税率</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in rows">
          <template v-if="row.err">
            <td colspan="12">{{row.err}} 文件名: {{row.fileName}} PDF版本：{{row.pdfVersion}}</td>
          </template>
          <template v-else>
            <td v-for="item in row">{{item}}</td>
          </template>

        </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>

<script>
  import pdfJS from '../assets/lib/pdf'

  export default {
    data () {
      return {
        fileMsg: '',
        rows: [],
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
            minY: 12
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
        accuracy: 100,
        fileLength: 0
      }
    },
    methods: {
      readFile () {
        let that = this
        let $file = document.querySelector('#invoice')
        let files = $file.files
        that.fileMsg = '开始读取文件...'
        let startLoad = performance.now()
        let fileLength = files.length

        let loadedIndex = 0
        let analyzeIndex = 0
        let errFileNumber = 0
        that.fileLength = fileLength
        for (let file of  files) {
          ((file) => {
            let fileReader = new FileReader()
            fileReader.onload = function () {
              if (++loadedIndex === fileLength) {
                that.loadTime += performance.now() - startLoad
              }
              that.fileMsg = '开始解析发票...'
              let typedArray = new Uint8Array(this.result)
              let startAnalyze = performance.now()
              pdfJS.getDocument(typedArray).then((doc) => {
                let numPages = doc.numPages
                console.log('一共有: ' + numPages + '页\n')
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
                      console.log('content:', content)
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
                                  tar.value += item
                                }
                              } else {
                                tar.value += item
                              }
                            })
                            console.log(tar.text, ':', tar.value)
                            _row.push(tar.value || '--')
                            break
                          }
                        }
                      }
                      if (_row.length) {
                        that.rows.push(_row)
                      } else {
                        ++errFileNumber
                        console.log(errFileNumber)
                        that.accuracy = 100 - parseInt((errFileNumber / fileLength) * 100)
                        that.rows.push({
                          err: '文件解析失败',
                          fileName: file.name,
                          pdfVersion: pdfVersion
                        })
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
                if (++analyzeIndex === fileLength) {
                  that.analyzeTime += performance.now() - startAnalyze
                }
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

