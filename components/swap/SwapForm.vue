<template>
  <div class="swapForm">
    <div class="contentContainer">
      <tokenSelect
        :isInputSide="true"
        :tokenInfo="tokenInfo.input"
        @showTokenListWithSide="showTokenListWithSide"
        @setInputAmount="setInputAmount"
      />
      <Icon type="swap" class="swapIcon" @click="switchInputAndOutputToken" />
      <tokenSelect
        :isInputSide="false"
        :tokenInfo="tokenInfo.output"
        @showTokenListWithSide="showTokenListWithSide"
        :outputAmount="amount.output"
      />
      <SwapDetail
        :tokenInfo="tokenInfo"
        :slippage="slippage"
        :amount="amount"
        :routes="routes"
      />
      <button class="swapBtn">Swap</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import tokenSelect from "@/components/swap/TokenSelect.vue";
import { Icon } from "ant-design-vue";
import SwapDetail from "./SwapDetail.vue";

export default Vue.extend({
  name: "SwapForm",
  props: ["tokenInfo", "slippage", "amount", "routes"],
  components: {
    tokenSelect,
    Icon,
    SwapDetail,
  },
  data() {
    return {
      innerTokenInfo: {},
    };
  },
  methods: {
    showTokenListWithSide(isInputSide: boolean) {
      this.$emit("showTokenListWithSide", isInputSide);
    },
    setInputAmount(val: number) {
      this.$emit("setInputAmount", val);
    },
    switchInputAndOutputToken() {
      this.$emit("switchInputAndOutputToken");
    },
  },
});
</script>

<style scoped lang="sass">
$white: #eee
$main_blue: rgb(19, 27, 51)
$swap_card_bgc: #131a35
$coin_select_block_bgc: #000829
$placeholder_grey: #f1f1f2
$swap_btn_border_color: #5ac4be
$token_list_bgc: #1c274f
$slippage_setting_warning_red: #f5222d
$dappio_font_color: #fbae21

.swapForm
  width: 100%
  display: flex
  align-items: center
  justify-content: center
  border-radius: .5rem
  padding: .1rem
  margin-top: 2rem
  .contentContainer
    border: solid 1px $dappio_font_color
    z-index: 99
    border-radius: .5rem
    box-sizing: border-box
    width: 100%
    height: 100%
    padding: 2rem 1.8rem
    display: flex
    flex-direction: column
    align-items: center
  .swapIcon
    background-color: rgba(0,0,0,1)
    padding: .8rem
    border-radius: 50%
    display: flex
    align-items: center
    justify-content: center
    font-size: 1.5rem
    transform: rotate(90deg)
    margin: 1.5rem
    &:hover
      background-color: rgba(0,0,0,.5)
      cursor: pointer
  .swapBtn
    border: none
    padding: 1.2rem 2rem
    background-color: transparent
    color: $white
    font-size: 1.6rem
    width: 80%
    border: solid 1px rgba(255, 255, 255, .1)
    border-radius: 1rem
    margin-top: 3rem
    &:hover
      cursor: pointer
      color: $dappio_font_color
      border-color: $dappio_font_color
      transition: .5s
</style>
