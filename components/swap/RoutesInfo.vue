<template>
  <div>
    <div>Possible number of routes: {{ routes.routesInfos.length }}</div>
    <!-- <div
      v-for="(item, index) in routes.routesInfos"
      :key="index"
      style="display: flex"
    >
      <div
        v-for="(route, routeIndex) in item.marketInfos"
        :key="'route_' + routeIndex"
      >
        {{ route.marketMeta.amm.label }} >
      </div>
    </div> -->
    <!-- <div>
      Best quote:
      {{ routes.routesInfos[0].outAmount / 10 ** tokenInfo.output.decimals }}
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "RoutesInfo",
  props: ["routes", "tokenInfo"],
  watch: {
    routes: {
      handler(data) {
        console.log(this.routes, "ALL ROUTES");
        console.log("Possible number of routes:", data.routesInfos?.length);
        console.log("Best quote: ", data.routesInfos[0].outAmount);
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>

<style scoped lang="sass"></style>
