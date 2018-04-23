<template>
  <div id="app">
    <vheader :seller="seller"></vheader>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods" tag="div">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" tag="div">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller" tag="div">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import vheader from './components/header/header';
  export default {
    name: 'App',
    data() {
      return {
        seller: {}
      };
    },
    created() {
      this.$http.get('/api/seller').then((res) => {
          this.seller = res.body;
      });
    },
    components: {vheader}
  };
</script>
<style lang="less">
  @import './common/less/scale.less';

  #app {
    width: 100%;
    height: 100%;
    .tab {
      width: 100%;
      height: 40px;
      line-height: 40px;
      display: flex;
      .border-1px(rgba(7, 17, 27, .1));
      .tab-item {
        flex: 1;
        text-align: center;
        & > div {
          font-size: 14px;
          color: rgb(77, 85, 93);
          &.ac {
            color: rgb(240, 20, 20);
          }
        }
      }
    }
  }
</style>
