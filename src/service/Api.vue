<script lang="ts">
class Api {
  constructor() {
  }
  

  mockPro = false
  preLink = process.env.NODE_ENV !== "development" || this.mockPro ? "https://www.xianneng.top/api/launcher-box" : "http://localhost:8030"
  historyPage = this.preLink + "/chromeHistory/page"
  scheduleTask = this.preLink + "/scheduleTask/list"
  schedule = this.preLink + "/com/manual/schedule"
}

const api = new Api()
export default api
</script>