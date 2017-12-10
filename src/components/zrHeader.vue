<template>
  <div class="header">
    <div class="inner">
      <div class="m-logo">
        <router-link to="/musichall/index" tag="a">温小云音乐</router-link>
        <div class="header-nav">
          <router-link v-for="item in this.nav" :to="{path:item.path}" tag="a" active-class="active">
            {{item.title}}
          </router-link>
          <a href="https://github.com/abc97393094" target="_blank">我的Github</a>
          <el-autocomplete
            class="inline-input"
            v-model="state1"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            valueKey="k"
          >
            <el-button slot="append" icon="el-icon-search" @click="to(state1)"></el-button>
          </el-autocomplete>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        nav:[{
          title:"音乐馆",
          path:'/musichall/index'
        },{
          title:"我的音乐",
          path:'/mymuisc'
        }],
        restaurants: [],
        state1: ''
      }
    },
    methods:{
      querySearch(queryString, cb) {
        let restaurants = this.restaurants;
        this.$store.dispatch('getHotKey').then((response) => {
          cb(response.data.data.hotkey.slice(0, 6))
        })
      },
      to(state1){
        this.$router.push({name: 'search', params: {id: state1}})
      }
    },
    create(){

    }
  }
</script>
<style>
  .inner{
    margin:0 200px;
    border-bottom: 1px solid #f2f2f2;
  }
  .m-logo>a{
    line-height:80px;
    text-decoration: none;
    color: #000;
    font-size: 26px;
    font-weight: 700;
  }
  .header-nav{
    float: right;
  }
  .header-nav>a{
    line-height: 80px;
    list-style: none;
    padding:0 20px;
    background-color: #fff;
    color: #000;
    text-decoration: none;
    display: inline-block;
  }
  .header-nav>a.active{
    background-color: #409eff;
    color: #fff;
  }

  .el-input {
    width: 250px;
  }
</style>
