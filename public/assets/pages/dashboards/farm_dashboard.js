if(bk_user.role=="Super User (OEM)"){
	$.ajax({
		url: "/users/project/get_datatables_list",
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (projects) {
			projects.data.forEach(project=>{
				$('#projects').append($('<option>', {value:project.project, text:project.project}));
            });
            object = {
                value:projects.data[0].project
            }
			initialize_project(object);
		}
	});
}
else{
	initialize_project('self_project');
}

function initialize_project(e){
    if(bk_user.role=="Super User (OEM)"){
        plant_url = "/"+e.value+"/plant_management/get_datatables_list";
        fish_url = "/"+e.value+"/fish_management/get_datatables_list";
        farm_design_url = "/"+e.value+"/farm_maker/get_datatables_list";
    }
    else{
        plant_url = "/plant_management/get_datatables_list";
        fish_url = "/fish_management/get_datatables_list";
        farm_design_url = "/farm_maker/get_datatables_list";
    }
    $.ajax({
        url: plant_url,
        cache: false,
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        success: function (plants) {
            create_plants_table(plants.data);
        }
    });
    $.ajax({
        url: fish_url,
        cache: false,
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        success: function (fish) {
            create_fish_table(fish.data);
        }
    });
    $.ajax({
        url: farm_design_url,
        cache: false,
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        success: function (result) {
            result.data.forEach(farm=>{
                $('#farm_designs').append($('<option>', {value:farm._id, text:farm.title}));
            });
            if(result.data.length){
                get_design(result.data[0]._id);
            }
        }
    });
}

function change_project(e){
    if(bk_user.role=="Super User (OEM)"){
        plant_url = "/"+e.value+"/plant_management/get_datatables_list";
        fish_url = "/"+e.value+"/fish_management/get_datatables_list";
        farm_design_url = "/"+e.value+"/farm_maker/get_datatables_list";
    }
    else{
        plant_url = "/plant_management/get_datatables_list";
        fish_url = "/fish_management/get_datatables_list";
        farm_design_url = "/farm_maker/get_datatables_list";
    }
    $.ajax({
        url: plant_url,
        cache: false,
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        success: function (plants) {
            update_plants_table(plants.data);
        }
    });
    $.ajax({
        url: fish_url,
        cache: false,
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        success: function (fish) {
            update_fish_table(fish.data);
        }
    });
    $.ajax({
        url: farm_design_url,
        cache: false,
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        success: function (result) {
            $('#farm_designs').html('');
            result.data.forEach(farm=>{
                $('#farm_designs').append($('<option>', {value:farm._id, text:farm.title}));
            });
            if(result.data.length){
                get_design(result.data[0]._id);
            }
            else{
                stage = new Konva.Stage({
                    container: 'container',
                    width: width,
                    height: height
                });
            
                layer = new Konva.Layer();
                stage.add(layer);
            }
        }
    });
}

function update_plants_table(data){
    $('#plants_table').dataTable().fnClearTable();
    if(data.length){
        $('#plants_table').dataTable().fnAddData(data);
    }
}
function create_plants_table(data){
    $('#plants_table').DataTable({
        data: data,
        ordering: false,
        // "fnDrawCallback": function (oSettings) {
        //     $(oSettings.nTHead).hide();
        // },
        pageLength: 5,
        responsive: true,
        sDom: 'tp',
        columns: [
            { name: "Type", title: "Type", data: 'plant_type' },
            { name: "Quantity", title: "Quantity", data: 'count' },
            { name: "Growing Area", title: "Growing Area", data: 'growing_area' },
            { name: "Expected Harvest Date", title: "Expected Harvest Date", data: 'EHD' },
            { name: "Progress", title: "Progress", data: 'EHD' },
        ],
        columnDefs: [
            {
                targets: 0,
                "width": "25%"
            },
            {
                targets: 1,
                "width": "15%"
            },
            {
                targets: 2,
                "width": "15%"
            },
            {
                targets: 3,
                "width": "25%"
            },
            {
                targets: 4,
                "width": "25%",
                render: function (data, type, full, meta) {

                    var date1 = new Date(); 
                    var date2 = new Date(full.EHD);
                    var date3 = new Date(full.planted_at);
                    
                    var Difference_In_Time_from_harvest = date1.getTime() - date3.getTime(); 
                    var Difference_from_harvest = Difference_In_Time_from_harvest / (1000 * 3600 * 24);

                    var Difference_In_Time_from_planting = date2.getTime() - date3.getTime(); 
                    var Difference_from_planting = Difference_In_Time_from_planting / (1000 * 3600 * 24);

                    progress = (Difference_from_harvest/Difference_from_planting)*100;

                    var valx = progress

                    classX = "m--bg-success";

                    if (valx < 50) {
                        classX = "m--bg-warning";
                    }

                    if (valx < 20) {
                        classX = "m--bg-danger";
                    }

                    output = `
                    <div class="row m-row--no-padding align-items-center">
                        <div class="col">
                            <div class="progress m-progress--sm">
                                <div class="progress-bar ` + classX + `" role="progressbar" style="width: ` + progress + `%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        </div>
                `;

                    return output;
                }
            }
        ]
    });
}

