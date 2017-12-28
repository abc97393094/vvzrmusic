<template>
  <div>
    <ul v-loading="loading">

      <li class="border-1px border-1px-after" v-for="(item,index) in  this._.slice(topListData.songlist,oldNum,newNum)">

        <span style="font-size: 24px;font-weight: 300" class="sort" :style="(currentPage-1)*25 +index+1 <= 3 ? 'color:#ff4222' : ''">{{(currentPage-1)*25 +index+1}}</span>
        <div class="cd-show" @click="play(index)">
          <img :src="'https://y.gtimg.cn/music/photo_new/T002R90x90M000'+item.data.albummid+'.jpg?max_age=2592000'" alt="">
          <span class="songname">{{item.data.songorig}}</span>
          <span class="songdesc">{{item.data.albumdesc}}</span>
        </div>
        <div class="singer">
          <span v-for="(singername,index) in item.data.singer" class="artist">
            <a href="">{{singername.name}}</a>
            <span v-if="index < (item.data.singer.length - 1)"> / </span>
          </span>
        </div>
        <span class="songlist-time">{{item.data.interval | musicmin}}</span>
      </li>
    </ul>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="topListData.total_song_num"
        :current-page="currentPage"
        :page-size=pageSize
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>

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
      },
      play:function (index) {
        let list = []
        this.topListData.songlist.forEach(item=>{
          list.push({
            id: item.data.songid,
            mid:item.data.songmid,
            name:item.data.songorig,
            singer:item.data.singer,
            albummid:item.data.albummid
          })
        })
        this.$store.commit('setPlayList',{
          index:index,
          list:list
        })
        this.$store.commit('play')
      }

    },filters:{
      musicmin:time=>{
        return parseInt((time/60))+':'+(time%60)
      }

    }
  }
</script>
<style scoped>
  .singer{
    display: inline-block;
    width: 10%;
  }

  ul>li{
    list-style: none;
    padding:5px;
  }
  ul>li:nth-child(odd){
    background-color: #F9F9F9;
  }
  ul>li img{
    vertical-align:middle;
    height: 80px;
  }
  .songlist-time{
    position: relative;
    top: -3px;
    width: 5%;
    color: #999;
    font-weight:300;
  }
  ul>li .songlist-time,
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
    font-weight: 400;
    font-size: 14px;
  }
  .sort{
    width: 5%;
    text-align: center;
    position: relative;
    top:4px;
    font-size: 24px;
  }
  .singer a{
    color: #333;
    text-decoration: none;
  }
  .songname{
    font-size: 14px;
    margin-left: 15px;
  }
  .songdesc{
    color: #999;
    margin-left:10px;
    font-size: 14px;
  }
  .pagination{
    padding:20px 0;
  }
</style>
