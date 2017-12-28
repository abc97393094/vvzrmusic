<template>
  <div>
    <div class="footer">
      <div class="footer_copyright">
        <p>
          <a v-for="item in copyright" :href="item.path">{{item.title}}</a>
        </p>
        <p>
          <a href="#">Copyright © 2017</a>
        </p>
        <p>
          <a href="#">粤ICP备XXXXXXXXXXXXXXXX</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        copyright:[{
          title:"关于我",
          path:'/'
        },{
          title:"about me",
          path:'/'
        },{
          title:"服务条款",
          path:'/'
        },{
          title:"用户服务协议",
          path:'/'
        },{
          title:"隐私政策",
          path:'/'
        },{
          title:"数据采集说明",
          path:'/'
        }]
      }
    }
  }
</script>
<style scoped>
  .footer{
    background-color: #f7fbfd;
    width: 100%;
    padding:50px 0 120px 0;
  }
  p{
    text-align: center;
  }
  p>a{
    font-size: 12px;
    color: #666;
    padding:0 5px;
  }
</style>
