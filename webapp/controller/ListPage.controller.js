sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/arteriatech/ss/utils/js/Common",
    "com/arteriatech/ppc/utils/js/Common"
    
],
function (Controller,SSCommon,PPCCommon) {
    "use strict";

    return Controller.extend("com.arteriatech.sfcrt.create.controller.ListPage", {
        onInit: function () {
            this.onInitialHookUp();
        },

        onInitialHookUp: function(){
            this._oView = this.getView();
            this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
            var oDataModel = this._oComponent.getModel("PCGW");
            var oUtilsI18n = this._oComponent.getModel("ppcutili18n").getResourceBundle();
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.attachRouteMatched(this.onRouteMatched, this);
        },
        onRouteMatched:function(){
            
        },
        onCreate:function(){
            this._oRouter.navTo("CreatePage", {}, true);
        }
    });
});