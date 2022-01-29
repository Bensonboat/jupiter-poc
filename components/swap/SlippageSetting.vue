<template>
  <div class="slippageSettingComponent" @click.self="close">
    <div class="slippageSettingContainer">
      <div class="header">
        <div>Setting</div>
        <div class="closeIcon" @click="close">x</div>
      </div>
      <div class="settingSelectBlock">
        <div class="title">Slippage tolerance</div>
        <div class="optionsBlock">
          <button
            v-for="(item, index) in rate"
            :key="index"
            class="optionBtn"
            :class="[item == slippageValue ? 'selectedSlippageRateBtn' : '']"
            @click="setSlippageValue(item)"
          >
            {{ item }}%
          </button>
          <button class="optionBtn inputBtn">
            <input
              v-model="slippageValue"
              type="number"
              placeholder="0%"
              class="input"
            />
            %
          </button>
        </div>
        <div class="warning">{{ warningText }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SlippageSetting",
  props: {
    slippage: {
      type: Number,
    },
  },
  data() {
    return {
      rate: [0.1, 0.5, 1] as number[],
      slippageValue: this.slippage,
      warningText: "" as string,
    };
  },
  watch: {
    slippageValue: {
      handler(data) {
        if (data < 0 || data === "") {
          this.warningText = "Please enter a valid slippage percentage";
        } else if (data < 1) {
          this.warningText = "Your transaction may fail";
        } else {
          this.warningText = "";
        }
        this.$emit("setSlippageValue", data);
      },
      immediate: true,
    },
  },
  methods: {
    close() {
      this.$emit("toggleSlippageModal", false);
    },
    setSlippageValue(val: number) {
      this.slippageValue = val;
    },
  },
});
</script>

<style scoped lang="sass">
$white: #eee
$main_dappio_v1_bg: rgb(35, 35, 35)
$main_blue: rgb(19, 27, 51)
$swap_card_bgc: #131a35
$coin_select_block_bgc: #000829
$placeholder_grey: #f1f1f2
$swap_btn_border_color: #5ac4be
$token_list_bgc: #1c274f
$slippage_setting_warning_red: #f5222d
$dappio_font_color: #fbae21

.slippageSettingComponent
  box-sizing: border-box
  width: 100vw
  height: 100vh
  background-color: rgba(0,0,0,.5)
  position: fixed
  z-index: 999
  top: 0
  left: 0
  color: $white
  .slippageSettingContainer
    width: 50rem
    height: 20rem
    background-color: $main_dappio_v1_bg
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    position: fixed
    z-index: 9999999
    border-radius: .5rem
  .header
    padding: 0 2rem
    font-size: 1.6rem
    height: 5rem
    display: flex
    align-items: center
    justify-content: space-between
    border-bottom: solid .1rem $white
    font-weight: 500
  .closeIcon
    cursor: pointer
  .settingSelectBlock
    padding: 2.4rem
  .title
    font-weight: 700
    font-size: 1.6rem
    color: $placeholder_grey
  .optionsBlock
    display: flex
    align-items: center
    margin-top: 1rem
  .optionBtn
    display: flex
    align-items: center
    justify-content: center
    width: 100%
    background-color: rgba(0,0,0, .5)
    // background-color: $swap_card_bgc
    color: $placeholder_grey
    padding: 1rem 1.2rem
    border: 0
    border-radius: 4px
    font-size: 1.4rem
    font-weight: 600
    cursor: pointer
    flex: 1
    margin-right: 1.5rem
  .warning
    margin: 1rem
    color: $slippage_setting_warning_red
    font-size: 1.4rem
  .input
    // width: 100%
    background-color: transparent
    outline: none
    text-align: center
    color: $white
  .optionBtn.selectedSlippageRateBtn
    background-color: $dappio_font_color
  .inputBtn
    border: solid .1rem $dappio_font_color
</style>
