var userName

function addUser(userData){
      
      $.ajax({
				   type: "POST",
				   dataType: "json",
				   contentType: "application/json",
				   url: "http://localhost:8081/registerUser",
				   data: JSON.stringify(userData),
				   success: function(msg){
		             alert(msg.data[0].status)
		             hideAll();
		             $("#ChatWindow").css("display","block");

		             
                    

             	   },
				   error: function(){
				   	    alert('in error');
				   }
           });


}


function findUser(data){
            
      $.ajax({
				   type: "POST",
				   dataType: "json",
				   contentType: "application/json",
				   url: "http://localhost:8081/userOperation",
				   data: JSON.stringify(data),
				   success: function(msg){

				      $("#updateContainer").css("display","block");
				   	  $("#updateContaineremail").val(msg[0].email);
				   	  $("#updateContainerUserName").val(msg[0].name);
				   	  $("#updateContainerPassword").val(msg[0].pwd)

				  /* 	$("#updateContainer").css("display","block");
				   	$("#updateContainerUserName").html(msg[0].email);
				   	$("#updateContaineremail").html(msg[0].email);

				   	   $("#updateContainerUserName").val(msg[0].name)
*/


                     


		       //alert('wow'+msg);
		      // alert(msg.data[0].status)
           //console.log("received data"+JSON.stringify(msg));

				   },
				   error: function(){
				   	    alert('in error');
				   }
           });


}





function  updateUserInfo(updateObject){
 
             $.ajax({
  				   type: "POST",
				   dataType: "json",
				   contentType: "application/json",
				   url: "http://localhost:8081/updateUserData",
				   data: JSON.stringify(updateObject),
				   success: function(msg){

				   	   alert(msg.data[1].respnse)

                },
				   error: function(){
				   	    alert('in error');
				   }
           });



}





function showAllUserList(){
                 $.ajax({
  				   type: "GET",
				   dataType: "json",
				   contentType: "application/json",
				   url: "http://localhost:8081/getUserList",
				   success: function(msg){

				    console.log(msg.data[1].respnse)
                         $("#userListItems").html("")

                       for(var i=0;i<msg.data[1].respnse.length;i++){
                            if(msg.data[1].respnse[i].accessType!="hr"){
                              var userStr = ' <a href="#" class="list-group-item"><span id="useIcon" class="glyphicon glyphicon-user" style="margin-right:10px;"></span>'+"<span id='userNameId'>"+msg.data[1].respnse[i].name+'<span class="pull-right"><span class="glyphicon glyphicon-trash" onClick="removeUser(\''+msg.data[1].respnse[i].email+'\')"></span></button></span></a>'                                                      
                              $("#userListItems").append(userStr);         
                           }                 
                        }
                },
				   error: function(){
				   	    alert('in error');
				   }
           });



}


function removeUser(email){
      

  var option =  window.confirm("Are you sure you want ot remove "+email);
   
  if (option == true) {
      
            var object = new Object();
            object.email = email;

            $.ajax({
  				   type: "POST",
				   dataType: "json",
				   contentType: "application/json",
				   url: "http://localhost:8081/removeUser",
				   data: JSON.stringify(object),
				   success: function(msg){

				   	   alert(msg.data[1].respnse)
				   	   showUserList();

                },
				   error: function(){
				   	    alert('in error');
				   }
           });


     




} else {
   // alert("dont remove it");




}




}




 $('#searchEmpId').keyup(function () {

            var rex = new RegExp($(this).val(), 'i');
            $('#userListItems .list-group-item').hide();
            $('#userListItems .list-group-item').filter(function () {
                return rex.test($(this).text());
            }).show();
  })