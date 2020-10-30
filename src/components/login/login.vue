<template>
  <div class="login-wrap">

    <div style="margin: 20px;"></div>
    <el-form
    class="login-form"
    :label-position="labelPosition"
    label-width="80px"
    :model="formData">
    <h1>用户登录</h1>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" type="primary" class="login-btn" round>登录</el-button>
    </el-form>

</div>
</template>
<script>

      export default {
        data() {
          return {
            labelPosition: 'top',
            formData: {
              username: '',
              password: ''
            }
          };
        },
        methods:{
          //登录请求
          handleLogin(){
            this.$http.post('login',this.formData)
            .then((res)=>{
              console.log(res)
              const {data,meta:{msg,status}}=res.data
              if(status===200){
                this.$router.push({name:'home'})
                this.$message.success(msg)
              }else{
                this.$message.warning(msg)
              }
            })
          }
        }
      }
</script>

<style>
  .login-wrap{
    height: 100%;
    background-color: #303133;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .login-wrap .login-form{
    width: 400px;
    background-color: #00FF00;
    border-radius: 5px;
    padding: 30px;

  }
  .login-wrap .login-btn{
    width: 100%;
  }


</style>
