<script lang="ts">
class Api {
  constructor() {
  }
  

  mockPro = false
  preLink = process.env.NODE_ENV !== "development" || this.mockPro ? "https://www.xianneng.top/api/launcher-box" : "http://localhost:8030"
  historyPage = this.preLink + "/chromeHistoryExt/page"
  scheduleTask = this.preLink + "/scheduleTaskExt/list"
  schedule = this.preLink + "/com/manual/schedule"
  plot = this.preLink + '/chromeHistory/plot'
  login = this.preLink + '/system/login'
  register =  this.preLink + '/system/authUser'
  filesRecordUser = this.preLink + '/com/file/current'
  filesRecord=  this.preLink + '/filesRecord'
  fileUpload=  this.preLink + '/filesBucket/upload/open'
  appRecord= this.preLink + '/appRecordExt/query'
}

const api = new Api()
export default api
</script>