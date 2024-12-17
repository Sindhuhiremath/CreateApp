sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/arteriatech/ss/utils/js/Common",
    "com/arteriatech/ppc/utils/js/Common"
],
function (Controller,SSCommon,PPCCommon) {
    "use strict";

    return Controller.extend("com.arteriatech.sfcrt.create.controller.Main", {
        onInit: function () {
            this._oComponent = sap.ui.component(sap.ui.Component.getOwnerIdFor(this.getView()));
            var oDataModel = this._oComponent.getModel("PCGW");
            var oUtilsI18n = this._oComponent.getModel("ppcutili18n").getResourceBundle();
            this._oRouter = sap.ui.core.UIComponent.getRouteFor(this);

            if(sap.ui.Device.support.touch===false){
                this.getView().addStyleClass("sapUiSizeCompact");
            }
            if(this.onInitHookUp_Exit){
                this.onInitHookUp();
            }

        }
    });
});
