<template>
  <div class="dropfile-box box" ref="dropArea">
    <span class="content box">Drag your file here</span>
    <ul class="filelist">
      <fileItem
        v-for="(fileUid, key) in $store.state.userSettings.fileIdList"
        :key="key"
        :filedata="getFileData(fileUid)"
        @delete="removeFile(key)"
        @play="useFile(key)"
      />
    </ul>
  </div>
</template>

<script>
import fileItem from '@/components/ui-toolbox/fileItem'

export default {
  name: 'dropfile-box',
  components: {
    fileItem
  },
  computed: {
    getFileData () {
      return (uid) => {
        let fileData = this.$store.state.files.list[uid]
        return fileData || {}
      }
    }
  },
  methods: {
    removeFile (fileKey) {
      this.$store.dispatch('DEL_AND_UNLOG_FILE', fileKey)
    },
    useFile (fileKey) {
      let uid = this.$store.getters.getUniqueId(fileKey)
      let file = this.$store.state.files.list[uid]
      if (file) {
        this.$store.commit('SETTINGS_SET_PROP', { prop: 'openedFile', value: uid })
        this.$router.push('/csv-display')
      } else {
        console.error(`File #${fileKey} doesn't exist.`)
      }
    },
    loading () {
      this.$router.push({
        name: 'csv-loading',
        params: {
          msg: 'Please wait while I analyze this file'
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (evt) {
        /*
            For each event add an event listener that prevents the default action
            (opening the file in the browser) and stop the propagation of the event (so
            no other elements open the file in the browser)
          */
        this.$refs.dropArea.addEventListener(evt, function (e) {
          e.preventDefault()
          e.stopPropagation()
        }, false)
      }.bind(this))

      /*
          Add an event listener for drop to the form
        */
      this.$refs.dropArea.addEventListener('drop', function (e) {
        /*
            Capture the files from the drop event and add them to our local files
            array.
          */
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          // Check the filetype, if it isn't text or void, do nothing
          let fileDescriptor = {}
          for (const key in e.dataTransfer.files[i]) {
            fileDescriptor[key] = e.dataTransfer.files[i][key]
          }
          if (fileDescriptor.type === '' || /^text|ms-excel/.test(fileDescriptor.type)) {
            this.$store.dispatch('ADD_AND_LOG_FILE', fileDescriptor)
          } else {
            console.log('cannot drag ' + fileDescriptor.type + ' files')
            console.log(e.dataTransfer.files[i])
          }
          this.$emit('uploaded')
        }
      }.bind(this))
    })
  }
}
</script>

<style lang="scss">
  $base-color: #889aa9;
  .dropfile-box{
    border: 1px solid rgb(10, 10, 107);
    .filelist{
      list-style: none;
      padding: 0;
    }
  }

</style>
