<template>
  <div>
    <div class="swiper" :style="'height:'+swiperHeight">
      <!--<el-carousel height="360px" type="card">-->
        <!--<el-carousel-item v-for="item in slider" v-if="item.type!==3002">-->
          <!--<router-link tag="img" :src="item.pic" :to="'/album/'+item.id">-->
          <!--</router-link>-->
        <!--</el-carousel-item>-->
      <!--</el-carousel>-->
      <transition-group name="list" tag="ul" class="ban-swiper">
        <li ref="li" class="ban-swiper-item" v-for="(item,index) in newSlider" :key="index" v-show="index==swiperIndex">
          <router-link tag="img" :src="item.pic" :to="'/album/'+item.id">
          </router-link>
        </li>
      </transition-group>
      <ul class="new-swiper" >
        <li class="title">新歌推荐</li>

          <li v-for="(item,index) in newSong.SongList">
            <img v-lazy="'http://y.gtimg.cn/music/photo_new/T002R300x300M000'+item.album.mid+'.jpg?max_age=2592000'" alt="">
            <div class="song-desc">
              <p>{{item.title}}</p>
              <p>{{item.singer | singer}}</p>
            </div>
          </li>


      </ul>
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
        newSlider:[],
        songList:[],
        swiperIndex:0,
        timer:null,
        swiperHeight:'300px',
        newSong:{
          SongList:[],
          nowIndex:0
        }
      }
    },
    methods:{
      autoPlay(){
        this.swiperIndex++;
        if(this.swiperIndex > this.newSlider.length -1){
          this.swiperIndex = 0;
        }
      },
      autoHeight(){
        this.$refs.li.forEach(item=>{
          if(item.offsetHeight != 0){
            this.swiperHeight = item.offsetHeight+'px';
          }
        })
      },
      onresize(){
        window.onresize=null;
        setTimeout(()=>{
          this.autoHeight();
          window.onresize = this.onresize();
        },500)
      }
    },
    created(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          var that = this;
          this.autoHeight();
          window.onresize=that.onresize();
        },300);

        this.timer = setInterval(()=>{
          this.autoPlay();
        },3000);
      })
    },
    mounted(){
      this.$store.dispatch('getRecommands').then((response) => {
        this.slider = response.data.data.focus;
        this.slider.forEach(item=>{
          if(item.type!=3002){
            this.newSlider.push(item);
          }
        });
        this.songList = response.data.data.hotdiss.list
        this.loading=false;
      });
      this.$store.dispatch('getNewSong',1).then(response=>{
        this.newSong.SongList = response.data.new_song.data.song_list
      });

    },
    filters: {
      listenCount: num => Math.round(num / 1000) / 10 + '万'
    }

  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .swiper{
    overflow: hidden;
    display: flex;
    justify-content: center;
    position: relative;
    ::-webkit-scrollbar{
      width: 8px;

    }
    ::-webkit-scrollbar-thumb{
      background-color: rgba(0,0,0,.6);
      border-radius: 5px;
    }
    .list-enter-active,
    .list-leave-active{
      transition: opacity .8s;
    }
    .list-enter,
    .list-leave-to{
      opacity: 0;
    }

    .ban-swiper{
      font-size: 0;
      display: flex;
      width: 80%;
      position: relative;
      li{
        position: absolute;
        width: 100%;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .new-swiper{
      height: 100%;
      overflow-y: scroll;
      position: absolute;
      top: 0;
      right: 10%;
      opacity: .9;
      li.title{
        height: 50px;
        letter-spacing: 10px;
        font-size: 24px;
        justify-content: center;
        font-weight: 700;
      }
      li{
        height: 20%;
        display: flex;
        align-items: center;
        background-color: rgba(255,255,255,.6);
        padding: 20px;
        transition: all .3s;
        .song-desc{
          padding-left: 10px;
        }
        p{
          font-size: 1em;
        }
        &:hover{
          position: relative;
          z-index: 9;
          box-shadow: 2px 4px 30px rgba(0,0,0,0.1);

        }
      }
      img{
        height: 100%;
        border-radius: 50%;
      }
    }
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
