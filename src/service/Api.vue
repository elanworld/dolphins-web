<script lang="ts">
class Api {
  constructor() {
  }
  preLink = process.env.NODE_ENV === "development" ? "http://localhost:8080/launcher-box":"https://www.xianneng.top/api/launcher-box"
  historyPage = this.preLink + "/chromeHistory/page"
}

const api = new Api()
export default api
</script>