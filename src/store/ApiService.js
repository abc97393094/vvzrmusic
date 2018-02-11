import Vue from 'vue'
import axios from 'axios'
import jsonp from 'jsonp'
import API from '../config/api'

function apiFactory(api) {
  return (id = null,key=null) => Vue.http.jsonp(
    api.url,
    {
      params: api.params(id,key),
      jsonp: api.jsonp
    }
  )
}

export default {
  actions: {
    getRankSongs({}, id){
      return apiFactory(API.rank_songs)(id)
    },
    getRankList({}){
      return apiFactory(API.rank_list)()
    },
    getAlbum({}, id){
      return apiFactory(API.album)(id)
    },
    getSingerInfo({}, id){
      return apiFactory(API.singer_info)(id)
    },
    search({}, key){
      return apiFactory(API.search)(key)
    },
    newSearch({}, key){
      return apiFactory(API.newSearch)(key.key,key.start)
    },
    getHotKey({}){
      return apiFactory(API.hotkey)()
    },
    getRecommands({}){
      return apiFactory(API.first_page_data)()
    },
    getCdList({},id){
      return apiFactory(API.cd)(id)
    },
    getNewSong({},id){
      return Vue.http.jsonp('https://u.y.qq.com/cgi-bin/musicu.fcg?callback=recom7818074489534006&g_tk=5381&jsonpCallback=recom7818074489534006&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%7D%2C%22new_song%22%3A%7B%22module%22%3A%22QQMusic.MusichallServer%22%2C%22method%22%3A%22GetNewSong%22%2C%22param%22%3A%7B%22type%22%3A'+id+'%7D%7D%7D',{
        jsonp:'callback'
      })
    },
    getLyric({},id){
      return Vue.http.jsonp('https://api.darlin.me/music/lyric/'+id+'/',{
        jsonp:'callback'
      })
    },
    getGuid(){
      var t = (new Date).getUTCMilliseconds()
      var guid = Math.round(2147483647 * Math.random()) * t % 1e10
      return guid;
    },
    getKey({},guid){
      return apiFactory(API.Key)(guid)
    }
  }
}
