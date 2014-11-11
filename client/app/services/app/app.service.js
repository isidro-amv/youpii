'use strict';

angular.module('youpiiBApp')
  .service('App', function ($location, Auth ) {
    this.host = 'http://localhost:9000/api/';
    this.sendRequest = function (v, cbok, cberr) {
      $.ajax({
        type: v.method,
        url: this.host+v.url,
        data:v.form,
        cache:false,
        contentType: false,
        processData: false,
        headers: { 'Authorization': Auth.getBarerToken() },
        dataType: "json",
        success:function(data){
          cbok(data);
        },
        error: function(err){
          cberr(err);
        }
      });
    },
    this.dataURItoBlob = function (dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }
  });
