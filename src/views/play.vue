<template>
  <div id="play" ref="body">
    <div class="player-mask player-mask-image" :style="{backgroundImage:`url(${coverImgUrl})`}">
    </div>
    <div class="player-mask player-mask-color">
    </div>
    <header ref="header">
      <h1 class="logo">
        <a href="javascript:;" @click="closeModal">温小云音乐</a>
      </h1>
      <div class="right">
        <a href="#">登录</a>
      </div>
    </header>

    <div class="play-main">
      <div class="song-list">
        <div ref="toolbar" class="toolbar">
          <a href="javascript:;">收藏</a>
          <a href="javascript:;">下载</a>
          <a href="javascript:;">删除</a>
          <a href="javascript:;">清空列表</a>
        </div>
        <ul class="song-list-header">
          <li class="song-name">
            <div >
              歌曲名
            </div>
          </li>
          <li class="song-singer">
            <div>
              歌手
            </div>
          </li>
          <li class="time">
            <div>
              时间
            </div>
          </li>
        </ul>
        <ul class="song-list-item" :style="'height:'+listHeight">
          <li v-for="(item,index) in playList">
            <div class="song-name">
              {{item.name}}
            </div>
            <div class="song-singer">
              {{item.singer | singer}}
            </div>
            <div class="time">
              {{item.interval | musicmin}}
            </div>
          </li>

        </ul>
      </div>
      <div class="song-info" v-if="song!=null">
        <div class="album-cover">
          <img :src="coverImgUrl" alt="">
        </div>
        <div class="album-info">
          <div class="song-name">
            歌曲名：
            <a href="javascript:;">{{song.name}}</a>
          </div>
          <div class="singer-info">
            歌手名：
            <a href="javascript:;">{{song.singer | singer}}</a>
          </div>
        </div>
        <div class="lyric">
          <lyric :songid="song.id" :currentTime="currentTime"></lyric>
        </div>
      </div>
    </div>
    <footer>
      <a href="javascript:;" class="icon-icon-test iconfont" @click="playFront"></a>
      <a href="javascript:;" class="iconfont" :class="playing?'icon-icon-test1':'icon-icon-test2'" @click="tapButton"></a>
      <a href="javascript:;" class="icon-icon-test6 iconfont" @click="playNext"></a>
      <div class="prog">
        <div class="music-info">
          <div class="song-info">
            <a href="javascript:;">{{song.name}}</a> -
            <a href="javascript:;">{{song.singer | singer}}</a>
          </div>
          <div class="time">
            <span>{{currentTime}}</span>
            /
            <span>{{song.interval | musicmin}}</span>
          </div>
        </div>
        <div class="player-prog" @click="setPlayTime">
          <div class="progress-load">
          </div>
          <div class="progress-play" :style="{width:indicatorPosition+'%'}">
            <i class="dot"></i>
          </div>
        </div>
      </div>

    </footer>
  </div>
</template>

