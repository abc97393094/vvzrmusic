<template>
  <div class="inner">
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
      <el-table
        :data="album.songlist"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="歌曲名"
          min-width="65%">
          <template scope="scope"><p @click=play(scope.$index)>{{ scope.row.name }}</p> </template>
        </el-table-column>
        <el-table-column
          prop="singerName"
          label="歌手"
          min-width="25%">
        </el-table-column>

        <el-table-column
          prop="interval"
          :formatter="dateFormat"
          label="时长"
          min-width="10%">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
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
          for(let i in this.album.songlist){
            for(let j in this.album.songlist[i].singer){
              if(typeof(this.album.songlist[i].singerName) == "undefined"){
                this.album.songlist[i].singerName = this.album.songlist[i].singer[j].name
              }else{
                this.album.songlist[i].singerName += this.album.songlist[i].singer[j].name
              }
              if(j < this.album.songlist[i].singer.length-1 && this.album.songlist[i].singer.length!=1){
                this.album.songlist[i].singerName += "/";
              }
            }
          }
        }).catch()
      },
      play(index) {
        console.log(this.album);
        var list = []
        this.album.list.forEach(item => {
          list.push({
            id: item.songid,
            mid: item.songmid,
            name: item.songorig,
            singer: item.singer,
            albummid: item.albummid
          })
        })
        this.$store.commit('setPlayList', {
          index: index,
          list: list
        })
        this.$store.commit('play')
      },
      created(){
        this.showPage()
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
        }
      }

    },
    created(){
      this.showPage();
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
</style>
