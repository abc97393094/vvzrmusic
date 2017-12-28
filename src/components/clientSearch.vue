<template>
  <div class="inner">
    <div class="main">
      <div class="mod-search">
        <div class="search">
          <input type="text" v-model="key" placeholder="请输入内容" @input="inputFunc" @focus="focusFunc" @blur="blurFunc">
          <button class="el-icon-search" @click="goSearch(key,1)"></button>
          <div class="mod-search-result" :class="dope ? 'res-drop':''" v-if="smartSearch!=null">
            <div class="res-song" v-if="smartSearch.song!=null">
              <div class="search-tit">
                <i class="el-icon-star-on"></i>
                单曲
              </div>
              <ul>
                <li v-for="(item,index) in smartSearch.song.itemlist" @click="handleSelect(index)">
                  <span class="result-name">{{item.name}}</span>
                  <span class="result-singer">{{item.singer}}</span>
                </li>
              </ul>
            </div>
            <div class="res-singer" v-if="smartSearch.singer!=null">
              <div class="search-tit">
                <i class="el-icon-star-on"></i>
                歌手
              </div>
              <ul>
                <li v-for="(item,index) in smartSearch.singer.itemlist">
                  <span class="result-name">{{item.name}}</span>
                </li>
              </ul>
            </div>
            <div class="res-album" v-if="smartSearch.album!=null">
              <div class="search-tit">
                <i class="el-icon-star-on"></i>
                专辑
              </div>
              <ul>
                <li v-for="(item,index) in smartSearch.album.itemlist">
                  <span class="result-name">{{item.name}}</span>
                  <span class="result-singer">{{item.singer}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      <div class="result" v-if="searchContent!=null">
        <div class="m-list-singer" v-if="searchContent.singer!=null">
          <div class="singer-item" v-for="item in searchContent.singer.itemlist">
            <img class="singer-img" :src="item.pic">
            <div class="singer-p">
              <p>{{item.name}}</p>
            </div>
          </div>
        </div>
        <div class="m-list-song">

          <ul>
            <transition-group name="list" tag="div">
              <li v-for="(item,index) in searchContent.data.song.list" :key="index" @click="play(index)">
                <span style="font-weight: 300" class="sort" >{{index+1}}</span>
                <div class="cd-show">
                  <span class="songname">{{item.name}}</span>
                  <!--<span class="songdesc">{{item.data.albumdesc}}</span>-->
                </div>
                <div class="singer">
                <span v-for="(singername,index) in item.singer" class="artist">
                  <a href="">{{singername.name}}</a>
                  <span v-if="index < (item.singer.length - 1)"> / </span>
                </span>
                </div>
                <div class="album">
                  <span>{{item.album.name}}</span>
                </div>
                <span class="interval">{{item.interval | musicmin}}</span>
              </li>
            </transition-group>
          </ul>
        </div>
        <div class="dont-have" v-if="!haveMore">
          <p>再刷也没有了哦</p>
        </div>
      </div>
      <v-loading v-if="loading"></v-loading>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import loading from './loading.vue'
  import {mapMutations, mapState, mapGetters} from 'vuex'

  export default {
    data() {
      return {
        searchModel: null,
        searchContent: null,
        smartSearch:null,
        loading: false,
        key: null,
        currentRow: null,
        start:1,
        dope:false
      }
    },
    components:{
      vLoading:loading
    },
    computed:{
      haveMore(){
        return (this.start*20) < this.searchContent.data.song.totalnum;
      }
    },
    methods: {
      ...mapMutations([
        'play', 'pause', 'playFront', 'playNext', 'playContinue'
      ]),
      goSearch(key,start) {
        this.start=1;
        this.key = key;
        this.loading = true;
        this.$store.dispatch('newSearch', {key,start}).then((response) => {
          this.searchContent = response.data;
          this.loading = false;
        });
      },
      play(index) {
        this.$store.commit('setPlayList', {
          index: index,
          list: this.searchContent.data.song.list
        })
      },
      handleSelect(item) {
        this.$store.commit('addToPlayListAsNextPlay', this.smartSearch.song.itemlist[item]);
        this.playNext();
        this.key=this.smartSearch.song.itemlist[item].name.trim();
      },
      inputFunc(){
        this.$store.dispatch('search',this.key).then((response) => {
           this.smartSearch=response.data.data;
        })
      },
      focusFunc(){
        this.dope=true;
      },
      blurFunc(){
        this.dope=false;
      }

    },
    created(){
      this.goSearch(this.$route.params.id.trim(),this.start);
    },
    mounted(){
      let _this = this;
      let sw = true;

      window.addEventListener('scroll',function () {
        if(document.body.scrollTop + window.innerHeight >= document.body.offsetHeight){
          if(sw && _this.haveMore){
            sw=false;
            _this.loading=true; //显示加载动画
            _this.$store.dispatch('newSearch',{
              key : _this.key,
              start : ++_this.start
            } ).then((response) => {
              for(let value of response.data.data.song.list){
                _this.searchContent.data.song.list.push(value);
              }
              sw=true;
              _this.loading=false;//关闭加载动画
            });

          }
        }
      })

    },
    filters:{
      musicmin:time=>{
        return parseInt(time/60)+":"+(parseInt(time%60) < 10?"0"+parseInt(time%60):parseInt(time%60))
      }
    }
  }
</script>
<style scoped>
 /*搜索框样式*/

  .mod-search{
    text-align: center;
    padding: 50px 0;
  }
  .search{
    margin: 0 auto;
    width: 800px;
    border: 1px solid #d8dce5;
    position: relative;
  }
  .search > input{
    padding: 14px 20px;
    border-radius: 4px;
    border: none;
    width: calc(100% - 80px);
  }
  .search > button{
    width: 40px;
    height: 40px;
    background-color: #fff;
    border: none;
    font-size: 16px;
    float: right;
  }
 .search > button:focus{
   outline: none;
 }
  /*显示*/
 .res-drop{
   visibility: visible !important;
   max-height: 800px !important;
 }
 /*搜索框联想*/
 .mod-search-result{
   position: absolute;
   top:46px;
   left:0;
   width: 800px;
   background-color: #fff;
   /*border: 1px solid #d8dce5;*/
   visibility: hidden;
   max-height: 0;
   transition: all .5s;
 }

  .mod-search-result > div{
    position: relative;
  }
  .mod-search-result ul > li{
    list-style: none;
    text-align: left;
    margin-left: 100px;
    padding:8px 0 8px 30px;
    color: #111;
    font-weight: 300;
    font-size: 16px;
  }
 .mod-search-result ul > li:hover{
   background-color: rgba(64, 158, 255, .9);
 }
 .mod-search-result ul > li:hover .result-singer{
   color: rgba(255,255,255,.8);
 }
 .mod-search-result ul > li > .result-singer{
   color: #999;
   padding-left: 8px;
 }
  .search-tit{
    position: absolute;
    top: 5px;
    left: 10px;
    color: #777;
  }

  .singer-img{
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
  }
  .singer{
    width: 10%;
  }
  .result{
    font-size: 14px;
  }
  .search-singer {
    color: #999;
  }

  /*搜索显示页*/
  .result ul li{
    list-style: none;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
  }
  .result ul li .cd-show,
  .result ul li .sort,
  .result ul li .album,
  .result ul li .singer{
    display: inline-block;
    vertical-align: bottom
  }

  .result ul li:nth-child(odd){
    background-color: #fbfbfd;
  }
  .cd-show{
    width: 35%;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
  }
  .singer,
  .album{
    width: 25%;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
    font-weight: 400;
  }
  .sort{
    width: 5%;
    text-align: center;

  }
  .singer a{
    color: #333;
    text-decoration: none;
  }
  .songname{
    margin-left: 15px;
  }
  .interval{
    float: right;
    margin-right: 20px;
  }

  .dont-have{
    text-align: center;
    padding: 40px 0;
    color: #666;
  }

  /*animate*/
  .list-enter-active,
  .list-leave-active {
    transition: all 1s;
  }
  .list-enter,
  .list-leave-to{
    opacity: 0;
    transform: translateX(30px);
  }

</style>
