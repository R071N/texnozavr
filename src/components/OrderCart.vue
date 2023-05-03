<template>
  <li class="cart__order" :key="item.productsId">
    <h3>{{ item.product.title }}</h3>
    <b>{{ (item.amount * item.product.price) | numberFormat}} ₽ </b>
    <span>Артикул: {{ item.productsId }}</span>
    <span>Кол-во {{ item.amount }}</span>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['item'],
  filters: { numberFormat },
};
</script>
