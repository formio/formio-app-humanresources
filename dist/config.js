var APP_URL = 'https://yourapp.form.io';
var API_URL = 'https://api.form.io';

// Parse query string
var query = {};
location.search.substr(1).split("&").forEach(function(item) {
  query[item.split("=")[0]] = item.split("=")[1] && decodeURIComponent(item.split("=")[1]);
});

APP_URL = query.appUrl || APP_URL;
API_URL = query.apiUrl || API_URL;

if (query.token) {
  localStorage.setItem('formioToken', query.token);
  localStorage.removeItem('formioAppUser');
  localStorage.removeItem('formioUser');
  window.history.pushState("", "", location.pathname + location.hash);
}

angular.module('formioApp').constant('AppConfig', {
  appUrl: APP_URL,
  apiUrl: API_URL,
  forms: {
    userLoginForm: APP_URL + '/user/login',
    sendResetPassword: APP_URL + '/sendreset',
    resetPassForm: APP_URL + '/resetpass'
  },
  resources: {
    employee: {
      form: APP_URL + '/employee',
      resource: 'EmployeeResource'
    }
  }
});
