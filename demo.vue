<!--
      descript: 受益人信息
        author: gongshuai
        param:

-->
<template>
  <div class="beneficiaryInfo-page">
    <div class="base-info">
      <div class="item-head">
        <span>受益人信息</span>
        <div class="selectIcon">
          <span class="icon icon-addPerson" @click="importConnect">导入</span>
          <span class="icon icon-scan" @click="scan">扫描</span>
        </div>
      </div>
      <ul v-if="relationship">
        <li>
          <span class="name">姓名</span>
          <input type="text" class="input" maxlength="30" v-model.trim="form.name" placeholder="请输入姓名"
                 v-validate:name.initial="'required'" name="name" data-vv-as="请输入姓名"
                 :class="{'is-danger': errors.has('name') }">
        </li>
        <li>
          <span class="name">性别</span>
          <div class="_input">
            <c_gender @Click="checkgander" :gender="form.gender"></c_gender>
          </div>
        </li>
        <li>
          <span class="name">是否投保人</span>
          <div class="_input">
            <!--<c_radio @Click="checkedSelf" :checked="form.self"></c_radio>-->
            <c_radioBlock v-model.trim = "form.self" :checked="false"></c_radioBlock>
          </div>
        </li>
        <li>
          <span class="name">出生日期</span>
          <div class="input input_a">
            <datetime @on-change="cardtime"
                      clear-text=""
                      :placeholder="cardBrith.detime"
                      v-model.trim="form.birthday"
                      format="YYYY-MM-DD"
                      :title="timeTitle"
                      confirm-text="确定"
                      cancel-text="取消"
                      :start-date="cardBrith.stime"
                      :end-date="cardBrith.etime"
                      :min-year="cardBrith.minyear"
                      :max-year="cardBrith.maxyear"
            >
            </datetime>
            <input
              class="hiddenInput"
              type="hidden"
              placeholder=""
              name="birthday"
              v-model.trim="form.birthday[0]"
              v-validate
              data-vv-as="请选择出生日期"
              data-vv-rules="required">
          </div>
        </li>
        <li>
          <popup-picker title="与被保险人关系" :data="relationList" @on-hide="onHide()" placeholder="请选择与被保险人关系"
                        @on-change="onChange" v-model.trim="form.relation"></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="relation"
            v-model.trim="form.relation[0]"
            v-validate
            data-vv-as="请选择与被保险人关系"
            data-vv-rules="required">
        </li>
        <li v-if="hascardKind">
          <span class="name">证件类型</span>
          <span type="text" class="input" v-if="form.cardKind">{{form.cardKind[0]}}</span>
        </li>
        <li v-else>
          <popup-picker title="证件类型" :data="cardKindList" @on-hide="onHide('cardKind')" placeholder="请选择证件类型"
                        @on-change="onChange" v-model.trim="form.cardKind"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="cardKind"
            v-model.trim="form.cardKind"
            v-validate
            data-vv-as="请选择证件类型"
            data-vv-rules="required">
        </li>
        <li>
          <span class="name">证件号码</span>
          <span type="text" class="input" v-if="hascardKind">{{form.cardNum}}</span>
          <input type="text" class="input" maxlength="30" v-model.trim="form.cardNum" placeholder="请输入证件号码"
                 v-validate:cardNum.initial="'required|idcard'" data-vv-as="请输入证件号码" name="cardNum"
                 :class="{'is-danger': errors.has('cardNum') }" v-else>
        </li>
        <li>
          <span class="name">有效期至</span>
          <div class="input">
            <datetime @on-change="cardtime"
                      clear-text=""
                      :placeholder="card.detime"
                      v-model.trim="form.indate"
                      format="YYYY-MM-DD"
                      :title="timeTitle"
                      confirm-text="确定"
                      cancel-text="取消"
                      :start-date="card.stime"
                      :end-date="card.etime"
                      :min-year="card.minyear"
                      :max-year="card.maxyear"
            >
            </datetime>
            <input
              class="hiddenInput"
              type="hidden"
              placeholder=""
              name="indate"
              v-model.trim="form.indate"
              v-validate
              data-vv-as="请选择有效期"
              data-vv-rules="required">
          </div>
          <div class="upload-img" @click="indate">
            <span class="icon-cricle" :class="{active: selected}"></span>
            <span class="icon-text" :class="{'icon-text-active': selected}">长期</span>
          </div>
        </li>
        <li v-if="hasnationality">
          <span class="name">国籍</span>
          <span type="text" class="input">{{form.nationality}}</span>
        </li>
        <li v-else>
          <popup-picker title="国籍" :data="nationalityList" @on-hide="onHide('nationality')" placeholder="请选择证件类型"
                        @on-change="onChange" v-model.trim="form.nationality"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="nationality"
            v-model.trim="form.nationality[0]"
            v-validate
            data-vv-as="请选择国籍"
            data-vv-rules="required">
        </li>
        <li>
          <popup-picker title="受益顺序" :data="beneficialOrderList" @on-hide="onHide()" placeholder="请选择"
                        @on-change="onChange" v-model.trim="form.beneficialOrder"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="beneficialOrder"
            v-model.trim="form.beneficialOrder[0]"
            v-validate
            data-vv-as="请选择受益顺序"
            data-vv-rules="required">
        </li>
        <li>
          <span class="name">受益比例</span>
          <input type="text" class="input" maxlength="30" v-model="form.beneficialProportion" placeholder="请输入受益比例"
                 v-validate:beneficialProportion.initial="'required|decimal|between:0, 100'" data-vv-as="请输入受益比例" name="beneficialProportion"
                 :class="{'is-danger': errors.has('beneficialProportion') }">
          <span>%</span>
        </li>
      </ul>
      <ul v-else>
        <li>
          <span class="name">姓名</span>
          <input type="text" class="input" maxlength="30" v-model.trim="form.name" placeholder="请输入姓名"
                 v-validate:name.initial="'required'" name="name" data-vv-as="请输入姓名"
                 :class="{'is-danger': errors.has('name') }">
        </li>
        <li>
          <span class="name">性别</span>
          <div class="_input">
            <c_gender @Click="checkgander" :gender="form.gender"></c_gender>
          </div>
        </li>
        <li>
          <span class="name">是否投保人</span>
          <div class="_input">
            <!--<c_radio @Click="checkedSelf" :checked="form.self"></c_radio>-->
            <c_radioBlock v-model.trim = "form.self" :checked="false"></c_radioBlock>
          </div>
        </li>
        <li>
          <span class="name">出生日期</span>
          <div class="input input_a">
            <datetime @on-change="cardtime"
                      clear-text=""
                      :placeholder="cardBrith.detime"
                      v-model.trim="form.birthday"
                      format="YYYY-MM-DD"
                      :title="timeTitle"
                      confirm-text="确定"
                      cancel-text="取消"
                      :start-date="cardBrith.stime"
                      :end-date="cardBrith.etime"
                      :min-year="cardBrith.minyear"
                      :max-year="cardBrith.maxyear"
            >
            </datetime>
            <input
              class="hiddenInput"
              type="hidden"
              placeholder=""
              name="birthday"
              v-model.trim="form.birthday[0]"
              v-validate
              data-vv-as="请选择出生日期"
              data-vv-rules="required">
          </div>
        </li>
        <li>
          <popup-picker title="与被保险人关系" :data="relationList" @on-hide="onHide()" placeholder="请选择与被保险人关系"
                        @on-change="onChange" v-model.trim="form.relation"></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="relation"
            v-model.trim="form.relation[0]"
            v-validate
            data-vv-as="请选择与被保险人关系"
            data-vv-rules="required">
        </li>
        <li v-if="hascardKind">
          <span class="name">证件类型</span>
          <span type="text" class="input" v-if="form.cardKind">{{form.cardKind[0]}}</span>
        </li>
        <li v-else>
          <popup-picker title="证件类型" :data="cardKindList" @on-hide="onHide('cardKind')" placeholder="请选择证件类型"
                        @on-change="onChange" v-model.trim="form.cardKind"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="cardKind"
            v-model.trim="form.cardKind"
            v-validate
            data-vv-as="请选择证件类型"
            data-vv-rules="required">
        </li>
        <li>
          <span class="name">证件号码</span>
          <span type="text" class="input" v-if="hascardKind">{{form.cardNum}}</span>
          <input type="text" class="input" maxlength="30" v-model.trim="form.cardNum" placeholder="请输入证件号码"
                 v-validate:cardNum.initial="'required|idcard'" data-vv-as="请输入证件号码" name="cardNum"
                 :class="{'is-danger': errors.has('cardNum') }" v-else>
        </li>
        <li>
          <span class="name">有效期至</span>
          <div class="input">
            <datetime @on-change="cardtime"
                      clear-text=""
                      :placeholder="card.detime"
                      v-model.trim="form.indate"
                      format="YYYY-MM-DD"
                      :title="timeTitle"
                      confirm-text="确定"
                      cancel-text="取消"
                      :start-date="card.stime"
                      :end-date="card.etime"
                      :min-year="card.minyear"
                      :max-year="card.maxyear"
            >
            </datetime>
            <input
              class="hiddenInput"
              type="hidden"
              placeholder=""
              name="indate"
              v-model.trim="form.indate"
              v-validate
              data-vv-as="请选择有效期"
              data-vv-rules="required">
          </div>
          <div class="upload-img" @click="indate">
            <span class="icon-cricle" :class="{active: selected}"></span>
            <span class="icon-text" :class="{'icon-text-active': selected}">长期</span>
          </div>
        </li>
        <li v-if="hasnationality">
          <span class="name">国籍</span>
          <span type="text" class="input">{{form.nationality}}</span>
        </li>
        <li v-else>
          <popup-picker title="国籍" :data="nationalityList" @on-hide="onHide('nationality')" placeholder="请选择证件类型"
                        @on-change="onChange" v-model.trim="form.nationality"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="nationality"
            v-model.trim="form.nationality[0]"
            v-validate
            data-vv-as="请选择国籍"
            data-vv-rules="required">
        </li>

        <li>
          <span class="name">职业</span>
          <input type="text" class="input" maxlength="30" v-model="form.jobs" placeholder="请输入职业"
                 v-validate:jobs.initial="'required'" data-vv-as="请输入职业" name="jobs"
                 :class="{'is-danger': errors.has('jobs') }">
        </li>
        <li>
          <span class="name">手机号码</span>
          <input type="tel" class="input" maxlength="30" v-maxLength v-model.trim="form.mobilphone" placeholder="请输入手机号码"
                 v-validate:tel.initial="'required'" data-vv-as="请输入手机号码" name="tel"
                 :class="{'is-danger': errors.has('tel') }">
        </li>
        <li class="address-li">
          <x-address title="地址" v-model.trim="form.address" :list="addressData"
                     placeholder="省 /市 /区"></x-address>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="address"
            v-model.trim="form.address[0]"
            v-validate
            data-vv-as="请选择地址"
            data-vv-rules="required">
        </li>
        <li>
          <span class="name">详细地址</span>
          <input type="text" class="input" maxlength="30" v-model.trim="form.addressDetail" placeholder="请输入街道门牌信息"
                 v-validate:addressDetail.initial="'required'" data-vv-as="请输入详细地址" name="addressDetail"
                 :class="{'is-danger': errors.has('addressDetail') }">
        </li>
        <li>
          <span class="name">邮编</span>
          <input type="text" class="input" maxlength="6" v-model.trim="form.postcode" placeholder="请输入邮编（非必填）">
        </li>

        <li>
          <popup-picker title="受益顺序" :data="beneficialOrderList" @on-hide="onHide()" placeholder="请选择"
                        @on-change="onChange" v-model.trim="form.beneficialOrder"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="beneficialOrder"
            v-model.trim="form.beneficialOrder[0]"
            v-validate
            data-vv-as="请选择受益顺序"
            data-vv-rules="required">
        </li>
        <li>
          <span class="name">受益比例</span>
          <input type="text" class="input" maxlength="30" v-model="form.beneficialProportion" placeholder="请输入受益比例"
                 v-validate:beneficialProportion.initial="'required|decimal|between:0, 100'" data-vv-as="请输入受益比例" name="beneficialProportion"
                 :class="{'is-danger': errors.has('beneficialProportion') }">
          <span>%</span>
        </li>
      </ul>
      <div class="button-wrapper">
        <c_button val="确定修改" @Click="submit"></c_button>
      </div>
    </div>
  </div>
