var userName="";
var loginComplete=false;
var colorCode = getRandomColor();


$(document).ready(function(){
    // showUserList();
      hideAll();
        $("#loginSingnUpContainer").css("display","block");

    $("#btn-signup").click(function(){
             var myData = new Object();
             myData.email = $("#email").val();
             myData.userName = $("#UserName").val();
             myData.passwd = $("#passwd").val();
 
               if($('#femaleId').is(':checked')){
                 myData.gender = "female"

               }else{

                myData.gender = "male"
               }
                //alert($('#maleId').is(':checked'))

            // myData.gender = 


             console.log(myData);
            addUser(myData);


    })



  $("#btn-login").click(function(){
              
             var myData = new Object(); 
             myData.email = $("#inputEmail").val();
             myData.passwd = $("#inputPassword").val();
             $.ajax({
				   type: "POST",
				   dataType: "json",
				   contentType: "application/json",
				   url: "http://localhost:8081/login",
				   data: JSON.stringify(myData),
				   success: function(msg){


				        //  console.log("received data"+JSON.stringify(msg.data[1].userInfo[0].name)+msg);
                  console.log(msg);
                        hideAll();
                       if(msg.data[0].status==1){
                          hideAll();
                          $("#ChatWindow").css("display","block");
                          $("#sidebar-wrapper").css("display","block");
                          
                        //   alert("login done");
                       loginComplete=true;
                       $("#loginSingnUpContainer").css("display","none");
                       $("#wrapper").css("display","block");
                       $("#UserName").html(msg.data[1].userInfo[0].name)
                       userName = msg.data[1].userInfo[0].name;
                     
                       $("#h1Id").html(msg.data[1].userInfo[0].name);

                       // alert(JSON.stringify(msg.data[1].menuIData.length))
                       
                        addUserInChatList(msg.data[1].userInfo[0].name,$("#inputEmail").val());

                       // socketio.on('connect', function (){
                               
                       // });


                       for(var i=0;i<msg.data[2].menuIData.length;i++){
                        var opName = msg.data[2].menuIData[i].Operation
                        var menuStr  = '<li id="mainMenu'+i+'" onClick="menuAction(\''+opName+'\')"><a href="#">'+msg.data[2].menuIData[i].name+'</a></li>'
                           $("#menuListItem").append(menuStr)
                        }
                            var menuStrlogOut  = ' <li><a href="#" onClick="logout(\''+$("#inputEmail").val()+'\')">log out</a></li>'
                            $("#menuListItem").append(menuStrlogOut)
                            $("#menuListItem #mainMenu0").trigger("click"); 

                       }else{
                            //alert("login done");
                           alert("Wrong email/password, please try again:");


                       }

				   },
				   error: function(){
				   	    alert('in error');
				   }
           });

    })

      
      $("#SaveButton").click(function(){
             var myData = new Object(); 
             myData.email = $("#inputEmail").val();
             myData.htmlData = $("#pdfData").html();

             console.log(myData)


             $.ajax({
				   type: "POST",
				   dataType: "json",
				   contentType: "application/json",
				   url: "http://localhost:8081/savePdf",
				   data: JSON.stringify(myData),
				   success: function(msg){
				      // console.log(msg.data[0].url);
				         window.open(msg.data[0].url, '_blank');
            	   },
    				   
               error: function(){
    				   	    alert('in error');
    				   }


           });

    })






  $("#forgotPassSubmit").click(function(){

        var email = $("#forgotEmail").val()

         if(isEmail(email)){

            var myData = new Object(); 
             myData.email = email;
            
             $.ajax({
				   type: "POST",
				   dataType: "json",
				   contentType: "application/json",
				   url: "http://localhost:8081/forgotPassword",
				   data: JSON.stringify(myData),
				   success: function(msg){
				      alert(msg.data[1].respnse);



            	   },
				   error: function(){
				   	    alert('in error');
				   }
           });

         }else{

          alert("Email is not correct, please check and try again");             

         }

  });


  $("#addUserId").click(function(){
                 
                 var user = new Object();
                 user.email= $("#userEmail").val()
                 user.firstname=$("#userFirstName").val()
                 user.lastname=$("#userLastName").val();
                 user.passwd=$("#userPassword").val();
                 addUser(user);

  })


    


$("#findButtonId").click(function(){

                 var findObj = new Object();
                 findObj.email= $("#findEmail").val()
                 findObj.operationName = "findUser";
                 findUser(findObj);

})




$("#updateUserButton").click(function(){
                 var updateObject = new Object();
                 
                 updateObject.email= $("#updateContaineremail").val()
                 updateObject.userName = $("#updateContainerUserName").val();
                 updateObject.pwd = $("#updateContainerPassword").val();
                 updateObject.update = "updateUser";
                 updateUserInfo(updateObject);

})


  $("#useList").hide();
   showUserList();


})

$(document).keypress(function(e) {
    if(e.which == 13) {
       // alert('You pressed enter!');
       if(!loginComplete){
         $("#btn-login").trigger("click");
       }else{
           if($("#message_input").val()!=""){
             sendMessage();
          }
       }
    }
});







function logout(email){
  
  socketio.emit('removeUser', email); 
	window.location = "index.html";
}


function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}



function menuAction(str){


          var myData = new Object(); 
          myData.email = $("#inputEmail").val(); 
          myData.menuName = str; 
          
          $.ajax({
           type: "POST",
           dataType: "json",
           contentType: "application/json",
           url: "http://localhost:8081/menuHandling",
           data: JSON.stringify(myData),
           success: function(msg){
             // console.log(msg.length);
                  $("#buttonContainerId").html("");
                  for(var i=0;i<msg.length;i++){

                    var opName = msg[i].Operation;

                   // var buttonString =   '<li onClick="subMenuOpen(\''+opName+'\')"><a href='#'>'+msg[i].name+'</a></li>'

                     var buttonString  = '<li id="subMenuIteam'+i+'" onClick="subMenuOpen(\''+opName+'\')"><a href="#">'+msg[i].name+'</a></li>'
                     $("#buttonContainerId").append(buttonString);

                   }

                   $("#buttonContainerId #subMenuIteam0").trigger("click");


                 },
           error: function(){
                alert('in error');
           }
           });

}








function subMenuOpen(str){
    


      if(str=="addNewUser"){
         hideAll() 
        $("#addUserDiv").css("display","block");
         $("#chatContainer").css("display","block");  

      }else if(str=="updateUser"){
         
        hideAll(); 
         $("#updateUserId").css("display","block");   

      } else if (str=="deleteUser"){

         hideAll(); 
         showAllUserList();
         $("#deleteUser").css("display","block");   
      } 

}




function hideAll(){

       $("#loginSingnUpContainer").css("display","none");
       $("#signupbox").css("display","none");  
      $("#forgotPassword").css("display","none");  
      $("#sidebar-wrapper").css("display","none"); 
      $("#ChatWindow").css("display","none"); 
    //  $("#chatContainer").css("display","none");  


}


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


