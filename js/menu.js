/*$(function() {
  
  // elementos de la lista
  var menues = $(".nav li"); 

  // manejador de click sobre todos los elementos
  menues.click(function() {
     // eliminamos active de todos los elementos
     menues.removeClass("active");
     // activamos el elemento clicado.
     $(this).addClass("active");
  });

});*/
$( function() {
    $( "#datepicker" ).datepicker();
  } );