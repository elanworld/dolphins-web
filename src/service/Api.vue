<script lang="ts">
class Api {
  constructor() {
  }

  mockPro = true
  preLink = process.env.NODE_ENV !== "development" || this.mockPro ? "https://www.xianneng.top/api/launcher-box" : "http://localhost:8070/launcher-box"
  historyPage = this.preLink + "/chromeHistory/page"
}

const api = new Api()
export default api
</script>