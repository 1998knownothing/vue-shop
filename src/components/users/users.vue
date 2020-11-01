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
      <el-button type="success" @click="showAdd()">添加用户</el-button>
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
             prop="mobile"
             label="电话">
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
               @change="changeState(scope.row)"
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

               <el-button
               size="mini"
                plain type="primary"
                 icon="el-icon-edit"
                 @click="showEditUserMsgBox(scope.row)"
                  circle></el-button>
               <el-button size="mini"
               plain
               type="success"
               icon="el-icon-check"
               @click="showSetUserRoleDia(scope.row)"
               circle></el-button>
               <el-button size="mini"
                plain
                type="danger"
                 icon="el-icon-delete"
                 @click="showDelUserMsgBox(scope.row.id)"
                  circle></el-button>
             </template>

           </el-table-column>
         </el-table>
    <!-- 分页-->
     <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>




        <!-- Form -->


        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
          <el-form :model="form">
            <el-form-item label="用户名" >
              <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" >
              <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" >
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" >
              <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit" width="50%">
          <el-form :model="form">
            <el-form-item label="用户名" >
              <el-input v-model="form.username" autocomplete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="邮箱" >
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" >
              <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
          </div>
        </el-dialog>



        <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole" width="50%">
          <el-form :model="form">
            <el-form-item label="用户名" >
              <el-input v-model="currentUsername" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色" >{{currentRoleId}}
              <el-select v-model="currentRoleId">
                <el-option label="请选择" :value="-1"></el-option>
                 <el-option :label="item.roleName" :value="item.id"
                 v-for="(item,i) in roles" :key="i"
                 ></el-option>

              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
            <el-button type="primary" @click="setUserRole()">确 定</el-button>
          </div>
        </el-dialog>





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
        pagenum: 1,
        pagesize: 2,

        userlist: [],
        total: -1,
        dialogFormVisibleAdd:false,
        dialogFormVisibleEdit:false,
        dialogFormVisibleRole:false,
        currentRoleId: 1,
        currentUsername:'',
        currentUserId:-1,
        roles:[],

        form:{
          username:'',
          password:'',
          email:'',
          mobile:''

        }

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
            },changeState(user){
              this.$http.put('users/'+user.id+'/state/'+user.mg_state)
              .then((res)=>{
                const {
                  meta:{status,msg},
                      data
                }=res.data
                console.log(res.data)
              })
            },
            showSetUserRoleDia(user){
              this.currentUsername = user.username
              this.currentUserId = user.id
              //获取所有角色
              this.$http.get('roles')
              .then((res)=>{
                this.roles=res.data.data

              })
              //获取当前角色id
              this.$http.get('users/'+user.id)
              .then((res)=>{
                this.currentRoleId=res.data.data.rid

              })
              this.dialogFormVisibleRole=true
            },
            setUserRole(){
              this.$http.put('users/'+this.currentUserId+'/role',{rid: this.currentRoleId})
              .then((res)=>{
                console.log('改变roleid：'+res)

              })
              this.dialogFormVisibleRole=false
            }
            ,showAdd(){

              this.dialogFormVisibleAdd = true
              this.form={}
            }
            ,addUser(){

              this.$http.post('users',this.form)
              .then((res)=>{
                console.log(res)
                const {
                  meta:{status,msg},
                      data
                }=res.data
                if(status===201){
                  console.log(this.form)
                  this.$message.success(msg)
                  this.getUserList()
                  this.form={}
                  /* 清空之前的form
                  for(const key in this.form){
                    if(this.form.hasOwnProperty(key)){
                      this.form[key]=""
                    }
                  }

                  */
                  this.dialogFormVisibleAdd = false
                }else{
                  this.$message.warning(msg)
                }
              })



            },
            showEditUserMsgBox(user){
              this.form = user
              this.dialogFormVisibleEdit=true

            },
            editUser(){
              this.$http.put('users/'+this.form.id,this.form)
              .then((res)=>{
                console.log('编辑：'+res)
                const {
                  meta:{status,msg},
                      data
                }=res.data
                if(status===201){
                  console.log(this.form)
                  this.$message.success(msg)
                  this.getUserList()
                  this.form={}
                  /* 清空之前的form
                  for(const key in this.form){
                    if(this.form.hasOwnProperty(key)){
                      this.form[key]=""
                    }
                  }

                  */
                  this.dialogFormVisibleAdd = false
                }else{
                  this.$message.warning(msg)
                }
              })


            },showDelUserMsgBox(userId){
                      this.$confirm('删除用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        this.$http.delete('users/'+userId)
                        .then((res)=>{
                          console.log('删除：'+res)
                          if(res.data.meta.status===200){
                            this.pagenum = 1

                            this.getUserList()

                            this.$message({
                              type: 'success',
                              message: res.data.meta.msg
                            });
                          }


                        })




                      }).catch(() => {
                        this.$message({
                          type: 'info',
                          message: '已取消删除'
                        });
                      });
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
