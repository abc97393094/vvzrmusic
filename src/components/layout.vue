<template>
  <div>
    <zr-header v-if="!playShow"></zr-header>
      <router-view v-if="!playShow"></router-view>
      <transition name="play-slide">
        <play v-show="playShow" @close="hidden" @setPlayTime="setPlayTime"></play>
      </transition>
    <zr-footer v-if="!playShow"></zr-footer>
    <div :style="playShow?'visibility: hidden':''"  @click="showPlayList" id="play-bar">
      <i class="icon-icon-test iconfont" @click="playFront"></i>
      <i class="iconfont" :class="playing?'icon-icon-test1':'icon-icon-test2'" @click="tapButton"></i>
      <i class="icon-icon-test6 iconfont" @click="playNext"></i>
      <div class="play-bar-info">
        <audio id="music"
               ref="audio"
               :src="dataUrl"
               @timeupdate="updateTime"
               @ended="playContinue"
               autoplay></audio>
        <img class="play-bar-image" :src="coverImgUrl">
      </div>
      <p class="play-bar-text">
        <span class="song-name">{{song.name}}</span><br/>
        <span class="song-singer">{{song.singer | singer}}</span>
      </p>
      <el-progress :percentage="indicatorPosition" id="progbar" :show-text=false></el-progress>
    </div>
  </div>
</template>

<script>
  import zrHeader from './zrHeader.vue'
  import zrFooter from './zrFooter.vue'
  import play from '../views/play.vue'
  import Vue from 'vue'
  import * as def from '../config/def'
  import {mapMutations, mapState, mapGetters} from 'vuex'

  export default {
    data(){
      return {
        playShow:false,
        Key:null,
        Guid:null
      }
    },
    mounted() {
      document.body.removeChild(document.getElementById('loading'));
      this.$store.dispatch('getGuid').then((response) => {
        this.Guid = response;
        this.$store.dispatch('getKey', this.Guid).then((res) => {
          this.Key = res.data.key;
        })
      })
    },
    components: {
      zrHeader, zrFooter,play
    },
    methods: {
      tapButton(event) {
        event.preventDefault()
        this.playing ? this.pause() : this.play()
      },
      updateTime() {
        this.$store.commit('updateCurrentTime', parseInt(document.getElementById('music').currentTime))
      },
      ...mapMutations([
        'play', 'pause', 'playFront', 'playNext', 'playContinue'
      ]),
      updateTime() {
        this.$store.commit('updateCurrentTime', parseInt(document.getElementById('music').currentTime))
        this.$store.commit('updateDuration', parseInt(document.getElementById('music').duration))
      },
      hidden(){
        this.playShow = false;
      },
      showPlayList(event){
        event.preventDefault();
        this.playShow = true;
      },
      setPlayTime(val){
        console.log(val)
        this.$refs.audio.currentTime = parseInt(val / 100 * this.song.interval)
      }
    },
    computed: {
      ...mapGetters([
        'coverImgUrl', 'currentTime', 'duration'
      ]),
      ...mapState({
        indicatorPosition: state => parseInt(state.PlayService.currentTime / state.PlayService.duration * 100),
        playing: state => state.PlayService.playing,
        song: state => state.PlayService.song,
          dataUrl(state) {
          if(state.PlayService.song.mid !== undefined) {
            return 'http://dl.stream.qqmusic.qq.com/C200' + state.PlayService.song.mid + '.m4a?vkey=' + this.Key + '&guid=' + this.Guid + '&fromtag=999'
          }


        }
      })
    },
    filters: {
      singer: val => {
        if (typeof val === 'string') {
          return val
        } else if (val instanceof Array) {
          let singer = ''
          val.forEach(item => {
            singer = singer + item.name + ' '
          })
          return singer
        }
      }
    },
    watch: {
      playing(val) {
        if (val) {
          document.getElementById('music').play()
        } else {
          document.getElementById('music').pause()
        }
      }
    }

  }
</script>

<style>
  @import 'https://at.alicdn.com/t/font_498489_uk9sxpl9u91thuxr.css';

  * {
    margin: 0;
    padding: 0;
    font-family: poppin, Helvetica, Arial, sans-serif;
  }
  a{
    text-decoration: none;
  }
  li{
    list-style: none;
  }

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .el-row {
    margin-bottom: 20px;
  }

  :last-child {
    margin-bottom: 0;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .iconfont {
    font-size: 40px;
    vertical-align: middle;
    cursor: pointer;
  }

  #play-bar {
    position: fixed;
    width: 100%;
    text-align: center;
    height: 70px;
    left: 0;
    bottom: 0;
    box-shadow: 2px 2px 20px #333333;
    background: linear-gradient(rgba(64, 158, 255, .9), rgba(64, 158, 255, 1));
    color: #fff;
    z-index: 99999;
  }

  .play-bar-info {
    display: inline-block;
    padding-top: 10px;
  }

  .play-bar-image {
    width: 50px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 50%;
    animation: xz 15s infinite linear;
  }

  .play-bar-text {
    position: relative;
    top: 14px;
    display: inline-block;
  }

  .play-bar-text .song-singer {
    font-size: 12px;
    color: #8f8f8f;
  }

  #progbar {
    width: 100%;
    position: absolute;
    bottom: -4px;
    left: 0;
  }

  @keyframes xz {
    from {
      transform: rotate(0deg)
    }
    to {
      transform: rotate(360deg)
    }
  }
  .play-slide-enter-active {
    transition: all .3s ease;
  }

  .play-slide-leave-active {
    transition: all .3s ease-out;
  }

  .play-slide-enter, .play-slide-leave-active {
    transform: translateY(100vh);
  }
</style>
