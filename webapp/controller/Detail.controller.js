sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/arteriatech/ss/utils/js/Common",
    "com/arteriatech/ppc/utils/js/Common"
],
function (Controller,SSCommon,PPCCommon) {
    "use strict";
    var contextPath;

    return Controller.extend("com.arteriatech.sfcrt.create.controller.Detail", {
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
            this. setDefaultSettingModel();
            
        },

        setDefaultSettingModel:function(){
            var json={
                messageLength:0,
                Detail:true,
                Edit:false,
                errormsg: false,
                editBtn:true,
                saveBtn:false,
                reviewBtn:false,
                cancelbtn:false
            }

            var ojsonmodel = new sap.ui.model.json.JSONModel();
            ojsonmodel.setData(json);
            this.getView().setModel(ojsonmodel,"LocalViewSettingsDetail");
        },
        onRouteMatched:function(oEvent){
            var oHistory = sap.ui.core.routing.History.getInstance();
            if(oEvent.getParameter("name")!== "Detail"){
                return;
            }
            if(oHistory.getDirection()!=="Backwards"){
                contextPath = oEvent.getParameter("arguments").contextPath;
            this.getDetailData();
        }
    },
        onBack:function(){
            if (this.getView().getModel("LocalViewSettingsDetail").getProperty("/Edit")){
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/Edit", false);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/editBtn", true);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/Detail",true);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/saveBtn",false);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/cancelbtn",false);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/reviewBtn", false);
            }
            else if(this.getView().getModel("LocalViewSettingsDetail").getProperty("/reviewBtn")){
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/saveBtn",true);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/Detail",false);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/Edit", true);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/editBtn", false);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/reviewBtn", false);
            }
            else if(this.getView().getModel("LocalViewSettingsDetail").getProperty("/saveBtn")){
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/saveBtn",false);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/Edit", true);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/reviewBtn", true);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/cancelbtn",true);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/Detail",false);

            }
            else{
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("ListPage", {}, true);
            }
        },


        getDetailData:function(){
            var that = this;
           // BusyDialog.open();
            var oModel = that._oComponent.getModel("PYGWHANA");
            var oFilter=[];
            var ID = PPCCommon.getPropertyValueFromContextPath(contextPath,"ID");
            oFilter.push(new sap.ui.model.Filter("ID","EQ",ID));
            oModel.read("/BPHeader",{
                filters: oFilter,
                success: function(oData){
                    //BusyDialog.close();
                    if(oData){
                        var jsonModel = new sap.ui.model.json.JSONModel();
                        jsonModel.setData(oData.results[0]);
                        that._oComponent.setModel(jsonModel,"DetailModel");    
                    }
                }
            })

        },

        onEdit:function(){
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/Detail",false);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/Edit",true);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/editBtn",false);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/reviewBtn",true);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/cancelbtn",true);
        },

        onCancel:function(){
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/Detail",true);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/editBtn",true);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/cancelbtn",false);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/reviewBtn",false);
        },

        
        onReview:function(){
            PPCCommon.removeAllMsgs();
            PPCCommon.hideMessagePopover();
            this.validateData();
            if (PPCCommon.doErrMessageExist()) {
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/Detail", true);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/reviewBtn", false);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/Edit", false);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/editBtn", false);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/saveBtn",true);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/cancelbtn",false);
            this.getView().getModel("LocalViewSettingsDetail").setProperty("/messageLength", sap.ui.getCore().getMessageManager().getMessageModel()
                        .getData().length);
            }
            else {
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/messageLength", sap.ui.getCore().getMessageManager().getMessageModel()
                    .getData().length);
                this.getView().getModel("LocalViewSettingsDetail").setProperty("/errormsg", true);
                // PPCCommon.showMessagePopover(gDetailPageBasic);
                // PPCCommon.showMessagePopover(gDetailBusiness1);
                // PPCCommon.showMessagePopover(gDetailBusiness2);
                this.onshowerrorpopup();
            }
        },


        onshowerrorpopup: function () {
            PPCCommon.showMessagePopover(gObjectPageLayoutID);
            // oPPCommon.showMessagePopover(gDetailBusiness1);
            // oPPCommon.showMessagePopover(gDetailBusiness2);
        },
        onSavePopup: function () {

            if (!this.oFixedSizeDialog) {
                this.oFixedSizeDialog = new Dialog({
                    title: "Confirmation",
                    content: new sap.m.Text({
                        text: "Do you want to Update?",
                    }),
                    beginButton: new Button({
                        text: "OK",
                        press: function () {
                            this.onSave();
                            this.oFixedSizeDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "Close",
                        press: function () {
                            this.oFixedSizeDialog.close();
                        }.bind(this)
                    })
                });

                //to get access to the controller's model
                this.getView().addDependent(this.oFixedSizeDialog);
            }

            this.oFixedSizeDialog.open();
        },

        onSave:function(){
            var that = this;
            var oData = this.getView().getModel("DetailModel").getData();
            var oModel = this.getView().getModel("PYGWHANA");

            oModel.update("/BPHeader(ID='"+oData.ID+"')",oData,{
                success:function(data,status){
                    BusyDialog.close();
                    if (status.statusCode === "204"){
                        var oSuccessMessageDialog = new Dialog({
                            title: "Success",
                            type: DialogType.Message,
                            state: ValueState.Success,
                            content: new sap.m.Text({
                                text: "Record Updated Successfully"
                            }),
                            beginButton: new Button({
                                text: "OK",
                                press: function () {
                                    //this._common = [];
                                    // window.location.reload()
                                    that.getView().getModel("LocalViewSettingsDetail").setProperty("/reviewBtn", false);
                                    that.getView().getModel("LocalViewSettingsDetail").setProperty("/saveBtn", false);
                                    that.getView().getModel("LocalViewSettingsDetail").setProperty("/editBtn", true);
                                    that.getView().getModel("LocalViewSettingsDetail").setProperty("/Detail", true);
                                    that.getView().getModel("LocalViewSettingsDetail").setProperty("/Edit", false);
                                    this.getView().getModel("LocalViewSettingsDetail").setProperty("/cancelbtn",false);
                                    that.getView().getModel("LocalViewSettingsDetail").setProperty("/messageLength", sap.ui.getCore().getMessageManager().getMessageModel()
                                        .getData().length);
                                    oSuccessMessageDialog.close();
                                }.bind(that)
                            })
                        });
                        oSuccessMessageDialog.open();
                    }
                    else {
                        // MessageBox.warning("Please check Again")
                    }
                },error:function(data,status){
                    MessageBox.warning("Please check Again")
                    BusyDialog.close();
                    // MessageBox.error("Record Not Created, Please check Again!!")
                    if (data.statusCode === "400"){
                        var oSuccessMessageDialog = new Dialog({
                            title: "Error",
                            type: DialogType.Message,
                            state: ValueState.Error,
                            content: new sap.m.Text({
                                text: "Please add all properties"
                            }),
                        })
                        oSuccessMessageDialog.open();
                    }
                }

            });

        },

        validateData: function () {
            var oModel = this.getView().getModel("DetailModel").getData();
            if(!oModel.CPGuid){
                gDetailObjectHeader.byId("idCPGuid1").setValueState("Error");
                gDetailObjectHeader.byId("idCPGuid1").setValueStateText(oi18n.getText("Error.cpguid"));
                PPCCommon.addMsg_MsgMgr(oi18n.getText("Error.cpguid"));
            } 
            else{
                gDetailObjectHeader.byId("idCPGuid1").setValueState("None");
                gDetailObjectHeader.byId("idCPGuid1").setValueStateText("");
            }
        },

        

       
    });
});