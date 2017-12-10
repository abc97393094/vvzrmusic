import Vue from 'vue'
import Router from 'vue-router'
import mymusic from '@/components/mymusic.vue'
import musichall from '@/components/musichall.vue'
import indexPage from '@/components/indexPage.vue'
import sortPage from '@/components/sortPage.vue'
import sortPageIndex from '@/components/sortPageIndex.vue'
import Album from '@/components/album.vue'
import Search from '@/components/clientSearch.vue'
import cdList from '@/components/cdList.vue'
import Vuex from 'vuex'

Vue.use(Router)
Vue.use(Vuex)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/musichall/index'
    },
    {
      path:'/musichall',
      component:musichall,
      children:[
        {
          path:'index',
          component:indexPage
        },
        {
          path:'sort',
          redirect:'/musichall/sort/4',
          component:sortPage,
          children:[{
            path:':id',
            name:'sort',
            component:sortPageIndex
          }]

        }]
    },
    {
      path:'/mymuisc',
      component:mymusic
    }
    ,{
      path: '/album/:id',
      name:'album',
      component: Album
    }
    ,{
      path: '/search/:id',
      name:'search',
      component: Search
    }
    ,{
      path: '/cdList/:id',
      name:'cdList',
      component: cdList
    }
  ]
})
