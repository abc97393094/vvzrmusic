import Vue from 'vue'

import API from '../config/api'

function apiFactory(api) {
  return (id = null) => Vue.http.jsonp(
    api.url,
    {
      params: api.params(id),
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
