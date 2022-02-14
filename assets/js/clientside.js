var casa="10b71c570dd0a7dd032685cf690e3cc5";
//ip:port/api/casa/request/option
 function getCSRF()
 {
   var action = "PROCESSOR/getCSRF?p=ZjFkZDU2ZjkwM2FjMjM0NTQxZGU1Mzk3M2Q3ZjhjOTE=";
   var formdata = "{}";
   $.post(action,formdata, function(data, status){
     //alert(data);
     var csrf = data;
      return csrf;
   });
 }

 function getFormattedPartTime(partTime){
      if (partTime<10)
         return "0"+partTime;
      return partTime;
  }

 function slogout(redirect="Y")
 {
   localStorage.removeItem('studentdata');
   localStorage.removeItem('exam');
   localStorage.removeItem('questions');
   localStorage.removeItem('sid');
   var sd = JSON.parse(localStorage.getItem('studentdata'));
   if(sd)
   {
      Materialize.toast("Logout Failed, Try Again", 4000,'red');
   }
   else {
      (redirect=='Y')? window.location.href="login.html" : "";
   }

 }

function getexamlist()
{
  var api = localStorage.getItem('api');
  var studentdata = JSON.parse(localStorage.getItem('studentdata'));
  var sid = studentdata.id;
  if(sid && api)
  {
    // Lets get exam list
    var formdata = { 'sid':sid };
    $.post(api+'getexam',formdata,function(data,status){
      console.log(data);
        var data = JSON.parse(data);
        var tag  = 'Successful';
        if(data.message.indexOf(tag) != -1)
        {
          var exams = data.data;
            if(exams.length>0)
            {
              var extitle = exams.length+" Exams Available";
              $('.examtitle').html(extitle);
              // make seperate exams section
              $(exams).each(function(index,item){

                    var examsingle = "<li><div class='collapsible-header exambtn indigo darken-4' >"+ item.examname +"</div><div class='collapsible-body white'><div class='row' ><div class='col s6' ><h5>"+ item.examname +"</h5><div><ul><li>Subject: <strong>"+ item.subject +"</strong></li></li><li>Marks: <strong>"+ item.totalmarks +"</strong></li><li>Pass Mark: <strong>"+ item.passmark +"</strong></li><li>Total number of Questions: <strong>"+ item.totalquestions +"</strong></li><li>Total time: <strong>"+ item.totaltime +"</strong></li><li>Date of Exam: <strong>"+ item.exam_date +"</strong></li> </ul> </div></div><div class='col s6'><span class='btn startexam green darken-3 waves-effect waves-light right' onclick='startexam(this)' sid='"+sid+"' eid='"+ item.id +"' >Start</span></div></div></div></li>";

                    $('#examlist').append(examsingle);
                     $('.collapsible').collapsible('open', 0);
              });
            }
        }
        else
        {
            Materialize.toast(data.message,5000,'red');
        }
    }).fail(function(){
      Materialize.toast("Server not reachable", 5000,'red');
      msgcapn();
    })
  }
  else {
    Materialize.toast("Student not logged-in", 4000,'red');
  }
}

function startexam(field)
{
    var eid = $(field).attr('eid');
    var sid = $(field).attr('sid');
    if(eid && sid)
    {
      var api = localStorage.getItem('api');
        // getting selected Exams
      var fdata = { 'eid':eid, 'sid':sid };
      $.post(api+"getselectedexam",fdata,function(datae,status){
           var datae = JSON.parse(datae);
           //console.log(datae);
           var tag = 'Successful';
        var dm = datae.message;
            if(dm.indexOf(tag) != -1)
            {
               var sexam = datae.data;
               localStorage.setItem('exam',JSON.stringify(sexam));
               var cex = JSON.parse("["+localStorage.getItem('exam')+"]");
                 if(cex.length > 0)
                 {
                       // getting questions
                       var formdata = { 'eid':eid,'sid':sid };
                       $.post(api+"getquestions",formdata,function(data,status){
                      //   alert(data);
                      //   console.log(data);
                            var data = JSON.parse(data);
                            var tag = 'Successful';
                         var dm = data.message;
                             if(dm.indexOf(tag) != -1)
                             {
                                var questions = data.data;
                                localStorage.setItem('questions',JSON.stringify(questions));
                                var cq = JSON.parse(localStorage.getItem('questions'));
                                  if(cq.length>0)
                                  {
                                 setTimeout(function(){
                                    window.location.href = "prepare.html";
                                 },1200);
                                 }
                                 else
                                 {
                                    Materialize.toast("No Questions Available", 5000,'red');
                                 }
                             }
                             else
                             {
                                 Materialize.toast(data.message, 5000,'red');
                             }
                           });
                 }
                 else {
                      Materialize.toast("No Exam Found", 4000,'red');
                 }
               }
               else {
                  Materialize.toast(datae.message, 4000,'red');
               }

      }).fail(function(){
           Materialize.toast("Server not ready, Configure APN if needed", 4000,'red');
           msgcapn();
      });



    }
    else
    {
      Materialize.toast("Click Properly on Start button", 4000,'red');
    }
}

