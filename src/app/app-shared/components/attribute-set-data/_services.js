﻿'use strict';
app.factory('RestAttributeSetPortalService', ['$rootScope', 'CommonService', 'BaseRestService',
    function ($rootScope, commonService, baseService) {
        var serviceFactory = Object.create(baseService);
        serviceFactory.init('attribute-set-data');

        var _getList = async function (viewType, objData, attributeSetId, attributeSetName, parentType, parentId) {
            objData.filter  = '';
            if(attributeSetId){
                objData.filter += 'attributeSetId eq ' + attributeSetId;
            }
            if(attributeSetName){
                if(objData.filter){
                    objData.filter += ' and ';
                }
                objData.filter += "attributeSetName eq '" + attributeSetName + "'";;
            }
            if(parentType){
                if(objData.filter){
                    objData.filter += ' and ';
                }
                objData.filter += 'parentType eq ' + parentType;
            }
            if(parentId){
                if(objData.filter){
                    objData.filter += ' and ';
                }
                objData.filter += "parentId eq '" + parentId + "'";
            }        
            var data = serviceFactory.parseODataQuery(objData);           
            var url = this.prefixUrl + '/' + viewType;
            if(data){
                url = url.concat(data);
            }
            var req = {
                method: 'GET',
                url: url
            };
            return await commonService.getApiResult(req);
        };
        
        var _export = async function (viewType, objData, attributeSetId, attributeSetName, parentType, parentId) {
            objData.filter  = '';
            if(attributeSetId){
                objData.filter += 'attributeSetId eq ' + attributeSetId;
            }
            if(attributeSetName){
                if(objData.filter){
                    objData.filter += ' and ';
                }
                objData.filter += "attributeSetName eq '" + attributeSetName + "'";;
            }
            if(parentType){
                if(objData.filter){
                    objData.filter += ' and ';
                }
                objData.filter += 'parentType eq ' + parentType;
            }
            if(parentId){
                if(objData.filter){
                    objData.filter += ' and ';
                }
                objData.filter += "parentId eq '" + parentId + "'";
            }        
            var data = serviceFactory.parseODataQuery(objData);           
            var url = this.prefixUrl + '/' + viewType + '/export/' + attributeSetName;
            if(data){
                url = url.concat(data);
            }
            var req = {
                method: 'GET',
                url: url
            };
            return await commonService.getApiResult(req);
        };

        serviceFactory.getList = _getList;
        serviceFactory.export = _export;
        return serviceFactory;

    }]);
