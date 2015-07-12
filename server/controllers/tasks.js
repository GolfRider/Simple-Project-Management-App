var http = require('http');
var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var mysql=require('mysql')

var pool=mysql.createPool({
connectionLimit:10,
database:'20ml',
host:'localhost',
user:'root'

});

var listFiles= function(){
		            var files = fs.readdirSync(appDir + "/uploads/");
					return files;
        }

// This is the base controller. Used for base routes, such as the default index/root path, 404 error pages, and others.
module.exports = {
    index: {
        handler: function(request, reply){
          // Render the view with the custom greeting
            reply.view('home', {
                title: 'Welcome to xNGO'
            });
        },
        app: {
            name: 'home'
        }
    },
    about: {
        handler: function(request, reply){
            reply.view('about', {
                title: 'Super Informative About Page'
            });
        },
        app: {
            name: 'about'
        }
    },
    missing: {
        handler: function(request, reply){
            reply.view('404', {
                title: 'Total Bummer 404 Page'
            }).code(404);
        },
        app: {
            name: '404'
        }
    },
	showProjects : {
	    handler: function(request, reply){
		         pool.getConnection(function(err,connection){
				 //connection.query('select user_name from user_info where email_id=? and user_pwd=?',[email,password],function(err,rows){
			        connection.query('select id,project_title,project_start_date,project_end_date,project_status from project_info',null,function(err,result){
				    connection.release()
			        console.log('Result:'+JSON.stringify(result))			
					reply.view('projects',{projects:result})
			    })
			})
            
        }
	},
	addProjects : {
	    handler: function(request, reply){
		    var prj_title=request.payload.prj_title
			var start_date=request.payload.start_date
			var end_date=request.payload.end_date
			
			if( request.payload.prj_title.trim().length==0 ||
				request.payload.start_date.trim().length==0 ||
				request.payload.end_date.trim().length==0 
			  ){
				     return reply.view('project_error',{msg:'Please enter valid values'});
			}
			var projectInfo={}
			projectInfo.project_title=prj_title
			projectInfo.project_start_date=start_date
			projectInfo.project_end_date=end_date
			
			pool.getConnection(function(err,connection){
			connection.query('insert into project_info set ?',projectInfo,function(err,result){
				   connection.release()
			       console.log('Result:'+JSON.stringify(result))			
			    })
			})
            reply.view('projects')
        }
	},
	files: {
	     handler: function(request, reply){
		 			var xfiles= listFiles()
					var pageTitle='Welcome '
					reply.view('files', {
						title: pageTitle,
						files: xfiles
					}).code(200);
		 
		 }
	},
    signin: {
        handler: function(request, reply){
		    var email=request.payload.email
			var password=request.payload.pwd
			
			if( request.payload.email.trim().length==0 ||
				request.payload.pwd.trim().length==0 
			  ){
				     return reply.view('signin_error',{msg:'Please enter valid values'});
			}
			
			var page,pageTitle,xfiles,userName
			var signInInfo={email_id:email,user_pwd:password}
			console.log("SignInfo:"+JSON.stringify(signInInfo))
			var userName
			pool.getConnection(function(err,connection){
			
			  connection.query('select user_name from user_info where email_id=? and user_pwd=?',[email,password],function(err,rows){
			       connection.release()
			       console.log('Result:'+JSON.stringify(rows))			
				   userName=rows[0].user_name
				   
				   console.log("User Name:"+userName)
					if(userName!=null){
					   page='landing'
					   pageTitle='Welcome '+userName
					   xfiles= listFiles()
					}
					else{
					   page='home'
					   pageTitle='Welcome to xNGO'
					   xfiles= []
					}
					
					reply.view(page, {
						title: pageTitle,
						files: xfiles
					}).code(200);
			
			  })
			
            });
			
        }
    },
	signup: {
	   handler: function(request,reply){
	            reply.view('signup')			
	   }
	},
	doSignup: {
	   handler: function(request,reply){
	            
				if(request.payload.username.trim().length==0 ||
				request.payload.email.trim().length==0 ||
				request.payload.pwd.trim().length==0 ||
				request.payload.confirm_pwd.trim().length==0 
				   ){
				     return reply.view('signup_error',{msg:'Please enter valid values'});
				}
				
				var userInfo={}
				userInfo.user_name=request.payload.username
				userInfo.email_id=request.payload.email			
			    userInfo.user_pwd=request.payload.pwd			
				
				if(!(request.payload.email.indexOf('.')>0 && request.payload.email.indexOf('@')>0 
				   && request.payload.email.indexOf('.') >request.payload.email.indexOf('@'))){
				   return reply.view('signup_error',{msg:'Invalid Email entered'});
				}
				
				if(request.payload.confirm_pwd!=request.payload.pwd){
				   return reply.view('signup_error',{msg:'Password mismatch'});
				}
				
				pool.getConnection(function(err,connection){
			            connection.query('insert into user_info set ?',userInfo,function(err,result){
			            connection.release()
			            console.log('Result:'+JSON.stringify(result))			
			         })
			
                });
	            reply.view('signup_success')			
	   }
	},
	upload: {
	    payload:{
		    output:'stream',
			parse:true,
			maxBytes:10485760,
			allow: 'multipart/form-data'		      
		},
        handler: function(request, reply){
		    var data = request.payload;
			if(data.upload){
			  var fileName=data.upload.hapi.filename
			  var filepath = appDir + "/uploads/" + fileName;
              var file = fs.createWriteStream(filepath);
			   file.on('error', function (err) { 
                    console.error(err) 
                });
				
			   data.upload.pipe(file);
               data.upload.on('end', function (err) {
			          reply.view('landing', 
					             {
                                   files: listFiles()
                                  })
			
			
                })

			}
			else 
			{ 
			   reply({"file":"corrupt file received"});
			}
        },
        app: {
            name: '404'
        }
    },
	download: {
	    
        handler: function(request, reply){
		 var filepath = appDir + "/uploads/" + request.params.file;   
         console.log("File_Name:"+encodeURIComponent(request.params.file))
		 console.log("File_Path:"+filepath)
		 console.log("3xx:"+request.params.file)
		 reply.file(filepath);	
			
			
        }
    }
}
