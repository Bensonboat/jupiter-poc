<template>
  <div class="swapPage">
    <SlippageSetting
      v-if="modal.showSlippage"
      :slippage="slippage"
      @setSlippageValue="setSlippageValue"
      @toggleSlippageModal="toggleSlippageModal"
    />
    <TokenList
      v-show="modal.showTokenList"
      :tokenList="selectingInputToken ? tokenList.input : tokenList.output"
      :selectingInputToken="selectingInputToken"
      @close="toggleTokeListModal"
      @setTokenInfo="setTokenInfo"
    />
    <div class="wholeSwapContainer">
      <div v-if="loading.tokenList" style="color: white">
        Loading tokenList...
      </div>
      <TitleRow
        @toggleSlippageModal="toggleSlippageModal"
        :tokenInfo="tokenInfo"
      />
      <SwapForm
        :tokenInfo="tokenInfo"
        :amount="amount"
        :slippage="slippage"
        :routes="routes"
        @showTokenListWithSide="toggleTokeListModal"
        @setInputAmount="setInputAmount"
        @switchInputAndOutputToken="switchInputAndOutputToken"
      />
      <button @click="sendTransaction">Test</button>
      <div v-if="loading.routes">Loading routes...</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SlippageSetting from "@/components/swap/SlippageSetting.vue";
