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

  .invoice {
    width: 107px;
    height: 40px;
    outline: none;
    opacity: 0;
    position: relative;
    top: -43px;
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

  .upload-bg {
    width: 127px;
    height: 127px;
    margin: 160px auto 0;
    background: url("./bg.png") center no-repeat;
    background-size: contain;
  }

  .upload-btn {
    width: 108px;
    margin: 20px auto;
    overflow: hidden;
  }

  .btn-top {
    width: 108px;
    height: 40px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .el-button {
    background: #7352bf !important;
    color: #ffffff !important;
  }

  .el-progress.is-success .el-progress-bar__inner {
    background: #7352bf;
  }

  .el-progress-bar__innerText {
    float: right;
    margin-top: 1px;
  }

  .el-button.is-disabled {
    background: #c0c4cc !important;
    color: #ffffff !important;
  }

  .el-icon-error {
    color: #e8e6ee;
    font-size: 20px;
  }

  .el-table th {
    background: #f1f1f5;
  }

  table td, table th {
    border: none;
    border-bottom: 1px solid #ebeef5;
  }

  .s-info {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #ebeef5;
    font-size: 13px;
    text-align: right;
  }

  .yellow {
    color: #ff9300;
  }

  .tip-main {
    width: 60%;
    margin: 10px auto;
  }
</style>

<template>
  <div id="wrapper">
    <div class="main">
      <div v-if="rows.length" class="has-rs">
        <div class="btn-top">
          <el-button>+上传发票</el-button>
          <input class="invoice" type="file" accept="application/pdf" multiple @change="readFile">
        </div>
        <div class="content" :style="{height: height+'px'}">
          <el-table
            :data="rows"
            :max-height="height"
            @selection-change="handleSelectionChange"
            :style="{width: '100%'}">
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              fixed
              label="序号"
              width="50">
              <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column
              fixed
              label="车牌号"
              width="90">
              <template slot-scope="scope">{{scope.row[0]}}</template>
            </el-table-column>
            <el-table-column
              fixed
              label="上传时间"
              width="96">
              <template slot-scope="scope">{{date}}</template>
            </el-table-column>

            <el-table-column
              label="开票日期"
              width="96">
              <template slot-scope="scope">{{scope.row[1]}}</template>
            </el-table-column>
            <el-table-column
              label="通行日期起"
              width="100">
              <template slot-scope="scope">{{scope.row[2]}}</template>
            </el-table-column>
            <el-table-column
              label="通行日期止"
              width="100">
              <template slot-scope="scope">{{scope.row[3]}}</template>
            </el-table-column>
            <el-table-column
              label="发票代码"
              width="120">
              <template slot-scope="scope">{{scope.row[4]}}</template>
            </el-table-column>
            <el-table-column
              label="发票号码"
              width="100">
              <template slot-scope="scope">{{scope.row[5]}}</template>
            </el-table-column>
            <el-table-column
              label="购方名称"
              width="300">
              <template slot-scope="scope">{{scope.row[6]}}</template>
            </el-table-column>
            <el-table-column
              label="销方名称"
              min-width="200">
              <template slot-scope="scope">{{scope.row[7]}}</template>
            </el-table-column>
            <el-table-column
              label="未税金额"
              width="80">
              <template slot-scope="scope">{{scope.row[8]}}</template>
            </el-table-column>
            <el-table-column
              label="进项税额"
              width="80">
              <template slot-scope="scope">{{scope.row[9]}}</template>
            </el-table-column>
            <el-table-column
              label="税价合计"
              width="80">
              <template slot-scope="scope">{{scope.row[10]}}</template>
            </el-table-column>
            <el-table-column
              label="税率"
              width="80">
              <template slot-scope="scope">{{scope.row[10]}}</template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="50">
              <template slot-scope="scope">
                <i @click="removeItem(scope.$index)" class="el-icon-error"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="s-info">
          未税金额汇总: <span class="yellow">{{untaxedAmount.toFixed(2)}}</span> &nbsp;
          进项税额汇总: <span class="yellow">{{taxedAmount.toFixed(2)}}</span> &nbsp;
          价税汇总: <span class="yellow">{{priceTax.toFixed(2)}}</span> &nbsp;
          加载耗时: <span class="yellow">{{(loadTime/1000).toFixed(2)}}</span>秒 ，
          识别耗时：<span class="yellow">{{(analyzeTime/1000).toFixed(2)}}</span>秒 ，
          本次识别文件 <span class="yellow">{{fileLength}}</span> 个，准确率：<span class="yellow">{{accuracy}}%</span>
          <el-button @click="exportData" style="margin-left: 20px;" :disabled="selectedRows.length===0">
            <i class="el-icon-download"></i>导出数据
          </el-button>
        </div>
      </div>
      <div v-else class="file">
        <div class="upload-bg"></div>
        <div class="upload-btn">
          <el-button>+上传发票</el-button>
          <input class="invoice" type="file" accept="application/pdf" multiple @change="readFile">
        </div>
      </div>
      <el-dialog
        title="解析发票"
        :visible.sync="analyzing"
        width="50%">
        <div class="tip-main">
          <div>{{fileMsg}}：</div>
          <el-progress :text-inside="true" :stroke-width="14" :percentage="percentage" status="success"></el-progress>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUpload">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="导出数据"
        :visible.sync="download"
        width="50%">
        <div style="height: 100px; font-size: 16px; text-align: center;">
          <div class="s" style="width: 100px; margin: 10px auto;" v-if="downloadSuccess">
            <img src="./xl-emo.png">
            <div style="color: #88cca6;">导出成功</div>
          </div>
          <div class="f" style="width: 100px; margin: 0 auto;" v-else>
            <img src="./kl-emo.png">
            <div style="color: #ff0000;">导出失败</div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="download = false">完成</el-button>
        </div>
      </el-dialog>
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
        download: false,
        downloadSuccess: false,
        height: (document.documentElement.clientHeight - 210),
        selectedRows: [],
        date: this.dateFormat(new Date(), 'yyyy.MM.dd'),
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
              return text.replace(/年|月/g, '.').replace('日', '')
            }
          },
          {
            text: '通行日期起',
            flag: '通行日期起',
            minX: 10,
            minY: 0,
            format: (text) => {
              return text.substring(0, 4) + '.' + text.substring(4, 6) + '.' + text.substring(6, 8)
            }
          },
          {
            text: '通行日期止',
            flag: '通行日期止',
            minX: 10,
            minY: 0,
            format: (text) => {
              return text.substring(0, 4) + '.' + text.substring(4, 6) + '.' + text.substring(6, 8)
            }
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
            },
            default: 0
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
            minY: 0,
            format: (val) => {
              return val.replace(/不征税/g, '0%')
            },
            default: '0%'
          }
        ],
        loadTime: 0,
        analyzeTime: 0,
        accuracy: 100,
        fileLength: 0,
        untaxedAmount: 0,
        taxedAmount: 0,
        priceTax: 0,
        percentage: 0,
        cancelUploading: false
      }
    },
    methods: {
      exportData () {
        // console.log(this.rows.length, this.rows)
        this.$http.post('/api/excel', {data: this.selectedRows}).then((data) => {
          this.download = true
          if (data.data) {
            this.downloadSuccess = true
            window.location = window.location.origin + '/' + data.data.url
          } else {
            this.downloadSuccess = false
          }
        }).catch((err) => {
          this.download = true
          this.downloadSuccess = false
          // dlWindow.close()
        })
      },
      readFile () {
        this.rows = []
        this.errList = []
        this.loadTime = 0
        this.analyzeTime = 0
        this.accuracy = 100
        this.fileLength = 0
        this.untaxedAmount = 0
        this.taxedAmount = 0
        this.priceTax = 0
        let that = this
        let $file = document.querySelector('.invoice')
        let files = $file.files
        let startLoad = performance.now()
        let fileLength = files.length
        let loadedIndex = 0
        let analyzeIndex = 0
        let errFileNumber = 0
        let errList = []
        that.cancelUploading = false
        that.fileLength = fileLength
        if (fileLength > 1000) {
          this.$alert('一次最多只能上传1000个文件', '文件上限', {
            confirmButtonText: '确定'
          })
          return false
        }
        for (let file of  files) {
          ((file) => {
            if (!that.cancelUploading) {
              that.fileMsg = '正在读取发票'
            }
            let fileReader = new FileReader()
            fileReader.onload = function () {
              if (++loadedIndex === fileLength) {
                that.loadTime = performance.now() - startLoad
              }
              if (!that.cancelUploading) {
                that.fileMsg = '正在解析发票'
              }
              let typedArray = new Uint8Array(this.result)
              let startAnalyze = performance.now()
              pdfJS.getDocument(typedArray).then((doc) => {
                let numPages = doc.numPages
                // console.log('一共有: ' + numPages + '页\n')
                let lastPromise
                let pdfVersion = ''
                lastPromise = doc.getMetadata().then((data) => {
                  // console.log('\n', JSON.stringify(data.info, null, 2), '\n')
                  pdfVersion = data.info.PDFFormatVersion
                })
                let loadPage = function (pageNum) {
                  if (that.cancelUploading) {
                    that.rows = []
                    that.fileMsg = ''
                    return false
                  }
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
                            _row.push(tar.value || tar.default)
                            break
                          }
                        }
                      }
                      if (_row.length === 12) {
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
                        that.fileMsg = ''
                        that.analyzeTime = performance.now() - startAnalyze
                      }
                      that.percentage = parseInt(analyzeIndex / fileLength * 100)
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
      },
      dateFormat (date, format) {
        if (format === undefined) {
          format = date
          date = new Date()
        }
        let map = {
          'M': date.getMonth() + 1,
          'd': date.getDate(),
          'h': date.getHours(),
          'm': date.getMinutes(),
          's': date.getSeconds(),
          'q': Math.floor((date.getMonth() + 3) / 3),
          'S': date.getMilliseconds()
        }
        format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
          let v = map[t]
          if (v !== undefined) {
            if (all.length > 1) {
              v = '0' + v
              v = v.substr(v.length - 2)
            }
            return v
          } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length)
          }
          return all
        })
        return format
      },
      removeItem (index) {
        this.rows.splice(index, 1)
      },
      handleSelectionChange (val) {
        this.selectedRows = val
      },
      cancelUpload () {
        this.cancelUploading = true
      }
    },
    computed: {
      analyzing () {
        return !!this.fileMsg
      }
    }
  }
</script>