</template>

<script>
  import {PopupPicker, Group, Datetime, XAddress, ChinaAddressV3Data, Value2nameFilter as value2name} from 'vux'

  const nowTime = function () {
    return new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)) + '-' + new Date().getDate()
  }
  const ENDTIME = '9999-12-31'
  export default {
    data () {
      return {
        query: '',
        hascardKind: false,
        cardKindList: [['身份证', '军人证', '护照']],
        hasnationality: false,
        nationalityList: [['中国 ', '美国', '俄罗斯', '英国']],
        relationList: [['父母', '兄妹', '朋友']],
        beneficialOrderList: [['1', '2', '3']],
        addressData: ChinaAddressV3Data,
        timeTitle: ' ',
        card: {
          deftime: nowTime(),
          startTime: nowTime(),
          stime: nowTime(),
          etime: "2080-01-01",
          minyear: 2017,
          maxyear: 2100
        },
        cardBrith: {
          deftime: nowTime(),
          startTime: nowTime(),
          stime: "1900-01-01",
          etime: "2080-01-01",
          minyear: 1900,
          maxyear: 2100
        },
        form: {
          name: '',
          gender: '男',
          self: true,
          birthday: '1980-01-01',
          relation: ['父母'],
          cardKind: [],
          indate: nowTime(),
          nationality: [],
          beneficialOrder: [],
          beneficialProportion: '',
          jobs: '',
          mobilphone: '',
          address: [],
          addressDetail: '',
          postcode: ''
        }
      }
    },
    created () {
      this.form.cardKind.length && (this.hascardKind = true)
      this.form.nationality.length && (this.hasnationality = true)
    },
    computed: {
      selected () {
        return this.form.indate === ENDTIME
      },
      relationship () {
        return this.$route.query.index == 1
      }
    },
    watch: {
      'form.cardNum': {
        handler (v, o) {
          if (v === v.toUpperCase()) {
            return
          }
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.form.cardNum = v.toUpperCase()
          }, 250)
        }
      }
    },
    methods: {
      onHide () {
      },
      onChange () {
      },
      cardtime () {
      },
      importConnect () {
        console.log('open...')
      },
      scan () {
        console.log('wait...')
      },
      checkgander (v) {
        if (v === 'M') {
          this.form.gender = '男'
        } else {
          this.form.gender = '女'
        }
      },
      checkedSelf (v) {
        this.form.self = v
      },
//    证件日期切换有效期至无限期
      indate () {
        if (this.selected) {
          this.form.indate = ' '
        } else {
          this.form.indate = ENDTIME
        }
      },
      submit () {
        this.validateBeforeSubmit()
        this.$store.commit('customer/PUSH_BENEFICIARY', this.form)
      },
      validateBeforeSubmit () {
        console.log(this.$validator.getErrors())
        this.$validator.validateAll().then(() => {
          // eslint-disable-next-line
//          alert('From Submitted!')
        }).catch((err) => {
          this.$vux.toast.show({
            type: "text",
            width: "200px",
            text: this.$validator.getErrors().errors[0].msg
          })
          throw new Error(err)
        })
      }
    },
    components: {
      PopupPicker,
      Group,
      Datetime,
      XAddress,
      ChinaAddressV3Data
    }
  }
