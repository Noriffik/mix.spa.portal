modules.component('attributeSetForm', {
    templateUrl: '/app/app-portal/components/attribute-set-form/view.html',
    bindings: {
        attributeSetId: '=',
        attributeSetName: '=',
        attrDataId: '=?',
        attrData: '=?',
        parentType: '=?', // attribute set = 1 | post = 2 | page = 3 | module = 4
        parentId: '=?',
        defaultId: '=',
        saveData: '&?'
    },
    controller: ['$rootScope', '$scope', 'AttributeSetDataService',
        function ($rootScope, $scope, service) {
            var ctrl = this;
            ctrl.isBusy = false;
            ctrl.attributes = [];
            ctrl.defaultData = null;
            ctrl.selectedProp = null;
            ctrl.settings = $rootScope.globalSettings;
            // ctrl.$onInit = async function () {
            //     ctrl.loadData();
            // };
            ctrl.loadData = async function () {

                /*
                    If input is data id => load ctrl.attrData from service and handle it independently
                    Else modify input ctrl.attrData
                */
                $rootScope.isBusy = true;
                if (ctrl.attrDataId) {
                    ctrl.attrData = await service.getSingle('portal', [ctrl.attrDataId, ctrl.attributeSetId, ctrl.attributeSetName]);
                    if (ctrl.attrData) {                        
                        $rootScope.isBusy = false;
                        $scope.$apply();
                    } else {
                        if (ctrl.attrData) {
                            $rootScope.showErrors('Failed');
                        }
                        $rootScope.isBusy = false;
                        $scope.$apply();
                    }

                }
                ctrl.defaultData = await service.getSingle('portal', [ctrl.defaultId, ctrl.attributeSetId, ctrl.attributeSetName]);
                if(ctrl.defaultData){
                    ctrl.defaultData.attributeSetId = ctrl.attributeSetId;
                    ctrl.defaultData.attributeSetName = ctrl.attributeSetName;
                    ctrl.defaultData.parentId = ctrl.parentId;
                    ctrl.defaultData.parentType = ctrl.parentType;
                }

                if (!ctrl.attrData) {
                    ctrl.attrData = angular.copy(ctrl.defaultData);
                }
                $rootScope.isBusy = false;
                $scope.$apply();
            };
            ctrl.reload = async function () {
                ctrl.attrData = angular.copy(ctrl.defaultData);
            };
            ctrl.loadSelected = function(){
                if(ctrl.selectedList.data.length){
                    ctrl.attrData = ctrl.selectedList.data[0];
                    ctrl.attrData.attributeSetId = ctrl.attributeSetId;
                    ctrl.attrData.attributeSetName = ctrl.attributeSetName;
                    ctrl.attrData.parentId = ctrl.parentId;
                    ctrl.attrData.parentType = ctrl.parentType;
                }
                console.log(ctrl.selectedList);
            };
            ctrl.submit = async function () {
                angular.forEach(ctrl.attrData.values, function (e) {
                    //Encrypt field before send
                    if (e.field && e.field.isEncrypt) {
                        var encryptData = $rootScope.encrypt(e.stringValue);
                        e.encryptKey = encryptData.key;
                        e.encryptValue = encryptData.data;
                        e.stringValue = null;
                    }
                });
                if (ctrl.saveData) {
                    ctrl.isBusy = true;
                    var result = await ctrl.saveData({ data: ctrl.attrData });
                    if (result && result.isSucceed) {
                        ctrl.isBusy = false;
                        ctrl.attrData = result.data;
                        $scope.$apply();
                    }
                    else {
                        ctrl.isBusy = false;
                        // ctrl.attrData = await service.getSingle('portal', [ctrl.defaultId, ctrl.attributeSetId, ctrl.attributeSetName]);
                        $scope.$apply();
                    }
                }
                else {

                    ctrl.isBusy = true;
                    var saveResult = await service.save(ctrl.attrData);
                    if (saveResult.isSucceed) {

                        ctrl.isBusy = false;
                    } else {
                        ctrl.isBusy = false;
                        if (saveResult) {
                            $rootScope.showErrors(saveResult.errors);
                        }
                        $scope.$apply();
                    }

                }
            };

            ctrl.filterData = function (attributeName) {
                if (ctrl.attrData) {
                    var attr = $rootScope.findObjectByKey(ctrl.attrData.data, 'attributeFieldName', attributeName);
                    if (!attr) {
                        attr = angular.copy($rootScope.findObjectByKey(ctrl.defaultData.data, 'attributeFieldName', attributeName));
                        ctrl.attrData.data.push(attr);
                    }
                    return attr;
                }
            };
        }]
});