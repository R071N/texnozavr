<template>
  <div class="content container" v-if="!item">Товары не найдены</div>
  <div id="clock1" class="content container" v-else-if="cartLoading"></div>
  <li v-else class="cart__item product" :key="item.productId">
    <div class="product__pic">
      <img :src="item.product.image" width="120" height="120" alt="item.product.title">
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <span class="product__code">
      Артикул: {{ item.product.id }}
    </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар"
      @click.prevent="amountRemoveCount" :disabled="amount === 1">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>
      <label for="#">
        <input type="text" v-model.number="amount" name="count">
      </label>
      <button type="button" aria-label="Добавить один товар"
      @click.prevent="amountAddCount">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ (item.amount * item.product.price) | numberFormat}} ₽
    </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
    @click.prevent="deleteCart(item.product.id)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>

</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      cartLoading: false,
      cartLoadingFailed: false,

      cartDeleteProduct: false,
      cartDeleteSending: false,
    };
  },
  props: ['item', 'cartProd'],
  filters: { numberFormat },
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        return this.$store.dispatch('updateCartProductAmount', { productsId: this.item.productsId, amount: value });
      },
    },
  },
  methods: {
    ...mapActions({ deleteCart: 'deleteFromCartProduct' }),
    loadCartProduct() {
      this.cartLoading = true;
      this.cartLoadingFailed = false;
      clearTimeout(this.loadCartTimer);
      this.loadCartTimer = setTimeout(() => {
        axios
          .get('https://vue-study.skillbox.cc/api/baskets')
          .catch(() => { this.cartLoadingFailed = true; })
          .then(() => { this.cartLoading = false; });
      }, 1000);
    },
    amountRemoveCount() {
      if (this.item.amount > 0) {
        this.amount -= 1;
      }
    },
    amountAddCount() {
      if (this.item.amount < 999) {
        this.amount += 1;
      }
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadCartProduct();
      },
      immediate: true,
    },
  },
};
</script>
