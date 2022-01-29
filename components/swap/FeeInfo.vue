<template>
  <div>
    <div v-if="transactionFeeInfo">
      transactionFeeInfo
      <br />

      <div>
        Deposit For serum:
        {{
          transactionFeeInfo.openOrdersDeposits.reduce(
            (total, i) => total + i,
            0
          ) /
          10 ** 9
        }}
        SOL
      </div>
      <div>
        Deposit For ATA:
        {{ transactionFeeInfo.ataDeposit / 10 ** 9 }} SOL
      </div>
      <div>Fee: {{ transactionFeeInfo.signatureFee / 10 ** 9 }} SOL</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TransactionFeeInfo } from "@jup-ag/core";

export default Vue.extend({
  name: "FeeInfo",
  props: ["routes"],
  data() {
    return {
      transactionFeeInfo: undefined as TransactionFeeInfo | undefined,
    };
  },
  watch: {
    routes: {
      handler(data) {
        if (data && data.routesInfos) {
          let route = data.routesInfos[0];

          route.getDepositAndFee().then((res: TransactionFeeInfo) => {
            console.log(res, "route.getDepositAndFee()");
            this.transactionFeeInfo = res;
          });
        }
      },
      immediate: true,
    },
  },
});
</script>

<style scoped></style>
