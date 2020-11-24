<script lang="ts">
  const optInText =
    window.registrationContent[getMarket()].contactMethodsLabel[getLang()];
  const label = document.querySelector(".contact-methods__label");
  let documentObserver = new MutationObserver(function (mutations) {
    if (document.body.contains(label)) {
      label.innerHTML = optInText;
      documentObserver.disconnect();
    }
  });

  documentObserver.observe(document, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  });

  function getMarket() {
    return window.config.defaults.addressCountry;
  }
  function getLang() {
    if (!window.config) {
      console.log("AB - window.config not found");
    }
    const ns = window.config.padl.namespace;
    if (!ns) {
      console.log("AB - padl.namespace not found");
    }
    const dataLayer = window[ns].dataLayer;
    if (!dataLayer) {
      console.log("AB - window[ns].dataLayer not found");
    }
    return window[ns].dataLayer.page.page.pageInfo.language;
  }
</script>
