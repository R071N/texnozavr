<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <img :src="product.image" :alt="product.title">
    </router-link>
    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>
    <span class="catalog__price">
      {{ product.price | numberFormat }} ₽
    </span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="code in product.colors" :key="code.id">
        <label for="code.code" class="colors__label">
          <input class="colors__radio sr-only" type="radio"
          :value="code.code"
          v-model="color"
          :id="code.id">
          <span class="colors__value"
          :style="{'background-color': code.code}">
          </span>
        </label>
      </li>
    </ul>

  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  data() {
    return {
      color: '#73B6EA',
    };
  },
  filters: { numberFormat },
  props: ['product'],
};
</script>
