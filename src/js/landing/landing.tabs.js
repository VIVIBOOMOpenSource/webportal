import { act } from "react-dom/test-utils";
import { app } from "../../js/utils/app";

app.plugins.createTab({
  triggers: ".login-register-form-trigger",
  elements: ".login-register-form-element",
  animation: {
    type: "slide-in-right",
  },
  onTabChange: function (activeTab) {
    const firstInput = activeTab.querySelector("input");
    firstInput.focus();
  },
});
