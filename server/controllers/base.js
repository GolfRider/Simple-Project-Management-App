var http = require('http');
var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var mysql=require('mysql')
var Q = require("q");


var pool=mysql.createPool({
connectionLimit:10,
database:'app_db',
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
	taskDetails : {
	    handler: function(request, reply){
		         var task_id=request.params.id
		         console.log("File_Name:"+encodeURIComponent(task_id))
				 var viewInfo={}
				 //var data={}
				 
				  function doQuery1(){
						var defered = Q.defer();
						console.log("test-12")
						pool.getConnection(function(err,connection){
								   connection.query('select task_title, task_start_date, task_end_date,task_owner,task_status from task_info where id=?',[task_id],function(err,result){
									  connection.release()
									  console.log('Result:'+JSON.stringify(result))			
									  //reply.view('task_details',{tasks:result,task_id:task_id})
									  //data.task_id=task_id
									  //data.task=result
									  defered.resolve(result)
							 }) })
						
						return defered.promise;
					}
					
					function doQuery2(){
						var defered = Q.defer();
						pool.getConnection(function(err,connection){
							   connection.query('select user_name,task_comments from task_details where task_id=?',[task_id],function(err,result){
							   connection.release()
							   console.log('Result:'+JSON.stringify(result))			
							   //reply.view('task_details',{tasks:result,task_id:task_id})
							   //data.comments=result
							   defered.resolve(result)
							 })})
								
						return defered.promise;
					}
					
					Q.all([doQuery1(),doQuery2()]).then(function(results){
				    console.log("FINAL:"+JSON.stringify(results))
				    reply.view('task_details',{task:results[0][0],comments:results[1],
					                          task_id:task_id,userName:request.state.userName,
											  menu_prj:"active" 
											  })
				    })     
            
        }
	},
	addComment : {
	   handler: function(request, reply){
		         var task_id=request.payload.task_id
				 var comment=request.payload.task_comment
		         console.log("File_Name:"+encodeURIComponent(task_id))
				 var dbData={}
				 dbData.task_id=task_id
				 dbData.task_comments=comment
				 dbData.user_name=request.state.userName
		         pool.getConnection(function(err,connection){
			       connection.query('insert into task_details set ?',dbData,function(err,result){
				   connection.release()
			       console.log('Result:'+JSON.stringify(result))			
				   reply.redirect('/task/'+request.payload.task_id)            
			    })
			})
            
        }
	},
	showTasks : {
	    handler: function(request, reply){
		         var project_id=request.params.id
		         console.log("File_Name:"+encodeURIComponent(project_id))
				 
				 function doQuery1(){
						var defered = Q.defer();
						pool.getConnection(function(err,connection){
							  connection.query('select id,task_title,task_start_date,task_end_date,task_owner,task_status from task_info where project_id=?',[project_id],function(err,result){
				             connection.release()
			                 console.log('Result:'+JSON.stringify(result))			
							 defered.resolve(result)
					         //reply.view('tasks',{tasks:result,project_id:project_id})
			                 })
				
				
							 })
								
						return defered.promise;
					}


				 function doQuery2(){
						var defered = Q.defer();
						pool.getConnection(function(err,connection){
							   connection.query('select user_name from user_info',null,function(err,result){
							   connection.release()
							   console.log('Result:'+JSON.stringify(result))										   
							   defered.resolve(result)
							 })})
								
						return defered.promise;
					}
				 
				 
			
			Q.all([doQuery1(),doQuery2()]).then(function(results){
				    console.log("FINAL:"+JSON.stringify(results))
				    //reply.view('task_details',{task:results[0][0],comments:results[1]})
					reply.view('tasks',{tasks:results[0],project_id:project_id,users:results[1],userName:request.state.userName,menu_prj:"active"})
				    })     
            
        }
	},showProjects : {
	    handler: function(request, reply){
		         pool.getConnection(function(err,connection){
				 //connection.query('select user_name from user_info where email_id=? and user_pwd=?',[email,password],function(err,rows){
			        connection.query('select id,project_title,project_start_date,project_end_date,project_status from project_info',null,function(err,result){
				    connection.release()
			        console.log('Result:'+JSON.stringify(result))			
					reply.view('projects',{projects:result,userName:request.state.userName,menu_prj:"active"})
			    })
			})
            
        }
	},
	addTasks : {
	    handler: function(request, reply){
		    var task_title=request.payload.task_title
			var start_date=request.payload.start_date
			var end_date=request.payload.end_date
			var owner=request.payload.owner
			
			if( request.payload.task_title.trim().length==0 ||
				request.payload.start_date.trim().length==0 ||
				request.payload.end_date.trim().length==0 ||
				request.payload.owner==null || request.payload.owner.trim().length==0 
			  ){
				     return reply.view('task_error',{msg:'Please enter valid values'});
			}
			var taskInfo={}
			taskInfo.task_title=task_title
			taskInfo.task_start_date=start_date
			taskInfo.task_end_date=end_date
			taskInfo.task_owner=owner
			taskInfo.project_id=request.payload.project_id
			console.log("TaskInfo:"+JSON.stringify(taskInfo))
			pool.getConnection(function(err,connection){
			connection.query('insert into task_info set ?',taskInfo,function(err,result){
				   connection.release()
			       console.log('Result:'+JSON.stringify(result))			
				   reply.redirect('/project/s/'+request.payload.project_id)
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
				   reply.redirect('/projects')
			    })
			})
            
			
        }
	},
	files: {
	     handler: function(request, reply){
		 			var xfiles= listFiles()
					var pageTitle='Welcome '
					reply.view('files', {
						title: pageTitle,
						files: xfiles,
						userName:request.state.userName,
						menu_files:"active"
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
					   reply.redirect('/projects').state('userName',userName)
					}
					else{
					   reply.redirect('/')
					}
					
					
			
			  })
			
            });
			
        }
    },
	signout: {
	   handler: function(request,reply){
	            reply.redirect('/').state('userName',null)
				}
	},
	signup: {
	   handler: function(request,reply){
	            reply.view('signup')			
	   }
	}, 
	signupSuccess: {
	   handler: function(request,reply){
	            reply.view('signup_success')			
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
				////////////////
				
				 function doQuery1(){
						var defered = Q.defer();
						pool.getConnection(function(err,connection){
							   connection.query('select count(*) as user_count from user_info',null,function(err,result){
							   connection.release()
							   console.log('Result:'+JSON.stringify(result))										   
							   defered.resolve(result)
							 })})
								
						return defered.promise;
					}
				 
				 
			
			      Q.all([doQuery1()]).then(function(results){
				    if(results[0][0].user_count>30){
					return reply.view('signup_error',{msg:'Sorry, user registration exceeded, please contact site admin.'});
					}
				    
				    })
				
				///////////////
				pool.getConnection(function(err,connection){
			            connection.query('insert into user_info set ?',userInfo,function(err,result){
			            connection.release()
			            console.log('Result:'+JSON.stringify(result))			
			         })
			
                });
				
				
	            reply.redirect('/signup_success')			
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
			          reply.redirect('/files')						
			
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
