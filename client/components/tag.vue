<template>
  <div class="tagBox">
    <span>{{ tagValue }}</span>
    <button @click="deleteTag">X</button>
  </div>
</template>

<script>
export default {
  name: 'tagBox',
  props: {
    tagValue: {
      type: String,
      default: 'none',
    },
  },
  methods: {
    deleteTag() {
      this.$emit('remove'); // remove event
    },
  },
};
</script>

<style>
.tagBox {
  display: flex;
  align-items: center;
  padding: 3px 10px;
  background: rgba(0, 0, 0, .1);
  border-radius: 20px;
}
.tagBox span {
  font-size: .8rem;
}
.tagBox button {
  width: 18px;
  height: 18px;
  margin-left: 5px;
  border: none;
  outline: none;
  background: rgba(0, 0, 0, .3);
  border-radius: 9px;
  color: white;
  font-size: .7rem;
}
</style>
