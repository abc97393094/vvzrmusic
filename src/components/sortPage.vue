<template>
  <div class="inner">
    <div class="silder-left">
      <el-menu :router="router">
        <el-menu-item v-for="item in topList" :index="item.id.toString()" >
          <span slot="title">{{item.topTitle}}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="slider-right">
        <router-view>
        </router-view>

    </div>
  </div>
</template>
<script>
  import sortPageIndex from './sortPageIndex.vue'
  export default {
    components:{sortPageIndex},
    data () {
      return {
        topList: null,
        router:true
      }
    },
    created: function () {
      this.$store.dispatch('getRankList').then((response) => {
        this.topList = response.data.data.topList
      })
    },
    methods:{
      showRank: function (id) {
        this.$router.push({name: 'sort', params: {id: id}})
      }
    }
  }
</script>
<style scoped>

  .silder-left{
    width: 20%;
    display: inline-block;
    float: left;
    overflow: hidden;
  }
  .silder-left span{
    width: 100%;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
    display: inline-block;
  }
  .slider-right{
    width: 80%;
    display: inline-block;

  }
</style>
