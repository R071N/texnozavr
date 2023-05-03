<template>
  <router-link class="header__cart" aria-label="Корзина с товарами" :to="{ name: 'cart' }">
    <svg width="30" height="21" fill="currentColor">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span id="clock1" class="content container" v-if="countLoading"></span>
    <span class="content container" v-else-if="!countData">404</span>
    <span class="header__count" aria-label="Количество товаров" v-else>
      {{ $store.state.cartProducts.length }}
    </span>
  </router-link>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      countData: null,
      countLoading: false,
      countLoadingFailed: false,
    };
  },
  methods: {
    loadCount() {
      this.countLoading = true;
      this.countLoadingFailed = false;
      clearTimeout(this.loadCountTimer);
      this.loadCountTimer = setTimeout(() => {
        axios
          .get('https://vue-study.skillbox.cc/api/baskets')
          .then((response) => { this.countData = response.data; })
          .catch(() => { this.countLoadingFailed = true; })
          .then(() => { this.countLoading = false; });
      }, 1000);
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadCount();
      },
      immediate: true,
    },
  },
};
</script>