import { TOKEN_LIST_URL, Jupiter } from "@jup-ag/core";
import {
  Connection,
  Cluster,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { IToken, IRoutes } from "../interface/swap";
import TitleRow from "@/components/swap/TitleRow.vue";
import SwapForm from "@/components/swap/SwapForm.vue";
import TokenList from "@/components/swap/TokenList.vue";
// import RoutesInfo from "~/components/swap/RoutesInfo.vue";
// import FeeInfo from "@/components/swap/FeeInfo.vue";
import { ISplTokenInfo, IParsedInfo } from "../interface/swap";

export default Vue.extend({
  components: {
    SlippageSetting,
    TitleRow,
    SwapForm,
    TokenList,
    // RoutesInfo,
    // FeeInfo,
  },
  data() {
    return {
      jupiter: {} as Jupiter,
      routeMap: new Map<string, string[]>(),
      allTokenList: [] as IToken[],
      tokenMap: new Map<string, IToken>(),
      tokenInfo: {
        input: {} as IToken,
        output: {} as IToken,
      },
      tokenList: {
        input: [] as IToken[],
        output: [] as IToken[],
      },
      amount: {
        input: null as number | null,
        output: null as number | null,
        outAmountWithSlippage: null as number | null,
        txFee: null as number | null,
      },
      // inputAmount: null as number | null,
      routes: null,
      slippage: 0.5 as number, // default 0.5
      selectingInputToken: true as boolean, // cuz token list would change base on selected token
      modal: {
        showSlippage: false as boolean,
        showTokenList: false as boolean,
      },
      loading: {
        routes: false as boolean,
        tokenList: false as boolean,
      },
      splTokenList: [] as ISplTokenInfo[],
    };
  },
  async mounted() {
    await this.createJupiterProvider(
      // new Connection("https://rpc-mainnet-fork.dappio.xyz"),
      new Connection("https://solana-api.projectserum.com"),
      "mainnet-beta",
      new PublicKey("GjFnjZtNYdSUsiHcToGVy8MBox5yDRrZsq9Yt9KtDGsP")
    );
    this.getRouteMap();
    await this.getAllTokens();
    this.setTokenMap();

    this.tokenList.input = this.allTokenList;
    this.tokenList.output = this.allTokenList;

    this.getSplTokenDataList(
      new Connection("https://rpc-mainnet-fork.dappio.xyz"),
      new PublicKey("GjFnjZtNYdSUsiHcToGVy8MBox5yDRrZsq9Yt9KtDGsP")
    )
      .then((res) => {
        this.splTokenList = res;
      })
      .then(() => {
        // default input token
        this.setTokenInfo(
          this.allTokenList.find(
            (t: IToken) =>
              t.address === "So11111111111111111111111111111111111111112"
          )!
        );
      });
  },
  watch: {
    "tokenInfo.input": {
      async handler(data) {
        // update valid token pair
        this.tokenList.output = this.getValidTokenPairs(
          data.address
        ) as IToken[];
        this.getRoutes();
      },
      deep: true,
    },
    "tokenInfo.output": {
      async handler(data) {
        // update valid token pair
        this.tokenList.input = this.getValidTokenPairs(
          data.address
        ) as IToken[];
        this.getRoutes();
      },
      deep: true,
    },
    slippage() {
      this.getRoutes();
    },
    "amount.input": {
      handler() {
        this.getRoutes();
      },
      immediate: true,
    },
  },
  methods: {
    getValidTokenPairs(mintAddress: string) {
      let validTokenPairs = this.routeMap.get(mintAddress);

      let list = validTokenPairs
        ?.map((t) => {
          return this.tokenMap.get(t);
        })
        ?.filter((t) => t !== undefined)
        .sort((a: any, b: any) =>
          a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : 0
        );
      return list;
    },
    async createJupiterProvider(
      connection: Connection,
      cluster: Cluster,
      user: PublicKey
    ) {
      //  Load Jupiter
      this.jupiter = await Jupiter.load({
        connection: new Connection("https://solana-api.projectserum.com"),
        // connection,
        cluster,
        user, // or public key
      });
    },
    async getRouteMap() {
      this.routeMap = await this.jupiter.getRouteMap();
    },
    async getAllTokens() {
      this.loading.tokenList = true;

      const tokens: IToken[] = await (
        await fetch(TOKEN_LIST_URL["mainnet-beta"])
      ).json(); // Fetch token list from Jupiter API

      this.loading.tokenList = false;
      this.allTokenList = tokens.sort((a: any, b: any) =>
        a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : 0
      );
    },
    setTokenMap() {
      this.tokenMap = this.allTokenList.reduce((map, item) => {
        map.set(item.address, item);
        return map;
      }, new Map());
    },
    async getRoutes() {
      this.routes = null;
      if (
        !this.tokenInfo.input.address ||
        !this.tokenInfo.output.address ||
        this.amount.input! <= 0
      ) {
        return;
      }

      this.isLoadingRoutes();
      const inputAmountInSmallestUnits = this.tokenInfo.input
        ? Math.round(
            (this.amount.input as number) * 10 ** this.tokenInfo.input.decimals
          )
        : 0;

      console.log(
        "input:",
        this.tokenInfo.input.address,
        ";",
        "output:",
        this.tokenInfo.output.address,
        ";",
        "inputAmountInSmallestUnits:",
        inputAmountInSmallestUnits,
        ";",
        "Slippage: ",
        this.slippage
      );

      try {
        let routes =
          this.tokenInfo.input.address && this.tokenInfo.output.address
            ? await this.jupiter.computeRoutes(
                new PublicKey(this.tokenInfo.input.address),
                new PublicKey(this.tokenInfo.output.address),
                inputAmountInSmallestUnits,
                this.slippage,
                true
              )
            : null;
        console.log(routes, "routes");

        if (routes && routes.routesInfos) {
          // @ts-ignore
          this.routes = routes;
          // @ts-ignore
          let bestRoute = routes.routesInfos[0];

          this.amount.output =
            bestRoute.outAmount / 10 ** this.tokenInfo.output.decimals;
          this.amount.outAmountWithSlippage =
            bestRoute.outAmountWithSlippage /
            10 ** this.tokenInfo.output.decimals;
        }
      } catch (e) {
        console.error(e);
      }

      this.loading.routes = false;
    },
    setSlippageValue(val: number) {
      this.slippage = val;
    },
    toggleSlippageModal(val: boolean) {
      this.modal.showSlippage = val;
    },
    toggleTokeListModal(isInputSide: boolean) {
      this.modal.showTokenList = !this.modal.showTokenList;
      if (isInputSide) {
        this.selectingInputToken = true;
      } else {
        this.selectingInputToken = false;
      }
    },
    setTokenInfo(token: IToken) {
      let data = token;
      if (data.address === "So11111111111111111111111111111111111111112") {
        data["balance"] = this.splTokenList.find(
          (t) => t.mint === "11111111111111111111111111111111"
        )?.balance!;
      }
      if (this.splTokenList.find((t) => t.mint === token.address)) {
        data["balance"] = this.splTokenList.find(
          (t) => t.mint === token.address
        )?.balance!;
      }
      if (this.selectingInputToken) {
        this.tokenInfo.input = data;
      } else {
        this.tokenInfo.output = data;
      }
    },
    setInputAmount(val: number) {
      this.amount.input = val;
    },
    switchInputAndOutputToken() {
      let data = {
        input: this.tokenInfo.output,
        output: this.tokenInfo.input,
      };

      this.tokenInfo = JSON.parse(JSON.stringify(data));
    },
    isLoadingRoutes() {
      // loading
      // this.routes = null;
      this.loading.routes = true;
    },
    async getSplTokenDataList(
      connection: Connection,
      pubkey: PublicKey
    ): Promise<ISplTokenInfo[]> {
      const TOKEN_PROGRAM_ID = new PublicKey(
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      );
      const splList = await connection.getParsedTokenAccountsByOwner(
        pubkey,
        {
          programId: new PublicKey(TOKEN_PROGRAM_ID),
        },
        "confirmed"
      );

      let accountInfo = await connection.getAccountInfo(pubkey);

      let list = splList.value.map((item: IParsedInfo) => {
        let parsed = item.account.data.parsed.info;
        let splToken = {} as ISplTokenInfo;
        splToken["mint"] = parsed.mint;
        splToken["balance"] = parsed.tokenAmount.uiAmount;
        splToken["symbol"] = this.tokenMap.get(parsed.mint)!.symbol;
        return splToken;
      });
      list.push({
        mint: accountInfo?.owner.toBase58() as string,
        balance: accountInfo?.lamports! / LAMPORTS_PER_SOL,
      });
      return list;
    },
    async sendTransaction() {
      const inputAmountInSmallestUnits = this.tokenInfo.input
        ? Math.round(
            (this.amount.input as number) * 10 ** this.tokenInfo.input.decimals
          )
        : 0;

      let routes =
        this.tokenInfo.input.address && this.tokenInfo.output.address
          ? await this.jupiter.computeRoutes(
              new PublicKey(this.tokenInfo.input.address),
              new PublicKey(this.tokenInfo.output.address),
              inputAmountInSmallestUnits,
              this.slippage,
              true
            )
          : null;
      console.log(routes, "######");
      const { transactions } = await this.jupiter.exchange({
        // @ts-ignore
        route: routes?.routesInfos[0],
      });
      console.log(transactions, "###");
    },
  },
});
</script>
<style lang="sass">
html, body
  font-size: 10px
  margin: 0
  padding: 0
  input
    border: none
  input[type='number']
    -moz-appearance: textfield
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button
    -webkit-appearance: none
.swapPage
  background-color: rgb(35, 35, 35)
  width: 100vw
  height: 100vh
  color: white
  .wholeSwapContainer
    position: absolute
    top: 5rem
    left: 50%
    transform: translateX(-50%)
    width: 40rem
    color: white
</style>
