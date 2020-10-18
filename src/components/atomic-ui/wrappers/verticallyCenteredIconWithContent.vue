<template>
  <div class="vertically-centered-icon-with-content">
    <span class="icon-container">
      <slot name="icon"></slot>
    </span>
    <slot></slot>
  </div>
</template>

<style lang="scss">
  .vertically-centered-icon-with-content {
      display:grid;
      grid-template-columns: 1.75rem 1fr;
      > *:not(.icon-container) {
        grid-column: 2 / -1;
      }
      > .icon-container {
        grid-row: span 2;
        align-self: center;
      }
    }
</style>
