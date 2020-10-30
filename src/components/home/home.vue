<template>

    <el-container class="container">
      <el-header class="header">
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
          <img src="../../assets/heima.png" alt="无法显示图片">
            </div>
          </el-col>
          <el-col :span="18">
            <div class="middle">
              <h3>电商管理系统</h3>
            </div>
            </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <a class="loginout" href="#">退出</a>
            </div>
            </el-col>
        </el-row>

      </el-header>
      <el-container>
        <el-aside class="aside" width="200px">

              <el-menu :unique-opened="true">
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>用户管理</span>

                  </template>
                   <!-- <template slot="title">分组一</template> -->
                    <el-menu-item index="1-1">用户列表</el-menu-item>

                </el-submenu>

                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>权限管理</span>

                  </template>
                   <!-- <template slot="title">分组一</template> -->
                    <el-menu-item index="2-1">用户列表</el-menu-item>

                </el-submenu>
              </el-menu>

        </el-aside>
        <el-container>
          <el-main class="main">Main</el-main>
        </el-container>
      </el-container>
    </el-container>
</template>

<script>
  export default{


    //newVue之前自动触发

    beforeCreate(){
      //获取token
      const token =localStorage.getItem('token')
      //if token 有，-》继续渲染组件
      if(!token){
        this.$router.push({name:'login'})
      }
      //token 没有 -> 登录

    }
  }
</script>

<style>
  .container{
    height: 100%;
  }

  .header {

    background-color: #B3C0D1;

  }

  .aside {
    background-color: #D3DCE6;
  }

  .main {
    background-color: #E9EEF3;
    height: 100%;
  }
  .middle{
    text-align: center;
  }
  .loginout{
    text-decoration: none;
  }


</style>
