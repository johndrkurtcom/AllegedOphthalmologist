var routes = require('../constants/Constants.js').ServerRoutes;
var UserStore = require('./../stores/UserStore');

// Helper functions

var setAuthHeader = function(){
  $.ajaxSetup({
      headers: { 'Authorization': "Bearer "+UserStore.getToken() }
  });
};

var PostReq = function(route, data){ 
  setAuthHeader();
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: route,
      method: 'POST',
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function(data) {
        resolve(data);
      },
      error: function(xhr, status, err) {
        reject(err);
      }
    });
  });
};
var GetReq = function(route){
  setAuthHeader();  
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: route,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        resolve(data);
      },
      error: function(xhr, status, err) {
        reject(err);
      }
    });
  });
};

module.exports = {
  getWattTotal : function() {
    return GetReq(routes.WATT_BEHIND)
    .then(function(behind) {
      return GetReq(routes.WATT_AHEAD)
      .then(function(ahead) {
        return behind.concat(ahead);
      });
    });
  },

  getHexCode: function(){ 
    return GetReq(routes.BULB_COLOR);
  },

  getUtilityTotal : function() {
    return GetReq(routes.UTILITY_TOTAL);
  },

  getUtilityUser : function() {
    return GetReq(routes.UTILITY_USER);
  },

  registerNewUser: function(data) {
    return PostReq(routes.USER_REGISTRATION, data);
  },

  updateUserPGE: function(update_data){
    return PostReq(routes.PGE_UPDATE, update_data);
  },

  loginUser: function(data) {
    return PostReq(routes.USER_LOGIN, data);
  },

  logoutUser: function(data){
    return GetReq(routes.USER_LOGOUT);
  },
};
