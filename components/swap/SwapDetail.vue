<template>
  <div class="swap-detail">
    <div class="detail-item">
      <div class="detail-item-title-icon-block">
        <span class="detail-item-title">Slippage Tolerance</span>
        <!-- <Icon type="question-circle" class="icon" /> -->
      </div>
      <div>{{ slippage }}%</div>
    </div>
    <div
      v-if="
        Object.keys(tokenInfo.input).length > 0 &&
        Object.keys(tokenInfo.output).length > 0
      "
      class="detail-item"
    >
      <span class="detail-item-title">Swapping Through</span>
      <div>{{ tokenInfo.input.symbol }} > {{ tokenInfo.output.symbol }}</div>
    </div>
    <div class="detail-item" v-if="priceImpactPct !== null">
      <div class="detail-item-title-icon-block">
        <span class="detail-item-title">Price Impact</span>
      </div>
      <div>{{ priceImpactPct }} %</div>
    </div>
    <div class="detail-item" v-if="amount.outAmountWithSlippage">
      <div class="detail-item-title-icon-block">
        <span class="detail-item-title">Minimum Received</span>
      </div>
      <div>{{ amount.outAmountWithSlippage }}</div>
    </div>
    <div class="detail-item" v-if="amount.txFee">
      <div class="detail-item-title-icon-block">
        <span class="detail-item-title">Transaction Fee</span>
      </div>
      <div>{{ amount.txFee.signatureFee / 10 ** 9 }} SOL</div>
    </div>
    <!-- <div class="detail-item">
      <div class="detail-item-title-icon-block">
        <span class="detail-item-title">Deposit</span>
      </div>
      <div>-</div>
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TransactionFeeInfo } from "@jup-ag/core";
// import { Icon } from "ant-design-vue";

export default Vue.extend({
  name: "SwapDetail",
  props: ["tokenInfo", "slippage", "amount", "routes"],
  components: {
    // Icon,
  },
  data() {
    return {
      priceImpactPct: null as number | null,
      transactionFeeInfo: undefined as TransactionFeeInfo | undefined,
    };
  },
  watch: {
    // routes: {
    //   handler(data) {
    //     if (data) {
    //       // let bestRoute = data.routesInfos[0];
    //       this.priceImpactPct = parseFloat(data.priceImpactPct.toFixed(4));
    //       data.getDepositAndFee().then((res: TransactionFeeInfo) => {
    //         console.log("/????");
    //         this.transactionFeeInfo = res;
    //       });
    //     }
    //     // if (data && data.routesInfos) {
    //     //   // let bestRoute = data.routesInfos[0];
    //     //   // this.priceImpactPct = bestRoute.priceImpactPct.toFixed(4) * 100;
    //     //   // bestRoute.getDepositAndFee().then((res: TransactionFeeInfo) => {
    //     //   //   this.transactionFeeInfo = res;
    //     //   // });
    //     // }
    //   },
    // },
  },
});
</script>

<style scoped lang="sass">
.swap-detail
  width: 100%
  padding: 0 2rem
  box-sizing: border-box
  margin-top: 3rem
  .detail-item
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 1rem
  .detail-item-title-icon-block
    display: flex
    align-items: center
    font-size: 1.2rem
  .detail-item-title
    margin-right: 1rem
    opacity: .5
  // .icon
  //   width: 2rem
  //   height: 2rem
  //   display: flex
  //   align-items: center
  //   font-size: 1.4rem
</style>
