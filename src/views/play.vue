<template>
  <div id="play" ref="body">
    <div class="player-mask player-mask-image" :style="{backgroundImage:`url(${coverImgUrl})`}">
    </div>
    <div class="player-mask player-mask-color">
    </div>
    <header ref="header">
      <h1 class="logo">
        <a href="javascript:;" @click="closeModal">返回</a>
      </h1>
      <div class="right">
        <a href="javascript:;">登录</a>
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
        <ul class="song-list-item" :style="'height:'+listHeight">
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
          <li v-for="(item,index) in playList" class="item">
            <div class="song-name">
              {{item.name}}
              <div class="song-menu">
                <a href="javascript:;" class="menu-icon menu-icon-play" @click="playIndex(index)"></a>
                <a href="javascript:;" class="menu-icon menu-icon-down" @click="download(index)"></a>
                <a href="javascript:;" class="menu-icon menu-icon-del" @click="del(index)"></a>
              </div>
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
          <div class="song-info-name">
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
        window.onresize = this.formHeight;
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
      watch:{
        //监听变化
        mdShow:function (mdshow) {
          if(mdshow){
            this.formHeight();
          }
        }
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
        formHeight(){
          window.onresize = null;
          setTimeout(()=>{
            this.screenHeight = this.$refs.body.getBoundingClientRect().height;
            window.onresize = this.formHeight;
            let header = document.querySelector('header');
            let footer = document.querySelector('footer');
            console.log(1)
            this.listHeight = this.screenHeight-107-footer.offsetHeight-header.offsetHeight-41+'px';
          },400)
        },
        playIndex(index){
          this.$store.commit('playIndex',index);
        },
        download(index){
          let downUrl = 'http://dl.stream.qqmusic.qq.com/C400' + this.$store.state.PlayService.playList[index].mid + '.m4a?vkey=' + this.$store.state.PlayService.Key + '&guid=' + this.$store.state.PlayService.Guid + '&fromtag=999'
          let a = document.createElement('a');
          // a.download = "hello world.m4a"; 跨域不生效 等待解决
          a.href = downUrl;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        del(index){
          this.$store.commit('deleteFromPlayList',index);
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
    overflow: hidden;

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
    height: 5%;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 3;
    width: 1280px;
    min-width: 1280px;
    margin: 0 auto;
    .logo{
      a{
        font-size: 1.25rem !important;
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
    align-items: center;
    position: relative;
    z-index: 3;
    height: 85%;

    //公共样式
    .song-name{
      width: 63%;
    }
    .song-singer{
      width: 27%;
    }
    .time{
      width: 10%;
    }

    a{
      color: #fff;
      opacity: nth($opacity,1);
    }
    .song-list{
      width: 70%;
      a.iconfont{
        font-size: 36px !important;
      }
      li{
        display: flex;
        color: #fff;
        opacity: nth($opacity,1);
        line-height: 50px;
        border-top: solid 1px rgba(255,255,255,.1);
      }
      .toolbar{
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
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
      }
      .song-list-item{
        max-height: 800px;
        overflow-y: scroll;
        .song-name{
          position: relative;
        }
        .item{
          .menu-icon{
            background: url('https://y.gtimg.cn/mediastyle/yqq/img/icon_list_menu.png?max_age=2592000&v=4566a1a62ecad72fe9b9205d1ad62d2b');
            width: 36px;
            height: 36px;
            display: block;
            margin-right: 10px;
            opacity: .3 !important;
            &:hover{
              opacity: 1 !important;
            }
          }
          .menu-icon-play{
            background-position: -120px 0;
          }
          .menu-icon-down{
            background-position: -120px -120px;
          }
          .menu-icon-del{
            background-position: -120px -160px;
          }

          &:hover{
            .song-menu{
              display: flex;
              height: 100%;
              align-items: center;
            }
          }
        }
      }
      .song-menu{
        display: none;
        position: absolute;
        right: 20px;
        top: 0;
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
        font-size: 14px;

        div{
          padding: 3px;
        }
      }

   }

  }
  footer{
    width: 1280px;
    min-width: 1280px;
    height: 10%;
    margin: 0 auto;
    display: flex;
    position: relative;
    z-index: 3;
    align-content: center;
    a.iconfont{
      color: #fff;
      font-size: 50px !important;
      opacity: nth($opacity,1);
    }
    .prog{
      width: 50%;
      padding-left: 30px;
      .music-info{
        display: flex;
        justify-content: space-between;
        padding-top: 10px;
        color: rgba(255,255,255,.6);
      }
      .player-prog{
        position: relative;
        cursor: pointer;
        padding: 10px 0;
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
          top: 10px;
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
