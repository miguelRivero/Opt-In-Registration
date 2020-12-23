<script lang="ts">
  const copyContent = window.registrationContent[getMarket()];
  const lang = getLang();
  const contactNewContent = `
  <span class="contact-methods__label">${copyContent["contactMethodsLabel"][lang]}</span>
  
  <ul id="contact-method-list" class="contact-methods__list">
   <li class="contact-method">
      <input id="ta-registration-keep-me-informed" name="optins.contactMeans.emailAuthorized" class="contact-method__input" data-track-preference-name="Email" type="checkbox" value="true"><input type="hidden" name="_optins.contactMeans.emailAuthorized" value="on" style="">
      <label for="ta-registration-keep-me-informed" class="keep-me-informed__label">
        ${copyContent["contactMethods"][lang]["email"]}
      </label>
   </li>
   <li class="contact-method">
      <input id="messagingAuthorized" name="optins.contactMeans.messagingAuthorized" class="contact-method__input" data-track-preference-name="SMS" type="checkbox" value="true"><input type="hidden" name="_optins.contactMeans.messagingAuthorized" value="on" style="">
      <label class="contact-method__label" for="messagingAuthorized">
        ${copyContent["contactMethods"][lang]["sms"]}
      </label>
   </li>
   <li class="contact-method">
      <input id="phoneAuthorized" name="optins.contactMeans.phoneAuthorized" class="contact-method__input" data-track-preference-name="Phone" type="checkbox" value="true"><input type="hidden" name="_optins.contactMeans.phoneAuthorized" value="on" style="">
      <label class="contact-method__label" for="phoneAuthorized">
        ${copyContent["contactMethods"][lang]["call"]}
      </label>
   </li>
</ul>
<p class="contact-methods__clarification">${copyContent["clarification1"][lang]}</p>
<p class="contact-methods__clarification">${copyContent["clarification2"][lang]}</p>
<p class="contact-methods__clarification">${copyContent["clarification3"][lang]}</p>
  `;

  const formContainer = document.querySelector(
    ".form-container.contact-methods"
  ) as HTMLElement;

  let documentObserver = new MutationObserver(function (mutations) {
    if (document.body.contains(formContainer)) {
      formContainer.innerHTML = contactNewContent;

      // Some styling
      formContainer.querySelector("#contact-method-list").style.margin =
        "0.5rem 0";

      formContainer.querySelectorAll("i").forEach(function (item) {
        item.style.fontStyle = "italic";
      });

      let clarifications = formContainer.querySelectorAll(
        ".contact-methods__clarification"
      );
      clarifications.forEach(function (item) {
        item.style.fontSize = "0.625rem";
      });

      // links
      formContainer
        .querySelector("#privacy-notice-legal-link")
        .setAttribute("href", copyContent.privacyNoticeLegalLink[lang]);

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
