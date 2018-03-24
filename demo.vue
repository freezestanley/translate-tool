<!--
      author: gongshuai
    descript: menu
   -->
<template>
  <div class="mask-page">
    <c_mask v-if="maskShow">
      <div class="wrapper">
        <div class="box-sider" @click="hide"></div>
        <div class="box">
          <div class="through">
            <div class="contentBox" v-for="(item, index) in items" :key="index">
              <adiveList :item="item" :showindex="showindex" @route-change="hide"></adiveList>
            </div>
          </div>
          <div class="tab">
            <div class="home">
              <div class="bar">
                <div @click="gohome">
                  <img src="~@/assets/image/adiveHome.png">
                  <div>首页</div>
                </div>
              </div>
            </div>
            <div class="schedule">
              <div class="bar">
                <div @click="goprogress">
                  <img src="~@/assets/image/adiveSchedule.png">
                  <div>投保进度</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </c_mask>
    <div class="arrow-left-box" v-else>
      <div class="arrow-left" @click="show"></div>
    </div>
  </div>
</template>
<script>
  import {ISMAKEADVIE} from '@/api'
  import resultRouter from '@/router/routerconf'
  import adiveList from './adiveList'
  import {
    ConfirmPlugin,
    TransferDomDirective as TransferDom
  } from 'vux'
  import Vue from 'vue'
  Vue.use(ConfirmPlugin)
  export default {
    name: 'sidebar',
    data () {
      return {
        showimg: false,
        items: [],
        pageNum: 1,
        maskShow: false,
        showindex: '',
        step: this.$route.meta.step
      }
    },
    created: function () {
      this.oninit()
    },
    watch: {
      '$route' (to, from) {
        this.getStep()
      }
    },
    props: ["id", "stepOn"],
    methods: {
      oninit () {
        this.getData()
        this.getStep()
      },
      goprogress () {
        window.location.href = '/web/progress?type=3'
      },
      gohome () {
        window.closeWebview(1)
      },
      getStep () {
        let step = this.$route.meta.step
        // 根据item.step识别当前进度 @zjq
        let item = this.items.find((item) => {
          if (item.step === step) {
            return item
          } else {
            return item.list.find(({value}) => value == step)
          }
        })
        item && (this.showindex = item.id)
      },
      show () {
        window.ts = this
        this.$root.$validator.validateAll().then(result => {
          console.log(result)
          console.log(this.$root.fields.dirty())
        })
        this.maskShow = true
      },
      hide () {
        this.maskShow = false
      },
      change () {
        if (this.showimg) {
          this.showimg = false
        } else {
          this.showimg = true
        }
      },
      getData () {
        // this.axios.get(ISMAKEADVIE).then((res) => {
        //   this.items = res.data.resultContent.items
        // }).then((err) => {
        //   throw new Error(err)
        //   console.log(err)
        // })
        // items 各节点添加 step 属性，用于在list 为空的情况下识别当前进度 @zjq
        this.items = [
          {
            "id": "0",
            "title": "制作建议书",
            "step": 1,
            "list": [
              {name: "录入客(13)户'11'~信息!,~，。：！、\.；", value: "制定保险计划11a", pathName: "recordCustomerInfor"},
              // {name: "选择主险", value: 2, pathName: "addmajor"},
              {name: "制定保险计划", value: 3, pathName: "makePlan"},
              {name: "预览建议书", value: 4, pathName: "previewsuggestion"}
            ]
          },
          {
            "id": "1",
            "title": "制作投保书",
            "step": 5,
            "list": [
              {name: "完善客户信息", value: 5, pathName: "supplementInsure"},
              {name: "选择受益人", value: 6, pathName: "beneficiary"},
//              {name: "补充投保信息", value: 7, pathName: "supplementInfo"},
              {name: "健康告知", value: 8, pathName: "notify"},
              {name: "代理人告知", value: 9, pathName: "announcement"},
              {name: "预览投保书", value: 10, pathName: "previewinsurance"}
            ]
          },
          {
            "id": "2",
            "title": "电子签名",
            "step": 11,
            "list": []
          },
          {
            "id": "3",
            "title": "支付保费",
            "step": 12,
            "list": []
          }
        ]
      }
    },
    components: {
      adiveList
    }
  }
