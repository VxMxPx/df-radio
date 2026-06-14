<div class="lines">
  <div class="lines-1">
    <small>1440</small>
  </div>
  <div class="lines-2">
    <small>1800</small>
  </div>
  <div class="lines-3">
    <small>22·22</small>
  </div>
</div>

<style>
  @media (width < 1400px) {
    .lines {
      display: none;
    }
  }

  .lines > div {
    z-index: 0;
    position: fixed;
  }

  .lines > div > small {
    color: #ecbd47;
    opacity: 40%;
    position: absolute;
  }

  .lines-1 {
    width: 134px;
    height: 56px;
    background: url('/images/lines-right-2.svg') no-repeat;
    background-size: 100%;
    right: 0;
    top: 40%;
  }

  .lines-1 > small {
    top: 8px;
    left: 40px;
  }

  .lines-2 {
    width: 210px;
    height: 130px;
    background: url('/images/lines-right-1.svg') no-repeat;
    background-size: 100%;
    right: -20px;
    top: 20%;
  }

  .lines-2 > small {
    top: 30px;
    left: 70px;
  }

  .lines-3 {
    width: 210px;
    height: 154px;
    background: url('/images/lines-left-1.svg') no-repeat;
    background-size: 100%;
    left: -20px;
    top: 277px;
  }

  .lines-3 > small {
    top: 90px;
    left: 120px;
  }
</style>
