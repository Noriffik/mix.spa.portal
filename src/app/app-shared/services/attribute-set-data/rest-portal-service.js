'use strict';
app.factory('RestAttributeSetDataPortalService', ['BaseRestService', 'CommonService', function (baseService, commonService) {

    var serviceFactory = angular.copy(baseService);
    serviceFactory.init('attribute-set-data/portal');
    var _initData = async function (attrSetName) {
        var url = this.prefixUrl + '/init/' + attrSetName;
        var req = {
            method: 'GET',
            url: url
        };
        return await commonService.getRestApiResult(req);
    };

    var _export = async function (objData) {

        var data = serviceFactory.parseQuery(objData);
        var url = this.prefixUrl;

        if (data) {
            url += '/export?';
            url = url.concat(data);
        }
        var req = {
            method: 'GET',
            url: url
        };
        return await commonService.getRestApiResult(req);
    };

    serviceFactory.initData = _initData;
    serviceFactory.export = _export;
    return serviceFactory;

}]);
