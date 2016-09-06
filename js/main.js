var app = angular.module('myApp',["firebase","ngAnimate"]);


app.controller('myKontroller', function($scope,$location, $firebaseArray){
   
    
    $scope.page = document.body;
    $scope.status = "Login";
    $scope.toggleMenus = {uploadMenu:false,createMenu:false,loginMenu:false,userSettings:true,userConfig:false,newPasswordMenu:false,uploadForm:false};
    $scope.password,$scope.password1,$scope.password2,$scope.email = "";
    $scope.loggedIn = false;
    $scope.updating = true;
    
    var users = new Firebase("https://brukerdata.firebaseio.com");
    
    var ref = new Firebase("https://brukerdata.firebaseio.com/Arrangor");
    $scope.arrangorData =  new $firebaseArray(ref);
    
    var ref2 = new Firebase("https://brukerdata.firebaseio.com/Bookingansvarlig");
    $scope.bookingansvarligData =  new $firebaseArray(ref2);
    
    var ref3 = new Firebase("https://brukerdata.firebaseio.com/Bookingsjef");
    $scope.bookingsjefData =  new $firebaseArray(ref3);
    
    
    $scope.upload = function(){
        $scope.bookingansvarligData.$add({text: $scope.text});
    }
    
    
    
    
    $scope.checkPrivelages = function(){
           
        $scope.arrangorData.$loaded().then(function(notes) {
            if(notes.length > 0){
               $scope.isArrangor = true; 
            }
        });
        
         $scope.bookingansvarligData.$loaded().then(function(notes) {
            if(notes.length > 0){
                $scope.isBookingansvarlig = true;
            }
        });
        
         $scope.bookingsjefData.$loaded().then(function(notes) {
            if(notes.length > 0){
                $scope.isBookingsjef = true;
            }
        });
    }
    
    
    $scope.resetPassword = function(email){
        console.log(email);
        users.resetPassword({
            email : email
            }, function(error) {
        if (error === null) {
                console.log("Password reset email sent successfully");
        } else {
    alert("Error sending password reset email:", error);
  };
});
        
}
    
    
    $scope.createUser = function(email){
        users.createUser({
            email    : email,
            password : Math.random(0,10000000000)+"",
            
        }, function(error, userData) {
        if (error) {
            alert("Error creating user:"+error);
        } else {
            alert("An email is sent to you with more info!",userData.uid);
            $scope.resetPassword(email);
            }
        });
    };
    
    
    $scope.loginUser = function(email,pass){
        Firebase.goOnline();
            users.authWithPassword({
            email    : email,
            password : pass
            }, function(error, authData) {
            if (error) {
                alert("Login Failed! Your email or password is wrong!");
            } else {
                console.log("Authenticated successfully with payload:", authData, "provider"+authData.uid);
                $scope.toggleMenus.userSettings = false;
                $scope.toggleMenus.userConfig = true;
                $scope.toggleMenus.uploadForm = true;
                $scope.loggedIn = true;
                $scope.status = "Upload"
                location.reload();
                
                
            }
        });    
    };
    
    
    $scope.logOut = function(){
        $scope.toggleMenus.userConfig = false;
        $scope.toggleMenus.userSettings = true;
        $scope.toggleMenus.newPasswordMenu = false;
        $scope.toggleMenus.uploadForm = false;
        $scope.loggedIn = false;
        $scope.password = "";
        $scope.status = "Login"
        $scope.isArrangor= false;
        $scope.isBookingansvarlig = false;
        $scope.isBookingsjef = false;
        users.unauth();
    };
    
    
    $scope.changePassword = function(email,pass1,pass2){
           users.changePassword({
            email       : email,
            oldPassword : pass1,
            newPassword : pass2
            }, function(error) {
        if (error === null) {
            alert("Password changed successfully");
            $scope.password1 = "";
            $scope.password2 = "";
            $scope.$apply();
        } else {
            alert("Error changing password:"+ error);
        }
    });     
 }
    
    
    $scope.showCreate = function($event){
        
        $scope.toggleMenus.loginMenu = false;  
        
    };
    
    
    $scope.showLogin = function($event){
       $scope.toggleMenus.createMenu = false;
        
    };
    
    
    $scope.togglerFunc = function(x,hide){
        if(hide == true){
        $scope.toggleMenus[x] = false;
          
        }
        else{  
            $scope.toggleMenus[x] = !$scope.toggleMenus[x];
            }
      
        
    }
    
    
    window.onload = function(){
        if(users.getAuth()){
                
               console.log("Loged inn"+users.getAuth().uid);
                $scope.toggleMenus.userSettings = false;
                $scope.toggleMenus.userConfig = true;
                $scope.toggleMenus.uploadForm = true;
                $scope.loggedIn = true;
                $scope.status = "Options"
                $scope.isArrangor= false;
                $scope.isBookingansvarlig = false;
                $scope.isBookingsjef = false;
                $scope.checkPrivelages();
                
           }else{
                 $scope.status = "Login"
           }
    }

});