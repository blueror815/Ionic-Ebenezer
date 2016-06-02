angular.module('starter.services', [])
    .constant('api_key', '6e906986c3b199c51fff3154cfb76979')
    .constant('api_url', 'http://mpc.historicebenezer.org/api/')
    .constant('wpapi_url','http://wp.historicebenezer.org')
    .service('RESOURCES', function (api_url) {
        this.apiUrl = api_url;
})

// Login Service     
.factory('LoginService',function(RESOURCES, $http, api_key){
    return {
        get:function(user_data){
            var url = RESOURCES.apiUrl+"login";
            var req = ({
                url :url,
                method:'POST',
                data: user_data,
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'api_key': api_key
                }
            });
            return $http(req);
        }
    };
})
     
.factory('LandingPageService',function (RESOURCES, $http, LoaderService2, api_key){
    return {
         getData : function(){
             LoaderService2.show("Loading Content<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'landing',
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        }
    } 
})

.factory('EventsService',function (RESOURCES, $http, LoaderService2, api_key){
    return {
         getEvents : function(){
             LoaderService2.show("Loading Events<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'events',
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        },
        ministryEvents : function(ministry_id){
             LoaderService2.show("Loading Events<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'ministry_events',
                params: {ministry_id: ministry_id},
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        },
        singleEvent : function(event_id){
             LoaderService2.show("Fetching Event<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'event',
                params: {event_id: event_id},
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        }
    } 
})
.factory('AnnouncementsService',function (RESOURCES, $http, LoaderService2, api_key){
    return {
         getData : function(){
             LoaderService2.show("Loading Announcements<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'announcements',
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        },
        ministryAnnouncements : function(ministry_id){
             LoaderService2.show("Loading Annoucements<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'ministry_announcements',
                params: {ministry_id: ministry_id},
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        }
    } 
})

.factory('BulletinsService',function (RESOURCES, $http, LoaderService2, api_key){
    return {
         getMobileTodayBulletins : function(){
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'get_mobile_today_bulletins',
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        },
        getAllBulletins : function(){
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'get_bulletins',
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        }
    } 
})


.factory('MinistriesService',function (RESOURCES, $http, LoaderService2, api_key){
    return {
         getData : function(){
             LoaderService2.show("Loading Ministries<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'ministries',
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        },
        getSingle : function(ministry_id){
             LoaderService2.show("Loading Ministry<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'ministry',
                params: {ministry_id: ministry_id}, 
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        },
       coreGroupMinistries : function(core_group_id){
             LoaderService2.show("Loading Ministries<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'core_group_ministries',
                params: {core_group_id: core_group_id},
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        }
    } 
})
.factory('CoreGroupsService',function (RESOURCES, $http, LoaderService2, api_key){
    return {
         getData : function(){
             LoaderService2.show("Loading Core Groups<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'core_groups',
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        }
    } 
})
.factory('LiveService',function (RESOURCES, $http, LoaderService2, api_key){
    return {
         getData : function(){
             LoaderService2.show("Loading Live & OD<br> Please wait");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'live',
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        }
    } 
})
.factory('PersonsService',function (RESOURCES, $http, LoaderService2, api_key){
    return {
         getPersons : function(){
             LoaderService2.show("Loading Person<br> Directory");
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'persons',
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        }
    } 
})


// ChangePassword Service     
.factory('FormSubmitService',function(RESOURCES,$http,api_key){
    return {
        prayer_services:function(data){
            var url = RESOURCES.apiUrl+"prayer_services";
            var req = ({
                url :url,
                method:'POST',
                data: data,
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'api_key': api_key
                }
            });
            return $http(req);
        },
        contact_ministry:function(data){
            var url = RESOURCES.apiUrl+"contact_ministry";
            var req = ({
                url :url,
                method:'POST',
                data: data,
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'api_key': api_key
                }
            });
            return $http(req);
        },
        contact_organizer:function(data){
            var url = RESOURCES.apiUrl+"contact_organizer";
            var req = ({
                url :url,
                method:'POST',
                data: data,
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'api_key': api_key
                }
            });
            return $http(req);
        },
        suggestions:function(data){
            var url = RESOURCES.apiUrl+"suggestions";
            var req = ({
                url :url,
                method:'POST',
                data: data,
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'api_key': api_key
                }
            });
            return $http(req);
        },
        help_find_ministry:function(data){
            var url = RESOURCES.apiUrl+"help_find_ministry";
            var req = ({
                url :url,
                method:'POST',
                data: data,
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'api_key': api_key
                }
            });
            return $http(req);
        },
        become_member:function(data){
            var url = RESOURCES.apiUrl+"become_member";
            var req = ({
                url :url,
                method:'POST',
                data: data,
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'api_key': api_key
                }
            });
            return $http(req);
        }
    };
})

.factory('ChatService',function (RESOURCES, $http, LoaderService2, api_key){
    return {
         getMessages : function(chatType, recordId){
            var req = {
                method: 'GET',
                url: RESOURCES.apiUrl + 'get_messages',
                params: {type: chatType, record_id: recordId},
                headers:{
                    'Content-Type': undefined,
                    'api_key': api_key
                }
            };
            return $http(req);    
        },
        sendMessage : function(data){
            var req = {
                url : RESOURCES.apiUrl + 'add_message',
                method:'POST',
                data: data,
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'api_key': api_key
                }
            };
            return $http(req);
        }
    } 
})



.factory('BlogCategoriesService',function (RESOURCES, $http, LoaderService2, wpapi_url,$q){
        var json = wpapi_url+'/api/get_category_index?callback=JSON_CALLBACK';
        var deferred = $q.defer();
        var promise = deferred.promise;
        var data = [];
        var service = {};

        service.async = function() {
            $http.jsonp(json)
            .success(function(d) {
                data = d;
                deferred.resolve();
            }).
            error(function() {
                console.log("Data not Found!");
                deferred.reject();
            });

            return promise;
        };
        service.getCategories = function() { return data; };
        return service;
})



.factory('BlogPostsService',function (RESOURCES, $http, LoaderService2, wpapi_url,$q){
        var deferred = $q.defer();
        var promise = deferred.promise;
        var data = [];
        var service = {};
        service.async = function(id) {
            console.log(id);
            
            $http.jsonp(wpapi_url+'/api/get_category_posts?id='+id+'&callback=JSON_CALLBACK')
            .success(function(d) {
                console.log(d);
                data = d;
                deferred.resolve();
            }).
            error(function() {
                console.log("Data not Found!");
                deferred.reject();
            });
            return promise;
        };
        service.getPosts = function() { return data; };
        return service;
})

.factory('BlogPostService',function (RESOURCES, $http, LoaderService2, wpapi_url,$q){
        var deferred = $q.defer();
        var promise = deferred.promise;
        var data = [];
        var service = {};
        service.async = function(id) {
            $http.jsonp(wpapi_url+'/api/get_post?id='+id+'&callback=JSON_CALLBACK')
            .success(function(d) {
                data = d;
                deferred.resolve();
            }).
            error(function() {
                console.log("Data not Found!");
                deferred.reject();
            });
            return promise;
        };
        service.getPost = function() { return data; };
        return service;
})