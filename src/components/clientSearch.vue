<template>
  <div class="inner">
    <div class="main">
      <div class="mod-search">
        <el-input placeholder="请输入内容" v-model="key" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" :loading="loading" @click="goSearch(key)"></el-button>
        </el-input>
      </div>
      <div class="result" v-if="album!=null">
        <div class="m-list-singer" v-if="album.singer!=null">
          <div class="singer-item" v-for="item in album.singer.itemlist">
            <img class="singer-img" :src="item.pic">
            <div class="singer-p">
              <p>{{item.name}}</p>
            </div>
          </div>
        </div>
        <div class="m-list-song">
          <el-table
            :data="album.song.itemlist"
            style="width: 100%;cursor: pointer"
            highlight-current-row>

            <el-table-column
              type="index"
              min-width="10%">
            </el-table-column>
            <el-table-column
              label="歌曲名"
              min-width="80%">
              <template scope="scope"><p @click=play(scope.$index)>{{ scope.row.name }}</p> </template>
            </el-table-column>
            <el-table-column
              prop="singer"
              label="歌手"
              min-width="10%">
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        searchModel: null,
        album: null,
        loading: false,
        key: null,
        currentRow: null
      }
    },
    methods: {
      goSearch(key) {
        this.key = key;
        this.loading = true;
        this.$store.dispatch('search', key).then((response) => {
          this.album = response.data.data
          console.log(this.album)
//          for (let i in this.album.list) {
//            for (let j in this.album.list[i].singer) {
//              if (typeof(this.album.list[i].singerName) == "undefined") {
//                this.album.list[i].singerName = this.album.list[i].singer[j].name
//              } else {
//                this.album.list[i].singerName += this.album.list[i].singer[j].name
//              }
//              if (j < this.album.list[i].singer.length - 1 && this.album.list[i].singer.length != 1) {
//                this.album.list[i].singerName += "/";
//              }
//            }
//          }
          this.loading = false;
        });
      },

      play(index) {
        this.$store.commit('setPlayList', {
          index: index,
          list: this.album.song.itemlist
        })
      }
    },
    created(){
      this.goSearch(this.$route.params.id);
    }
  }
</script>
<style scoped>

  .mod-search{
    text-align: center;
    padding: 50px 0;
  }
  .input-with-select{
    width: 50%;
  }
  .singer-img{
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
  }
  .singer-p{
    display: inline-block;
  }
  .singer-item{
    line-height:50px;
  }

</style>
