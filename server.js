var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var http = require("http");
var url = require("url");

var fs = require('fs');
var pdf = require('html-pdf');
var conenctedUserList=new Array();
var clientsList=new Array();
  
   var server = app.listen(8081, function () {
      var host = server.address().address
      var port = server.address().port
      console.log("Example app listening at http://%s:%s", host, port)
   })


var hrMenu =   [{"name":"User Management", "Operation":"userHandling"},
               {"name":"Leave Management", "Operation":"leaveHandling"},
               {"name":"Query Management", "Operation":"QueryHandling"}];

var userManagement =  [{"name":"Add New Employee", "Operation":"addNewUser"},
                     {"name":"Update Employee Details ", "Operation":"updateUser"},
                     {"name":"Remove Employee", "Operation":"deleteUser"}];
var leaveManagement =  [{"name":"Add new Leave request", "Operation":"addNewLeave"},
                     {"name":"Update Leave Status", "Operation":"updateLeave"},
                     {"name":"Remove requst", "Operation":"deleteRequest"}];

var queryManagement =  [{"name":"Add new Query", "Operation":"addQuery"},
                     {"name":"Update Existing queries", "Operation":"updateQuery"},
                     {"name":"Others", "Operation":"deleteOthers"}];




var empMenu  = [{"name":"Profile", "Operation":"profileHandling"},
               {"name":"Leaves", "Operation":"leaveHandling"}]
          
var profileMenu  =  [{"name":"Edit profile", "Operation":"editProfile"},
                     {"name":"Profile update request", "Operation":"updateProfileQuery"}];             

var empLeavesMenu =  [{"name":"New Leave request", "Operation":"addLeaveRequest"},
                     {"name":"Check Leave status", "Operation":"leaveStatusCheck"},
                     {"name":"Leave Balance", "Operation":"leaveBalanceCheck"}];             
               
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/users';

app.use(bodyParser());

app.use("/", express.static(__dirname));

app.post('/registerUser', function (req, res) {
      
          var user  = {name: req.body.userName, email:req.body.email, pwd:req.body.passwd, gender:req.body.gender};
  
          MongoClient.connect(url, function (err, db) {
              if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
              } else {
              
                     console.log('Connection established to', url);
                        var collection = db.collection('users');

                         collection.find({email: req.body.email}).toArray(function (err, result) {
                        if (err) {
                          console.log(err);
                        } else if (result.length) {

                          res.status("200");
                          console.log("User already registred with system"); 
                          var status = {"data":[{"status":"User already registred with system "}]}
                          res.end(JSON.stringify(status));
                          db.close();

                        } else {
                          //console.log('No document(s) found with defined "find" criteria!');


                                  collection.insert([user], function (err, result) {
                                    if (err) {
                                      console.log("we have error here"+err);
                                    } else {
                                       res.status("200");
                                       var status = {"data":[{"status":"User added with the system"}]}
                                       res.end(JSON.stringify(status));
                                       db.close();
                                    }
                               });

                        }
                        

                   });

              }
        });
})


app.post('/login', function (req, res) {
         
            MongoClient.connect(url, function (err, db) {
              if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
              } else {
              
                console.log('Connection established to', url);

                var collection = db.collection('users');
               
                collection.find({email: req.body.email, pwd:req.body.passwd}).toArray(function (err, result) {
                if (err) {
                  console.log(err);
                } else if (result.length) {
                 // console.log('Found:', result[0].accessType);
                  
                  if(result[0].accessType=="hr"){
                      var responseData =  {"data":[{"status":"1"},{"userInfo":result},{"menuIData":hrMenu}]}

                  }else{
                       var responseData =  {"data":[{"status":"1"},{"userInfo":result},{"menuIData":empMenu}]}

                  }
                    res.status("200");
                   res.end(JSON.stringify(responseData));


                } else {
                    res.status("200");
                    var status = {"data":[{"status":"0"},{"userInfo":[]}]}
                    res.end(JSON.stringify(status));
                }
                db.close();

              });
              }
        });
              
})


         




      app.post('/forgotPassword', function (req, respo) {
           
                MongoClient.connect(url, function (err, db) {
              if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
              } else {
                console.log('Connection established to', url);
                var collection = db.collection('users');
                collection.find({email: req.body.email}).toArray(function (err, result) {
                if (err) {
                  console.log(err);
                } else if (result.length) {

                   var newPass = generatePassword();

                     collection.update(
                       
                       {email: req.body.email }, {$set:{pwd: newPass}}, function(){

                                            console.log("update");  
                                            respo.status("200");
                                            emailPass(newPass,req.body.email);
                                            var responseData = {"data":[{"status":"0"},{"respnse":"New password has been sent to your email"}]}
                                            respo.end(JSON.stringify(responseData));
                        }

                      )
                 } else {
                     console.log("not found");  
                    respo.status("200");
                    var responseData = {"data":[{"status":"0"},{"respnse":"No user found related to this email id"}]}
                    respo.end(JSON.stringify(responseData));
                }
                db.close();
                
                 });
            }
        });

               
                
       })


  








    app.get('/getUserList', function (req, respo) {
              
              MongoClient.connect(url, function (err, db) {
              if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
              } else {
                         // console.log('Connection established to', url);

                         var collection = db.collection('users');
                        
                         collection.find().toArray(function (err, result) {



                         if(err){
                           console.log("no info available")
                         }else{
                          

                           respo.status("200");
                          var responseData = {"data":[{"status":"0"},{"respnse":result}]}
                          respo.end(JSON.stringify(responseData));

                            

                         /* collection.update(
                          
                          {email: req.body.email },{$set:{pwd: req.body.pwd, name:req.body.userName}}, function(){
                          respo.status("200");
                          var responseData = {"data":[{"status":"0"},{"respnse":"User's info updated"}]}
                          respo.end(JSON.stringify(responseData));

                        }

                      )*/
                       

                         }    
                        });

                      }
              });           
    
   })


  

    app.post('/removeUser', function (req, respo) {
              
              MongoClient.connect(url, function (err, db) {
              if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
              } else {
                         // console.log('Connection established to', url);

                         var collection = db.collection('users');
                        
                         collection.remove({email: req.body.email},function(err, result) {
                         if(err){
                           console.log("no info available")
                         }else{
                          
                           console.log(result);
                           respo.status("200");
                          var responseData = {"data":[{"status":"0"},{"respnse":"You have successfully remove this user"}]}
                          respo.end(JSON.stringify(responseData));
                         }

                         });   
                          

                         /* collection.update(
                          
                          {email: req.body.email },{$set:{pwd: req.body.pwd, name:req.body.userName}}, function(){
                          respo.status("200");
                          var responseData = {"data":[{"status":"0"},{"respnse":"User's info updated"}]}
                          respo.end(JSON.stringify(responseData));

                        }

                      )*/
                       }
              });           
    
   })


