<template>
  <div for="#" class="form__label">
    <slot></slot>
    <span class="form__value">{{ title }}</span>
    <span class="form__error" v-if="error">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: ['title', 'error'],
};
</script>
