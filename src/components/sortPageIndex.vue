<template>
  <div>
    <ul v-loading="loading">

      <li class="border-1px border-1px-after" v-for="(item,index) in  this._.slice(topListData.songlist,oldNum,newNum)">

        <span style="font-size: 24px;font-weight: 400" class="sort">{{(currentPage-1)*25 +index+1}}</span>
        <div class="cd-show">
          <img :src="'https://y.gtimg.cn/music/photo_new/T002R90x90M000'+item.data.albummid+'.jpg?max_age=2592000'" alt="">
          <span class="songname">{{item.data.songorig}}</span>
        </div>
        <div class="singer">
          <span class="artist">
            <a href="" v-for="singername in item.data.singer">{{singername.name}}</a>
          </span>
        </div>
        <span class="songlist__time">{{item.data.interval | musicmin}}</span>
      </li>
    </ul>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="100"
      :current-page="currentPage"
      :page-size=pageSize
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        topListData: null,
        topid:this.$route.params.id,
        currentPage:1,
        pageSize:25,
        loading:true
      }
    },
    created(){
      this.loading=true;
      this.$store.dispatch('getRankSongs',this.topid).then((response) => {
        this.topListData = response.data
        this.loading=false;
      })
    },
    watch:{
      '$route': function () {
        this.loading=true;
        this.topid = this.$route.params.id;
        this.$store.dispatch('getRankSongs',this.topid).then((response) => {
          this.topListData = response.data
          this.loading=false;
        })
      }
    },
    computed:{
      oldNum(){
        return (this.currentPage-1)*25;
      },
      newNum(){
        return (this.currentPage-1)*25+25;
      }
    },
    methods:{
      handleSizeChange: function (size) {
        this.pageSize = size;
      },
      handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
      },
      imgUrl(width,url){
        return 'https://y.gtimg.cn/music/photo_new/T002R'+width+'x'+width+'M000'+url+'.jpg?max_age=2592000'
      }

    },filters:{
      musicmin:time=>{
        return parseInt((time/60))+':'+(time%60)
      }

    }
  }
</script>
<style scoped>
  body{
    font-family: poppin;
  }
  .singer{
    display: inline-block;
    width: 10%;
  }

  ul>li{
    list-style: none;
    padding:5px;

  }
  ul>li img{
    vertical-align:middle;
  }
  .songlist__time{
    position: relative;
    top: -3px;
  }
  ul>li .songlist__time,
  ul>li .cd-show,
  ul>li .sort{
    display: inline-block;
  }
  .cd-show{
    display: inline-block;
    width: 70%;
  }
  .singer{
    width: 15%;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
  }
  .songlist__time{
    width: 5%;
  }
  .sort{
    width: 5%;
    text-align: center;
    position: relative;
    top:4px;
  }
  .singer a{
    color: #000;
    text-decoration: none;
  }
</style>
