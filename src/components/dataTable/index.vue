<template>
  <div class="data-table">
    <ul id="data-title">
      <li v-for="item in titleList">
        {{ item.name }}
      </li>
    </ul>
    <ul id="data-list">
      <li v-for="(item, index) in dataFullList">
        <div :class="item.name" :style="{width: item.width}">
          {{ item.value }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
      name: "index",
      props: {
        titleList: {
          type: Array,
          default: () => ([])
        },
        dataFullList: {
          type: Array,
          default: () => ([])
        }
      }
    }
</script>

<style scoped>

</style>
