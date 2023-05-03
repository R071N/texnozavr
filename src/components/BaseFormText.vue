<template>
  <BaseFormField :title="title" :error="error">
    <label for="#">
      <input class="form__input" type="text" v-model="dataValue" :placeholder="placeholder">
    </label>
  </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';

export default {
  mixins: [formFieldMixin],
};
</script>
