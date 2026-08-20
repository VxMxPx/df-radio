<script>
  import { APP_NAME } from '$root/constants'
</script>

<footer>
  <span> &copy; 2026 {APP_NAME} </span>
  <span> | </span>
  <a href="/privacy.txt"> Privacy </a>
  <span> | </span>
  <a href="/llms.txt"> LLMS </a>
  <span> | </span>
  <a href="/ai-disclaimer.txt"> AI Disclaimer </a>
  <span> | </span>
  <a href="/contact">Request Removal →</a>
</footer>

<style>
  footer {
    text-align: center;
    position: relative;
    z-index: 1;
    border-radius: 2px;
    padding: 5px 10px;
    font: var(--font-body-small);
    background: var(--bg-primary);
  }
  footer,
  footer > * {
    color: var(--tx-primary-50);
  }
</style>