/*======chatting*/

var io  = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
  // console.log("connected");
   

    

    socket.on('adduser', function (user,email) {

            var findFlag=false;

           var userObject =  [{"name":user, "userEmail":email,"id":socket.id}];        
   
          for(var i=0;i<conenctedUserList.length;i++){
             // console.log(conenctedUserList[i][0].userEmail);
             if(email==conenctedUserList[i][0].userEmail){
               findFlag=true;
              // console.log("at index"+i);
             }

          }
          
         if(findFlag){
         
         }else{
           conenctedUserList.push(userObject);
           updateClients();

         }
               
    });



   socket.on('removeUser', function(email) {

      
         for(var i=0;i<conenctedUserList.length;i++){
          
             if(email==conenctedUserList[i][0].userEmail){
               conenctedUserList.splice(i, 1);
               updateClients();
             
             }

          }





      /* var num = conenctedUserList.indexOf(userName);

        if(num!=-1){

          conenctedUserList.splice(num, 1);
          updateClients();

         } */

        //io.sockets.emit("message_to_client",{ message: data["message"],userName:data["userName"],colorCode:data['color_code'] });
    });



    socket.on('message_to_server', function(data) {
        
        io.sockets.emit("message_to_client",{ message: data["message"],userName:data["userName"],colorCode:data['color_code'] });
    });



      socket.on('privateChat', function(userName,id,message,fromUser,fromId) {

             for(var i=0;i<conenctedUserList.length;i++){
          
             if(id==conenctedUserList[i][0].id){
             //  conenctedUserList.splice(i, 1);
               //updateClients();
                io.to(id).emit('privateChatRCV', message,fromUser,fromId);
             
             }

          }




         // var findIndex = conenctedUserList.indexOf(data.toUser)

         // io.to(clientsList[findIndex]).emit('privateChatRCV', data.message);
        
      
    });



   /* socket.on('message_to_server', function(data) {
        
        io.sockets.emit("message_to_client",{ message: data["message"],userName:data["userName"],colorCode:data['color_code'] });
    });

    clientsList*/

    function updateClients() {

        io.sockets.emit('update', conenctedUserList);
    }

   });

  function emailPass(passwd,email){
   
    var mailer = require("nodemailer");
   
    var smtpTransport = mailer.createTransport("SMTP",{
            service: "Gmail",
            auth: {
                user: "mpprogram123@gmail.com",
                pass: "Welcomemp"
            }
        });
  
   var mail = {
        from: "test@gmail.com",
        to: email,
        subject: "Password Reset",
        text: "Your new password is",
        html: "Your new password is "+passwd
    }

 smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });

 }



 function generatePassword(){

    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz0123456789";
    var string_length = 8;
    var randomstring = '';
    var charCount = 0;
    var numCount = 0;

    for (var i=0; i<string_length; i++) {
        // If random bit is 0, there are less than 3 digits already saved, and there are not already 5 characters saved, generate a numeric value. 
        if((Math.floor(Math.random() * 2) == 0) && numCount < 3 || charCount >= 5) {
            var rnum = Math.floor(Math.random() * 10);
            randomstring += rnum;
            numCount += 1;
        } else {
            // If any of the above criteria fail, go ahead and generate an alpha character from the chars string
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
            charCount += 1;
        }
    }

     return randomstring;
    //alert(randomstring);
 }