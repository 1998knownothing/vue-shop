<template>

  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>

  </el-breadcrumb>

</template>

<script>
  export default{
    name:'my-brand',
    data(){
      return{

      }

    },
    //props 值字符串数组
    //使用方法与data数据用法一样
    //数据的值 来源于使用组件的传的值
    props:['level1','level2']

  }
</script>

<style>
</style>