</script>
<style lang='scss' rel="stylesheet/scss">
  @import '~@/assets/scss/function';

  .mask-page {
    /*height: 100%;*/
    /*position: relative;*/
    .wrapper {
      display: flex;
      height: 100%;
      .box-sider {
        flex: 1;
      }
      .box {
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: row-reverse;
        -webkit-flex-direction: row-reverse;
        flex-direction: row-reverse;
        width: rem-calc(320/2px);
        position: fixed;
        right: 0;
        height: 100%;
        .through {
          position: fixed;
          right: 0;
          top: 0;
          width: rem-calc(320/2px);
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          padding-top: rem-calc(35/2px);
          box-sizing: border-box;
          .content {
            padding: 0 rem-calc(32/2px) 0 rem-calc(30/2px);
            .title {
              color: #fff;
              font-size: rem-calc(30/2px);
              margin-bottom: rem-calc(40/2px);
              position: relative;
              .showimg {
                background: url("~@/assets/image/bottom.png") no-repeat;
                background-size: contain;
                background-position: center;
              }
              i {
                position: absolute;
                top: rem-calc(14/4px);
                right: 0;
                width: rem-calc(26/2px);
                height: rem-calc(14/2px);
                box-sizing: border-box;
                line-height: rem-calc(14/2px);
                background: url("~@/assets/image/top.png") no-repeat;
                background-size: contain;
                background-position: center;
                float: right;
              }
            }
            .list {
              color: #b1b1b1;
              .seled {
                color: #00adff;
                border-left: 1px solid #00b0ff;
              }
              .seled:before{
                background: #00b0ff;
              }
              position: relative;
              font-size: rem-calc(26/2px);
              padding-left: rem-calc(10/2px);
              div:nth-child(1) {
                padding-top: 0;
              }
              div:last-child {
                padding-bottom: 0;
                border-left: 0;
              }
              div {
                padding-left: rem-calc(23/2px);
                height: rem-calc(75/2px);
                border-left: 1px solid #b1b1b1;
                &:before {
                  content: '';
                  display: inline-block;
                  width: rem-calc(20/2px);
                  height: rem-calc(20/2px);
                  border-radius: rem-calc(20/4px);
                  background: #b1b1b1;
                  position: absolute;
                  left: 0;
                }
              }
            }
          }
        }
        .tab {
          width: rem-calc(320/2px);
          height: rem-calc(100/2px);
          background: #000;
          display: flex;
          flex-direction: row;
          font-size: rem-calc(30/2px);
          color: #bfbfbf;
          position: fixed;
          bottom: 0;
          right: 0;
          .home, .schedule {
            flex: 1;
            text-align: center;
            height: 100%;
            box-sizing: border-box;
            padding-top: rem-calc(16/2px);
            div {
              font-size: rem-calc(20/2px);
              img {
                height: rem-calc(36/2px);
                width: rem-calc(36/2px);
              }
              div {
                padding-top: rem-calc(10/2px);
              }
            }
          }
          a {
            font-size: rem-calc(20/2px);
            color: #bfbfbf;
            text-decoration: none;
          }
        }
      }
    }
    .arrow-left-box {
      position: fixed;
      top: 50%;
      right: 0%;
      margin: rem-calc(-20) 0 0 0;
      width: rem-calc(20);
      overflow-x: hidden;
      z-index: 999;
      .arrow-left {
        position: relative;
        width: rem-calc(40);
        height: rem-calc(40);
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        &:after {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: rem-calc(24);
          content: ' ';
          display: block;
          width: 0;
          height: 0;
          border-top: rem-calc(7) solid transparent;
          border-right: rem-calc(9) solid #ffffff;
          border-bottom: rem-calc(7) solid transparent;
        }
      }
    }
  }
</style>
