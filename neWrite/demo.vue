<!--
      descript: 受益人信息
        author: gongshuai
        param:

-->
<template>
  <div class="beneficiaryInfo-page">
    <div class="base-info">
      <div class="item-head">
        <span>{{$t("key25")}}</span>
        <div class="selectIcon">
          <span class="icon icon-addPerson" @click="importConnect">{{$t("key26")}}</span>
          <span class="icon icon-scan" @click="scan">{{$t("key27")}}</span>
        </div>
      </div>
      <ul v-if="relationship">
        <li>
          <span class="name">{{$t("key28")}}</span>
          <input type="text" class="input" maxlength="30" v-model.trim="form.name" :placeholder="i18n.t('key0')"
                 v-validate:name.initial="'required'" name="name" :data-vv-as="i18n.t('key0')"
                 :class="{'is-danger': errors.has('name') }">
        </li>
        <li>
          <span class="name">{{$t("key29")}}</span>
          <div class="_input">
            <c_gender @Click="checkgander" :gender="form.gender"></c_gender>
          </div>
        </li>
        <li>
          <span class="name">{{$t("key30")}}</span>
          <div class="_input">
            <!--<c_radio @Click="checkedSelf" :checked="form.self"></c_radio>-->
            <c_radioBlock v-model.trim = "form.self" :checked="false"></c_radioBlock>
          </div>
        </li>
        <li>
          <span class="name">{{$t("key31")}}</span>
          <div class="input input_a">
            <datetime @on-change="cardtime"
                      clear-text=""
                      :placeholder="cardBrith.detime"
                      v-model.trim="form.birthday"
                      format="YYYY-MM-DD"
                      :title="timeTitle"
                      :confirm-text="i18n.t('key1')"
                      :cancel-text="i18n.t('key2')"
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
              :data-vv-as="i18n.t('key3')"
              data-vv-rules="required">
          </div>
        </li>
        <li>
          <popup-picker :title="i18n.t('key4')" :data="relationList" @on-hide="onHide()" :placeholder="i18n.t('key5')"
                        @on-change="onChange" v-model.trim="form.relation"></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="relation"
            v-model.trim="form.relation[0]"
            v-validate
            :data-vv-as="i18n.t('key5')"
            data-vv-rules="required">
        </li>
        <li v-if="hascardKind">
          <span class="name">{{$t("key6")}}</span>
          <span type="text" class="input" v-if="form.cardKind">{{form.cardKind[0]}}</span>
        </li>
        <li v-else>
          <popup-picker :title="i18n.t('key6')" :data="cardKindList" @on-hide="onHide('cardKind')" :placeholder="i18n.t('key7')"
                        @on-change="onChange" v-model.trim="form.cardKind"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="cardKind"
            v-model.trim="form.cardKind"
            v-validate
            :data-vv-as="i18n.t('key7')"
            data-vv-rules="required">
        </li>
        <li>
          <span class="name">{{$t("key32")}}</span>
          <span type="text" class="input" v-if="hascardKind">{{form.cardNum}}</span>
          <input type="text" class="input" maxlength="30" v-model.trim="form.cardNum" :placeholder="i18n.t('key8')"
                 v-validate:cardNum.initial="'required|idcard'" :data-vv-as="i18n.t('key8')" name="cardNum"
                 :class="{'is-danger': errors.has('cardNum') }" v-else>
        </li>
        <li>
          <span class="name">{{$t("key33")}}</span>
          <div class="input">
            <datetime @on-change="cardtime"
                      clear-text=""
                      :placeholder="card.detime"
                      v-model.trim="form.indate"
                      format="YYYY-MM-DD"
                      :title="timeTitle"
                      :confirm-text="i18n.t('key1')"
                      :cancel-text="i18n.t('key2')"
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
              :data-vv-as="i18n.t('key9')"
              data-vv-rules="required">
          </div>
          <div class="upload-img" @click="indate">
            <span class="icon-cricle" :class="{active: selected}"></span>
            <span class="icon-text" :class="{'icon-text-active': selected}">{{$t("key34")}}</span>
          </div>
        </li>
        <li v-if="hasnationality">
          <span class="name">{{$t("key10")}}</span>
          <span type="text" class="input">{{form.nationality}}</span>
        </li>
        <li v-else>
          <popup-picker :title="i18n.t('key10')" :data="nationalityList" @on-hide="onHide('nationality')" :placeholder="i18n.t('key7')"
                        @on-change="onChange" v-model.trim="form.nationality"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="nationality"
            v-model.trim="form.nationality[0]"
            v-validate
            :data-vv-as="i18n.t('key11')"
            data-vv-rules="required">
        </li>
        <li>
          <popup-picker :title="i18n.t('key12')" :data="beneficialOrderList" @on-hide="onHide()" :placeholder="i18n.t('key13')"
                        @on-change="onChange" v-model.trim="form.beneficialOrder"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="beneficialOrder"
            v-model.trim="form.beneficialOrder[0]"
            v-validate
            :data-vv-as="i18n.t('key14')"
            data-vv-rules="required">
        </li>
        <li>
          <span class="name">{{$t("key35")}}</span>
          <input type="text" class="input" maxlength="30" v-model="form.beneficialProportion" :placeholder="i18n.t('key15')"
                 v-validate:beneficialProportion.initial="'required|decimal|between:0, 100'" :data-vv-as="i18n.t('key15')" name="beneficialProportion"
                 :class="{'is-danger': errors.has('beneficialProportion') }">
          <span>%</span>
        </li>
      </ul>
      <ul v-else>
        <li>
          <span class="name">{{$t("key28")}}</span>
          <input type="text" class="input" maxlength="30" v-model.trim="form.name" :placeholder="i18n.t('key0')"
                 v-validate:name.initial="'required'" name="name" :data-vv-as="i18n.t('key0')"
                 :class="{'is-danger': errors.has('name') }">
        </li>
        <li>
          <span class="name">{{$t("key29")}}</span>
          <div class="_input">
            <c_gender @Click="checkgander" :gender="form.gender"></c_gender>
          </div>
        </li>
        <li>
          <span class="name">{{$t("key30")}}</span>
          <div class="_input">
            <!--<c_radio @Click="checkedSelf" :checked="form.self"></c_radio>-->
            <c_radioBlock v-model.trim = "form.self" :checked="false"></c_radioBlock>
          </div>
        </li>
        <li>
          <span class="name">{{$t("key31")}}</span>
          <div class="input input_a">
            <datetime @on-change="cardtime"
                      clear-text=""
                      :placeholder="cardBrith.detime"
                      v-model.trim="form.birthday"
                      format="YYYY-MM-DD"
                      :title="timeTitle"
                      :confirm-text="i18n.t('key1')"
                      :cancel-text="i18n.t('key2')"
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
              :data-vv-as="i18n.t('key3')"
              data-vv-rules="required">
          </div>
        </li>
        <li>
          <popup-picker :title="i18n.t('key4')" :data="relationList" @on-hide="onHide()" :placeholder="i18n.t('key5')"
                        @on-change="onChange" v-model.trim="form.relation"></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="relation"
            v-model.trim="form.relation[0]"
            v-validate
            :data-vv-as="i18n.t('key5')"
            data-vv-rules="required">
        </li>
        <li v-if="hascardKind">
          <span class="name">{{$t("key6")}}</span>
          <span type="text" class="input" v-if="form.cardKind">{{form.cardKind[0]}}</span>
        </li>
        <li v-else>
          <popup-picker :title="i18n.t('key6')" :data="cardKindList" @on-hide="onHide('cardKind')" :placeholder="i18n.t('key7')"
                        @on-change="onChange" v-model.trim="form.cardKind"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="cardKind"
            v-model.trim="form.cardKind"
            v-validate
            :data-vv-as="i18n.t('key7')"
            data-vv-rules="required">
        </li>
        <li>
          <span class="name">{{$t("key32")}}</span>
          <span type="text" class="input" v-if="hascardKind">{{form.cardNum}}</span>
          <input type="text" class="input" maxlength="30" v-model.trim="form.cardNum" :placeholder="i18n.t('key8')"
                 v-validate:cardNum.initial="'required|idcard'" :data-vv-as="i18n.t('key8')" name="cardNum"
                 :class="{'is-danger': errors.has('cardNum') }" v-else>
        </li>
        <li>
          <span class="name">{{$t("key33")}}</span>
          <div class="input">
            <datetime @on-change="cardtime"
                      clear-text=""
                      :placeholder="card.detime"
                      v-model.trim="form.indate"
                      format="YYYY-MM-DD"
                      :title="timeTitle"
                      :confirm-text="i18n.t('key1')"
                      :cancel-text="i18n.t('key2')"
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
              :data-vv-as="i18n.t('key9')"
              data-vv-rules="required">
          </div>
          <div class="upload-img" @click="indate">
            <span class="icon-cricle" :class="{active: selected}"></span>
            <span class="icon-text" :class="{'icon-text-active': selected}">{{$t("key34")}}</span>
          </div>
        </li>
        <li v-if="hasnationality">
          <span class="name">{{$t("key10")}}</span>
          <span type="text" class="input">{{form.nationality}}</span>
        </li>
        <li v-else>
          <popup-picker :title="i18n.t('key10')" :data="nationalityList" @on-hide="onHide('nationality')" :placeholder="i18n.t('key7')"
                        @on-change="onChange" v-model.trim="form.nationality"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="nationality"
            v-model.trim="form.nationality[0]"
            v-validate
            :data-vv-as="i18n.t('key11')"
            data-vv-rules="required">
        </li>

        <li>
          <span class="name">{{$t("key36")}}</span>
          <input type="text" class="input" maxlength="30" v-model="form.jobs" :placeholder="i18n.t('key16')"
                 v-validate:jobs.initial="'required'" :data-vv-as="i18n.t('key16')" name="jobs"
                 :class="{'is-danger': errors.has('jobs') }">
        </li>
        <li>
          <span class="name">{{$t("key37")}}</span>
          <input type="tel" class="input" maxlength="30" v-maxLength v-model.trim="form.mobilphone" :placeholder="i18n.t('key17')"
                 v-validate:tel.initial="'required'" :data-vv-as="i18n.t('key17')" name="tel"
                 :class="{'is-danger': errors.has('tel') }">
        </li>
        <li class="address-li">
          <x-address :title="i18n.t('key18')" v-model.trim="form.address" :list="addressData"
                     :placeholder="i18n.t('key19')"></x-address>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="address"
            v-model.trim="form.address[0]"
            v-validate
            :data-vv-as="i18n.t('key20')"
            data-vv-rules="required">
        </li>
        <li>
          <span class="name">{{$t("key38")}}</span>
          <input type="text" class="input" maxlength="30" v-model.trim="form.addressDetail" :placeholder="i18n.t('key21')"
                 v-validate:addressDetail.initial="'required'" :data-vv-as="i18n.t('key22')" name="addressDetail"
                 :class="{'is-danger': errors.has('addressDetail') }">
        </li>
        <li>
          <span class="name">{{$t("key39")}}</span>
          <input type="text" class="input" maxlength="6" v-model.trim="form.postcode" :placeholder="i18n.t('key23')">
        </li>

        <li>
          <popup-picker :title="i18n.t('key12')" :data="beneficialOrderList" @on-hide="onHide()" :placeholder="i18n.t('key13')"
                        @on-change="onChange" v-model.trim="form.beneficialOrder"
          ></popup-picker>
          <input
            class="hiddenInput"
            type="hidden"
            placeholder=""
            name="beneficialOrder"
            v-model.trim="form.beneficialOrder[0]"
            v-validate
            :data-vv-as="i18n.t('key14')"
            data-vv-rules="required">
        </li>
        <li>
          <span class="name">{{$t("key35")}}</span>
          <input type="text" class="input" maxlength="30" v-model="form.beneficialProportion" :placeholder="i18n.t('key15')"
                 v-validate:beneficialProportion.initial="'required|decimal|between:0, 100'" :data-vv-as="i18n.t('key15')" name="beneficialProportion"
                 :class="{'is-danger': errors.has('beneficialProportion') }">
          <span>%</span>
        </li>
      </ul>
      <div class="button-wrapper">
        <c_button :val="i18n.t('key24')" @Click="submit"></c_button>
      </div>
    </div>
  </div>
</template>

<script>
 import i18n from "@/i18n"

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
        cardKindList: [[i18n.t("key40"), i18n.t("key41"), i18n.t("key42")]],
        hasnationality: false,
        nationalityList: [[i18n.t("key43"), i18n.t("key44"), i18n.t("key45"), i18n.t("key46")]],
        relationList: [[i18n.t("key47"), i18n.t("key48"), i18n.t("key49")]],
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
          gender: i18n.t("key50"),
          self: true,
          birthday: '1980-01-01',
          relation: [i18n.t("key47")],
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
          this.form.gender = i18n.t("key50")
        } else {
          this.form.gender = i18n.t("key51")
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
