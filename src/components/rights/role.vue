<template>
  <el-card>
    <my-brand level1="权限管理" level2="角色列表"></my-brand>

    <el-row>
      <el-col class="addrolebtn">
        <el-button type="info">添加角色</el-button>
      </el-col>
    </el-row>


    <!-- 表格-->
     <el-table
           :data="rolelist"
           style="width: 100%">
          <!-- 布局是行列布局-》 for嵌套
          *
          **
          ***
          -->

           <el-table-column
           type="expand"
             label="#"
             width="150">
             <template slot-scope="scope">
               <el-row v-for="(item1,i) in scope.row.children" :key="i">

                 <el-col :span="4">
                   <el-tag @close="delRight(scope.row,item1.id)" type="success" closable>{{item1.authName}}</el-tag>
                   <i class="el-icon-arrow-right"></i>
                   </el-col>

                   <el-col :span="20">
                     <el-row  v-for="(item2,i) in item1.children" :key="i">
                        <el-col :span="4">
                          <el-tag @close="delRight(scope.row,item2.id)" type="warning" closable>{{item2.authName}}</el-tag>
                          <i class="el-icon-arrow-right"></i>
                        </el-col>


                        <el-col :span="20" >
                            <el-tag @close="delRight(scope.row,item3.id)" type="danger" closable v-for="(item3,i) in item2.children" :key="i">{{item3.authName}}</el-tag>
                        </el-col>


                     </el-row>

                     </el-col>
               </el-row>

               <span v-if="scope.row.children.length===0">未分配权限</span>
             </template>

           </el-table-column>


           <el-table-column
           type="index"
             label="#"
             width="60">
           </el-table-column>
           <el-table-column
             prop="roleName"
             label="角色名称"
             width="80">
           </el-table-column>
           <el-table-column
             prop="roleDesc"
             label="角色描述"
             width="80">
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
             prop="address"
             label="操作">
             <template slot-scope="scope">

               <el-button
               size="mini"
                plain type="primary"
                 icon="el-icon-edit"
                 @click="showSetRightMsgBox(scope.row)"
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

         <!-- Form -->


         <el-dialog title="修改权限" :visible.sync="dialogFormVisibleAdd">

           <el-tree
           ref="tree"
             :data="rightlist"
             show-checkbox
             node-key="id"
             :default-expanded-keys="[0, 3]"
             :default-checked-keys="arrayTemp"
             default-expand-all
             :props="defaultProps">
           </el-tree>




           <div slot="footer" class="dialog-footer">
             <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
             <el-button type="primary" @click="setRoleRight()">确 定</el-button>
           </div>
         </el-dialog>



  </el-card>
</template>

<script>
 export default{
    data(){
      return{
        arrayTemp:[],
        rightlist:[],
        rolelist:[],
        currentRoleId:'',
        dialogFormVisibleAdd:false,
                defaultProps: {
                  children: 'children',
                  label: 'authName'
                }
      }
    },
    created(){
      this.getrolelist()
    },
    methods:{
      setRoleRight(){
        //roles/:roleId/rights
        //roleId给前要修改权限的角色id

        //rids 树形节点中 所有全选和半选的label的id【】

        //获取全选的id数组arr1

        //获取半选id数组arr2

        //arr=arr1+arr2

        //el-tree-> js方法 getCheckedKeys
        //1.给要操作的dom元素 设置ref属性值 input ref="txt"
        //2.this.$refs.ref属性值.js方法名 this.$refs.txt.foucs()
        let arr1 = this.$refs.tree.getCheckedKeys()
        let arr2 = this.$refs.tree.getHalfCheckedKeys()
        console.log(arr1)
        console.log(arr2)
        //es6展开运算符 ..数组或者对象
        let arr = [...arr1,...arr2]

        console.log(arr)
        this.$http.post('roles/'+this.currentRoleId+'/rights',{rids:arr.join(',')})
        .then((res)=>{
          console.log(res)
        })
        this.getrolelist()
        this.dialogFormVisibleAdd = false
      }
      ,showSetRightMsgBox(role){
        this.currentRoleId = role.id
        this.dialogFormVisibleAdd = true
        this.$http.get('rights/tree')
        .then((res)=>{
          console.log(res)
          this.rightlist = res.data.data

          var arrayTemp=[]
          role.children.forEach( item1 =>{
            arrayTemp.push(item1.id)
            item1.children.forEach(item2 =>{
              arrayTemp.push(item2.id)
              item2.children.forEach( item3 =>{
                arrayTemp.push(item3.id)

              });
            });
          });
          this.arrayTemp = arrayTemp
          console.log('we'+this.arrayTemp)
        })
      },
      //取消角色指定权限
      delRight(role,rightId){
        // roles/:roleId/rights/:rightId
        // roleId 当前角色的id
        // rightId 要删除的权限id
        this.$http.get('roles/'+role.id+'/rights/'+rightId)
        .then((res)=>{
          console.log(res)
          role.children = res.data.data
        })
      },
      getrolelist(){
        this.$http.get('roles')
        .then((res)=>{
          console.log(res)
          this.rolelist = res.data.data
          console.log(this.rolelist)
        })
      }
    }



}
</script>

<style>
  .addrolebtn{
    margin-top: 20px;
  }
</style>
