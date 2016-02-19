// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova', 'ngIOS9UIWebViewPatch' ,'ngSanitize','starter.controllers', 'starter.services' ,'starter.utilities', 'monospaced.elastic', 'angularMoment'])

.config(function($ionicConfigProvider, $httpProvider) {
  // Remove the Back Button text  
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
})

//96e56eb7-18e6-4483-b591-5c7d4d8eba93

.run(function($ionicPlatform) {
        
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) { 
     // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
        
    // InAppBrowser Initialize
    // Open any external link with InAppBrowser Plugin
    $(document).on('click', 'a[href^=http], a[href^=https]', function(e){
        e.preventDefault();
        var $this = $(this); 
        var target = $this.data('inAppBrowser') || '_system';
        window.open($this.attr('href'), target);
    });
    
    
    document.addEventListener('deviceready', function () {
//         window.plugins.OneSignal.setLogLevel({logLevel: 0, visualLevel: 0});

        var notificationOpenedCallback = function(jsonData) {
          console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
        };

        window.plugins.OneSignal.init("ace1585f-e563-4080-a2b4-b73aeb5975e8",
                                       {googleProjectNumber: "851184216151"},
                                       notificationOpenedCallback);
                                       
        window.plugins.OneSignal.getIds(function(ids) {
            localStorage.OneSignalUserID = ids.userId; 
            localStorage.OneSignalPushToken = ids.pushToken; 
        });                                
                                       
                                       
        // Show an alert box if a notification comes in when the user is in your app.
        //window.plugins.OneSignal.enableInAppAlertNotification(true);
        
      }, false);
    
    
    
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  
  // States
  $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

    // Landing page
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'LandingController'
        }
      }
    })

   
    // Giving Page
    .state('app.giving', {
      url: '/giving',
      views: {
        'menuContent': {
          templateUrl: 'templates/giving.html'
        }
      }
    })
    
    .state('app.giving_accessaccount', {
      url: '/giving_accessaccount',
      views: {
        'menuContent': {
          templateUrl: 'templates/giving_access_account.html'
        }
      }
    })
    
     // Map Page
    .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
          controller: 'MapController'
        }
      }
    })
    
    // Live and OD Page
    .state('app.liveandod', {
        url: '/liveandod',
        views: {
          'menuContent': {
            templateUrl: 'templates/liveandod.html',
            controller: 'LiveODController'
          }
        }
      })

    // Live Detail Page
    .state('app.live_detail', {
        url: '/live_detail',
        cache : false,
        views: {
          'menuContent': {
            templateUrl: 'templates/live_detail.html',
            controller: 'LiveODDetailController'
          }
        }
      })


    // Categories Page
    .state('app.news_categories', {
        url: '/news_categories',
        views: {
          'menuContent': {
            templateUrl: 'templates/news-categories.html',
            controller: 'NewsCategoriesController'
          }
        }
      })
      
    // Category Posts Page
    .state('app.news_category_posts', {
        url: '/category_posts/:categoryId',
        views: {
          'menuContent': {
            templateUrl: 'templates/news-category-posts.html',
            controller: 'NewsCategoryPostsController'
          }
        }
      })
      
     // Single Post Page
    .state('app.news_post', {
        url: '/news_post/:postId',
        views: {
          'menuContent': {
            templateUrl: 'templates/news-post.html',
            controller: 'NewsPostController'
          }
        }
      })  
      
    // Announcements Page
    .state('app.announcements', {
        url: '/announcements',
        views: {
          'menuContent': {
            templateUrl: 'templates/announcements.html',
            controller: 'AnnouncementController'
          }
        }   
      })
      
      
     // Bulletins Page
    .state('app.bulletins', {
        url: '/bulletins',
        views: {
          'menuContent': {
            templateUrl: 'templates/bulletins.html',
            controller: 'BulletinsController'
          }
        }   
      }) 
      
      .state('app.homebulletins', {
        url: '/homebulletins',
        views: {
          'menuContent': {
            templateUrl: 'templates/homebulletins.html',
            controller: 'HomeBulletinsController'
          }
        }   
      }) 
      
      
     // Single Bulletin Page
    .state('app.bulletin', {
        url: '/bulletins/:bulletinId',
        views: {
          'menuContent': {
            templateUrl: 'templates/bulletin_detail.html',
            controller: 'BulletinDetailController'
          }
        }   
      }) 
      

   // Events Page
    .state('app.events', {
        url: '/events',
        cache: true,
        views: {
          'menuContent': {
            templateUrl: 'templates/events.html',
            controller: 'EventsController'
          }
        }   
      })
      
    // Event Detail Page
    .state('app.event_detail', {
        url: '/events/:eventId',
        views: {
          'menuContent': {
            templateUrl: 'templates/event-detail.html',
            controller: 'EventDetailController'
          }
        }   
      })  
      
     // Core Groups Page
    .state('app.core_groups', {
        url: '/core_groups',
        views: {
          'menuContent': {
            templateUrl: 'templates/core_groups.html',
            controller: 'CoreGroupsController'
          }
        }   
      })

    // Ministries Page
    .state('app.ministries', {
        url: '/ministries',
        views: {
          'menuContent': {
            templateUrl: 'templates/ministries.html',
            controller :'MinistriesController'
          }
        }   
      })
      
      
      
     // Ministry Detail Page
    .state('app.ministry_detail', {
        url: '/ministries/:ministryId',
        views: {
          'menuContent': {
            templateUrl: 'templates/ministry-detail.html',
            controller: 'MinistryDetailController'
          }
        }   
      }) 
      //Ministry About Us
     .state('app.ministry_about', {
       url: '/ministry_about/:ministryId',
        views: {
          'menuContent': {
            templateUrl: 'templates/ministry_about.html',
            controller: 'MinistryAboutCtrl'
          }
        }   
      })   
      //Ministry Announcements
       .state('app.ministry_annoucements', {
       url: '/ministry_annoucements',
        views: {
          'menuContent': {
            templateUrl: 'templates/ministry_announcements.html',
            controller: 'MinistryAnnouncementsCtrl'
          }
        }   
      })   
      //Ministry Events
       .state('app.ministry_events', {
       url: '/ministry_events',
        views: {
          'menuContent': {
            templateUrl: 'templates/ministry_events.html',
            controller: 'MinistryEventsCtrl'
          }
        }   
      })   
      //Ministry Bulletins
       .state('app.ministry_bulletins', {
       url: '/ministry_bulletins',
        views: {
          'menuContent': {
            templateUrl: 'templates/ministry_bulletins.html',
            controller: 'MinistryBulletinsCtrl'
          }
        }   
      })   
      
      //Group Ministries
       .state('app.group_ministries', {
       url: '/group_ministries',
        views: {
          'menuContent': {
            templateUrl: 'templates/group_ministries.html',
            controller: 'GroupMinistriesCtrl'
          }
        }   
      })   
      
      
      // Persons
       .state('app.persons', {
       url: '/persons',
        views: {
          'menuContent': {
            templateUrl: 'templates/persons.html',
            controller: 'PersonsCtrl'
          }
        }   
      })  
      
      
      // Ministry Single Detail
       // Chat Page
    .state('app.chat', {
      url: '/chat/:type/:recordId',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat.html',
          controller: 'UserMessagesCtrl'
        }
      }
    })
    
   // Facebook Page
    .state('app.facebook', {
        url: '/facebook',
        views: {
          'menuContent': {
            templateUrl: 'templates/facebook.html'
          }
        }   
      })

   // Website Page
    .state('app.website', {
        url: '/website',
        views: {
          'menuContent': {
            templateUrl: 'templates/website.html'
          }
        }   
      })
      
   // Profile Page
    .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html'
          }
        }   
      })
      
      // Contact MinistryPage
    .state('app.contact_ministry', {
        url: '/contact_ministry',
        views: {
          'menuContent': {
            templateUrl: 'templates/contact_minstry.html',
            controller: 'ContactMinistryCtrl'
          }
        }   
      }) 
      
    .state('app.contact_organizer', {
        url: '/contact_organizer',
        views: {
          'menuContent': {
            templateUrl: 'templates/contact_organizer.html',
            controller: 'ContactOrganizerCtrl'
          }
        }   
      })   
      
      
   // Suggestions Page
    .state('app.suggestions', {
        url: '/suggestions',
        views: {
          'menuContent': {
            templateUrl: 'templates/suggestions.html',
            controller: 'SuggestionsCtrl'
          }
        }   
      })
      
    // Need Prayer Page
    .state('app.need_prayer', {
        url: '/need_prayer',
        views: {
          'menuContent': {
            templateUrl: 'templates/need_prayer.html',
            controller: 'NeedPrayerCtrl'
          }
        }   
      })   
      
      
   // Need Help Finding Ministries Page
    .state('app.need_help_find', {
        url: '/need_help_find',
        views: {
          'menuContent': {
            templateUrl: 'templates/need_help_find.html',
            controller: 'HelpFindCtrl'
          }
        }   
      })      
      
    // Become Member Page
    .state('app.become_member', {
        url: '/become_member',
        views: {
          'menuContent': {
            templateUrl: 'templates/become_member.html',
            controller: 'BecomeMemberCtrl'
          }
        }   
      })  
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
