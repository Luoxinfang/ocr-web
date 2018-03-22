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
    height: 75px;
    line-height: 75px;
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
    display: block;
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
</style>

<template>
  <div id="wrapper">
    <div class="main">
      <label class="label" for="invoice">
        <input id="invoice" type="file" name="invoice" accept="application/pdf" multiple @change="readFile">
        +上传发票
      </label>
      <div v-if="fileMsg" class="tip">{{fileMsg}}</div>
      <table border="0">
        <tr>
          <th>车牌号</th>
          <th>开票日期</th>
          <th>通行日期起</th>
          <th>通行日期止</th>
          <th>发票代码</th>
          <th>发票号码</th>
          <th>购方名称</th>
          <th>销方名称</th>
          <th>未税金额</th>
          <th>进项税额</th>
          <th>价税合计</th>
          <th>税率</th>
        </tr>
        <tr v-for="row in rows">
          <td v-for="item in row">{{item}}</td>
        </tr>
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
        ]
      }
    },
    methods: {
      readFile () {
        let that = this
        let $file = document.querySelector('#invoice')
        let files = $file.files
        that.fileMsg = '开始读取文件...'
        for (let file of  files) {
          ((file) => {
            let fileReader = new FileReader()
            fileReader.onload = function () {
              that.fileMsg = '开始解析发票...'
              let typedArray = new Uint8Array(this.result)
              pdfJS.getDocument(typedArray).then((doc) => {
                let numPages = doc.numPages
                console.log('一共有: ' + numPages + '页\n')
                let lastPromise; // will be used to chain promises
                lastPromise = doc.getMetadata().then((data) => {
                  console.log('\n', JSON.stringify(data.info, null, 2), '\n')
                })

                let loadPage = function (pageNum) {
                  doc.getPage(pageNum).then(function (page) {
                    console.log('页码:' + pageNum + '\n')
                    let viewport = page.getViewport(1.0 /* scale */);
                    console.log('Size: ' + viewport.width + 'x' + viewport.height)
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
                      that.rows.push(_row)
                      console.log(n)
                    })
                  })
                };
                // Loading of the first page will wait on metadata and subsequent loadings
                // will wait on the previous pages.
                for (let i = 1; i <= numPages; i++) {
                  lastPromise = lastPromise.then(loadPage.bind(this, i))
                }
                $file.value = ''
                return lastPromise
              }).then(function () {
                // 文档读取完毕
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

