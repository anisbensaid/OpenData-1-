angular.module("opendataSidebar").
	component("opendataSidebar" , {
		templateUrl : "/opendata/app/sidebar/sidebar.html",
    // transclude: true,
  	// bindings : {},
    
		controller : "opendatatSidebarController"
	})
  

	.directive('fileModel', ['$parse', '$rootScope', '$http', function ($parse,$rootScope,$http) {
            return {
                restrict: 'A',
                bindings: {},
                transclude: true,
                require : "^?opendataSidebar",
               link: function(scope, element, attrs , opendataSidebar) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  element.bind('change', function(){
                    var file = element[0].files[0];

                     scope.$apply(function(){
                        modelSetter(scope, file);
                        opendataSidebar.filename = file.name;
                     });

                      // upload file
                      var fd = new FormData();
                      fd.append('file', file);

                      $http.post("/opendata/fileupload" , fd ,{
                          transformRequest: angular.identity,
                          headers: {'Content-Type': undefined}
                       })
                       .success(function(response){
                          if(response['status']){
                            allData.push({
                              data       : response['data'],
                              file_index : count,
                              filename   : opendataSidebar.filename
                            });

                            allChartTable.push({
                              file_index : count,
                              filename   : opendataSidebar.filename,
                              data       : []
                            });
                          
                            $rootScope.drawData();

                            opendataSidebar.collapse_menu(); // collapse menu when user upload file success
                           
                          
                            $rootScope.addFile(opendataSidebar.filename);
                            count+=1;
                          }else{
                            alert(response['error']);
                          }
                       })
                    
                       .error(function(){
                          // return 1
                       });

                     // columns parsing
                    var r = new FileReader();
                    r.onload = function(e) {
                      var contents = e.target.result;
                      contents = contents.split(/\n/);
                      scope.$apply(function() {
                        opendataSidebar.columns = contents[0].split(',').map(function(column) {
                          return { name: column, checked: false };
                        })
                      })
                    };
                    r.readAsText(file);
                  });
               }
            };
         }]);