function saveanswer(field)
{
  var anstime = $('#timer').html();
  var slno = $(field).attr('slno');
  var nextslno = parseInt(slno) + 1;
  var formdata = $(field).serialize();
  formdata = formdata+"&lefttime="+anstime;
  //console.log(formdata);
  var api = localStorage.getItem("api");
  if(formdata && api)
  {
      $.post(api+"saveanswer",formdata,function(data,status){
        console.log(data);
      var data = JSON.parse(data);
      var tag = "Successful";
      //console.log(data);
      var dm = data.message;
          if(dm.indexOf(tag) != -1)
          {
            var curselectr = '.tab[slno='+slno+'] a';
            var selectr = '.tab[slno='+nextslno+'] a';
              $(curselectr).addClass('attended');
              Materialize.toast("Answer Saved", 1000,'green');
              console.log(data);
              // Check for attended finished
            //  alert($('#questionnumb a').length +'==='+ $('#questionnumb a.attended').length);
                if($('#questionnumb a').length === $('#questionnumb a.attended').length)
                {
                   $('.submitexam').show(100);
                }
              if($(selectr).length > 0)
              {
                setTimeout(function(){
                  $(selectr).click();
                },1000);

              }
          }
          else {
              Materialize.toast("Unable to Save Answer", 4000,'red');
              console.log(data);
          }

      }).fail(function(){
      //  alert('Server not reachable');
        Materialize.toast("Server not reachable", 5000,'red');
        msgcapn();
      })

  }
  else {
    Materialize.toast("Please select answer", 4000,'red');
  }
}

function radioSelected(data,field)
{
  value = $(field).attr('value');
  if(data == value)
  {
  //  alert(value + " is checked");
    return "checked";
  }
}

function preparequestions(){
    var questions = JSON.parse(localStorage.getItem('questions'));
    var sid = JSON.parse(localStorage.getItem('sid'));
    var exam = JSON.parse(localStorage.getItem('exam'));
    var eid = exam.id;
    if(questions.length>0 && sid)
    {
      var i = 0;
        $(questions).each(function(index,item){
        i++;
        // Prepare Questiot
        var attended = "";
        var answersel = "";
        if(item.answer)
        {
          attended = "class='attended' ";
          answersel = item.answer;
        }
          var quest = "<form id='qform"+i+"' slno='"+i+"'  ><div class='col s12' id='q"+i+"' questionid='"+item.id+"' > <div class='col s12 m12'> <h6>"+i+": "+ item.question +"</h6> </div> <div class='col s12 m12'> ";
          var quest = quest+"<input type='hidden' name='qid' value='"+item.qid+"' /><input type='hidden' name='sid' value='"+ sid +"' /><input type='hidden' name='eid' value='"+ eid +"' />";
          var quest = quest+"<div class='col m6 s6'> <p > <input name='answer' onclick='saveanswer(\"#qform"+i+"\");' type='radio' value='opt-a' id='ans"+i+"a'/> <label for='ans"+i+"a'>"+ item['opt-a'] +"</label> </p> </div>";
          var quest = quest+"<div class='col m6 s6'> <p > <input name='answer' onclick='saveanswer(\"#qform"+i+"\");' type='radio' value='opt-b' id='ans"+i+"b'/> <label for='ans"+i+"b'>"+ item['opt-b'] +"</label> </p> </div>";
          var quest = quest+"<div class='col m6 s6'> <p > <input name='answer' onclick='saveanswer(\"#qform"+i+"\");' type='radio' value='opt-c' id='ans"+i+"c'/> <label for='ans"+i+"c'>"+ item['opt-c'] +"</label> </p> </div>";
          var quest = quest+"<div class='col m6 s6'> <p > <input name='answer' onclick='saveanswer(\"#qform"+i+"\");' type='radio' value='opt-d' id='ans"+i+"d'/> <label for='ans"+i+"d'>"+ item['opt-d'] +"</label> </p> </div>";
          var quest = quest+"</div> </div></form>";

          var trigger = '<li slno="'+i+'" class="tab boxes grey lighten-3 waves-effect waves-light"><a href="#q'+i+'" '+ attended +' >'+ i +'</a></li>';

          /////////////////
          $('#questionlist').append(quest);
          $('#questionnumb').append(trigger);
          ///////////////////
        })
//////////////
var j=0;
$(questions).each(function(index,item){
j++;
// Prepare Questiot
if(item.answer)
{
  //alert(item.answer);
  var answersel = item.answer;
  var slnov = item.slno;
  $('form[slno='+ slnov +'] input[value='+ answersel +']').attr('checked','true');
}

///////////////////
})


    }
    else {
      Materialize.toast("No questions", 4000,'red');
    }
}

