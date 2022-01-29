<template>
  <div class="tokeListComponent" @click.self="close">
    <div class="tokeListContainer">
      <div class="header">
        <div>Select a token</div>
        <div class="closeIcon" @click="close">x</div>
      </div>
      <div class="inputBlock">
        <input
          type="text"
          v-model="searchingKey"
          placeholder="Search name or mint address"
          class="searchTokenInput"
          @keyup="searchingToken"
        />
        <div class="tokenListTitleRow">
          <div>Token name</div>
        </div>
      </div>
      <div class="list">
        <div
          class="tokenRow"
          v-for="item in innerTokenList"
          :key="item.address"
          @click="setTokenInfo(item)"
        >
          <img :src="item.logoURI" alt="" class="tokenLogo" />
          <div>{{ item.symbol }}</div>
        </div>
      </div>
      <div class="tokenListSetting">
        Token List ({{ innerTokenList.length }})
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IToken } from "../../interface/swap";

export default Vue.extend({
  name: "TokenList",
  props: ["tokenList"],
  data() {
    return {
      innerTokenList: [] as IToken[],
      searchingKey: "" as string,
    };
  },
  watch: {
    tokenList: {
      handler(data) {
        this.innerTokenList = JSON.parse(JSON.stringify(data));
      },
      immediate: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
      this.searchingKey = "";
    },
    searchingToken() {
      let upperCaseKey: string = this.searchingKey.toUpperCase(); // ** case problem

      let searchedToken: IToken[] = [];
      this.tokenList.map((item: IToken) => {
        if (
          item.symbol.includes(upperCaseKey) ||
          item.address === this.searchingKey
        ) {
          searchedToken.push(item);
        }
      });
      this.innerTokenList = searchedToken;
    },
    setTokenInfo(token: IToken) {
      this.$emit("setTokenInfo", token);
      this.close();
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

.tokeListComponent
  transition: .3s
  width: 100vw
  height: 100vh
  background-color: rgba(0,0,0,.5)
  position: fixed
  top: 0
  left: 0
  z-index: 99
  .tokeListContainer
    max-width: 45rem
    width: calc(100vw - 1.6rem)
    height: calc( 100vh - 14rem)
    overflow: hidden
    background-color: $main_dappio_v1_bg
    // background-color: $token_list_bgc
    position: absolute
    top: 10rem
    left: 50%
    transform: translateX(-50%)
    border-radius: .5rem
    color: $white
  .header
    height: 2rem
    padding: 2.4rem
    display: flex
    align-items: center
    justify-content: space-between
    font-size: 1.6rem
    font-weight: 600
    letter-spacing: 1px
    border-bottom: solid .1rem $white
  .list
    height: calc(100% - 30rem)
    overflow: scroll
    padding: 0 1.5rem 2rem 1.5rem
  .tokenRow
    display: flex
    align-items: center
    padding: .8rem 1.2rem
    font-size: 1.6rem
    cursor: pointer
    &:hover
      background-color: rgba(0,0,0,.1)
      // background-color: $coin_select_block_bgc
      // opacity: .7
  .tokenLogo
    width: 2rem
    height: 2rem
    border-radius: 50%
    overflow: hidden
    margin-right: 1.2rem
  .tokenListSetting
    border-top: solid .1rem $white
    height: 5.5rem
    flex-shrink: 0
    display: flex
    align-items: center
    justify-content: center
    font-size: 1.4rem
    letter-spacing: 1px
    position: absolute
    bottom: 0
    // background-color: $main_dappio_v1_bg
    width: 100%
  .closeIcon
    cursor: pointer
    font-size: 2rem
    &:hover
      opacity: .7
  .inputBlock
    padding: 1rem 2.5rem 0 2.5rem
  .tokenListTitleRow
    font-size: 1.4rem
    font-weight: 600
    height: 5rem
    display: flex
    justify-content: space-between
    align-items: center
  .searchTokenInput
    padding: 1.6rem
    border: solid .1rem $dappio_font_color
    outline: none
    width: 100%
    background-color: $main_dappio_v1_bg
    font-size: 1.8rem
    border-radius: .5rem
    margin-top: 2rem
    box-sizing: border-box
    color: $white
    letter-spacing: .1rem
</style>
