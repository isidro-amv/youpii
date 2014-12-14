'use strict';

angular.module('youpiiBApp')
  .service('App', function ($location, Auth ) {
    this.host = window.location.origin + '/api/';

    this.sendRequest = function (v, cbok, cberr) {
      $.ajax({
        type: v.method,
        url: this.host+v.url,
        data:v.form,
        cache:false,
        contentType: false,
        processData: false,
        headers: { 'Authorization': Auth.getBarerToken() },
        dataType: 'json',
        success:function(data){
          cbok(data);
        },
        error: function(err){
          cberr(err);
        }
      });
    };
    this.dataURItoBlob = function (dataURL) {
        var BASE64_MARKER = ';base64,';
        var parts, contentType, raw;
        if (dataURL.indexOf(BASE64_MARKER) === -1) {
          parts = dataURL.split(',');
          contentType = parts[0].split(':')[1];
          raw = decodeURIComponent(parts[1]);

          return new Blob([raw], {type: contentType});
        }

        parts = dataURL.split(BASE64_MARKER);
        contentType = parts[0].split(':')[1];
        raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    };
  });