</script>

<style lang='scss' rel="stylesheet/scss">
  @import '~@/assets/scss/function';

  .beneficiaryInfo-page {
    .hiddenInput {
    }
    .address-li {
      & > div {
        flex: 1;
      }
    }
    .vux-cell-box {
      font-size: rem-calc(15);
      flex: 1;
      &:before {
        opacity: 0;
      }
      .weui-cell {
        padding: 0;
        background-size: 0 !important;
        @include borderbottom-1px(#efefef);
        .vux-cell-primary {
          color: #999999;
        }
        .weui-cell__ft {
          position: relative;
          &:after {
            content: " ";
            display: inline-block;
            height: 6px;
            width: 6px;
            border-width: 2px 2px 0 0;
            border-color: #C8C8CD;
            border-style: solid;
            -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            top: -2px;
            position: absolute;
            top: 50%;
            margin-top: -4px;
            right: 2px;
          }
        }
      }
    }
    .weui-cells {
      height: rem-calc(44px);
      line-height: rem-calc(44px);
      overflow: hidden;
      vertical-align: middle;
      a {
        padding: rem-calc(0px) 0 0 0;
        font-size: rem-calc(16px);
      }
    }
  }
</style>

<style lang='scss' rel="stylesheet/scss" scoped>
  @import '~@/assets/scss/function';

  .beneficiaryInfo-page {
    background: $bgGray;
    min-height: 100%;
    padding-bottom: rem-calc(15);
    .item-head {
      height: rem-calc(40);
      line-height: rem-calc(40);
      padding-left: rem-calc(15);
      position: relative;
      align-items: center;
      &:before {
        position: absolute;
        top: 28%;
        content: ' ';
        display: block;
        border-left: rem-calc(2.5) solid #00b0ff;
        height: rem-calc(15px);
      }
      & > span {
        margin-left: rem-calc(8);
      }
      .selectIcon {
        padding-right: rem-calc(15);
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        .icon-cricle {
          display: inline-block;
          width: rem-calc(18);
          height: rem-calc(18);
          line-height: rem-calc(18);
          border-radius: 50%;
          background-color: #cccccc;
          &:before {
            content: ' ';
            display: block;
            border-bottom: rem-calc(2) solid #ffffff;
            border-left: rem-calc(2) solid #ffffff;
            width: rem-calc(16);
            height: rem-calc(8);
            transform: rotate(-45deg) scale(.8);
            margin-top: rem-calc(1);
          }
        }
        .active {
          background-color: #00aeff;
        }
        .icon-text {
          font-size: rem-calc(13);
          color: #a5a5a5;
          margin-left: rem-calc(4);
        }
        .icon-text-active {
          color: #00aeff;
        }
      }
      .selectIcon {
        padding-right: rem-calc(15);
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        .icon {
          &:before {
            content: '';
            margin-right: rem-calc(4px);
            width: rem-calc(17px);
            height: rem-calc(18px);
            display: inline-block;
            vertical-align: middle;
            background-repeat: no-repeat;
            -webkit-background-size: cover;
            background-size: cover;
          }
        }
        .icon-addPerson {
          margin-right: rem-calc(20);
          &:before {
            background-image: url(~@/assets/image/addPerson.png);
          }
        }
        .icon-scan {
          &:before {
            background-image: url(~@/assets/image/scan.png);
          }
        }
      }
    }
    ul {
      position: relative;
      background-color: #ffffff;
      list-style: none;
      padding-left: rem-calc(15);
      & > li {
        display: flex;
        align-items: center;
        height: rem-calc(45);
        padding-right: rem-calc(15);
        font-size: rem-calc(15);
        @include borderbottom-1px(#efefef);
        & > span {
          display: inline-block;
        }
        .name {
          width: rem-calc(80);
        }
        .input {
          flex: 1;
          font-size: rem-calc(15);
          border: 0;
          outline: none;
          -webkit-appearance: none;
          text-align: right;
          color: #999999;
          & > a {
            text-decoration: none;
          }
        }
        ._input {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }
        .input_a {
          & > a {
            padding-right: 0;
          }
        }
        .upload-img {
          height: 100%;
          border-left: rem-calc(1) solid #efefef;
          display: flex;
          align-items: center;
          width: rem-calc(60);
          line-height: 100%;
          padding-left: rem-calc(15);
          .icon-cricle {
            width: rem-calc(18);
            height: rem-calc(18);
            line-height: rem-calc(18);
            border-radius: 50%;
            background-color: #999999;
            &:before {
              content: ' ';
              display: block;
              border-bottom: rem-calc(2) solid #ffffff;
              border-left: rem-calc(2) solid #ffffff;
              width: rem-calc(16);
              height: rem-calc(8);
              transform: rotate(-45deg) scale(.8);
              margin-top: rem-calc(1);
            }
          }
          .active {
            background-color: #00aeff;
          }
          .icon-text {
            font-size: rem-calc(13);
            color: #999999;
            margin-left: rem-calc(4);
          }
          .icon-text-active {
            color: #00aeff;
          }
        }
      }
      & > :last-child {
        background-size: 0 !important;
      }
      .picker {
        position: absolute;
        top: 0;
        left: 0;
        right: rem-calc(15);
        opacity: 0;
        .vux-cell-box {
          height: rem-calc(45);
        }
      }
      .picker {
        position: absolute;
        top: 0;
        left: 0;
        right: rem-calc(15);
        opacity: 0;
        .vux-cell-box {
          height: rem-calc(45);
        }
      }
    }

    .button-wrapper {
      margin-top: rem-calc(24);
      margin-bottom: rem-calc(25);
    }
  }

</style>
