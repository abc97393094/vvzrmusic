<template>
  <div>
    <div class="nav">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :router="router">
        <el-menu-item index="/musichall/index">首页</el-menu-item>
        <el-menu-item index="/musichall/sort">排行榜</el-menu-item>
      </el-menu>
    </div>
    <keep-alive>
      <router-view>

      </router-view>
    </keep-alive>

    </div>

</template>
<script>
  export default {
    data() {
      return {
        router:true,
        activeIndex: '/musichall/index',
        navList:[{
          label:"首页",name:"index",path:'index'
        },{
          label:"排行榜",name:"sort",path:'sort'
        }]
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
<style>
  .nav{
    margin: 0 200px;
  }
</style>
