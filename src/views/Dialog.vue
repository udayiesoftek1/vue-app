<template>
  <div v-if="open" class="my-dialog">
    <div class="dialog-content">
      <h2>Enter Area Name:</h2>
      <input type="text" v-model="inputValue" placeholder="Area Name" />
      <div class="buttons">
        <button @click="$emit('confirm')">Confirm</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    open: Boolean,
    inputValue: String
  },
  emits: ['confirm', 'close']
}
</script>

<style scoped>
.my-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

.buttons {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

button {
  margin-left: 10px;
}
</style>
