﻿
modules.component('mixFieldEditor', {
    templateUrl: '/app/app-shared/components/mix-field-editor/view.html',
    bindings: {
        model: '=',
        field:'=',
        isShowTitle: '=?',
        inputClass: '=?',
    },
    controller: ['$rootScope', '$scope', 'ngAppSettings', '$filter',
        function ($rootScope, $scope, ngAppSettings,$filter) {
        var ctrl = this;
        ctrl.icons = ngAppSettings.icons;        
        ctrl.refData = null;
        ctrl.defaultDataModel = null;

        ctrl.refDataModel = {
            id: null,
            data: null
        };
        ctrl.dataTypes = $rootScope.globalSettings.dataTypes;
        ctrl.previousId = null;
        ctrl.$onInit = function () {
            ctrl.initData();

        };
        ctrl.initData = async function(){
            setTimeout(() => {                                
                switch (ctrl.field.dataType) {
                    case 1:
                    case 2:
                    case 3:                        
                        if (ctrl.model.data[ctrl.field.name]) {
                            var local = $filter('utcToLocalTime')(ctrl.model.data[ctrl.field.name]);
                            ctrl.model.data[ctrl.field.name] = new Date(local);
                            $scope.$apply();
                        }
                        break;
                    case 23: // reference
                        // if(ctrl.field.referenceId && ctrl.parentId){
                        //     ctrl.model.data[ctrl.field.name] = ctrl.field.referenceId;
                        //     navService.getSingle('portal', [ctrl.parentId, ctrl.parentType, 'default', ctrl.attributeValue.field.referenceId]).then(resp=>{
                        //         ctrl.defaultDataModel = resp;
                        //         ctrl.defaultDataModel.attributeSetId = ctrl.attributeValue.field.referenceId;
                        //         ctrl.refDataModel = angular.copy(ctrl.defaultDataModel);
                        //     });
                        //     ctrl.loadRefData();
                        // }
                        break;
                    default:
                        
                        if (ctrl.field && ctrl.field.isEncrypt && ctrl.model.data[ctrl.field.name]) {
                            var encryptedData = {
                            };
                            ctrl.attributeValue.stringValue = $rootScope.decrypt(encryptedData);
                        }
                        if (ctrl.field && !ctrl.model.data[ctrl.field.name]) {
                            ctrl.model.data[ctrl.field.name] = ctrl.field.defaultValue;
                            $scope.$apply();
                        }
                        break;
                }
            }, 200);
        };
        ctrl.initDefaultValue = async function () {
            switch (ctrl.field.dataType) {
                case 1:
                case 2:
                case 3:
                    if (ctrl.field.defaultValue) {
                        ctrl.model.data[ctrl.field.name] = new Date(ctrl.attributeValue.field.defaultValue);
                    }
                    break;
                case 6:
                    if (ctrl.field.defaultValue) {
                        ctrl.model.data[ctrl.field.name] = parseFloat(ctrl.attributeValue.field.defaultValue);
                    }
                    break;
                case 18:
                    if (ctrl.field.defaultValue) {
                        ctrl.model.data[ctrl.field.name] = ctrl.attributeValue.field.defaultValue =='true';
                    }
                    break;

                default:
                    if (ctrl.field.defaultValue) {
                        ctrl.model.data[ctrl.field.name] = ctrl.field.defaultValue;
                    }
                    break;
            }
        };
    }]
});