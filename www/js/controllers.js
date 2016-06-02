angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope,$state, $ionicModal, $timeout, ShareService, $localstorage,LoaderService,$ionicHistory,$ionicSideMenuDelegate, AlertService, ValidateEmailService, serializeDataservice, $ionicPopup, LoginService,$cordovaGoogleAnalytics ) {
            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //$scope.$on('$ionicView.enter', function(e) {
            //});

            $scope.shareonFacebook = function(title, content, link, image){
                var main_url = "http://mpc.historicebenezer.org/";
                var share_image = main_url+image;
                window.plugins.socialsharing.shareViaFacebook(
                        content, 
                        share_image, 
                        link, 
                        function() {
                            console.log('share ok');
                        }, function(errormsg){
                            console.log(errormsg);
                        });
            };
            
            $scope.shareonTwitter = function(content){
               window.plugins.socialsharing.shareViaTwitter(content);
            };
            
            
            
            
            /*Share Service*/
            $scope.doShare = function (title, content, link, image) {
                var data = new Object();
                data.title = title;
                data.content = content;

                if (link) {
                    data.link = link;
                } else {
                    data.link = "http://www.historicebenezer.org/";
                }


                if (image) {
                    data.image = image;
                } else {
                    data.image = "http://www.historicebenezer.org/images/hebc_logoh70.png";
                }
                
                console.log(angular.toJson(data, true));
                
                ShareService.share(data);
            };
            
            
            $scope.composeEmail = function(){
                cordova.plugins.email.open({
                    to:      'info@ebenezerchurch.us',
                    subject: 'Contact',
                    body:    ''
                });
            };

            function _waitForAnalytics(screen_name) {
                if (typeof analytics !== 'undefined') {
                    $cordovaGoogleAnalytics.debugMode();
                    $cordovaGoogleAnalytics.startTrackerWithId('UA-71258387-1');
                    $cordovaGoogleAnalytics.trackView(screen_name);
                }
                else {
                    setTimeout(function () {
                        _waitForAnalytics();
                    }, 250);
                }
            };

            $scope.analyze = function (screen) {
                _waitForAnalytics(screen);
            };

           $scope.analyze("Landing Page");
            
            // a Scope Function to be used to check if any Object is Empty
            $scope.isEmpty = function(obj) {
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        return false;
                }

                return true;
            }
             
            //Acton for closing Side menu when needed
            $scope.closeSideMenu = function () {
                $ionicSideMenuDelegate.toggleRight();
            };
            
            //Open Chat Page Route
            $scope.startChat = function(type, recordId){
                $state.go("app.chat", { type: type, recordId: recordId});
            };
            
            // Check if User is Logged in!
            $scope.Loggedin = false;
            $scope.loginData = {};
            
            // Create the login modal that we will use later
              $scope.loginmodal = true;

              $ionicModal.fromTemplateUrl('templates/login.html', {
                  scope: $scope,
                  animation: 'slide-in-up'
              }).then(function (modal) {
                  $scope.accountmodal = modal;
              });

              // Show Login Modal
              $scope.login = function () {
                  $scope.accountmodal.show();
              };
              // Hide Login Modal
              $scope.closeLogin = function () {
                  $scope.accountmodal.hide();
              };
              // Show Login Form
              $scope.showLogin = function () {
                  $scope.loginmodal = true;
                   $scope.registermodal = false;
                   $scope.forgotpassmodal = false;
              };

              $scope.showRegister = function () {
                  $scope.loginmodal = false;
                  $scope.registermodal = true;
                   $scope.forgotpassmodal = false;
              };

              $scope.showForgotPassword = function(){
                  $scope.loginmodal = false;
                  $scope.registermodal = false;
                   $scope.forgotpassmodal = true;
              };

              //Go to Profile Screen
              $scope.gotoProfile = function () {
                  $state.go("app.profile");
              };
              
              $scope.gotoContactOrganizer = function(id,ministryid,eventid,eventname){
                    var data = {};
                        data.l_id = id;
                        data.ministryid = ministryid;
                        data.eventid = eventid;
                        data.eventname = eventname;
                      
                     $localstorage.setObject("contactOrganizerData", data);
                        
                    $state.go("app.contact_organizer");
                };
              
             //Login Section
            
            // Check if User is Logged in!
            $scope.checkloggedin = function() {
                if(!$scope.isEmpty($localstorage.getObject('user'))){
                    $scope.Loggedin = true;
                    $scope.userInfo = $localstorage.getObject('user');
                    
                    return true;
                } else {
                    $scope.Loggedin = false;
                    return false;
                }
            };
            $scope.checkloggedin();
            
            
            $scope.doLogout = function() {
                LoaderService.show("Logging out! <br> Please wait");
                $localstorage.remove("user");
                //$localstorage.clear();
                $timeout(function() {
                   LoaderService.hide();
                   $scope.checkloggedin();
                }, 1500);
            };
            
            // Perform Login from Server Webservice
            $scope.doLogin = function() {
                LoaderService.show("Logging in!<br> Please wait!");                
                var Userdata = $scope.loginData;
                
                if (Object.keys(Userdata).length === 0) {
                    LoaderService.hide();
                    AlertService.alert_popup("Error", 'Enter your Email and password');
                    } 
                    else if (Userdata.password === '' || Userdata.user_email === '' || !Userdata.password || !Userdata.user_email || !ValidateEmailService.get(Userdata.user_email)) {
                            if (Userdata.user_email === '' || !Userdata.user_email) {
                                AlertService.alert_popup("Error", 'Enter your Email');
                            } else if (!ValidateEmailService.get(Userdata.user_email)) {
                                AlertService.alert_popup("Error", 'Enter valid email');
                            } else {
                                AlertService.alert_popup("Error", 'Enter your Password');
                            }
                            LoaderService.hide();
                } else {
                    
                    var data = {};
                        data.email = Userdata.user_email;
                        data.password = Userdata.password;
                    
                    var serializeData = serializeDataservice.get(data);
                    
                    LoginService.get(serializeData).success(function(data, status, header, config) {
                        
                        if (data.success === '1') {
                            LoaderService.hide();
                            $scope.userData = data.data;
                            $scope.user = data.data;
                            $localstorage.setObject("user", $scope.userData);
                            var success_msg = 'Successfully Logged in';

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: success_msg,
                                okType: 'button-balanced'
                            });
                            alertPopup.then(function (res) {
                                $scope.loginData = {};
                                $scope.closeLogin();
                                $ionicHistory.clearCache();

                                $scope.checkloggedin();
                            });


                        }
                        if (data.errors === '1') {
                            LoaderService.hide();
                            AlertService.alert_popup("Error", data.data);
                        }
                    });
                }
            };
            
            

            $scope.getEventInfo = function (event) {
                $localstorage.setObject('currentEvent', event);
            };

            $scope.getMinistryInfo = function (event) {
                $localstorage.setObject('currentMinistry', event);
            };
            
            
            $scope.getBulletinInfo = function(bulletin){
                $localstorage.setObject('currentBulletin', bulletin);
            };
            
            $scope.getliveInfo = function(id){
                $localstorage.setObject('currentLiveOD', id);
            };

            
           //Go to Profile Screen
            $scope.gotoEventPage = function (eventId) {
                $state.go("app.event_detail", {eventId: eventId});
            };

            
            
            

        })

       
        .controller('LandingController', function ($scope, LandingPageService, $localstorage, LoaderService2, AlertService, EventsService) {            
            
            $scope.analyze("Landing Page");
    
    
            $scope.date = new Date();
            function GetHomeData(){
                LandingPageService.getData().success(function (data, status, header, config) {
                    $localstorage.setObject("landingData", data.data);
                    var landingData = $localstorage.getObject('landingData');
                    $scope.landingData = landingData;
                    $scope.ShareImage = landingData.main_cover_photo;
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }
            
             // For Refreshing the Data
            $scope.RefreshHomePage = function () {
                GetHomeData();
                $scope.$broadcast('scroll.refreshComplete');
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            
            $scope.$on('$ionicView.enter', function (e) {
                $scope.checkloggedin();
                if (!$scope.isEmpty($localstorage.getObject('landingData'))) {
                    var landingData = $localstorage.getObject('landingData');
                    $scope.landingData = landingData;
                    $scope.ShareImage = landingData.main_cover_photo;
                    LoaderService2.hide();
                } else {
                    GetHomeData();
                }
                
                
            });     
            
            
            $scope.shareonFacebook = function(title, content, link, image){
                var main_url = "http://mpc.historicebenezer.org/";
                
                if(image === 'homepage_image'){
                    share_image = main_url+$scope.ShareImage;
                }
                
                var share_image = main_url+image;
                window.plugins.socialsharing.shareViaFacebook(
                        content, 
                        share_image, 
                        link, 
                        function() {
                            console.log('share ok');
                        }, function(errormsg){
                            console.log(errormsg);
                        });
            };
            
            $scope.shareonTwitter = function(content){
               window.plugins.socialsharing.shareViaTwitter(content);
            };
            
            
        })

        .controller('EventsController', function ($scope, $localstorage, LoaderService2, AlertService, EventsService, $ionicScrollDelegate) {
            $scope.analyze("Events Page");
            $scope.checkloggedin();
             $scope.date = new Date();
             
            function getEvents() {
                $scope.eventsData = {};
                EventsService.getEvents().success(function (data, status, header, config) {
                    $localstorage.setObject("eventsData", data.data);
                    var eventsData = $localstorage.getObject('eventsData');
                    $scope.eventsData = eventsData;
                    console.log(angular.toJson(eventsData, true));
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }


             if(!$scope.isEmpty($localstorage.getObject('eventsData'))){
                var eventsData = $localstorage.getObject('eventsData');
                $scope.eventsData = eventsData;
                LoaderService2.hide();
            } else {
                getEvents();
            }

            $scope.today = true;
            $scope.this_week = false;
            $scope.this_month = false;
            $scope.this_featured = false;

            $scope.showToday = function () {
                $scope.analyze("Events Today Page");
                $scope.today = true;
                $scope.this_week = false;
                $scope.this_month = false;
                $scope.this_featured = false;
                $ionicScrollDelegate.scrollTop();
            };

            $scope.showWeek = function () {
                $scope.analyze("Events This Week Page");
                $scope.today = false;
                $scope.this_week = true;
                $scope.this_month = false;
                $scope.this_featured = false;
                $ionicScrollDelegate.scrollTop();
            };

            $scope.showMonth = function () {
                $scope.analyze("Events This Month Page");
                $scope.today = false;
                $scope.this_week = false;
                $scope.this_month = true;
                $scope.this_featured = false;
                $ionicScrollDelegate.scrollTop();
            };

            $scope.showFeatured = function () {
                $scope.analyze("Events Featured Page");
                $scope.today = false;
                $scope.this_week = false;
                $scope.this_month = false;
                $scope.this_featured = true;
                $ionicScrollDelegate.scrollTop();
            };

            // For Refreshing the Data
            $scope.RefreshEvents = function () {
                getEvents();
                $scope.$broadcast('scroll.refreshComplete');
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

        })

        .controller('EventDetailController', function ($scope, $stateParams, $filter, $localstorage,LoaderService2,AlertService, EventsService,$sce, $cordovaCalendar) {
            $scope.checkloggedin();
            console.log(angular.toJson($stateParams, true));
            var event = $localstorage.getObject('currentEvent');
           
            if(event.eventid === $stateParams.eventId){
                $scope.event = event;
                
                $scope.analyze(event.eventname+" Page");
                
                console.log(angular.toJson(event, true));
                 $scope.googlemap = $sce.trustAsResourceUrl("https://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q="+$scope.event.event_location+"&t=m&output=embed");
                console.log(angular.toJson($scope.googlemap, true));
             }else{
                EventsService.singleEvent($stateParams.eventId).success(function (data, status, header, config) {
                    $localstorage.setObject('currentEvent', data.data);
                    var event = $localstorage.getObject('currentEvent');
                    $scope.event = event;
                    
                    $scope.analyze(event.eventname+" Page");
                    
                    
                     $scope.googlemap = $sce.trustAsResourceUrl("https://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q="+$scope.event.event_location+"&t=m&output=embed");
                     console.log(angular.toJson($scope.googlemap, true));
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }
            
            
            $scope.AddtoCalender = function(){
                var startdate = $scope.event.start;
                console.log(startdate)
                var startmonth = parseInt(moment(startdate).format("MM")) - 1;
                startdate = moment(startdate);
                var endate = $scope.event.end;
                console.log(endate);
                var endmonth = parseInt(moment(endate).format("MM")) - 1;
                endate = moment(endate);
                
                $cordovaCalendar.createEvent({
                    title: $scope.event.eventname,
                    location: $scope.event.event_location,
                    notes: $scope.event.decription,
                    startDate: new Date(moment(startdate).format("YYYY"), startmonth , moment(startdate).format("DD"), moment(startdate).format("HH"), moment(startdate).format("mm"), moment(startdate).format("ss"), moment(startdate).format("SS")),
                    endDate: new Date(moment(endate).format("YYYY"), endmonth, moment(endate).format("DD"), moment(endate).format("HH"), moment(endate).format("mm"), moment(endate).format("ss"), moment(endate).format("SS")),
                  }).then(function (result) {
                      AlertService.alert_popup("Success!", "Event was Successfully added you to your Calender");
                  }, function (err) {
                      AlertService.alert_popup("Error!", "There was some problem adding the event to your Calender.");
                  });
            };
       }) 

        .controller('NewsCategoryPostsController', function ($scope, $stateParams,$ionicLoading, $localstorage,BlogPostsService, LoaderService2,AlertService) {
            $scope.checkloggedin();
            
            $scope.analyze("News Categories Page");
    
            $scope.$on('$ionicView.enter', function(e) {
                LoaderService2.show("Loading Posts<br>Please wait!");
                console.log($stateParams.categoryId);
                
                 BlogPostsService.async($stateParams.categoryId).then(
                     function() {
                         $scope.category = BlogPostsService.getPosts().category;
                         $scope.posts = BlogPostsService.getPosts().posts;
                         LoaderService2.hide();
                     },
                     function() {
                         AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                         $ionicLoading.hide();
                     },
                     function() {}
                 );
            });
            
        })
        
        
        .controller('NewsPostController', function ($scope, $stateParams,$ionicLoading, $localstorage,BlogPostService, LoaderService2,AlertService) {
            
            $scope.checkloggedin();
    
     $scope.$on('$ionicView.enter', function(e) {
               LoaderService2.show("Loading Post<br>Please wait!");
                BlogPostService.async($stateParams.postId).then(
                    function() {
                        $scope.post = BlogPostService.getPost().post;
                        LoaderService2.hide();
                        
                        
                        $scope.analyze($scope.post.title);

                    },
                    function() {
                        AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                        $ionicLoading.hide();
                    },
                    function() {}
                );
         });
        })
        
       
        .controller('NewsCategoriesController', function ($scope, $stateParams,$ionicLoading, $localstorage,BlogCategoriesService, LoaderService2,AlertService) {
            $scope.analyze("News Categories Page");
            $scope.checkloggedin();
               LoaderService2.show("Loading Categories<br>Please wait!");
                BlogCategoriesService.async().then(
                    function() {
                        $scope.categories = BlogCategoriesService.getCategories().categories;
                        console.log(angular.toJson($scope.categories, true));
                        LoaderService2.hide();
                    },
                    function() {
                        AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                        $ionicLoading.hide();
                    },
                    function() {}
                );
        })
        
        
        
        
        
        .controller('AnnouncementController', function ($scope, $localstorage, LoaderService2, AlertService, AnnouncementsService, $ionicScrollDelegate) {
            $scope.checkloggedin();
            $scope.analyze("Announcements Page");
            
            function getAnnouncements() {
                AnnouncementsService.getData().success(function (data, status, header, config) {
                    $localstorage.setObject("announcementsData", data.data);
                    var announcementsData = $localstorage.getObject('announcementsData');
                    $scope.announcementsData = announcementsData;
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }

            if(!$scope.isEmpty($localstorage.getObject('announcementsData'))){
                var announcementsData = $localstorage.getObject('announcementsData');
                $scope.announcementsData = announcementsData;
                console.log(angular.toJson(announcementsData, true));
                LoaderService2.hide();
            } else {
                getAnnouncements();
            }


            // For Refreshing the Data
            $scope.RefreshAnnoucements = function () {
                getAnnouncements();
                $scope.$broadcast('scroll.refreshComplete');
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

        })

        .controller('HomeBulletinsController', function ($scope, $localstorage, LoaderService2, AlertService, BulletinsService, $ionicScrollDelegate) {
            $scope.checkloggedin();
            $scope.analyze("Bulletins Page");
            
            function getBulletins() {
                LoaderService2.show("Loading Data<br>Please Wait");
                BulletinsService.getMobileTodayBulletins().success(function (data, status, header, config) {
                    $localstorage.setObject("bulletinsData", data.data);
                    var bulletinsData = $localstorage.getObject('bulletinsData');
                    $scope.bulletinsData = bulletinsData;
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }

//            if(!$scope.isEmpty($localstorage.getObject('bulletinsData'))){
//                var bulletinsData = $localstorage.getObject('bulletinsData');
//                $scope.bulletinsData = bulletinsData;
//                LoaderService2.hide();
//            } else {
//                getBulletins();
//            }

            $scope.$on('$ionicView.enter', function(e) {
                getBulletins();
            });

            // For Refreshing the Data
            $scope.RefreshBulletins = function () {
                getBulletins();
                $scope.$broadcast('scroll.refreshComplete');
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

        })
        
        .controller('BulletinsController', function ($scope, $localstorage, LoaderService2, AlertService, BulletinsService, $ionicScrollDelegate) {
            $scope.checkloggedin();
            $scope.analyze("Bulletins");
            
            function getBulletins() {
                LoaderService2.show("Loading Data<br>Please Wait");
                BulletinsService.getAllBulletins().success(function (data, status, header, config) {
                    $localstorage.setObject("bulletinsData", data.data);
                    var bulletinsData = $localstorage.getObject('bulletinsData');
                    $scope.bulletinsData = bulletinsData;
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }

            $scope.$on('$ionicView.enter', function(e) {
                getBulletins();
            });

            // For Refreshing the Data
            $scope.RefreshBulletins = function () {
                getBulletins();
                $scope.$broadcast('scroll.refreshComplete');
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

        })
        .controller('BulletinDetailController', function ($scope, $state, $stateParams, $localstorage, $sce) {
            var bulletin = $localstorage.getObject('currentBulletin');
            $scope.bulletin = bulletin;
            
            $scope.analyze("Bulletins");
            
        })
        
        .controller('MinistriesController', function ($scope, $localstorage, LoaderService2, AlertService, MinistriesService, $ionicScrollDelegate) {
            $scope.checkloggedin();
    
            $scope.analyze("All Ministries Page");


            function getMinistries() {
                MinistriesService.getData().success(function (data, status, header, config) {
                    $localstorage.setObject("ministriesData", data.data);
                    var ministriesData = $localstorage.getObject('ministriesData');
                    $scope.ministriesData = ministriesData;
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }

            if(!$scope.isEmpty($localstorage.getObject('ministriesData'))){
                var ministriesData = $localstorage.getObject('ministriesData');
                $scope.ministriesData = ministriesData;
                LoaderService2.hide();
            } else {
                getMinistries();
            }

            // For Refreshing the Data
            $scope.RefreshMinistries = function () {
                getMinistries();
                $scope.$broadcast('scroll.refreshComplete');
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            
        })

        .controller('MinistryDetailController', function ($scope, $state, $stateParams,MinistriesService, LoaderService2,AlertService, $localstorage, $sce) {
            $scope.checkloggedin(); 
    
            //Contact Ministry
            $scope.gotoContactMinistry = function(){
                $state.go("app.contact_ministry");
            };
            
            $scope.gotoMinistryAbout = function(id){
                $state.go("app.ministry_about",{ministryId: id});
            };
            
            $scope.gotoMinistryAnnoucements = function(){
                $state.go("app.ministry_annoucements");
            };
            
            $scope.gotoMinistryEvents = function(){
                $state.go("app.ministry_events");
            };
            
            $scope.gotoMinistryBulletins = function(){
                $state.go("app.ministry_bulletins");
            };
            
            $scope.gotoGroupMinistriess = function(){
                $state.go("app.group_ministries");
            };
            
            var ministry = $localstorage.getObject('currentMinistry');
            
            if(ministry.ministryid === $stateParams.ministryId){
               $scope.ministry = ministry;
               
               $scope.analyze(ministry.ministryname+" Page");

             }else{
                MinistriesService.getSingle($stateParams.ministryId).success(function (data, status, header, config) {
                    $localstorage.setObject("currentMinistry", data.data);
                    var ministriesData = $localstorage.getObject('currentMinistry');
                     $scope.ministry = ministriesData;
                     
                     $scope.analyze(ministry.ministryname+" Page");

                     
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }
            $scope.showDescription = function() {
               return $sce.trustAsHtml($scope.ministry.aboutushtml);
            };
        })


        .controller('MapController', function ($scope, $state, $stateParams, LoaderService2, $compile){
            $scope.analyze("Map Page");
    
            function initialize() {
                
                var myLatlng = new google.maps.LatLng(33.7567754,-84.3761709);

                var mapOptions = {
                  center: myLatlng,
                  zoom: 16,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("map"),
                    mapOptions);

                //Marker + infowindow + angularjs compiled ng-click
                var contentString = "<div><a>101 Jackson Street, Atlanta GA 30312</a></div>";
                var compiled = $compile(contentString)($scope);

                var infowindow = new google.maps.InfoWindow({
                  content: compiled[0]
                });

                var marker = new google.maps.Marker({
                  position: myLatlng,
                  map: map,
                  title: '101 Jackson Street, Atlanta GA 30312'
                });

                google.maps.event.addListener(marker, 'click', function() {
                  infowindow.open(map,marker);
                });

                $scope.map = map;
              }
            
               if (document.readyState === "complete") {
                    initialize();
                } else {
                  google.maps.event.addDomListener(window, 'load', initialize);
                }

        })

        .controller('MinistryAboutCtrl', function ($scope, $state, $stateParams, $localstorage, $sce, MinistriesService, LoaderService2, AlertService) {
            var ministry = $localstorage.getObject('currentMinistry');
    
            $scope.ministry = ministry;
           
            
            if(ministry.ministryid === $stateParams.ministryId){
               $scope.ministry = ministry;
               
               $scope.analyze(ministry.ministryname+" Page");

               
                $scope.ministry_about_url = $sce.trustAsResourceUrl("http://mpc.historicebenezer.org/api/ministry_detail.php?ministry_id="+$scope.ministry.ministryid);
                
             }else{
                MinistriesService.getSingle($stateParams.ministryId).success(function (data, status, header, config) {
                    $localstorage.setObject("currentMinistry", data.data);
                    var ministriesData = $localstorage.getObject('currentMinistry');
                     $scope.ministry = ministriesData;
                     
                     $scope.analyze(ministriesData.ministryname+" Page"); 
                     
                    $scope.ministry_about_url = $sce.trustAsResourceUrl("http://mpc.historicebenezer.org/api/ministry_detail.php?ministry_id="+$scope.ministry.ministryid);
                      
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }
            
           
            
            
            
        })

        .controller('MinistryAnnouncementsCtrl', function ($scope, $state, $stateParams, $localstorage, $sce, AnnouncementsService,LoaderService2,AlertService) {
            var ministry = $localstorage.getObject('currentMinistry');
            $scope.ministry = ministry;
            
            $scope.analyze(ministry.ministryname+" Announcements Page"); 
            
               AnnouncementsService.ministryAnnouncements(ministry.ministryid).success(function (data, status, header, config) {
                   $scope.announcementsData = data.data;
                   console.log(data.data);
                   LoaderService2.hide();
               }).error(function (data, status, headers, config) {
                   LoaderService2.hide();
                   AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
               });
            
            
        })

        .controller('MinistryEventsCtrl', function ($scope, $state, $stateParams, $localstorage, $sce,EventsService,LoaderService2,AlertService) {
            var ministry = $localstorage.getObject('currentMinistry');
            $scope.ministry = ministry;
            
            $scope.analyze(ministry.ministryname+" Events Page"); 

                EventsService.ministryEvents(ministry.ministryid).success(function (data, status, header, config) {
                    $scope.eventsData = data.data;
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            
            
        })

        .controller('MinistryBulletinsCtrl', function ($scope, $state, $stateParams, $localstorage, $sce) {
            var ministry = $localstorage.getObject('currentMinistry');
            $scope.ministry = ministry;
            $scope.analyze(ministry.ministryname+" Bulletins Page"); 
        })
        
         .controller('GroupMinistriesCtrl', function ($scope, $state, $stateParams, $localstorage, $sce,MinistriesService, LoaderService2,AlertService) {
            var ministry = $localstorage.getObject('currentMinistry');
            $scope.ministry = ministry;
            
           $scope.analyze(ministry.ministryname+" Group Ministries Page"); 

           console.log(ministry.ministryid);
            
            MinistriesService.coreGroupMinistries(ministry.ministryid).success(function (data, status, header, config) {
                $scope.ministriesData = data.data;
                LoaderService2.hide();
            }).error(function (data, status, headers, config) {
                LoaderService2.hide();
                AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
            });
            
        })

        

        .controller('CoreGroupsController', function ($scope, $localstorage, LoaderService2, AlertService, CoreGroupsService, $ionicScrollDelegate) {
            $scope.checkloggedin();
    
                       $scope.analyze("Core Groups Page"); 


            function getCoreGroups() {
                CoreGroupsService.getData().success(function (data, status, header, config) {
                    $localstorage.setObject("coreGroupsData", data.data);
                    var coreGroupsData = $localstorage.getObject('coreGroupsData');
                    $scope.coreGroupsData = coreGroupsData;
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }


            if(!$scope.isEmpty($localstorage.getObject('coreGroupsData'))){
                var coreGroupsData = $localstorage.getObject('coreGroupsData');
                $scope.coreGroupsData = coreGroupsData;
                LoaderService2.hide();
            } else {
                getCoreGroups();
            }
            

            // For Refreshing the Data
            $scope.RefreshCoreGroups = function () {
                getCoreGroups();
                $scope.$broadcast('scroll.refreshComplete');
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

        })

        
        .controller('LiveODController', function ($scope, $sce, $localstorage, LoaderService2, AlertService, LiveService, $ionicScrollDelegate) {
            $scope.checkloggedin();
            $scope.analyze("Live/OD Page"); 

            function getLiveODs() {
                LiveService.getData().success(function (data, status, header, config) {
                    $localstorage.setObject("liveOdsData", data.data);
                    var liveOdsData = $localstorage.getObject('liveOdsData');
                    $scope.liveOdsData = liveOdsData;

                    $scope.video_url = $sce.trustAsResourceUrl($scope.liveOdsData.currently_live[0].video_url);
                    console.log($scope.video_url);
                    
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }


            if(!$scope.isEmpty($localstorage.getObject('liveOdsData'))){
                var liveOdsData = $localstorage.getObject('liveOdsData');
                $scope.liveOdsData = liveOdsData;
                    $scope.video_url = $sce.trustAsResourceUrl($scope.liveOdsData.currently_live[0].video_url);
                    console.log($scope.video_url);
                 
                LoaderService2.hide();
            } else {
                getLiveODs();
            }

            // For Refreshing the Data
            $scope.RefreshLiveODs = function () {
                getLiveODs();
                $scope.$broadcast('scroll.refreshComplete');
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

        })

        
        .controller('LiveODDetailController', function ($scope, $sce, $localstorage, LoaderService2, AlertService, LiveService, $ionicScrollDelegate) {
            $scope.checkloggedin();

            var live = $localstorage.getObject('currentLiveOD');
            $scope.live = live;
            
            $scope.analyze(live.sermontitle+" Live Detail Page"); 


            $scope.video_url = $sce.trustAsResourceUrl(live.video_url);
            console.log(angular.toJson(live, true));

        })


        .controller('PersonsCtrl', function ($scope, $sce, $localstorage, LoaderService2, AlertService, PersonsService, $ionicScrollDelegate,$location) {
            $scope.checkloggedin();
    

            //Click letter event
            $scope.gotoList = function(id){
              $location.hash(id);
              $ionicScrollDelegate.anchorScroll();
            };

            //Create alphabet object
            function iterateAlphabet()
            {
               var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
               var numbers = new Array();
               for(var i=0; i<str.length; i++)
               {
                  var nextChar = str.charAt(i);
                  numbers.push(nextChar);
               }
               return numbers;
           }
                
            $scope.groups = [];
            for (var i=0; i<10; i++) {
              $scope.groups[i] = {
                name: i,
                items: []
              };
              for (var j=0; j<3; j++) {
                $scope.groups[i].items.push(i + '-' + j);
              }
            }

            /*
             * if given group is the selected group, deselect it
             * else, select the given group
             */
            $scope.toggleGroup = function(group) {
              if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
              } else {
                $scope.shownGroup = group;
              }
            };
            $scope.isGroupShown = function(group) {
              return $scope.shownGroup === group;
            };
    

             function getPersons() {
                PersonsService.getPersons().success(function (data, status, header, config) {
                    $localstorage.setObject("PersonsData", data.data);
                    var PersonsData = $localstorage.getObject('PersonsData');
                    $scope.PersonsData = PersonsData;
                    
                    var users = $scope.PersonsData;
                    var log = [];
                    $scope.alphabet = iterateAlphabet();

                    //Sort user list by first letter of name
                    var tmp={};
                    for(i=0;i<users.length;i++){
                      var letter=users[i].firstname.toUpperCase().charAt(0);
                      if( tmp[ letter] === undefined){
                        tmp[ letter]=[]
                      }
                        tmp[ letter].push( users[i] );
                    }
                    $scope.sorted_users = tmp;
                    
                    
                    LoaderService2.hide();
                }).error(function (data, status, headers, config) {
                    console.log(status)
                    LoaderService2.hide();
                    AlertService.alert_popup("Error", "There was some error while fetching the data from the WebService.");
                });
            }

            if(!$scope.isEmpty($localstorage.getObject('PersonsData'))){
                var PersonsData = $localstorage.getObject('PersonsData');
                $scope.PersonsData = PersonsData;
                
                var users = $scope.PersonsData;
                var log = [];
                $scope.alphabet = iterateAlphabet();

                //Sort user list by first letter of name
                var tmp={};
                for(i=0;i<users.length;i++){
                  var letter=users[i].firstname.toUpperCase().charAt(0);
                  if( tmp[letter] == undefined){
                    tmp[letter]=[]
                  }
                    tmp[letter].push( users[i] );
                }
                $scope.sorted_users = tmp;
                
                
                
                LoaderService2.hide();
            } else {
                getPersons();
            }

            // For Refreshing the Data
            $scope.RefreshLiveODs = function () {
                getPersons();
                $scope.$broadcast('scroll.refreshComplete');
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            
            
            

          
          
        })

.controller('ContactOrganizerCtrl', function ($scope, $sce, $localstorage, LoaderService2, AlertService, FormSubmitService, $ionicScrollDelegate, LoaderService, serializeDataservice, $ionicPopup, $stateParams) {
    $scope.formdata = {};
    $scope.$on('$ionicView.enter', function (e) {
        $scope.checkloggedin();
        
         $scope.analyze("Contact Organizer Page"); 
        
           if($scope.Loggedin){
               var user = $localstorage.getObject('user');
               $scope.formdata.volunteer_first_name =  user.user_fname;
               $scope.formdata.volunteer_last_name =  user.user_lname;
               $scope.formdata.volunteer_email =  user.email;
               $scope.formdata.volunteer_mobile =  user.mphone;
           }
           
            var contactdetails = $localstorage.getObject("contactOrganizerData");
            console.log(angular.toJson(contactdetails, true));
            
            $scope.formdata.volunteer_ministry =  contactdetails.ministryid;
            $scope.formdata.event_id =  contactdetails.eventid;
            $scope.formdata.eventname =  contactdetails.eventname;
            $scope.formdata.leader_id =  contactdetails.l_id;
            $scope.formdata.volunteer_message = "Please contact me regarding this event";
            $scope.formdata.volunteer_subject = "EBC Event Contact Request Notification for '"+contactdetails.eventname+"'";
            
    });
    
    $scope.submitForm = function(){
            if (Object.keys($scope.formdata).length === 0) {
                   AlertService.alert_popup("Error", 'All Fields are required!');
                   return false;
            }
            else if(!$scope.formdata.volunteer_first_name || $scope.formdata.volunteer_first_name === ""){
                 AlertService.alert_popup("Error", 'First Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_last_name || $scope.formdata.volunteer_last_name === ""){
                 AlertService.alert_popup("Error", 'Last Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_email || $scope.formdata.volunteer_email === ""){
                 AlertService.alert_popup("Error", 'Email Address is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_mobile || $scope.formdata.volunteer_mobile === ""){
                 AlertService.alert_popup("Error", 'Mobile Number is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_subject || $scope.formdata.volunteer_subject === ""){
                 AlertService.alert_popup("Error", 'Subject is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_message || $scope.formdata.volunteer_message === ""){
                 AlertService.alert_popup("Error", 'Message is required');
                 return false;
            }
            else{
                var formdata = {};
                    formdata.volunteer_first_name = $scope.formdata.volunteer_first_name;
                    formdata.volunteer_last_name = $scope.formdata.volunteer_last_name;
                    formdata.volunteer_email = $scope.formdata.volunteer_email;
                    formdata.volunteer_mobile = $scope.formdata.volunteer_mobile;
                    formdata.volunteer_phone = $scope.formdata.volunteer_phone;
                    formdata.volunteer_ministry = $scope.formdata.volunteer_ministry;
                    formdata.event_id = $scope.formdata.event_id;
                    formdata.eventname = $scope.formdata.eventname;
                    formdata.leader_id = $scope.formdata.leader_id;
                    formdata.volunteer_message = $scope.formdata.volunteer_message;
                    formdata.volunteer_subject = $scope.formdata.volunteer_subject;
                    
                    if($scope.formdata.volunteer_phone){
                       formdata.volunteer_phone = $scope.formdata.volunteer_phone;
                    }
                    
                    console.log(angular.toJson(formdata, true));
                    
                    LoaderService.show();
                    var serializeData = serializeDataservice.get(formdata); 
                    FormSubmitService.contact_organizer(serializeData).success(function(data, status, header, config) {
                            LoaderService.hide();
                            if (data.data === "success") {
                                var success_msg = 'Thanks for your feedback. The details have been sent to the organizer!';
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: success_msg,
                                    okType: 'button-balanced'
                                });
                                alertPopup.then(function(res) {
                                     formdata = {};
                                     $scope.formdata = {};
                                     
                                     if($scope.Loggedin){
                                        var user = $localstorage.getObject('user');
                                        console.log(angular.toJson(user, true));
                                        $scope.formdata.volunteer_first_name =  user.user_fname;
                                        $scope.formdata.volunteer_last_name =  user.user_lname;
                                        $scope.formdata.volunteer_email =  user.email;
                                        $scope.formdata.volunteer_mobile =  user.mphone;
                                        $scope.formdata.volunteer_message = "";
                                    }
                                     
                                });
                            }else{
                                LoaderService.hide();
                                AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                            }
                    }).error(function(data, status, header, config){
                        LoaderService.hide();
                        AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                    });
            }
        };
    
    
    

}) 

.controller('ContactMinistryCtrl', function ($scope, $sce, $localstorage, LoaderService2, AlertService, FormSubmitService, $ionicScrollDelegate, LoaderService, serializeDataservice, $ionicPopup, $stateParams) {
    $scope.formdata = {};
    
     $scope.$on('$ionicView.enter', function (e) {
         $scope.analyze("Contact Ministry Page"); 
         
         $scope.checkloggedin();
            if($scope.Loggedin){
                var user = $localstorage.getObject('user');
                console.log(angular.toJson(user, true));
                $scope.formdata.volunteer_first_name =  user.user_fname;
                $scope.formdata.volunteer_last_name =  user.user_lname;
                $scope.formdata.volunteer_email =  user.email;
                $scope.formdata.volunteer_mobile =  user.mphone;
            }
     });
    
    var ministry = $localstorage.getObject('currentMinistry');
    $scope.ministry = ministry;
    console.log(angular.toJson(ministry, true));
    
    $scope.formdata.volunteer_message = "Please contact me regarding this ministry:  "+$scope.ministry.ministryname;

    $scope.submitForm = function(){
            if (Object.keys($scope.formdata).length === 0) {
                   AlertService.alert_popup("Error", 'All Fields are required!');
                   return false;
            }
           
            else if(!$scope.formdata.volunteer_first_name || $scope.formdata.volunteer_first_name === ""){
                 AlertService.alert_popup("Error", 'First Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_last_name || $scope.formdata.volunteer_last_name === ""){
                 AlertService.alert_popup("Error", 'Last Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_email || $scope.formdata.volunteer_email === ""){
                 AlertService.alert_popup("Error", 'Email Address is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_mobile || $scope.formdata.volunteer_mobile === ""){
                 AlertService.alert_popup("Error", 'Mobile Number is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_message || $scope.formdata.volunteer_message === ""){
                 AlertService.alert_popup("Error", 'Message is required');
                 return false;
            }
            else{
                if(!$scope.formdata.volunteer_member_check){
                    $scope.formdata.volunteer_member = 0;
                }
                if($scope.formdata.volunteer_member_check === true){
                    $scope.formdata.volunteer_member = 1;
                }
                if($scope.formdata.volunteer_member_check === false){
                    $scope.formdata.volunteer_member = 0;
                }
                if(!$scope.formdata.volunteer_notify_check){
                    $scope.formdata.volunteer_notify = 0;
                }
                if($scope.formdata.volunteer_notify_check === true){
                    $scope.formdata.volunteer_notify = 1;
                }
                if($scope.formdata.volunteer_notify_check === false){
                    $scope.formdata.volunteer_notify = 0;
                }
                var formdata = {};
                    formdata.ministry_id = $scope.ministry.ministryid;
                    formdata.volunteer_first_name = $scope.formdata.volunteer_first_name;
                    formdata.volunteer_last_name = $scope.formdata.volunteer_last_name;
                    formdata.volunteer_email = $scope.formdata.volunteer_email;
                    formdata.volunteer_mobile = $scope.formdata.volunteer_mobile;
                    formdata.volunteer_message = $scope.formdata.volunteer_message;
                    formdata.volunteer_member = $scope.formdata.volunteer_member;
                    formdata.volunteer_notify = $scope.formdata.volunteer_notify;
            
                    LoaderService.show();
                    var serializeData = serializeDataservice.get(formdata); 
                    
                    FormSubmitService.contact_ministry(serializeData).success(function(data, status, header, config) {
                            LoaderService.hide();
                            
                            if (data.data === "success") {
                                var success_msg = 'Your request has been sent.  Someone from the ministry will contact you directly.';
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: success_msg,
                                    okType: 'button-balanced'
                                });
                                alertPopup.then(function(res) {
                                     formdata = {};
                                     $scope.formdata = {};
                                     $scope.formdata.volunteer_notify_check === false;
                                     $scope.formdata.volunteer_member_check === false;
                                     
                                     if($scope.Loggedin){
                                        var user = $localstorage.getObject('user');
                                        console.log(angular.toJson(user, true));
                                        $scope.formdata.volunteer_first_name =  user.user_fname;
                                        $scope.formdata.volunteer_last_name =  user.user_lname;
                                        $scope.formdata.volunteer_email =  user.email;
                                        $scope.formdata.volunteer_mobile =  user.mphone;
                                        $scope.formdata.volunteer_message = "Please contact me regarding this ministry:  "+$scope.ministry.ministryname;
                                    }
                                     
                                });
                            }else{
                                LoaderService.hide();
                                AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                            }
                    }).error(function(data, status, header, config){
                        LoaderService.hide();
                        AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                    });
            }
        };
})

        
.controller('BecomeMemberCtrl', function ($scope, $sce, $localstorage, LoaderService2, AlertService, FormSubmitService, $ionicScrollDelegate, LoaderService, serializeDataservice, $ionicPopup) {
    
    $scope.analyze("Become Member Page"); 

    $scope.formdata = {};
    
     $scope.$on('$ionicView.enter', function (e) {
         $scope.checkloggedin();
            if($scope.Loggedin){
                var user = $localstorage.getObject('user');
                console.log(angular.toJson(user, true));
                $scope.formdata.volunteer_first_name =  user.user_fname;
                $scope.formdata.volunteer_last_name =  user.user_lname;
                $scope.formdata.volunteer_email =  user.email;
                $scope.formdata.volunteer_mobile =  user.mphone;
                $scope.formdata.volunteer_message = "Please contact me regarding this ministry:  Ebenezer Member & Guest Services";
            }
     });
    
    
    
    
    $scope.submitForm = function(){
            if (Object.keys($scope.formdata).length === 0) {
                   AlertService.alert_popup("Error", 'All Fields are required!');
                   return false;
            }
            else if(!$scope.formdata.volunteer_first_name || $scope.formdata.volunteer_first_name === ""){
                 AlertService.alert_popup("Error", 'First Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_last_name || $scope.formdata.volunteer_last_name === ""){
                 AlertService.alert_popup("Error", 'Last Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_email || $scope.formdata.volunteer_email === ""){
                 AlertService.alert_popup("Error", 'Email Address is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_mobile || $scope.formdata.volunteer_mobile === ""){
                 AlertService.alert_popup("Error", 'Mobile Number is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_message || $scope.formdata.volunteer_message === ""){
                 AlertService.alert_popup("Error", 'Message is required');
                 return false;
            }
            else{
                if(!$scope.formdata.volunteer_member_check){
                    $scope.formdata.volunteer_member = 0;
                }
                if($scope.formdata.volunteer_member_check === true){
                    $scope.formdata.volunteer_member = 1;
                }
                if($scope.formdata.volunteer_member_check === false){
                    $scope.formdata.volunteer_member = 0;
                }
                if(!$scope.formdata.volunteer_notify_check){
                    $scope.formdata.volunteer_notify = 0;
                }
                if($scope.formdata.volunteer_notify_check === true){
                    $scope.formdata.volunteer_notify = 1;
                }
                if($scope.formdata.volunteer_notify_check === false){
                    $scope.formdata.volunteer_notify = 0;
                }
                var formdata = {};
                    formdata.volunteer_first_name = $scope.formdata.volunteer_first_name;
                    formdata.volunteer_last_name = $scope.formdata.volunteer_last_name;
                    formdata.volunteer_email = $scope.formdata.volunteer_email;
                    formdata.volunteer_mobile = $scope.formdata.volunteer_mobile;
                    formdata.volunteer_message = $scope.formdata.volunteer_message;
                    formdata.volunteer_member = $scope.formdata.volunteer_member;
                    formdata.volunteer_notify = $scope.formdata.volunteer_notify;
            
                    LoaderService.show();
                    var serializeData = serializeDataservice.get(formdata); 
                    
                    FormSubmitService.become_member(serializeData).success(function(data, status, header, config) {
                            LoaderService.hide();
                            if (data.data === "success") {
                                var success_msg = 'Your request has been sent.  Someone from the ministry will contact you directly.';
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: success_msg,
                                    okType: 'button-balanced'
                                });
                                alertPopup.then(function(res) {
                                     formdata = {};
                                     $scope.formdata = {};
                                     $scope.formdata.volunteer_notify_check === false;
                                     $scope.formdata.volunteer_member_check === false;
                                     
                                     if($scope.Loggedin){
                                        var user = $localstorage.getObject('user');
                                        console.log(angular.toJson(user, true));
                                        $scope.formdata.volunteer_first_name =  user.user_fname;
                                        $scope.formdata.volunteer_last_name =  user.user_lname;
                                        $scope.formdata.volunteer_email =  user.email;
                                        $scope.formdata.volunteer_mobile =  user.mphone;
                                        $scope.formdata.volunteer_message = "Please contact me regarding this ministry:  Ebenezer Member & Guest Services";
                                    }
                                     
                                });
                            }else{
                                LoaderService.hide();
                                AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                            }
                    }).error(function(data, status, header, config){
                        LoaderService.hide();
                        AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                    });
            }
        };



})

.controller('HelpFindCtrl', function ($scope, $sce, $localstorage, LoaderService2, AlertService, FormSubmitService, $ionicScrollDelegate, LoaderService, serializeDataservice, $ionicPopup) {
    
        $scope.analyze("Find Help Page"); 

    $scope.formdata = {};
    
    $scope.$on('$ionicView.enter', function (e) {
         $scope.checkloggedin();
            if($scope.Loggedin){
                var user = $localstorage.getObject('user');
                console.log(angular.toJson(user, true));
                $scope.formdata.volunteer_first_name =  user.user_fname;
                $scope.formdata.volunteer_last_name =  user.user_lname;
                $scope.formdata.volunteer_email =  user.email;
                $scope.formdata.volunteer_mobile =  user.mphone;
                $scope.formdata.volunteer_message = "Please contact me regarding this ministry:  Get Connected - Let Us Help You Find a Ministry";
            }
     });
    
    $scope.submitForm = function(){
            if (Object.keys($scope.formdata).length === 0) {
                   AlertService.alert_popup("Error", 'All Fields are required!');
                   return false;
            }
           
            else if(!$scope.formdata.volunteer_first_name || $scope.formdata.volunteer_first_name === ""){
                 AlertService.alert_popup("Error", 'First Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_last_name || $scope.formdata.volunteer_last_name === ""){
                 AlertService.alert_popup("Error", 'Last Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_email || $scope.formdata.volunteer_email === ""){
                 AlertService.alert_popup("Error", 'Email Address is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_mobile || $scope.formdata.volunteer_mobile === ""){
                 AlertService.alert_popup("Error", 'Mobile Number is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_message || $scope.formdata.volunteer_message === ""){
                 AlertService.alert_popup("Error", 'Message is required');
                 return false;
            }
            else{
                if(!$scope.formdata.volunteer_member_check){
                    $scope.formdata.volunteer_member = 0;
                }
                if($scope.formdata.volunteer_member_check === true){
                    $scope.formdata.volunteer_member = 1;
                }
                if($scope.formdata.volunteer_member_check === false){
                    $scope.formdata.volunteer_member = 0;
                }
                if(!$scope.formdata.volunteer_notify_check){
                    $scope.formdata.volunteer_notify = 0;
                }
                if($scope.formdata.volunteer_notify_check === true){
                    $scope.formdata.volunteer_notify = 1;
                }
                if($scope.formdata.volunteer_notify_check === false){
                    $scope.formdata.volunteer_notify = 0;
                }
                var formdata = {};
                    formdata.volunteer_first_name = $scope.formdata.volunteer_first_name;
                    formdata.volunteer_last_name = $scope.formdata.volunteer_last_name;
                    formdata.volunteer_email = $scope.formdata.volunteer_email;
                    formdata.volunteer_mobile = $scope.formdata.volunteer_mobile;
                    formdata.volunteer_message = $scope.formdata.volunteer_message;
                    formdata.volunteer_member = $scope.formdata.volunteer_member;
                    formdata.volunteer_notify = $scope.formdata.volunteer_notify;
            
                    LoaderService.show();
                    var serializeData = serializeDataservice.get(formdata); 
                    
                    FormSubmitService.help_find_ministry(serializeData).success(function(data, status, header, config) {
                            LoaderService.hide();
                            if (data.data === "success") {
                                var success_msg = 'Your request has been sent.  Someone from the ministry will contact you directly.';
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: success_msg,
                                    okType: 'button-balanced'
                                });
                                alertPopup.then(function(res) {
                                     formdata = {};
                                     $scope.formdata = {};
                                     $scope.formdata.volunteer_notify_check === false;
                                     $scope.formdata.volunteer_member_check === false;
                                     
                                     if($scope.Loggedin){
                                        var user = $localstorage.getObject('user');
                                        console.log(angular.toJson(user, true));
                                        $scope.formdata.volunteer_first_name =  user.user_fname;
                                        $scope.formdata.volunteer_last_name =  user.user_lname;
                                        $scope.formdata.volunteer_email =  user.email;
                                        $scope.formdata.volunteer_mobile =  user.mphone;
                                       $scope.formdata.volunteer_message = "Please contact me regarding this ministry:  Get Connected - Let Us Help You Find a Ministry";
                                    }
                                     
                                });
                            }else{
                                LoaderService.hide();
                                AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                            }
                    }).error(function(data, status, header, config){
                        LoaderService.hide();
                        AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                    });
            }
        };

})

.controller('NeedPrayerCtrl', function ($scope, $sce, $localstorage, LoaderService2, AlertService, FormSubmitService, $ionicScrollDelegate, LoaderService, serializeDataservice, $ionicPopup) {
    $scope.formdata = {};
    
             $scope.analyze("Need Prayer Page"); 

     $scope.$on('$ionicView.enter', function (e) {
         $scope.checkloggedin();
            if($scope.Loggedin){
                var user = $localstorage.getObject('user');
                console.log(angular.toJson(user, true));
                $scope.formdata.volunteer_first_name =  user.user_fname;
                $scope.formdata.volunteer_last_name =  user.user_lname;
                $scope.formdata.volunteer_email =  user.email;
                $scope.formdata.volunteer_mobile =  user.mphone;
                $scope.formdata.volunteer_message = "Please contact me regarding this ministry:  Prayer Services";
            }
     });
    
    
    $scope.submitForm = function(){
            if (Object.keys($scope.formdata).length === 0) {
                   AlertService.alert_popup("Error", 'All Fields are required!');
                   return false;
            }
           
            else if(!$scope.formdata.volunteer_first_name || $scope.formdata.volunteer_first_name === ""){
                 AlertService.alert_popup("Error", 'First Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_last_name || $scope.formdata.volunteer_last_name === ""){
                 AlertService.alert_popup("Error", 'Last Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_email || $scope.formdata.volunteer_email === ""){
                 AlertService.alert_popup("Error", 'Email Address is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_mobile || $scope.formdata.volunteer_mobile === ""){
                 AlertService.alert_popup("Error", 'Mobile Number is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_message || $scope.formdata.volunteer_message === ""){
                 AlertService.alert_popup("Error", 'Message is required');
                 return false;
            }
            else{
                if(!$scope.formdata.volunteer_member_check){
                    $scope.formdata.volunteer_member = 0;
                }
                if($scope.formdata.volunteer_member_check === true){
                    $scope.formdata.volunteer_member = 1;
                }
                if($scope.formdata.volunteer_member_check === false){
                    $scope.formdata.volunteer_member = 0;
                }
                if(!$scope.formdata.volunteer_notify_check){
                    $scope.formdata.volunteer_notify = 0;
                }
                if($scope.formdata.volunteer_notify_check === true){
                    $scope.formdata.volunteer_notify = 1;
                }
                if($scope.formdata.volunteer_notify_check === false){
                    $scope.formdata.volunteer_notify = 0;
                }
                var formdata = {};
                    formdata.volunteer_first_name = $scope.formdata.volunteer_first_name;
                    formdata.volunteer_last_name = $scope.formdata.volunteer_last_name;
                    formdata.volunteer_email = $scope.formdata.volunteer_email;
                    formdata.volunteer_mobile = $scope.formdata.volunteer_mobile;
                    formdata.volunteer_message = $scope.formdata.volunteer_message;
                    formdata.volunteer_member = $scope.formdata.volunteer_member;
                    formdata.volunteer_notify = $scope.formdata.volunteer_notify;
            
                    LoaderService.show();
                    var serializeData = serializeDataservice.get(formdata); 
                    
                    FormSubmitService.prayer_services(serializeData).success(function(data, status, header, config) {
                            LoaderService.hide();
                            if (data.data === "success") {
                                var success_msg = 'Your request has been sent.  Someone from the ministry will contact you directly.';
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: success_msg,
                                    okType: 'button-balanced'
                                });
                                alertPopup.then(function(res) {
                                     formdata = {};
                                     $scope.formdata = {};
                                     $scope.formdata.volunteer_notify_check === false;
                                     $scope.formdata.volunteer_member_check === false;
                                     
                                     if($scope.Loggedin){
                                        var user = $localstorage.getObject('user');
                                        console.log(angular.toJson(user, true));
                                        $scope.formdata.volunteer_first_name =  user.user_fname;
                                        $scope.formdata.volunteer_last_name =  user.user_lname;
                                        $scope.formdata.volunteer_email =  user.email;
                                        $scope.formdata.volunteer_mobile =  user.mphone;
                                        $scope.formdata.volunteer_message = "Please contact me regarding this ministry:  Prayer Services";
                                    }
                                     
                                });
                            }else{
                                LoaderService.hide();
                                AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                            }
                    }).error(function(data, status, header, config){
                        LoaderService.hide();
                        AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                    });
            }
        };
    
    
})

.controller('SuggestionsCtrl', function ($scope, $sce, $localstorage, LoaderService2, AlertService, FormSubmitService, $ionicScrollDelegate, LoaderService, serializeDataservice, $ionicPopup) {
    $scope.checkloggedin();
    
                 $scope.analyze("Suggestions Page"); 

    $scope.formdata = {};
    
    
     $scope.$on('$ionicView.enter', function (e) {
         $scope.checkloggedin();
            if($scope.Loggedin){
                var user = $localstorage.getObject('user');
                console.log(angular.toJson(user, true));
                $scope.formdata.volunteer_first_name =  user.user_fname;
                $scope.formdata.volunteer_last_name =  user.user_lname;
                $scope.formdata.volunteer_email =  user.email;
                $scope.formdata.volunteer_mobile =  user.mphone;
                $scope.formdata.volunteer_message = "I would like to suggest this ministry in order to: ";
            }
     });
    
    $scope.submitForm = function(){
            if (Object.keys($scope.formdata).length === 0) {
                   AlertService.alert_popup("Error", 'All Fields are required!');
                   return false;
            }
            else if(!$scope.formdata.volunteer_represent || $scope.formdata.volunteer_represent === ""){
                 AlertService.alert_popup("Error", 'Suggested Ministy Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_first_name || $scope.formdata.volunteer_first_name === ""){
                 AlertService.alert_popup("Error", 'First Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_last_name || $scope.formdata.volunteer_last_name === ""){
                 AlertService.alert_popup("Error", 'Last Name is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_email || $scope.formdata.volunteer_email === ""){
                 AlertService.alert_popup("Error", 'Email Address is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_mobile || $scope.formdata.volunteer_mobile === ""){
                 AlertService.alert_popup("Error", 'Mobile Number is required');
                 return false;
            }
            else if(!$scope.formdata.volunteer_message || $scope.formdata.volunteer_message === ""){
                 AlertService.alert_popup("Error", 'Message is required');
                 return false;
            }
            else{
                if(!$scope.formdata.volunteer_member_check){
                    $scope.formdata.volunteer_member = 0;
                }
                if($scope.formdata.volunteer_member_check === true){
                    $scope.formdata.volunteer_member = 1;
                }
                if($scope.formdata.volunteer_member_check === false){
                    $scope.formdata.volunteer_member = 0;
                }
                if(!$scope.formdata.volunteer_notify_check){
                    $scope.formdata.volunteer_notify = 0;
                }
                if($scope.formdata.volunteer_notify_check === true){
                    $scope.formdata.volunteer_notify = 1;
                }
                if($scope.formdata.volunteer_notify_check === false){
                    $scope.formdata.volunteer_notify = 0;
                }
                var formdata = {};
                    formdata.volunteer_represent = $scope.formdata.volunteer_represent;
                    formdata.volunteer_first_name = $scope.formdata.volunteer_first_name;
                    formdata.volunteer_last_name = $scope.formdata.volunteer_last_name;
                    formdata.volunteer_email = $scope.formdata.volunteer_email;
                    formdata.volunteer_mobile = $scope.formdata.volunteer_mobile;
                    formdata.volunteer_message = $scope.formdata.volunteer_message;
                    formdata.volunteer_member = $scope.formdata.volunteer_member;
                    formdata.volunteer_notify = $scope.formdata.volunteer_notify;
            
                    LoaderService.show();
                    var serializeData = serializeDataservice.get(formdata); 
                    
                    FormSubmitService.suggestions(serializeData).success(function(data, status, header, config) {
                            LoaderService.hide();
                            if (data.data === "success") {
                                var success_msg = 'Your request has been sent.  Someone from the ministry will contact you directly.';
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: success_msg,
                                    okType: 'button-balanced'
                                });
                                alertPopup.then(function(res) {
                                     formdata = {};
                                     $scope.formdata = {};
                                     $scope.formdata.volunteer_notify_check === false;
                                     $scope.formdata.volunteer_member_check === false;
                                     
                                     if($scope.Loggedin){
                                        var user = $localstorage.getObject('user');
                                        console.log(angular.toJson(user, true));
                                        $scope.formdata.volunteer_first_name =  user.user_fname;
                                        $scope.formdata.volunteer_last_name =  user.user_lname;
                                        $scope.formdata.volunteer_email =  user.email;
                                        $scope.formdata.volunteer_mobile =  user.mphone;
                                        $scope.formdata.volunteer_message = "I would like to suggest this ministry in order to: ";
                                    }
                                     
                                });
                            }else{
                                LoaderService.hide();
                                AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                            }
                    }).error(function(data, status, header, config){
                        LoaderService.hide();
                        AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                    });
            }
        };
})


.controller('UserMessagesCtrl', function ($scope, $rootScope, $state, $stateParams,$ionicActionSheet,$ionicPopup, $ionicLoading, $ionicScrollDelegate, LoaderService2, $timeout, $interval, ChatService, $localstorage,serializeDataservice, LoaderService, AlertService) {
            $scope.checkloggedin();
    
            console.log(angular.toJson($stateParams, true));
            var chatType = $stateParams.type;
            var recordId = $stateParams.recordId;
            
            
            
            $scope.input = {
                message: localStorage['userMessage'] || ''
            };

            var messageCheckTimer;
            var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
            var footerBar; // gets set in $ionicView.enter
            var scroller;
            var txtInput; // ^^^

            $scope.$on('$ionicView.enter', function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
                });
                
                
                // Get Messages after sending messages
                ChatService.getMessages(chatType, recordId).success(function (data, status, header, config) {
                    $scope.messages = data.data.messages;
                    viewScroll.scrollBottom();
                    $ionicLoading.hide();
                 }).error(function (data, status, headers, config) {
                    LoaderService2.hide();
                    console.log("Error!");
                });

                $timeout(function () {
                    footerBar = document.body.querySelector('#userMessagesView .bar-footer');
                    scroller = document.body.querySelector('#userMessagesView .scroll-content');
                    // txtInput = angular.element(footerBar.querySelector('textarea'));
                }, 0);

                messageCheckTimer = $interval(function () {
                        // Get Messages after sending messages
                    
                        ChatService.getMessages(chatType, recordId).success(function (data, status, header, config) {
                            $scope.messages = data.data.messages;
                         }).error(function (data, status, headers, config) {
                            LoaderService2.hide();
                            console.log("Error!");
                        });
                    
                }, 2000);
            });


            $scope.$on('$ionicView.leave', function () {
                //console.log('leaving UserMessages view, destroying interval');
                // Make sure that the interval is destroyed
                if (angular.isDefined(messageCheckTimer)) {
                    $interval.cancel(messageCheckTimer);
                    messageCheckTimer = undefined;
                }
            });

            $scope.$on('$ionicView.beforeLeave', function () {
                if (!$scope.input.message || $scope.input.message === '') {
                    localStorage.removeItem('userMessage');
                }
            });
            $scope.nomessages = false;

            function getMessages() {
                $ionicLoading.show({
                    template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
                });
                $ionicLoading.hide();
            }


            $scope.$watch('input.message', function (newValue, oldValue) {
                if (!newValue)
                    newValue = '';
                localStorage['userMessage'] = newValue;
            });


            $scope.sendMessage = function (sendMessageForm) {
                var message = {
                    message: $scope.input.message,
                    type:  chatType,
                    record_id : recordId
                };

                if($scope.Loggedin){
                    var user = $localstorage.getObject('user');
                    message.user_id = user.id;
                }
                
                $scope.input.message = "";
                var serializeData = serializeDataservice.get(message); 
                
                console.log(angular.toJson(message, true));

                ChatService.sendMessage(serializeData).success(function(data, status, header, config) {
                    // Get Messages after sending messages
                    ChatService.getMessages(chatType, recordId).success(function (data, status, header, config) {
                        $scope.messages = data.data.messages;
                        viewScroll.scrollBottom(true);
                        
                     }).error(function (data, status, headers, config) {
                        LoaderService2.hide();
                        console.log("Error!");
                    });
                    
                           
                           
                }).error(function(data, status, header, config){
                    LoaderService.hide();
                    AlertService.alert_popup("Error", "There was some problem submitting the form. Please check the fields.");
                });
                
                $timeout(function () {
                    //keepKeyboardOpen();
                    viewScroll.scrollBottom(true);
                }, 0);

            };

            // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
            function keepKeyboardOpen() {
                // console.log('keepKeyboardOpen');
                txtInput.one('blur', function () {
                    //console.log('textarea blur, focus back on it');
                    txtInput[0].focus();
                });
            }



        });