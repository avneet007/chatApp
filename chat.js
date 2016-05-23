var socketio = io.connect("http://localhost:8081");
var bottomPos=0;
var loggedInUserId="";
var loggedInUserName = "";


socketio.on("message_to_client", function(data) {
     
    console.log(data['userName']);
    console.log(data['message']);
   
$("#chatlog").append("<li style='font-size:14px;left: 0; class='glyphicon glyphicon-user'><span style='font-weight:bold;color:"+data['colorCode']+"'>"+data['userName']+"</span>:-"+data['message']+"</li>");
  
    /*  bottomPos +=30; 
      var bottomPosition = bottomPos+"px"
	$("#chatlog").append("<li style='font-size:14px;position: absolute;bottom:"+bottomPos+'px'";left: 0;'><span style='position: relative;''>"+data['message']+"</span></li>");
*/
   // document.getElementById("chatlog").innerHTML = ("<hr/>" +
   // data['message'] + document.getElementById("chatlog").innerHTML);


//$("#chatlog").append("<li style='font-size:14px;left: 0;'>"+data['message']+"</li>");

});

function sendMessage() {

    var msg = $("#message_input").val();
    $("#message_input").val("");
    socketio.emit("message_to_server", { message : msg,userName:userName,color_code:colorCode});
}

function addUserInChatList(name,email){
	  socketio.emit('adduser', name,email);
 }  

socketio.on("update", function(data) {
 
    
   $("#userList").html("");

  for(var i=0;i<data.length;i++){

  
      if(data[i][0].name!=userName){

      var liStr = '</br><div onClick="chatWithUser(\''+data[i][0].name+'\',\''+data[i][0].id+'\',\''+""+'\')"><i class="fa fa-circle" style="color:green;"><span></i>'+' '+data[i][0].name+'<span><div>'

      $("#userList").append(liStr);
      }else{

        loggedInUserId=data[i][0].id;
        loggedInUserName =data[i][0].name
      }



   }  

});

 
   socketio.on("privateChatRCV", function( message,fromUser,fromId) {
 
   // alert("this is my chat"+message+fromUser+fromId);
   // chatWithUser(fromUser,fromId)

    if($("#" + fromId).length == 0) {
       chatWithUser(fromUser,fromId,message)
    }else{

      $("#"+fromId+" #panelBodyTextId").append("</br><span style='font-weight: bold;'>"+fromUser+"</span>:-"+message);
    }


});






function showOpenChat(){
    $("#chatlog").css("display","block")
    $("#userList").css("display","none")

}

function showUserList(){
 
    $("#chatlog").css("display","none")
    $("#userList").css("display","block")
}


function chatWithUser(userName, id,message){
 

 if($("#" + id).length == 0) {
    





  // alert("chat with "+userName);

 var boxChatUserStr =   ' <div id="'+id+'" class="mainbox col-md-3" style="float: right;"><div class = "panel panel-info"><div class = "panel-heading" style="height:35px;">'
      boxChatUserStr += '<div class="panel-title"; id="chatboxTitleId">'+userName+'<span style="float:right;" id="minmizePanel" class="glyphicon glyphicon-modal-window"></span><span style="float:right;" class="glyphicon glyphicon-remove-sign" onClick="removeChatBox(\''+id+'\')"></span>'
      boxChatUserStr += '</div></div><div class = "panel-body" style="height:150px;overflow-y: scroll;padding:0px" id="panelBodyTextId"></div><div><input class="textBoxInputField" id="chatBoxInputId" type="text"  style="float: left;width:80%">'
      boxChatUserStr += '<button style="float: right" id="chatBoxSendButton">Send</button></div></div></div>'

  $("#footerId").append(boxChatUserStr);

  var panelBool=false;

  $("#"+id+" #minmizePanel").click(function(event){

       if(panelBool){
        $("#"+id).animate({height: '212px'});
        panelBool=false;
   }else{
       $("#"+id).animate({height: '30px'});
       panelBool=true;

   }

    })






 
  if(message!=""){
    
        $("#"+id+" #panelBodyTextId").append("</br><span style='font-weight: bold;'>"+userName+"</span>:-"+message);

  }

  $("#"+id+" #chatBoxSendButton").click(function(){
  
   if( $("#"+id+" #chatBoxInputId").val()!=""){
     
      $("#"+id+" #panelBodyTextId").append("</br><span style='font-weight: bold;'>"+loggedInUserName+"</span>:-"+ $("#"+id+" #chatBoxInputId").val());
      socketio.emit('privateChat', userName,id,$("#"+id+" #chatBoxInputId").val(),loggedInUserName,loggedInUserId);
      $("#"+id+" #chatBoxInputId").val("");         
   }
   
  })  

}
  
//addChatEvents(userName);


}


function showChatToggle(){
      
   // alert("toggle");

 if($("#ChatToggleId").hasClass( "glyphicon glyphicon-chevron-up" ))
{
  //  $("#chatlog").css("display","none")
   // $("#userList").css("display","none")
    

  $("#ChatToggleId").removeClass('glyphicon glyphicon-chevron-up');
  $("#ChatToggleId").addClass('glyphicon glyphicon-chevron-down');

}else if($("#ChatToggleId").hasClass( "glyphicon glyphicon-chevron-down" )){

     $("#ChatToggleId").removeClass('glyphicon glyphicon-chevron-down');
     $("#ChatToggleId").addClass('glyphicon glyphicon-chevron-up');
  

} 

}

  /*box chatting */


function addChatEvents(user){


    
}

function removeChatBox(id){

   $("#"+id).remove();
}