function preparetimer(){
    var exam = JSON.parse(localStorage.getItem('exam'));
    var totaltime = exam.totaltime;

////////////////////
// Check for left time
var questions = JSON.parse(localStorage.getItem('questions'));
$(questions).each(function(index,item){
  if(item.lefttime && item.lefttime < totaltime )
  {
    totaltime = item.lefttime;
  }
})
///////////////////
    // alert(totaltime);
    $("#timer").html(totaltime);
    setInterval(function(){
        var lefttime = parseInt($("#timer").html()) - parseInt(1);
        $("#timer").html(lefttime);
        if(parseInt(lefttime) === parseInt(0))
        {
            submitexam('Y');
        }

    },60000);
}


 function auth(field)
 {
   checkapnother();
    var apn = $("input[name=apn]").val();
    var port = $("input[name=port]").val();
    if(apn && port)
    {
        var casa="10b71c570dd0a7dd032685cf690e3cc5";
        var connectto = "http://"+apn+":"+port+"/API/"+casa+"/auth";
       // alert(connectto);
        $.post(connectto,'{}', function(data, status){
          var data = JSON.parse(data);
          var tag = 'Authorised';
         var dm = data.message;
             if(dm.indexOf(tag) != -1)
             {
               branding(data);

                 Materialize.toast(dm, 5000,'green');
                 localStorage.setItem("apn",apn);
                 localStorage.setItem("port",port);
                 localStorage.setItem("api","http://"+apn+":"+port+"/API/"+casa+"/");
                 $(".message p").html("Connected to "+localStorage.getItem("apn"));
                 setTimeout(function(){
                     window.location.href = "login.html";
                 },1200);
             }
             else
             {
                 Materialize.toast("Access denied", 5000,'red');


             }
    }).fail(function(){
        Materialize.toast("Server not reachable", 5000,'red');
      });

    }
    else
    {
        Materialize.toast("Please fill apn and port", 5000,'red');
    }
 }


 function slogin(field){

        var action = $(field).attr('action');
        var formdata = $(field).serialize();
        var api = localStorage.getItem("api");
    if(action && api)
    {
        $.post(api + action, formdata, function(data, status)
        {
        //  console.log(data);
            var dat  = JSON.parse(data);
            var tag  = 'Successful';
            if(dat.message.indexOf(tag) != -1)
            {
              var data = dat.data[0];
                localStorage.setItem("sid",data.id);
                localStorage.setItem("studentdata",JSON.stringify(data));
                var studentdata = JSON.parse(localStorage.getItem('studentdata'));
                $(".message p").html("Logged as <strong>"+ studentdata.name +"</strong>");
                Materialize.toast("Login Successfully",5000,'green');
                setTimeout(function(){
                window.location.href="selectexam.html";
                },1200);
            }
            else
            {
                Materialize.toast("Check Student ID and Password",5000,'red');
              //  $(".result").html(data);
                msgcapn();
            }
        }).fail(function(){
          Materialize.toast("Server not reachable", 5000,'red');
          msgcapn();
        })
    }
    else
    {
        Materialize.toast("Enter Student ID and Password",5000,'red');
    }
 }
 function sinfo(){
        var apn = localStorage.getItem('apn');
        var port = localStorage.getItem('port');
        var link = "http://"+apn+":"+port+"/";
        var studentdata = JSON.parse(localStorage.getItem('studentdata'));
        //console.log();
        if(studentdata.id)
        {

            var spic = $('.spic');
            var sname = $('.sname');
            var sroll = $('.sroll');
            var sclass =$('.sclass');

            if(spic.length > 0)
            {
                spic.attr('src',link+studentdata.photo);
            }
            if(sname.length > 0)
            {
                sname.html(studentdata.name);
            }
            if(sroll.length > 0)
            {
                sroll.html(studentdata.rollno);
            }
            if(sclass.length > 0)
            {
                sclass.html(studentdata.class);
            }

            $(".message p").html("Logged as <strong>"+ studentdata.name +"</strong>");
        }
        else
        {
            window.location.href="login.html";
        }
    }

 function msgcapn()
 {
    var msg = "To change server <a href='access.html' class='orange-text'>Change Server</a>";
    $(".message p").html(msg);
 }

  function sfSubmit(formid)
    {
      var action = "PROCESSOR/getCSRF?p=ZjFkZDU2ZjkwM2FjMjM0NTQxZGU1Mzk3M2Q3ZjhjOTE=";
      var formdata = "{}";
      $.post(action,formdata, function(data, status){
        var csrf = data;
        $(formid).ajaxSubmit({


          xhr: function() {
              var xhr = new window.XMLHttpRequest();

              xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                  var percentComplete = evt.loaded / evt.total;
                  percentComplete = parseInt(percentComplete * 100);
                  console.log(percentComplete);
                //  $(formid+'>.progress>.determinate').css('width', percentComplete+'%'); // For Inside Form
                  $('.progress>.determinate').css('width', percentComplete+'%'); // For Common Progress

                  if (percentComplete === 100) {
                    //  $(formid+'>.progress>.determinate').html("Upload Completed");   // For Inside Form
                      $('.progress>.determinate').html("Upload Completed"); // For Common Progress
                      setTimeout(function(){
                        $('.progress>.determinate').css('width', '0%'); // For Common Progress
                      },2000);
                  }

                }
              }, false);

              return xhr;
            },


          url: $(formid).attr('action')+"?csrf="+csrf,
      		//target: formid+'>.result',
          success: function(data, textStatus, jqXHR)
                   {
                     $('.result').html(data);
                       var tag = 'Success';
                         if(data.indexOf(tag) != -1){
                             Materialize.toast(data, 5000,'green');
                         }
                         else
                         {
                             Materialize.toast(data, 5000,'red');
                         }
                   }
      	});

      });
    }




