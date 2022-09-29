<template>
  <div>
    <h1>Git diff viewer</h1>
    <div class="view-form container">
      <div class="form-input">
        <textarea
          v-model="input"
          placeholder="Input diff here..." rows="15"></textarea>
      </div>
      <button
        class="button"
        :disabled="!input"
        @click="doParse">
          Parse
        </button>
        <div v-html="output" />
    </div>
  </div>
</template>

<script lang="ts">
import { http } from '../helpers/http'
import { defineComponent, ref } from 'vue'
import { useToast } from "vue-toastification";
import 'diff2html/bundles/css/diff2html.min.css'

export default defineComponent({
  setup () {
    const input = ref('')
    const output = ref('')
    const toast = useToast();

    const doParse = async () => {
      try {
        const { data } = await http.post('/parse', { diff: input.value })
        output.value = data
      } catch (error) {
        toast.error((error as any).message)
      }
    }
    
    return {
      input,
      output,
      doParse,
    }
  }
})
</script>

<style lang="scss">
textarea {
   height: auto !important;
}

.view-form {
  .form-input {
    width: 600px;
    margin: auto;
    width: 50%;
  }
}
</style>