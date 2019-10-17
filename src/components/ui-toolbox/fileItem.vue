<template>
  <li class="file-item level has-background-light box">
    <div class="level-left">
      <p class="filename level-item">{{filename}}</p>
    </div>
    <div class="level-right">
      <p class="filetype level-item">{{filetype==''?'no defined type':filetype}}</p>
      <p class="filesize level-item">{{filesizeFormated}}</p>
      <div class="level-item">
        <p class="buttons">
          <bulmaButton class="is-small" purpose="" picto="cog" @click="$emit('settings')" rounded />
          <bulmaButton class="is-small" purpose="info" picto="play" @click="$emit('play')" rounded />
          <bulmaButton class="is-small" purpose="" picto="times" @click="$emit('delete')" rounded />
        </p>
      </div>
    </div>
  </li>
</template>

<script>
/**
 * @function convertUnit
 * @param {Number} nbr
 * @param {Number} zeros // number of zeros you want to pass behind the comma
 * @param {Number} precision // number of digit you want to keep after the comma
 */
function convertUnit (nbr, zeros, precision) {
  function paramCheck (param, defaultValue) {
    let checkedParam = param
    if (typeof (checkedParam) !== 'number') {
      checkedParam = Number(checkedParam)
      if (Number.isNaN(checkedParam)) checkedParam = defaultValue
    }
    return checkedParam
  }
  zeros = paramCheck(zeros, 1)
  precision = paramCheck(precision, 2)
  let divider = Math.pow(10, zeros - precision)
  let precisionDivider = Math.pow(10, precision)
  return Math.round(nbr / divider) / precisionDivider
}
export default {
  name: 'fileItem',
  props: {
    'filedata': Object
  },
  computed: {
    filename () { return this.filedata.name },
    filetype () { return this.filedata.type },
    filesize () { return this.filedata.size },
    filesizeFormated () {
      if (this.filesize < Math.pow(10, 3)) {
        return `${this.filesize} octet`
      } else if (this.filesize < Math.pow(10, 6)) {
        return `${convertUnit(this.filesize, 3, 2)} ko`
      } else {
        return `${convertUnit(this.filesize, 6, 2)} Mo`
      }
    }
  }
}
</script>

<style lang="scss">
  .file-item {
    .filetype {
      font-style: italic;
    }
  }
</style>