function update_fish_table(data){
    $('#fishes_table').dataTable().fnClearTable();
    if(data.length){
        $('#fishes_table').dataTable().fnAddData(data);
    }
}
function create_fish_table(data){
    $('#fishes_table').DataTable({
        data: data,
        ordering: false,
        // "fnDrawCallback": function (oSettings) {
        //     $(oSettings.nTHead).hide();
        // },
        pageLength: 5,
        responsive: true,
        sDom: 'tp',
        columns: [
            { name: "Type", title: "Type", data: 'fish_type' },
            { name: "Biomass", title: "Biomass", data: 'biomass' },
            { name: "Aquarium", title: "Aquarium", data: 'aquarium' },
            { name: "Expected Harvest Date", title: "Expected Harvest Date", data: 'EHD' },
            { name: "Progress", title: "Progress", data: 'EHD' },
        ],
        columnDefs: [
            {
                targets: 0,
                "width": "25%"
            },
            {
                targets: 1,
                "width": "15%"
            },
            {
                targets: 2,
                "width": "15%"
            },
            {
                targets: 3,
                "width": "25%"
            },
            {
                targets: 4,
                "width": "35%",
                render: function (data, type, full, meta) {

                    var date1 = new Date(); 
                    var date2 = new Date(full.EHD);
                    var date3 = new Date(full.added_at);
                    
                    var Difference_In_Time_from_harvest = date1.getTime() - date3.getTime(); 
                    var Difference_from_harvest = Difference_In_Time_from_harvest / (1000 * 3600 * 24);

                    var Difference_In_Time_from_planting = date2.getTime() - date3.getTime(); 
                    var Difference_from_planting = Difference_In_Time_from_planting / (1000 * 3600 * 24);

                    progress = (Difference_from_harvest/Difference_from_planting)*100;

                    var valx = progress;

                    classX = "m--bg-success";

                    if (valx < 50) {
                        classX = "m--bg-warning";
                    }

                    if (valx < 20) {
                        classX = "m--bg-danger";
                    }

                    output = `
                        <div class="row m-row--no-padding align-items-center">
                            <div class="col">
                                <div class="progress m-progress--sm">
                                    <div class="progress-bar ` + classX + `" role="progressbar" style="width: ` + progress + `%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            </div>
                    `;

                    return output;
                }
            }
        ]
    });
}


// Loading form
var width = window.innerWidth;
var height = window.innerHeight;

function change_farm(id){
    get_design(id.value);
}

function get_design(id){
    if(bk_user.role=="Super User (OEM)"){
        project = $('#projects').val();
        farm_design_details_url = "/"+project+"/farm_maker/details/"+id;
    }
    else{
        farm_design_details_url = "/farm_maker/details/"+id;
    }
    $.ajax({
        url: farm_design_details_url,
        cache: false,
        processData: false,
        contentType: 'application/json',
        type: 'GET',
        success: function (result) {
            if(result.jsonText == 'empty'){
                stage = new Konva.Stage({
                  container: 'container',
                  width: width,
                  height: height
                });
                layer = new Konva.Layer();
                stage.add(layer);
            }
            else{
                images_array = result.images_urls;
                i = 0;
                stage = Konva.Node.create(result.jsonText, 'container');
                layer = new Konva.Layer();
                stage.add(layer);
    
                stage.find('Circle').forEach((circle)=>{
                    circle.remove();
                });
                tooltip = new Konva.Label({
                    x: 170,
                    y: 75,
                    opacity: 0.75
                });
    
                tooltip.add(new Konva.Tag({
                    fill: 'black',
                    pointerDirection: 'down',
                    pointerWidth: 10,
                    pointerHeight: 10,
                    lineJoin: 'round',
                    shadowColor: 'black',
                    shadowBlur: 10,
                    shadowOffset: 10,
                    shadowOpacity: 0.5
                }));
                tooltip_text = new Konva.Text({
                    text: 'faheem',
                    fontFamily: 'Calibri',
                    fontSize: 18,
                    padding: 5,
                    fill: 'white'
                });
    
                tooltip.add(tooltip_text);
                
                stage.find('Group').forEach((group)=>{
                    group.setAttr('draggable', false);
                    group.on('click', function () {
                        var mousePos = stage.getPointerPosition();
                        tooltip.position({
                            x: mousePos.x,
                            y: mousePos.y
                        });
                        tooltip_text.text(group.attrs.tooltip);
                        layer.add(tooltip);
                        layer.draw();
                    });
                    group.on('mouseout', function () {
                        tooltip.remove();
                        layer.draw();
                    });
                });
                
                stage.find('Image').forEach((imageNode) => {
                    const src = imageNode.getAttr('src');
                    const image = new Image();
                    image.onload = () => {
                        imageNode.image(image);
                        imageNode.getLayer().batchDraw();
                    }
                    image.src = src;
                    i++;
                });
            }
            
        }
    });
}



$(function() {
// Build "dynamic" rulers by adding items
$(".ruler[data-items]").each(function() {
  var ruler = $(this).empty(),
	  len = Number(ruler.attr("data-items")) || 0,
	  item = $(document.createElement("li")),
	  i;
  for (i = 0; i < len; i++) {
	  ruler.append(item.clone().text(i + 1));
  }
});
});