// CheckInternet
function CheckInternet()
{
  var online = navigator.onLine;
  var sysinternet = $('.sysinternet');
  if(online)
  {
    //alert('Internet Connected');
    sysinternet.removeClass('mdi-wifi-off');
    sysinternet.addClass('mdi-wifi');
    sysinternet.removeClass('red-text');
    sysinternet.addClass('white-text');
    sysinternet.attr('data-tooltip','Connected');
    sysinternet.tooltip();
  }
  else {
    //alert('Internet disconnected');
    sysinternet.removeClass('mdi-wifi');
    sysinternet.addClass('mdi-wifi-off');
    sysinternet.removeClass('white-text');
    sysinternet.addClass('red-text');
    sysinternet.attr('data-tooltip','disconnected');
    sysinternet.tooltip();

  }
}

function checkapn()
{
    var apn = localStorage.getItem("apn");
    var api = localStorage.getItem("api");
    $.post(api+"/auth",function(data, status){
        var data = JSON.parse(data);
        var tag = 'Authorised';
             if(data.message.indexOf(tag) != -1)
             {
                 $(".message p").html("Connected to "+apn);
                 window.location.href = "login.html";
             }
             else
             {
                 Materialize.toast("Access denied", 5000,'red');
             }
    }).fail(function(){
        Materialize.toast("Server not reachable", 5000,'red');
        msgcapn();
      });
}

function branding(data)
{
  var ologo = $('.ologo');
  var oname = $('.oname');
  if(ologo.length > 0)
  {
    ologo.attr('src',data.logo);
  }
  if(oname.length > 0)
  {
    oname.html(data.organisation);
  }
}

function checkapnother()
{
    var apn = localStorage.getItem("apn");
    var api = localStorage.getItem("api");
    $.post(api+"/auth",function(data, status){
        var data = JSON.parse(data);
        var tag = 'Authorised';
             if(data.message.indexOf(tag) != -1)
             {
                 $(".message p").html("Connected to "+apn);
                 branding(data);
             }
             else
             {
                 Materialize.toast("Access denied", 5000,'red');
                 msgcapn();
             }
    }).fail(function(){
        Materialize.toast("Server not reachable", 5000,'red');
        msgcapn();
      });
}

function submitexam(force="N")
{
  // Check for attended finished
  var quesleft = parseInt($('#questionnumb a').length) - parseInt($('#questionnumb a.attended').length);
    if($('#questionnumb a').length === $('#questionnumb a.attended').length || force==='Y')
    {
      var api = localStorage.getItem("api");
      var sid = localStorage.getItem("sid");
      var exam = JSON.parse(localStorage.getItem("exam"));
      var eid = exam.id;
      var formdata = { 'eid':eid,'sid':sid }
      $.post(api+"/finishedexam",formdata,function(data, status){
        console.log(data);
          var data = JSON.parse(data);
          var tag = 'Successful';
               if(data.message.indexOf(tag) != -1)
               {
                 Materialize.toast(" Exam Submited Successfully", 5000,'green');
                 setTimeout(function(){
                     window.location.href="thankyou.html";
                 },2000);
               }
               else
               {
                   Materialize.toast("Access denied", 5000,'red');
                   msgcapn();
               }
      }).fail(function(){
          Materialize.toast("Server not reachable", 5000,'red');
          msgcapn();
        });

    }
    else {
      Materialize.toast(quesleft + " question left", 5000,'red');
    }
}


$(document).ready(function(){
  console.log(localStorage);
  $('.preloader').hide(500);
  checkapnother();
    // Runs every 3sec
  setInterval(function(){
    CheckInternet();
  },3000);
  });
