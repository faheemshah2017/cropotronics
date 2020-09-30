$(document).ready(function(){
    $.ajax({
        url:'pin/find',
        type:'get',
        datatype:'json',
		cache: false,
		processData: false,
		contentType: 'application/json',
        success:function(data){
          if(!data.length){
            $('#graphs_view').html('<div class="col-md-12 text-center mt-5"><h1>You do not have any pinned graphs</h1></div><div class="col-md-12 text-center mt-5"><h1 class="mt-5">Aquaponics Management System</h1></div><div class="col-md-12 text-center"><h1>(AMS)</h1></div>');
            setTimeout(function(){
              window.location.href = "/kpis";
            },3000);
          }
            data.forEach(graph => {
                graph.div_html = graph.div_html.replace("'"+graph.div_id+"'","'"+graph._id+"'");
                graph.div_html = graph.div_html.replace("la la-thumb-tack","la la-close");
                
                $('#graphs_view').append(`<div class="`+graph.div_size+`" id="`+graph._id+`"></div>`);
                $('#'+graph._id).html(graph.div_html);
            });
        }
    })
    
});


function pin(_id,size){
    data = {
      _id: _id
    }
    $.ajax({
      type:'DELETE',
      url: "/pin/delete",
      data:data,
      dataType:'json',
      success:function(data2){
        location.reload();
      }
    })
  }