<script>
  import {mapMutations, mapState, mapGetters} from 'vuex'
  import Lyric from '../components/Lyric'
    export default {
      props:["mdShow"],
      components:{
        Lyric
      },
      data(){
        return{
          screenHeight: null,
          resizeTimer:false,
          listHeight:0
        }
      },
      mounted(){
        const that=this;
        const resizeFunction = ()=>{
          that.resizeTimer = true;
          window.onresize = null;
          //resize无需频繁触发
          setTimeout(()=>{
            that.screenHeight = this.$refs.body.getBoundingClientRect().height;
            window.onresize = resizeFunction;
            that.listHeight = that.screenHeight-107-50+'px';

          },400)
        }
        window.onresize = resizeFunction;
        resizeFunction();
      },
      computed:{
        ...mapState({
          playList:state=>state.PlayService.playList,
          song: state => state.PlayService.song,
          playing: state => state.PlayService.playing,
          indicatorPosition: state => parseInt(state.PlayService.currentTime / state.PlayService.duration * 100)
        }),
        ...mapGetters([
          'currentTime', 'duration','coverImgUrl'
        ])
      },
      methods:{
        tapButton(event) {
          event.preventDefault()
          this.playing ? this.pause() : this.play()
        },
        closeModal(){
          this.$emit("close");
        },
        setPlayTime(e){
          let prog = document.querySelector('.progress-load');
          // let val = ((e.offsetX - prog.getBoundingClientRect().left) / prog.offsetWidth)*100; //百分比
          let val = (e.offsetX / prog.offsetWidth)*100; //百分比
          this.$emit("setPlayTime",val);
        },
        ...mapMutations([
          'play', 'pause', 'playFront', 'playNext', 'playContinue'
        ])
      }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  $fontsize : 12px 14px 16px;
  $fontweight:200 300 700;
  $opacity : .6 .8;
  $bgc : rgb(64, 158, 255);
  #play{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left:0;
    background-color: rgb(20, 44, 73);
    font-family: poppin;

    ::-webkit-scrollbar{
      width: 8px;

    }
    ::-webkit-scrollbar-thumb{
      background-color: rgba(0,0,0,.1);
      border-radius: 5px;
    }
    a{
      font-weight: nth($fontweight,1);
      font-size: nth($fontsize,2);
      color: #fff;
      opacity: nth($opacity,1);
    }


  }

  header{
    display: flex;
    padding: 20px;
    justify-content: space-between;
    line-height: 1.25em;
    position: relative;
    z-index: 3;

    .logo{
      a{
        font-size: 1.25rem;
      }
    }
  }
  .player-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .player-mask-image{
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(65px);
    opacity: nth($opacity,1);
  }
  .player-mask-color{
    background-color: rgba(0,0,0,.35);
    z-index: 2;
  }
  .play-main{
    width: 1280px;
    min-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 3;

    a{
      color: #fff;
      opacity: nth($opacity,1);
    }
    .song-list{
      width: 70%;
      li{
        display: flex;
        color: #fff;
        opacity: nth($opacity,1);
        line-height: 50px;
        .song-name{
          width: 68%;
        }
        .song-singer{
          width: 26%;
        }
        .time{
          width: 5%;
        }

      }
      .toolbar{
        display: flex;
        justify-content: space-between;
        a{
          border: 1px solid rgba(255,255,255,.3);
          width: 24%;
          padding:10px 0;
          text-align: center;
          &:hover{
            opacity: nth($opacity,2);
          }
        }

      }
      .song-list-header{
        display: flex;
        .song-name{
          width: 68%;
        }
        .song-singer{
          width: 26%;
        }
        .time{
          width: 5%;
        }
      }
      .song-list-item{
        max-height: 600px;
        overflow-y: scroll;
      }
    }
    .song-info{
      width: 20%;
      text-align: center;
      color: rgba(255,255,255,.3);

      .album-cover{
        width: 100%;
        img{
          width: 100%;
        }
      }

      .album-info{
        padding: 30px 0;

        div{
          padding: 3px;
        }
      }

   }

  }
  footer{
    width: 1280px;
    min-width: 1280px;
    margin: 0 auto;
    display: flex;
    position: relative;
    z-index: 3;
    align-content: center;
    a.iconfont{
      color: #fff;
      font-size: 36px !important;
      opacity: nth($opacity,1);
    }
    .prog{
      width: 50%;
      padding-left: 30px;
      .music-info{
        display: flex;
        justify-content: space-between;
        color: rgba(255,255,255,.6);
      }
      .player-prog{
        position: relative;
        cursor: pointer;
        padding: 5px 0;
        .progress-load{
          height: 2px;
          background-color: rgba(255,255,225,.2);
          width: 100%;
        }
        /*播放进度*/
        .progress-play{
          height: 2px;
          background-color: rgba(255,255,225,.8);
          position: absolute;
          top: 5px;
          left: 0;
          .dot{
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            opacity: 1;
            background-color: #fff;
            position: absolute;
            top: -4px;
            right: -4px;
            &:before{
              content: ' ';
            }
          }
        }
      }

    }


  }
</style>
