<template>
  <div class="inner">
    <v-loading v-if="loading"></v-loading>
    <div class="mod-data" v-if="!loading">
      <div class="data-cover">
        <img :src="albumImgUrl" alt="">
      </div>
      <div class="data-cont">
        <div class="data-name">
          {{album.dissname}}
        </div>
        <div class="data-singer">
          {{album.nick}}
        </div>
        <div class="data-info">
          <p>{{album.visitnum | listenCount}} 个人播放</p>
        </div>
      </div>
    </div>
    <div class="m-list" v-if="!loading">
      <ul>
        <li v-for="(item,index) in album.songlist" :key="index" @click="play(index)">
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
      </ul>
    </div>
  </div>
</template>
<script>
  import loading from './loading.vue';
  export default {
    data(){
      return{
        album:null,
        loading:true,
        mid:this.$route.params.id
      }
    },
    watch:{
      '$route':function () {
        this.showPage();
      }
    },
    components:{
      vLoading:loading
    },
    computed: {
      albumImgUrl () {
        return this.album !== null ? this.album.logo : null
      }
    },
    methods:{
      dateFormat(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }else{}
        return parseInt(date/60)+':'+(date%60);
      },
      showPage() {
        this.loading=true;
        this.mid = this.$route.params.id;
        console.log(this.mid);
        this.$store.dispatch('getCdList',this.mid).then((response) => {
          this.album = response.data.cdlist[0];
          this.loading=false;
        }).catch()
      },
      play(index) {
        var list = []
        this.album.songlist.forEach(item => {
          list.push({
            id: item.id,
            mid: item.mid,
            name: item.name,
            singer: item.singer,
            album: item.album
          })
        })
        this.$store.commit('setPlayList', {
          index: index,
          list: list
        })
        this.$store.commit('play')
      }

    },
    mounted(){
      this.showPage();
    },
    filters:{
      singerFilder: val => {
        if (typeof val === 'string') {
          return val
        } else if (val instanceof Array) {
          let singer = ''
          val.forEach(item => {
            singer = singer + item.name + '/'
          })
          return singer
        }
      },
      listenCount: num => {
        return Math.round(num / 1000) / 10 + '万'
      },
      musicmin:time=>{
        return parseInt(time/60)+":"+(parseInt(time%60) < 10?"0"+parseInt(time%60):parseInt(time%60))
      }
    }
  }
</script>
<style scoped>
  .inner{
    background-color: rgb(246,246,246);
    position: relative;
    margin: 0;
    padding: 0 200px;
  }

  img{
    position: absolute;
    left:200px;
    top:25px;
    width: 250px;
  }
  .data-cont{
    display: inline-block;
    padding: 50px 0 50px 300px;
    min-height: 200px;
  }
  .data-name{
    font-size: 31px;
    line-height: 60px;
    font-weight: 400;
    margin-right: 10px;
  }
  .data-singer{
    font-size: 16px;
    line-height:28px;
    color: #333;
  }
  .data-info{
    line-height: 28px;
    font-size: 14px;
  }

  ul li{
    list-style: none;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
  }
  ul li .cd-show,
  ul li .sort,
  ul li .album,
  ul li .singer{
    display: inline-block;
    vertical-align: bottom
  }

  ul li:nth-child(odd){
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

</style>
