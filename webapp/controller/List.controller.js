sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/arteriatech/ss/utils/js/Common",
    "com/arteriatech/ppc/utils/js/Common"
],
function (Controller,SSCommon,PPCCommon) {
    "use strict";
    var oDevice = sap.ui.Device;
    var oPPCUtili18n;


    return Controller.extend("com.arteriatech.sfcrt.create.controller.List", {
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
            this.FilterDetails();
            this.setDefaultSettings();
            //this.getAggregatorID();
        },
        onRouteMatched:function(){

        },

        setDefaultSettings: function () {
          var json = {
            visibleRowCount: 0,
            ItemsCount: 0
          };
          var ojsonmodel = new sap.ui.model.json.JSONModel();
          ojsonmodel.setData(json);
          this.getView().setModel(ojsonmodel, "LocalViewSettings")
        },

        onSearch: function () {
          var that = this;
          //BusyDialog.open();
  
          var oModel = this.getView().getModel("PYGWHANA")
          var oFilter = [];
  
          //For Date Filter
          // if (this.getView().byId("DP11").getDateValue()) {
          //   oFilter = oPPCCommon.setODataModelReadFilter(this.getView(), "", oFilter, "CreatedOn", sap.ui.model.FilterOperator.BT, [
          //     this.getView().byId("DP11").getDateValue(), this.getView().byId("DP11").getSecondDateValue(),
          //   ], false, false, false);
          //   // oFilter = oPPCCommon.setODataModelReadFilter(this._oView, "", oFilter, "CreatedOn", sap.ui.model.FilterOperator.BT, [
          //   //   this._oView.byId("DP11").getDateValue(), this._oView.byId("DP11").getSecondDateValue(),
          //   // ], false, false, false);
          // }
  
  
          //For Select filter
          if (this.getView().byId("SelectFilterID").getSelectedKey() !== 'select') {
            oFilter = PPCCommon.setODataModelReadFilter(this.getView(), "", oFilter, "ID", sap.ui.model.FilterOperator.EQ, [
              this.getView().byId("SelectFilterID").getSelectedKey()], false, false, false);
          }
          //for combo box filter
          if (this.getView().byId("Combo").getSelectedKey()) {
            oFilter = PPCCommon.setODataModelReadFilter(this.getView(), "", oFilter, "CPName", sap.ui.model.FilterOperator.EQ, [
              this.getView().byId("Combo").getSelectedKey()], false, false, false);
          }
  
          //for multicombobox filter
          var data = this.getView().byId("MultiCombo").getSelectedKeys();
          for (var i = 0; i < data.length; i++) {
            if (this.getView().byId("MultiCombo").getSelectedKeys()) {
              oFilter = PPCCommon.setODataModelReadFilter(this.getView(), "", oFilter, "CPGuid", sap.ui.model.FilterOperator.EQ, [
                data[i]], false, false, false);
            }
          }
  
          //For MultiInput filter
          var data1 = this.getView().byId("MultiInputID1").getTokens();
          for(var j = 0; j < data1.length; j++){
          if(this.getView().byId("MultiInputID1").getTokens()){
              oFilter = PPCCommon.setODataModelReadFilter(this.getView(),"",oFilter,"AggregatorID", sap.ui.model.FilterOperator.EQ, [data1[j].mProperties.key],false,false,false);
          }
      }
          //for input filter
          if (this.getView().byId("InputID").getValue()) {
            oFilter = PPCCommon.setODataModelReadFilter(this.getView(), "", oFilter, "CPType", sap.ui.model.FilterOperator.EQ, [
              this.getView().byId("InputID").getValue()], false, false, false);
          }
  
          oModel.read("/BPHeader", {
            filters: oFilter,
            success: function (oData) {
             // BusyDialog.close();
              if (oData) {
                var jsonModel = new sap.ui.model.json.JSONModel(oData.results);
                that._oComponent.setModel(jsonModel, "ListItems");
                that.setTableLength(oData.results.length);
              }
            },
            error: function () {
              BusyDialog.close();
              var jsonModel = new sap.ui.model.json.JSONModel([]);
              that._oComponent.setModel(jsonModel, "ListItems");
              that.setTableLength(0);
            }
          })
        },
  

        FilterDetails: function () {
            var that = this;
            var oModel = this._oComponent.getModel("PYGWHANA");
            oModel.read("/BPHeader", {
   
              success: function (oData) {
                //BusyDialog.close();
                if (oData) {
                  var jsonModel = new sap.ui.model.json.JSONModel(oData.results);
                  that._oComponent.setModel(jsonModel, "FilterItems1");
                }
                if (oData) {
                  oData.results.unshift({ ID: "select" });
                  var jsonModel = new sap.ui.model.json.JSONModel(oData.results);
                  that._oComponent.setModel(jsonModel, "FilterItems");
                }
              },
              error: function () {
               // BusyDialog.close();
                var jsonModel = new sap.ui.model.json.JSONModel([]);
                that._oComponent.setModel(jsonModel, "FilterItems");
              }
            })
          },


          AggregatorF4:function(){
            var e = this;
            this.getAggregatorTokenInput = this.getView().byId("MultiInputID1");
            this.AggregatorKeys = ["AggregatorID","CPName"];
            this.Aggregator1F4({
              oController:this,
              bMultiSelect:true
            },function (t) {
              var o = {
                  AggregatorKeyTokens: []
              };
              var r = e.getView().byId("MultiInputID1");
              var a = [];
              if (t.length > 0) {
                  for (var s = 0; s < t.length; s++) {
                      o.AggregatorKeyTokens.push({
                          key: t[s].mProperties.key,
                          text: t[s].mProperties.text
                      })
                  }
              }
          }
          )
          },
    
          Aggregator1F4:function(e,t){
            var o = this;
            if (e.controlID === undefined || e.controlID === null) {
                       e.controlID = "MultiInputID1";
                  }
            if (e.bMultiSelect === undefined || e.bMultiSelect === null) {
             e.bMultiSelect = true
               }
    
            var r = "Aggregator ID";
            var a;
            if (e.oController.getAggregatorTokenInput) {
                       a = e.oController.getAggregatorTokenInput.getValue()
            }
            var s = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
              basicSearchText: a,
              title: r,
              supportMultiselect: e.bMultiSelect,
              supportRanges: false,
              supportRangesOnly: false,
              key: e.oController.AggregatorKeys[0],
              descriptionKey: e.oController.AggregatorKeys[1],
              stretch: sap.ui.Device.system.phone,
              ok: function (o) {
                if (e.oController.getAggregatorTokenInput) {
                    if (sap.ui.Device.system.phone || sap.ui.Device.system.tablet) {
                        var r = [];
                        r.push(o.getParameter("tokens")[0]);
                        e.oController.getAggregatorTokenInput.setTokens(r)
                    } else {
                        e.oController.getAggregatorTokenInput.setTokens(o.getParameter("tokens"))
                    }
                    if (e.controlID) {
                        if (e.oController.getView().byId(e.controlID)) {
                            e.oController.getView().byId(e.controlID).setValueState(sap.ui.core.ValueState.None);
                            e.oController.getView().byId(e.controlID).setValueStateText("")
                        } else {
                            e.oController.getAggregatorTokenInput.setValueState(sap.ui.core.ValueState.None);
                            e.oController.getAggregatorTokenInput.setValueStateText("")
                        }
                    } else {
                        e.oController.getAggregatorTokenInput.setValueState(sap.ui.core.ValueState.None);
                        e.oController.getAggregatorTokenInput.setValueStateText("")
                    }
                    if (t) {
                        t(e.oController.getAggregatorTokenInput.getTokens())
                    }
                }
                var r = [];
                r.push(o.getParameter("tokens")[0]);
                s.close()
            },
            cancel:function(e){
              s.close();
            },
            afterClose:function(){
              s.destroy();
            }
            });
            this.setAggregatorF4Columns(s, e);
            this.setAggregatorF4FilterBar(s,e);
    
            if (sap.ui.Device.support.touch === false) {
                s.addStyleClass("sapUiSizeCompact")
            }
            s.open();
            if (e.oController.getAggregatorTokenInput) {
                s.setTokens(e.oController.getAggregatorTokenInput.getTokens())
            }
          },
    
          setAggregatorF4FilterBar:function(e,t){
    
            var o = new sap.m.BusyDialog();
            var r = "";
            if(t.oController.getAggregatorTokenInput){
              r = t.oController.getAggregatorTokenInput.getValue();
            }
            var a = new sap.m.Input({
              value: r
            });
            var s  = new sap.m.Input({});
            var n = "Aggregator";
            e.setFilterBar(new sap.ui.comp.filterbar.FilterBar({
              advancedMode:true,
              filterGroupItems:[new sap.ui.comp.filterbar.FilterGroupItem({
                groupTitle:"Customer",
                groupName:"gn1",
                name:"n1",
                label:n,
                control:a
              })],
              clear: function(){
                a.setValue("")
                s.setValue("")
              },
              search: function(r){
                var n = a.getValue();
                var I = s.getValue();
                var i = new Array;
                i = PPCCommon.setODataModelReadFilter("", "", i, "AggregatorID", "", [SSCommon.getCurrentLoggedUser({
                  sServiceName: "BPHeader",
                  sRequestType: "read"
              })], false, false, false);
               i = SSCommonValueHelp.setODataModelReadFilter(t.oController.getView(), "", i, "AggregatorID", "", [n], false, false, false);
               i = SSCommonValueHelp.setODataModelReadFilter(t.oController.getView(), "", i, "CPName", "", [I], false, false, false);
              var g = t.oController._oComponent.getModel("PYGWHANA");
              g.attachRequestSent(function() {
                  o.open()
                });
              g.attachRequestCompleted(function () {
                  o.close()
                });
                
    
              },
            }))
            
          },
          setAggregatorF4Columns: function (e, t) {
            var o = this;
            $.ajax({
                url: "/PYGWHANA/BPHeader",
                type: "GET",
                dataType: "JSON",
                async: true,
                success: function (o, r, a) {
                    if (o) {
                        var s = o.d.results;
                        var n = [];
                        for (var l = 0; l < s.length; l++) {
                            n.push({
                                AggregatorID: s[l].AggregatorID,
                                CPName: s[l].CPName
                            })
                        }
                        var i = "Aggregator ID";
                        var g = "CP Name";
                        if (e.getTable().bindItems) {
                            var u = new sap.ui.model.json.JSONModel;
                            u.setData({
                                cols: [{
                                    label: i,
                                    template: "AggregatorID"
                                }, {
                                    label: g,
                                    template: "CP Name"
                                }]
                            });
                            e.getTable().setModel(u, "columns")
                        } else {
                            e.getTable().addColumn(new sap.ui.table.Column({
                                label: i,
                                template: new sap.m.Text({
                                    text: "{AggregatorID}"
                                }),
                                sortProperty: "AggregatorID",
                                filterProperty: "AggregatorID"
                            }));
                            e.getTable().addColumn(new sap.ui.table.Column({
                                label: g,
                                template: new sap.m.Text({
                                    text: "{CPName}"
                                }),
                                sortProperty: "CPName",
                                filterProperty: "CPName"
                            }));
                            var p = new sap.ui.model.json.JSONModel;
                            p.setData(n);
                            e.getTable().setModel(p);
                            e.getTable().bindRows("/");
                            if (e.getTable().bindItems) {
                                var c = e.getTable();
                                c.bindAggregation("items", "/", function () {
                                    var e = c.getModel("columns").getData().cols;
                                    return new sap.m.ColumnListItem({
                                        cells: e.map(function (e) {
                                            var t = e.template;
                                            return new sap.m.Text({
                                                text: "{" + t + "}",
                                                wrapping: true
                                            })
                                        })
                                    })
                                })
                            }
                            if (n.length === 0) {
                                e.getTable().setNoDataText(t.oUtilsI18n.getText("common.NoResultsFound"))
                            }
                        }
                    }
                },
                error: function (e, t, o) { }
            })
        },
    
        getAggregatorID: function () {
            var e = this;
            $.ajax({
                url: "/PYGWHANA/BPHeader",
                type: "GET",
                dataType: "JSON",
                async: true,
                success: function (t, o, r) {
                    if (t) {
                        var a = t.d.results;
                        var s = [];
                        for (var n = 0; n < a.length; n++) {
                            s.push({
                                AggregatorID: a[n].AggregatorID,
                                CPName: a[n].CPName
                            })
                        }
                        var l = new sap.ui.model.json.JSONModel;
                        l.setData(s);
                        e.getView().setModel(l, "setAggregatorModel")
                    }
                },
                error: function (e, t, o) { }
            })
        },
        handleAggregatorSuggest: function (e) {
            this.handleSuggest({
                oEvent: e,
                aProperties: ["AggregatorID", "CPName"],
                sBinding: "suggestionItems"
            })
        },
        suggestionAggregatorSelected: function (e) {
            var t = this;
            t.suggestionItemSelected({
                oEvent: e,
                thisController: this,
                sModelName: "setAggregatorModel",
                sKey: "AggregatorID",
                sDescription: "CPName"
            }, function (e, t) { })
        },
        onChangeAggregator: function (e) {
            var t = this;
            t.suggestionOnChange({
                oEvent: e,
                thisController: this,
                sModelName: "setAggregatorModel",
                sKey: "AggregatorID",
                sDescription: "CPName"
            }, function (e, o, r, a) {
                t.getView().byId("MultiInputID1").removeAllTokens();
                if (r != "") {
                    var s = new sap.m.Token({
                        key: r,
                        text: t.TextAbstract(a, r, 20),
                        tooltip: a + " (" + r + ")"
                    });
                    t.getView().byId("MultiInputID1").addToken(s)
                }
                if (e !== "") {
                    if (!o) {
                        var n = oi18n.getText("List.Filterbar.MultiInput.matNoError", [t.getView().byId("MultiInputID1").getLabel()])
                    }
                }
            })
        },

        setTableLength: function (length) {
          this.getView().getModel("LocalViewSettings").setProperty("/ItemsCount", length);
          if (length > 10) {
            this.getView().getModel("LocalViewSettings").setProperty("/visibleRowCount", 10);
          }
          else {
            this.getView().getModel("LocalViewSettings").setProperty("/visibleRowCount", length);
          }
        },


        exportToExcel: function () {
          var table = this.getView().byId("ListData");
          var oModel = this.getView().getModel("ListItems");
          var items, mParameteres;
          items = table.getItems();
          if (items.length > 0) {
            if (oDevice.system.desktop) {
              PPCCommon.copyAndApplySortingFilteringFromUITable({
                thisController: this,
                mTable: this.getView().byId("ListData"),
                uiTable: this.getView().byId("UITableData")
              })
            }
          }
          PPCCommon.exportToExcel(table, oModel, {
            bExportAll: false,
            oController: this,
            bLabelFromMetadata: false,
            sFileName: "BPHeader Data",
            sModel: "PYGWHANA",
            sEntityType: "BPHeader",
            oUtilsI18n: oPPCUtili18n
          })
        },
        goToDetail: function (oEvent) {
          var object = oEvent.getSource().getBindingContext("ListItems").getObject();
          var ID = object.ID;
          var contextpath = "path(ID=" + ID + "')";
          this._oRouter.navTo("Detail", {
            contextPath: contextpath
          }, false);
        },


    })
});