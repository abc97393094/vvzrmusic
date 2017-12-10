<template>
  <div>
    <div class="swiper">
      <el-carousel height="360px" type="card">
        <el-carousel-item v-for="item in slider" v-if="item.type!==3002">
          <router-link tag="img" :src="item.pic" :to="'/album/'+item.id">
          </router-link>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="recommend">
      <h2>歌单推荐</h2>
      <div class="play-list">
        <ul>
          <router-link tag="li" v-for="(item,index) in this._.slice(songList,0,5)" :to="'/cdList/'+item.dissid">
            <div class="img">
              <img :src="item.imgurl" alt="">
            </div>

            <p>{{item.dissname}}</p>
            <div class="playlist-other">
              播放量：{{item.listennum | listenCount}}
            </div>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="recommend hot-recommend">
      <h2>热门歌单</h2>
      <div class="play-list">
        <ul>
          <router-link tag="li" v-for="(item,index) in this._.slice(songList,5,10)" :to="'/cdList/'+item.dissid">
            <div class="img">
              <img :src="item.imgurl" alt="">
            </div>

            <p>{{item.dissname}}</p>
            <div class="playlist-other">
              播放量：{{item.listennum | listenCount}}
            </div>
          </router-link>
        </ul>
      </div>
    </div>
  </div>


</template>
<script>
  export default {
    data(){
      return{
        slider: [],
        songList:[]
      }
    },
    created(){
      this.$store.dispatch('getRecommands').then((response) => {
        this.slider = response.data.data.focus
        this.songList = response.data.data.hotdiss.list
        this.loading=false;
      }, (responce) => {
      })
    },
    filters: {
      listenCount: num => Math.round(num / 1000) / 10 + '万'
    }

  }
</script>
<style>
  h3{
    text-align: center;
  }
  .el-carousel__item img {
    height:100%;
    width:100%;
  }
  .recommend{
    background-color: rgba(0,0,0,.02);
    padding:30px 0px;
  }
  .hot-recommend{
    background-color: rgba(0,0,0,.05);
  }
  .recommend h2{
    letter-spacing: 10px;
    font-size: 30px;
    text-align: center;
    font-weight:500;
    padding-bottom: 30px;
  }
  .play-list{
    margin: 0 auto;
    text-align: center;
  }
  .play-list > ul{
    display: inline-block;
    width: 80%;
  }
  .play-list > ul > li{
    width: 20%;
    padding:10px;
    float: left;
    list-style: none;
    box-sizing: border-box;
    cursor: pointer;
  }
  .play-list > ul > li .img{
    overflow: hidden;
  }
  .play-list > ul > li img{
    width:100%;
    overflow: hidden;
    transition: all .4s;
  }
  .play-list > ul > li img:hover{
    transform: scale(1.1);
  }
  .play-list > ul > li p{
    text-align: left;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 14px;
  }
  .play-list > ul > li .playlist-other{
    color: #999;
    text-align: left;
    font-size: 14px;
  }
</style>
