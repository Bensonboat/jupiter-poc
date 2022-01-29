<template>
  <div class="titleContainer">
    <div class="title">Swap</div>
    <div class="iconButtonsContainer">
      <div
        @mouseenter="toggleAutoRefresh(true)"
        @mouseleave="toggleAutoRefresh(false)"
        class="iconButton"
      >
        <Progress
          type="circle"
          :width="20"
          :stroke-width="10"
          :percent="(100 / 60) * countdown"
          :show-info="false"
          strokeColor="#fbae21"
          class="icon"
        />
        <div v-show="tooltip.showAutoRefresh" class="tooltipContainer">
          <div class="tooltipContent">
            Displayed data will auto-refresh after {{ 60 - countdown }} seconds.
          </div>
        </div>
      </div>
      <div
        class="iconButton"
        @mouseenter="toggleAddressInfo(true)"
        @mouseleave="toggleAddressInfo(false)"
      >
        <div v-show="tooltip.showAddressInfo" class="tooltipContainer">
          <!-- <template slot="title"> -->
          <div class="tooltipContent">
            <div>Program Addresses (DO NOT DEPOSIT)</div>
            <div
              v-if="Object.keys(tokenInfo.input).length !== 0"
              class="tokenInfoBlock"
            >
              <div class="tokenInfoSymbol">{{ tokenInfo.input.symbol }}</div>
              <div class="tokenInfoAddress">
                <span>
                  {{ tokenInfo.input.address.substring(0, 14) }}
                </span>
                <span v-show="tokenInfo.input"> ... </span>
                <span>
                  {{ tokenInfo.input.address.substr(-14) }}
                </span>
              </div>

              <a
                :href="`${explorer}/address/${tokenInfo.input.address}`"
                target="_blank"
              >
                <Icon type="link" class="linkIcon" />
              </a>
            </div>
            <div
              v-if="Object.keys(tokenInfo.output).length !== 0"
              class="tokenInfoBlock"
            >
              <div class="tokenInfoSymbol">{{ tokenInfo.output.symbol }}</div>
              <div class="tokenInfoAddress">
                <span>
                  {{ tokenInfo.output.address.substring(0, 14) }}
                </span>
                <span v-show="tokenInfo.output"> ... </span>
                <span>
                  {{ tokenInfo.output.address.substr(-14) }}
                </span>
              </div>
            </div>
          </div>
          <!--<div class="swap-info">
              <div v-if="fromCoin" class="info">
                <div class="symbol">{{ fromCoin.symbol }}</div>
                <div class="address">
                  {{ fromCoin.mintAddress.substr(0, 14) }}
                  ...
                  {{
                    fromCoin.mintAddress.substr(
                      fromCoin.mintAddress.length - 14,
                      14
                    )
                  }}
                </div>
                <div class="action">
                  <Icon
                    type="copy"
                    @click="$accessor.copy(fromCoin.mintAddress)"
                  />
                  <a
                    :href="`${url.explorer}/token/${fromCoin.mintAddress}`"
                    target="_blank"
                  >
                    <Icon type="link" />
                  </a>
                </div>
              </div>
              <div v-if="toCoin" class="info">
                <div class="symbol">{{ toCoin.symbol }}</div>
                <div class="address">
                  {{ toCoin.mintAddress.substr(0, 14) }}
                  ...
                  {{
                    toCoin.mintAddress.substr(
                      toCoin.mintAddress.length - 14,
                      14
                    )
                  }}
                </div>
                <div class="action">
                  <Icon
                    type="copy"
                    @click="$accessor.copy(toCoin.mintAddress)"
                  />
                  <a
                    :href="`${url.explorer}/token/${toCoin.mintAddress}`"
                    target="_blank"
                  >
                    <Icon type="link" />
                  </a>
                </div>
              </div>
              <div v-if="marketAddress" class="info">
                <div class="symbol">Market</div>
                <div class="address">
                  {{ marketAddress.substr(0, 14) }}
                  ...
                  {{ marketAddress.substr(marketAddress.length - 14, 14) }}
                </div>
                <div class="action">
                  <Icon type="copy" @click="$accessor.copy(marketAddress)" />
                  <a
                    v-if="!officialPool"
                    :href="`${url.explorer}/account/${marketAddress}`"
                    target="_blank"
                  >
                    <Icon type="link" />
                  </a>
                  <a
                    v-else
                    :href="`${url.trade}/${marketAddress}`"
                    target="_blank"
                  >
                    <Icon type="link" />
                  </a>
                </div>
              </div>
              <div v-if="ammId" class="info">
                <div class="symbol">AMM ID</div>
                <div class="address">
                  {{ ammId ? ammId.substr(0, 14) : "" }}
                  ...
                  {{ ammId ? ammId.substr(ammId.length - 14, 14) : "" }}
                </div>
                <div class="action">
                  <Icon type="copy" @click="$accessor.copy(ammId)" />
                  <a :href="`${url.explorer}/account/${ammId}`" target="_blank">
                    <Icon type="link" />
                  </a>
                </div>
              </div>
            </div>
          </template> -->
        </div>

        <Icon type="info-circle" class="icon" />
      </div>
      <div class="iconButton">
        <Icon type="setting" class="icon" @click="toggleSlippageModal" />
      </div>

      <!-- </Tooltip> -->
      <!-- <Popover trigger="hover">
          <PopoverTrigger>
            <div class=icon>
              <InfoOutlineIcon w=18 h=18 />
            </div>
          </PopoverTrigger>
          <PopoverContent
            color="white"
            bg="brand.100"
            border="none"
            w="auto"
            class=popover
          >
            <PopoverArrow bg="brand.100" class=popover />
            <PopoverBody>
              <div class=selectTokenAddressTitle>
                Program Addresses (DO NOT DEPOSIT)
              </div>
              <div class=selectTokenAddress>
                props.fromData.tokenInfo?.symbol ? (
                  <AddressInfo type="From" />
                ) : (
                  ""
                )
              </div>
              <div class=selectTokenAddress>
                props.toData.tokenInfo?.symbol ? (
                  <AddressInfo type="To" />
                ) : (
                  ""
                )
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Progress, Icon } from "ant-design-vue";

