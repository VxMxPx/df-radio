<script lang="ts">
  type Props = {
    edge?: boolean
    center?: boolean
    class?: string
  }
  const { edge = true, center = true, class: class_name = '' }: Props = $props()
</script>

<div class="ui divider_ui {class_name}" class:edge class:center>
  <div class="ls"></div>
  <div class="rpt"></div>
  <div class="cntr"></div>
  <div class="rpt"></div>
  <div class="rs"></div>
</div>

<style>
  .divider_ui {
    display: flex;
    width: 100%;
    height: 25px;
    align-items: center;
    position: relative;
  }
  .divider_ui:not(.center) .cntr {
    display: none;
  }
  .divider_ui:not(.edge) .ls,
  .divider_ui:not(.edge) .rs {
    width: 40px;
    display: none;
  }
  .divider_ui > * {
    mix-blend-mode: luminosity;
    height: 100%;
    aspect-ratio: 1/1;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: left center;
    flex-grow: 0;
  }
  .ls {
    background-image: url(/style/div-LS.png);
  }
  .rs {
    background-image: url(/style/div-RS.png);
    background-position: right center;
  }
  .cntr {
    background-image: url(/style/div-CNTR.png);
    background-position: center center;
    width: 50px;
  }
  .rpt {
    background-image: url(/style/div-RP.png);
    background-repeat: repeat-x;
    flex-grow: 1;
    aspect-ratio: auto;
    background-size: 4px;
  }
</style>
