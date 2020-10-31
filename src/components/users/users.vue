<template>
  <el-card class="box-card">
    <!-- 面包屑-->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>

</el-breadcrumb>
    <!-- 搜索-->
<el-row>
  <el-col>
    <el-input
    placeholder="请输入内容"
    v-model="query"
    class="input-with-select"
    @clear="loadUserList()"
    clearable>
        <el-button
        slot="append"
        icon="el-icon-search"
        @click="searchUser()"
        ></el-button>
      </el-input>
      <el-button type="success">添加</el-button>
  </el-col>
</el-row>
    <!-- 表格-->
     <el-table
           :data="userlist"
           style="width: 100%">
           <el-table-column
           type="index"
             label="#"
             width="60">
           </el-table-column>
           <el-table-column
             prop="username"
             label="姓名"
             width="180">
           </el-table-column>
           <el-table-column
             prop="email"
             label="邮箱">
           </el-table-column>

           <el-table-column
             prop="create_time"
             label="创建时间">
             <!-- template内部要用数据 设置slot-scope属性
             该属性的值是要使用数据createtime的数据源userlist
             slot-scope 的值userlist其实就是eltable绑定数据userlist
             userlist.row=.数组中的每个对象-->
             <!-- 自动查找上一级数据源 不用userlist也可以-->
             <template slot-scope="scope">
               {{scope.row.create_time | fmtdate}}
             </template>
           </el-table-column>

           <el-table-column
             prop="mg_state"
             label="用户状态">
             <template slot-scope="scope">
               <el-switch
                 v-model="scope.row.mg_state"
                 active-color="#13ce66"
                 inactive-color="#ff4949">
               </el-switch>
             </template>
           </el-table-column>


           <el-table-column
             prop="address"
             label="操作">
             <template slot-scope="scope">

               <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
               <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
               <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
             </template>

           </el-table-column>
         </el-table>
    <!-- 分页-->
     <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>


  </el-card>
</template>

<script>
  export default{
    /*

    id: (...)


    mobile: (...)
    role_name: (...)
    username: (...)
    email: (...)
    create_time: (...)
    mg_state: (...)*/
    data(){
      return{
        query:'',
        pagenum:1,
        pagesize:2,

        userlist: [],
        total: -1
      }
    },created() {
      this.getUserList()
    },
    methods:{
      getUserList(){

        const AUTH_TOKEN = localStorage.getItem('token')
        this.$http.defaults.headers.common['Authorization']=AUTH_TOKEN

        this.$http.get('users?query='+this.query+'&pagenum='+this.pagenum+'&pagesize='+this.pagesize)
        .then((res)=>{
          console.log(res)
          const {meta:{status,msg},data:{users,total}} = res.data
          if(status===200){
            this.userlist=users
            this.total=total
            this.$message.success(msg)
            this.pagenum=1
          }else{
            this.$message.warning(msg)
          }

        })
      },
      handleSizeChange(val) {
              console.log(`每页 ${val} 条`);
              this.pagesize=val
              this.pagenum=1
              this.getUserList()
            },
            handleCurrentChange(val) {
              console.log(`当前页: ${val}`);
              this.pagenum=val
              this.getUserList()
            },
            searchUser(){
              this.getUserList()
            },
            loadUserList(){
              this.getUserList()
            }
    }
  }
</script>

<style>
  .box-card{
    height: 100%;
  }
 .el-input {
      width: 300px;
      margin-top: 20px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
</style>