export default Vue.extend({
  components: {
    Progress,
    Icon,
  },
  props: ["tokenInfo"],
  data() {
    return {
      countdown: 0 as number,
      explorer: "https://explorer.solana.com",
      tooltip: {
        showAutoRefresh: false,
        showAddressInfo: false,
      },
    };
  },
  mounted() {
    setInterval(() => {
      this.countdown++;
      if (this.countdown === 60) {
        this.countdown = 0;
      }
    }, 1000);
  },
  methods: {
    toggleAutoRefresh(val: boolean) {
      this.tooltip.showAutoRefresh = val;
    },
    toggleAddressInfo(val: boolean) {
      this.tooltip.showAddressInfo = val;
    },
    toggleSlippageModal() {
      this.$emit("toggleSlippageModal", true);
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

.titleContainer
  display: flex
  align-items: center
  justify-content: center
  margin-top: 4rem
  margin-bottom: 1rem
  .title
    flex: 1
    font-weight: 600
    font-size: 2.4rem
    color: $dappio_font_color
  .tooltipContainer
    position: absolute
    bottom: 0
    padding-top: 1rem
    background-color: transparent
    transform: translateY(100%)
    width: max-content
    color: white
    z-index: 9999
  .tooltipContent
    background-color: rgba(0, 0, 0, 1)
    padding: 1rem 1.5rem
    border-radius: 0.5rem
  .iconButtonsContainer
    display: flex
    flex: 2
    justify-content: flex-end
  .iconButton
    position: relative
    display: flex
    align-items: center
    justify-content: center
    cursor: pointer
    border-radius: .5rem
    margin-left: .5rem
    &:hover
      background: rgba(0,0,0,.8)
      // background-color: $coin_select_block_bgc
  .icon
    font-size: 1.8rem
    width: 3rem
    height: 3rem
    color: $white
    display: flex
    align-items: center
    justify-content: center
  .percentageCircle
    width: 3rem
    height: 3rem
  .circleBg
    stroke: $white
    fill: none
    stroke-width: 4
  .popover
    box-shadow: none !important
    outline: none !important
  .selectTokenAddressTitle
    font-size: 1.2rem
    font-weight: 600
    color: $placeholder_grey
    margin: .5rem 0 1rem 0
  .tokenInfoBlock
    display: flex
    align-items: center
    margin-top: 1rem
    .tokenInfoSymbol
      font-size: 1.4rem
      margin-right: 2rem
      opacity: .7
      min-width: 3rem
    .tokenInfoAddress
      background-color: $main_dappio_v1_bg
      border-radius: .5rem
      padding: .5rem 1rem
      margin-right: 1rem
    .linkIcon
      font-size: 1.5rem
      color: $white
      display: flex
      align-items: center
  .selectTokenAddress
    opacity: .7
    display: flex
    align-items: center
    margin-top: .5rem
    .symbol
      width: 5rem
      flex-shrink: 0
    .address
      background-color: $swap_card_bgc
      padding: .5rem
      border-radius: .5rem
      font-weight: 600
</style>
