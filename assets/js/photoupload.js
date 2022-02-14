/////////////////////////////////
// IMAGE UPLOAD
function activate_cropie(bindimg="")
{
  ////////////////////
  ////////////////////
  $('.canvaspp').croppie({
  enforceBoundary: true,
  enableExif: false,
  viewport: {
      width: 200,
      height: 200,
      type: 'square'
  },
  boundary: {
      width: 210,
      height: 210
  },
  url: bindimg
  });
  ////////////////////
}
function deactivate_cropie()
{
  ////////////////////
  $('.canvaspp').croppie('destroy');
  ////////////////////
}
function handleFile(e) {

  deactivate_cropie();
        ///////////////////////////////////////

        var reader = new FileReader();
        var img = new Image();
        reader.onload = function ( event ) {
            img.onload = function () {
                var canvas = document.createElement( 'canvas' );
                var ctx = canvas.getContext( "2d" );
                var width = img.width;
                var height = img.height;
                var MAX_WIDTH = 1000;
                var MAX_HEIGHT = 1000;

                // Resize maintaining aspect ratio
                if ( width > height ) {
                    if ( width > MAX_WIDTH ) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if ( height > MAX_HEIGHT ) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;

                // Copy the image to the canvas and resize it.
                ctx.drawImage( img, 0, 0, width, height );

                // Toss the new down-scaled image over to Croppie
                $output.croppie( 'bind', {
                        url: canvas.toDataURL( 'image/png' )
                    } )
                    .then(
                        function ( value ) {
                            $output.croppie( 'setZoom', 0 );
                        },
                        function ( reason ) {
                            console.error( 'Image binding failed. Reason: ', reason );
                        }
                    );
            }
            img.src = event.target.result;

          // Uploaded File used to alert here
          //  alert(event.target.result);
            var imgdata = event.target.result;
          //  $('.canvaspp').attr('src',event.target.result);
            activate_cropie(event.target.result);
            $('.canvaspp').croppie('bind',imgdata);
            $('.uploadpp-result').show();
        }

        ///////////////////////////////////////
        reader.readAsDataURL(e.target.files[0]);
}
function readURL2(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                deactivate_cropie();
                $('.canvaspp').attr('src',e.target.result);
                activate_cropie();
                $('.uploadpp-result').show();
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

$(document).ready(function() {
// AVATAR UPLOAD // pic
$('.canvaspp, .uploadpp').click(function(){
  $("#uploadpp").click();
});
////////////////////

});

$("#uploadpp").change(function(e){
    //readURL2(this);
    handleFile(e);
});
$('.uploadpp-result').on('click', function (ev) {
  $('.mdi-loading').show(200);
        $('.canvaspp').croppie('result', {
            type: 'canvas',
            size: 'original',
            format: 'jpg'
        }).then(function (resp) {
            //$('#imagebase64').val(resp);
            updatepp(resp);
            $('.mdi-loading').hide(200);
        });
    });

function updatepp(imgdata)
{
  $.post('PROCESSOR/uploadpp',{ 'imagebase64':imgdata }, function(data, status){
      //alert("Action: " + action + "\nStatus: " + status);
        $('.result').html(data);
      if(status==='success')
      {
        var tag = 'Successfully';

         if(data.indexOf(tag) != -1){
              Materialize.toast(data, 5000,'green');
              //$('.uploadpp-result').hide();
          }
          else
          {
              Materialize.toast(data, 5000,'red');
              $('.mdi-loading').hide();
              $('.uploadpp-result').show();
          }
      }
      else
      {
          $('.ppresult').html("Kindly check your internet connection.");
      }
  });
}
/////////////////////////////////
