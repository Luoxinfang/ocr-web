<style lang="less">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    .el-header {
      background-color: #4d317c;
      padding: 10px 20px;
    }

    .logo {
      width: 40px;
      height: 40px;
      float: left;
      display: inline-block;
    }

    .txt {
      color: #ffffff;
      float: left;
      display: inline-block;
      font-size: 24px;
      line-height: 45px;
      margin-left: 10px;
    }

    .el-main {
      padding: 15px 0 0 0;
    }
  }


</style>
<template>
  <div id="app">
    <el-container>
      <el-header>
        <div class="">
          <img :src="logoImg" class="logo">
          <span class="txt">上传发票</span>
        </div>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import logoImg from './components/logo.svg'

  export default {
    data () {
      return {
        logoImg: logoImg
      }
    }
  }
</script>
