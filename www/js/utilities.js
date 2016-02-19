angular.module('starter.utilities', [])

.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
})

.filter("toArray", function(){
    return function(obj) {
        var result = [];
        angular.forEach(obj, function(val, key) {
            result.push(val);
        });
        return result;
    };
})
.factory('$cordovaDatePicker', ['$window', '$q', function ($window, $q) {
   return {
     show: function(options) {
       var d = $q.defer();

       $window.datePicker.show(options, function (date) {
         d.resolve(date);
       });

       return d.promise;
     }
   }

 }])
.filter('num', function() {
    return function(input) {
       return parseInt(input, 10);
    }
})

.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
 }])
 
 .filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}])
 
.factory('MomentService', function () {
    return {
          get: function (dateString, format) {
              return moment(dateString).format(format);
          }
      }
})
.filter('timeago', function () {
    return function (dateString, type) {
        return moment(dateString).fromNow();
    };
}) 
.filter('isEmpty', function () {
    var bar;
    return function (obj) {
        for (bar in obj) {
            if (obj.hasOwnProperty(bar)) {
                return false;
            }
        }
        return true;
    };
})
.filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 15;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
})   
.filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  })
.factory('LoaderService', function ($rootScope, $ionicLoading, $timeout) {
      return {
          show: function () {
              $rootScope.loading = $ionicLoading.show({
                  template: '<ion-spinner class="spinner-light" icon="android" style="font-size:42px"></ion-spinner> <br>Please wait!!',
                  animation: 'fade-in',
                  showBackdrop: true,
                  maxWidth: 200,
                  showDelay: 0
              });
              
              $timeout(function(){
                $ionicLoading.hide();
              }, 25000);
              
          },
          hide: function () {
              $ionicLoading.hide();
          }
      }
  })
  
  

//Camera Access
.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();
      navigator.camera.getPicture(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, {
            quality: 90,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 640,
            targetHeight: 480,
            saveToPhotoAlbum: true
      });
      
      return q.promise;
    }
  }
}])

.factory('Photolibrary', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();
      navigator.camera.getPicture(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, {
            quality: 90,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 640,
            targetHeight: 480,
            saveToPhotoAlbum: false
      });
      
      return q.promise;
    }
  }
}])  
  
  
.directive('imageonload', function(LoaderService2) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
               LoaderService2.hide();
            });
        }
    };
})
  
.factory('LoaderService2', function ($rootScope, $ionicLoading, $timeout) {
      return {
          show: function (text) {
              $rootScope.loading = $ionicLoading.show({
                  template: '<ion-spinner class="spinner-light" icon="android" style="font-size:42px">></ion-spinner> <br>'+text,
                  animation: 'fade-in',
                  showBackdrop: true,
                  maxWidth: 200,
                  showDelay: 0
              });
          },
          hide: function () {
              $ionicLoading.hide();
          }
      }
  })
.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        remove: function (key) {
            return $window.localStorage.removeItem(key);
        },
        clear: function(){
            return $window.localStorage.clear();
        }
    }
}])

.factory('AlertService', function ($ionicPopup) {
    return {
        alert_popup: function (title, message) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: message,
                okType: 'button-positive'
            });   
        }
    };
}).factory('AlertErrorService', function ($ionicPopup) {
    return { 
        alert_popup: function (title, message) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: message,
                okType: 'button-assertive'
            });
        }
    };
})

.factory('serializeDataservice',function(){
    return {
        get:function(data){
            if ( ! angular.isObject( data ) ) { 
                    return( ( data == null ) ? "" : data.toString() ); 
                }

                var buffer = [];

                // Serialize each key in the object.
                for ( var name in data ) { 
                    if ( ! data.hasOwnProperty( name ) ) { 
                        continue; 
                    }

                    var value = data[ name ];

                    buffer.push(
                        encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value )
                    ); 
                }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer.join( "&" ).replace( /%20/g, "+" ); 
            return( source ); 
            }
    }
               
})

.factory('ShareService',function (){
    return {
        share : function(data){
                var subject = data.title;
                var message = data.content;
                    message = message.replace(/(<([^>]+)>)/ig,"");
                var    link =  data.link;
                var image = data.image;

                window.plugins.socialsharing.share(message, subject, image, link);
        }
    } 
})
.directive('standardTimeNoMeridian', function() {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      etime: '=etime'
    },
    template: "<strong>{{stime}}</strong>",
    link: function(scope, elem, attrs) {

      scope.stime = epochParser(scope.etime, 'time');

      function prependZero(param) {
        if (String(param).length < 2) {
          return "0" + String(param);
        }
        return param;
      }

      function epochParser(val, opType) {
        if (val === null) {
          return "00:00";
        } else {
          if (opType === 'time') {
            var hours = parseInt(val / 3600);
            var minutes = (val / 60) % 60;

            return (prependZero(hours) + ":" + prependZero(minutes));
          }
        }
      }

      scope.$watch('etime', function(newValue, oldValue) {
        scope.stime = epochParser(scope.etime, 'time');
      });

    }
  };
})
.factory('ValidateEmailService', function () {
            var return_var;
            return{
                get : function(email){
                    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return_var =  re.test(email);
                    return return_var;
                }
                
            };
           
})
.factory('PhonevalidationService',function(){
    return {
        get:function(inputtxt){
            var fld = new Object();
             fld.value = inputtxt;

                if (fld.value === "") {
                return false;
               }
                else if (isNaN(fld.value)) {
                return false;
               }
               else if (!(fld.value.length === 10)) {
                return false;
               } else {
                   return true;
               }
        },
        get_error: function(inputtxt){ 

            var fld = new Object();
             fld.value = inputtxt;

                if (fld.value === "") {
                return "You didn't enter a phone number.";
               }
                else if (isNaN(fld.value)) {

                return "The phone number contains illegal characters.";
               }
               else if (!(fld.value.length === 10)) {
                return "The phone number is the wrong length. \nPlease enter 10 digit mobile no.";
               } else {
                   return true;
               }

        }

    };
})

// fitlers
.filter('nl2br', ['$filter',
  function($filter) {
    return function(data) {
      if (!data) return data;
      return data.replace(/\n\r?/g, '<br />');
    };
  }
])


// directives
.directive('autolinker', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(function() {
          var eleHtml = element.html();

          if (eleHtml === '') {
            return false;
          }

          var text = Autolinker.link(eleHtml, {
            className: 'autolinker',
            newWindow: false
          });

          element.html(text);

          var autolinks = element[0].getElementsByClassName('autolinker');

          for (var i = 0; i < autolinks.length; i++) {
            angular.element(autolinks[i]).bind('click', function(e) {
              var href = e.target.href;
              console.log('autolinkClick, href: ' + href);

              if (href) {
                //window.open(href, '_system');
                window.open(href, '_blank');
              }

              e.preventDefault();
              return false;
            });
          }
        }, 0);
      }
    }
  }
])

;
