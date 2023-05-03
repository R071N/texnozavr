<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        152 товара
      </span>
    </div>

    <div class="content__catalog">

      <ProductFilter :price-from.sync="filterPriceFrom" :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoriesId" :color-id.sync="filterColorsId" />

      <section class="catalog">
        <div id="clock1" v-if="productsLoading"></div>
        <div v-if="productsLoadingFailed">Ошибка при загрузке товаров
          <button @click.prevent="loadProducts">Попробовать ещё раз</button>
        </div>
        <ProductList :products="products" />
        <BasePagination :page.sync="page" :count="countProducts" :per-page="productsPerPage" />
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import axios from 'axios';

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoriesId: 0,
      filterColorsId: '',

      page: 1,
      productsPerPage: 3,

      productsData: 0,
      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productsData
        ? this.productsData.items.map((product) => ({
          ...product,
          image: product.image.file.url,
        }))
        : [];
    },
    countProducts() {
      return this.productsData
        ? this.productsData.pagination.total
        : 0;
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get('https://vue-study.skillbox.cc/api/products', {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              categoryId: this.filterCategoriesId,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
              colorId: this.filterColorsId,
            },
          })
          .then((response) => { this.productsData = response.data; })
          .catch(() => { this.productsLoadingFailed = true; })
          .then(() => { this.productsLoading = false; });
      }, 1000);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterCategoriesId() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterColorsId() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>

<style>
#clock1 {
  display: block;
  position: absolute;
  top: 30%;
  left: 55%;
  height: 100px;
  width: 100px;
  margin: -25px 0 0 -25px;
  border-radius: 50%;
  border: 2px #000 solid;
}

#clock1:before {
  content: '';
  border-left: 1px #000 solid;
  position: absolute;
  top: 9%;
  left: 50%;
  width: 2px;
  height: -webkit-calc( 50% - 2px );
  height: calc( 50% - 2px );
  -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
  -ms-transform-origin: 0% 100%;
  -webkit-transform-origin: 0% 100%;
          transform-origin: 0% 100%;
  -webkit-transform-origin: 0% 100%;
      -ms-transform-origin: 0% 100%;
          transform-origin: 0% 100%;
  -webkit-animation: spClock 1s infinite linear;
          animation: spClock 1s infinite linear;
}

@-webkit-keyframes spClock {
  from {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
  }
}
@keyframes spClock {
  from {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
  }
}
  </style>
