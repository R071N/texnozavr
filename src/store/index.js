import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,

    cartProductsData: [],

    orderInfo: null,
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData
          .find((p) => p.product.id === item.productsId);
        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts
        .reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    orderInfo(state) {
      return state.orderInfo;
    },
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { productsId, amount }) {
      const item = state.cartProducts.find((itemId) => itemId.productsId === productsId);

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productsId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productsId !== productsId);
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productsId: item.product.id,
        amount: item.quantity,
      }));
    },
  },
  actions: {
    async loadOrderInfo(context, orderId) {
      const response = await axios
      // eslint-disable-next-line
        .get('https://vue-study.skillbox.cc/api/orders/' + orderId, {
          params: { userAccessKey: context.state.userAccessKey },
        });
      context.commit('updateOrderInfo', response.data);
    },
    loadCart(context) {
      return axios
        .get('https://vue-study.skillbox.cc/api/baskets', {
          params: { userAccessKey: context.state.userAccessKey },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    async addProductToCart(context, { productsId, amount }) {
      // eslint-disable-next-line
      await (new Promise((resolve) => setTimeout(resolve, 2000)));
      const response = await axios
        .post('https://vue-study.skillbox.cc/api/baskets/products', {
          productId: productsId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        });
      context.commit('updateCartProductsData', response.data.items);
      context.commit('syncCartProducts');
    },
    async updateCartProductAmount(context, { productsId, amount }) {
      context.commit('updateCartProductAmount', { productsId, amount });
      if (amount < 1) {
        return;
      }
      try {
        const response = await axios
          .put('https://vue-study.skillbox.cc/api/baskets/products', {
            productId: productsId,
            quantity: amount,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          });
        context.commit('updateCartProductsData', response.data.items);
      } catch {
        context.commit('syncCartProducts');
      }
    },
    async deleteFromCartProduct(context, productsId) {
      const response = await axios
        .delete('https://vue-study.skillbox.cc/api/baskets/products', {
          data: { productId: productsId },
          params: { userAccessKey: context.state.userAccessKey },
        });
      context.commit('updateCartProductsData', response.data.items);
      context.commit('syncCartProducts');
    },
  },
  modules: {
  },
});
