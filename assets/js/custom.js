/* Materialize  Basic Initialization */
$(document).ready(function(){
    $(this).scrollTop(5);
    $('.scrollspy').scrollSpy();
    $(".button-collapse").sideNav();
    $('.parallax').parallax();
    $('select').material_select();
    $('ul.tabs').tabs();
    $('.modal').modal();
    $(".dropdown-button").dropdown({
        hover: true,
        belowOrigin: true,
        constrainWidth: false
    });
    $('.tooltipped').tooltip({delay: 60});

    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 5, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Done',
      closeOnSelect: true // Close upon selecting a date,
    });


    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
      autoplay: true
    });
    setInterval(function(){
      $('.carousel').carousel('next');
    }, 10000);


// POSTFIX
    var inputFields = $(".input-field input");
    inputFields.focus(function() {
        var postfix = $( this ).siblings('.postfix');
        if(postfix)  postfix.addClass("active");
    });
    inputFields.blur( function() {
        var postfix = $( this ).siblings('.postfix');
        if(postfix)  postfix.removeClass("active");
    });
  //--

});

/* Your Custom JS Code */

function lickit(formid){
var url = $(formid).attr('action');
var formdata = $(formid).serialize();
$.post(url,formdata,function(data, status){
// Making
if(status==='success')
{
var laction = "PROCESSOR/mklick";
$.post(laction,{ 'mlick':data }, function(lick, status){
$('.result').html(lick);
  var tag = 'Success';
    if(lick.indexOf(tag) != -1){
        Materialize.toast(lick, 5000,'green');
    }
    else
    {
        Materialize.toast(lick, 5000,'red');
    }

});
}
else
{
  Materialize.toast('Check your internet connection', 5000,'blue');
}
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
    sysinternet.attr('data-tooltip','Connected');
    sysinternet.tooltip();
  }
  else {
    //alert('Internet disconnected');
    sysinternet.removeClass('mdi-wifi');
    sysinternet.addClass('mdi-wifi-off');
    sysinternet.attr('data-tooltip','disconnected');
    sysinternet.tooltip();
  }
}

function softwareipaddr()
{
  var sysapn = $('.sysapn');
  if(navigator.onLine)
  {
  action = "PROCESSOR/softwareipaddr";
  $.post(action,'', function(data, status){
    if(data.length<=25)
    {
     sysapn.attr('data-tooltip',data);
    }
    else {
      sysapn.attr('data-tooltip','Retriving');
    }
  });
  }
  else {
    sysapn.attr('data-tooltip','Unreachable');
  }
  sysapn.tooltip();
}

// TIMER
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('systemtime').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}


function populateData(action,embedto,adddatable="")
{
    var action = "PROCESSOR/"+action;
    var formdata = "{}";
    $.post(action,formdata, function(data, status){
        $(embedto).html(data);
      // $('.results').html(data);
      if(adddatable=='datatable')
      {
          $('table.ml-record').DataTable();
      }

    });
}

function OpenUpdateForm(action,showdiv,formid="")
{
    var action = "PROCESSOR/"+action;
    var formdata = "{}";
    $.post(action,formdata, function(data, status){
      //alert(typeof(data));
       var popudata = JSON.parse(data);
       //alert(typeof(popudata));
       setTimeout(loaddata(popudata,formid),1000);
       $(showdiv).show(500);
       if($('.stphoto').length > 0)
       {
       var photo = $('#modupdatestudent [name=photo]').val();
       $('.stphoto').attr('src',photo);
      }
    });
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

$(document).ready(function(){
  $('.preloader').hide(500);
  startTime();

// APP OFF
if((window.fullScreen) ||
   (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
     $('#systemoff i.mdi').removeClass('mdi-fullscreen');
     $('#systemoff i.mdi').addClass('mdi-fullscreen-exit');
} else {
  $('#systemoff i.mdi').removeClass('mdi-fullscreen-exit');
  $('#systemoff i.mdi').addClass('mdi-fullscreen');
}
$('#systemoff').click(function(){

});
$('#systemoff').hide();


// Mod_a
$('.moda').click(function(){
  var modaref = $(this).attr('ahref');
  $("[modaref="+modaref+"]").toggle(500);
})

// List
  $(document).on('click', '.ml_edit', function() {
    var inputid = $(this).attr('input-id');
    $("#ml_e"+inputid).removeAttr('disabled');
    $("#ml_e"+inputid).focus();
    $(this).removeClass('mdi-pencil');
    $(this).addClass('mdi-send');
    $(this).removeClass('ml_edit');
    $(this).addClass('ml_update');
  });

  $(document).on('click', '.ml_update', function() {
    var inputid = $(this).attr('input-id');
// Updating...

var uaction = "PROCESSOR/modaddls/update";
var inval = $("#ml_e"+inputid).val();
var formdata = { 'id':inputid,'value': inval };
$.post(uaction,formdata, function(data, status){
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
//
    $("#ml_e"+inputid).attr('disabled','');
    //$("#ml_e"+inputid).focus();
    $(this).removeClass('mdi-send');
    $(this).addClass('mdi-pencil');
    $(this).removeClass('ml_update');
    $(this).addClass('ml_edit');
  });

// modls starter
populateData("modaddls/read?value=class&returntype=option&returnvalue=value","select[name=class]");
populateData("modaddls/read?value=subjects&returntype=option&returnvalue=value","select[name=subject]");
populateData('modaddls/read?pid=0&returntype=li','.ml-main');
populateData('modaddls/read?pid=0&returntype=option&returnvalue=id',"select[name=pid]");
populateData('modaddstudents/read?all=all&returntype=td',".ml-record.studentlist tbody",'datatable');
populateData('modaddquestions/read?all=all&returntype=td',".ml-record.questionlist tbody",'datatable');
populateData('modaddexams/read?all=all&returntype=td',".ml-record.examslist tbody",'datatable');

//sidebar
$('.sidebar .item i').click(function(){
  var link = $(this).attr('ahref');
  window.location.href="HOME/"+link;
})


  // Runs every 3sec
  setInterval(function(){
    CheckInternet();
    softwareipaddr();
  },3000);
});
//
