<template>
  <div class="tokenSelect">
    <div class="sideText">
      <span v-if="isInputSide">From</span>
      <span v-else>To (Estimate)</span>
      <span v-if="tokenInfo.balance" class="balance"
        >Balance: {{ tokenInfo.balance.toFixed(4) }}</span
      >
    </div>
    <div class="tokenInfoBlock">
      <input
        v-if="isInputSide"
        type="number"
        v-model="inputAmount"
        class="amountInput"
        placeholder="0.00"
      />
      <div v-else>{{ outputAmount }}</div>
      <div @click="showTokenListWithSide">
        <div v-if="Object.keys(tokenInfo).length !== 0" class="tokenSymbol">
          <img :src="tokenInfo.logoURI" alt="logo" class="tokenLogo" />
          <div>{{ tokenInfo.symbol }}</div>
          <Icon type="caret-down" class="downIcon" />
        </div>
        <div v-else class="tokenSymbol">
          <div>Select a token</div>
          <Icon type="caret-down" class="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Icon } from "ant-design-vue";

export default Vue.extend({
  name: "TokenSelect",
  props: ["tokenInfo", "isInputSide", "outputAmount"],
  components: {
    Icon,
  },
  data() {
    return {
      inputAmount: null as number | null,
    };
  },
  watch: {
    inputAmount(val) {
      this.$emit("setInputAmount", val);
    },
  },
  methods: {
    showTokenListWithSide() {
      this.$emit("showTokenListWithSide", this.isInputSide);
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

.tokenSelect
  background-color: rgb(48, 48, 48)
  width: 100%
  padding: .5rem 1rem 1rem 2rem
  box-sizing: border-box
  border-radius: .5rem
  .sideText
    margin: 1rem 0 2rem 0
    font-size: 1.2rem
    display: flex
    justify-content: space-between
    .balance
      margin-right: 1.2rem
      font-size: 1.3rem
      opacity: .5
  .tokenInfoBlock
    display: flex
    justify-content: space-between
    height: 2rem
    margin-bottom: 1rem
    align-items: center
  .tokenSymbol
    padding: .8rem 1.2rem
    font-size: 1.4rem
    text-align: right
    border-radius: .5rem
    display: flex
    align-items: center
    &:hover
      opacity: .8
      cursor: pointer
      background-color: rgba(0,0,0,.4)
    .icon
      display: flex
      align-items: center
      margin-left: .5rem
  .amountInput
    background-color: transparent
    outline: none
    color: $white
    font-size: 1.6rem
  .tokenLogo
    width: 2.5rem
    height: 2.5rem
    margin-right: .8rem
    border-radius: 50%
  .downIcon
    display: flex
    margin-left: .5rem
</style>
