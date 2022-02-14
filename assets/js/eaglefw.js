
 $(".nav a").on("click", function(){
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");
 });


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

    function submit(formid){

       //alert(formid);
       $('.result').html('<p style="display:block; text-align:center;"><i class="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i><span class="sr-only">Process...</span> Processing</p>');
        var action = $(formid).attr('action');
        var formdata = $(formid).serialize();


        $.post(action,formdata, function(data, status){
            //alert("Data-IBA: " + action + "\nStatus: " + status);
            if(status==='success')
            {
                $('.result').html(data);
            }
            else
            {
                $('.result').html("Kindly check your internet connection.");
            }
        });
    };


    function fsubmit(formid){

       //alert(formid);
       $('.result').html('<p style="display:block; text-align:center;"><i class="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i><span class="sr-only">Process...</span> Processing</p>');
        var action = $(formid).attr('action');
        var formdata = $(formid).serialize();


        $.post(action,formdata, function(data, status){
            //alert("Action: " + action + "\nStatus: " + status);
            if(status==='success')
            {
                $('.result').html(data);
            }
            else
            {
                $('.result').html("Kindly check your internet connection.");
            }
        });
    };

function cSubmit(formid,csrf="",callback){

       //alert(formid);
       $('.result').html('<p style="display:block; text-align:center;"><i class="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></i><span class="sr-only">Process...</span> Processing</p>');
        var action = $(formid).attr('action');
        var action = action+"?csrf="+csrf;
        var formdata = $(formid).serialize();


        $.post(action,formdata, function(data, status){
             $('.result').html(data);
            // alert("Data: " + action + "\nStatus: " + status);
            if(status==='success')
            {
                $('.result').html(data);
              var tag = 'Success';

              // $('.result').html("");


                if(data.indexOf(tag) != -1){
                    Materialize.toast(data, 5000,'green');
                    $('.submitcol').hide();
//                    $('.goodmsg').show();
                }
                else
                {
                    Materialize.toast(data, 5000,'red');
                    $('.submitcol').show();
//                    $('.goodmsg').hide();
                }

            }
            else
            {
                $('.result').html("Kindly check your internet connection.");
            }

            callback();
        });
    };


    function sSubmit(formid,callback)
    {
      var action = "PROCESSOR/getCSRF?p=ZjFkZDU2ZjkwM2FjMjM0NTQxZGU1Mzk3M2Q3ZjhjOTE=";
      var formdata = "{}";
      $.post(action,formdata, function(data, status){
        //alert(data);
        var csrf = data;
        cSubmit(formid,csrf,function (){
          callback();
        });
      });
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

    function pressit(field,$data="")
    {
      var action = $(field).attr('ahref');
      action = "PROCESSOR/"+action;
      formdata = "{ "+data+" }"
      $.post(action,formdata, function(data, status){
         $('.result').html(data);
      });
    }

    function logout(field)
    {
      var action = $(field).attr('ahref');
      action = "PROCESSOR/"+action;
      $.post(action,'', function(data, status){
         $('.result').html(data);
        // alert('LOGOUT');
         window.location.href="LOGIN";
      });
    }

    function deleteit(field,id="")
    {
      var data =  'id='+id;
      var action = $(field).attr('ahref');
      action = "PROCESSOR/"+action;
      var formdata = data;
      $.post(action,formdata, function(data, status){
         $('.result').html(data);

           var tag = 'Success';
             if(data.indexOf(tag) != -1){
                 Materialize.toast(data, 5000,'green');
                 $('.row'+id).hide(200);
             }
             else
             {
                 Materialize.toast(data, 5000,'red');
             }
      });
    }

function loaddata(arraydata,formid="")
{
   //alert(typeof(arraydata));

// reset form values from json object
$.each(arraydata, function(name, val){
  //alert(name);
    var el = $(formid +' [name="'+name+'"]'),
    type = el.attr('type');

    switch(type){
        case 'checkbox':
            el.attr('checked', 'checked');
            break;
        case 'radio':
            el.filter(formid +'[value="'+val+'"]').attr('checked', 'checked');
            break;
        default:
        if($(el).length > 0)
        {
        //  alert(name +" = "+ typeof(val));
            el.val(val);
        }
    }

    //el.filter('[class="select2"]').select2("val", val);

    Materialize.updateTextFields();
});
}

function fillform(link,formdata="")
{
        $.post(link,formdata, function(arraydata, status){

            arraydata = $.trim(arraydata);
            arraydata= arraydata.replace(/\u0/,'');

            //data = JSON && JSON.parse(arraydata) || $.parseJSON(arraydata);
            $('#dataarray').val(arraydata);
            // alert("Data: " + link + "\n data:"+arraydata);
            // loaddata(JSON.parse(arraydata));

        });
}


    function getData(action,senddata='',embedtoid,processto){

       //alert(formid);
       $(processto).html('<p style="display:block; text-align:center;"><i class="mdi mdi-refresh mdi-spin" aria-hidden="true"></i><span class="sr-only">Process...</span> Processing</p>');


        $.post(action,senddata, function(data, status){
            //$(processto).html(data);
            //alert("Action: " + data + "\nStatus: " + status);
            if(status==='success')
            {
                data = data;

                $(processto).html(data);
                $(embedtoid).select2({ data: data });
                //$(processto).html('');
                Materialize.toast('Loaded', 2000,'teal');
            }
            else
            {
                $(processto).html("Kindly check your internet connection.");
            }
        });
    }

function getOS() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
var lock = 0;
var os = "";
      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent) && lock==0) {
        os = "Windows";
        lock = 1;
    }

    if (/android/i.test(userAgent)  && lock==0) {
        os = "Android";
        lock = 1;
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream && lock==0) {
        os = "iOS";
        lock = 1;
    }

    if(lock==0)
    {
    os = "unknown";
    lock = 1;
    }

     var urlos = "p/getOS/"+os;
    $.ajax({url: urlos});

}
