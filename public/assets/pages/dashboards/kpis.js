nodes = [];
nodesObject = []

if(bk_user.role=="Super User (OEM)"){
	$.ajax({
		url: "/users/project/get_datatables_list",
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (projects) {
			//nodesObject = result.data;
			projects.data.forEach(project=>{
				//nodes[node.node_id]= node; 
				$('#projects').append($('<option>', {value:project.project, text:project.project}));
			});
			//get_node_data(result.data[0].node_id);
		}
	});
}
else{
	$.ajax({
		url: "/sensors/sensor_mesh/get_datatables_list",
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (result) {
			//console.log(result.data);
			nodesObject = result.data;
			result.data.forEach(node=>{
				nodes[node.node_id]= node; 
				$('#sensor_nodes').append($('<option>', {value:node.node_id, text:node.location}));
			});
			if(result.data.length){
				selected_node = result.data[0].node_id;
				get_node_data(result.data[0].node_id);
			}
			else{
				console.log('No Data Node Found');
			}
		}
	});
}


function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// sensor_code = {'DO':'Dissolve Oxygen','pH':'pH','AT':'Air Temperature','AH':'Air Humidtity','WT':'Water Temperature','WL':'Water Temperature','nitrates':'Nitrates','nitrites':'Nitrites','ammonia':'Ammonia'}
//sensor_units = {'DO':'(mg/ltr)','pH':'','AT':'(℃)','AH':'(%)','WT':'(℃)','nitrates':'(mg/ltr)','nitrites':'(mg/ltr)','ammonia':'(mg/ltr)'}
// lower_limit = {'DO':4,'pH':6.5,'AT':16,'AH':0,'WT':16,'WL':0,'nitrates':190,'nitrites':0,'ammonia':0}
// uper_limit = {'DO':12,'pH':8.5,'AT':30,'AH':100,'WT':30,'WL':100,'nitrates':400,'nitrites':1,'ammonia':1}

sensor_code = {}
uper_range = {}
lower_range = {}
sensor_units = {}

bk_data.forEach(item=>{
	sensor_code[item.key] = item.name;
	lower_range[item.key] = item.lower_range;
	uper_range[item.key] = item.uper_range;
	sensor_units[item.key] = item.unit;
});

function change_project(e){
	$('#main_container').html('');
	$.ajax({
		url: "/sensors/sensor_mesh/"+e.value+"/get_datatables_list",
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (result) {
			//console.log(result.data);
			nodesObject = result.data;
			$('#sensor_nodes').html('');
			result.data.forEach(node=>{
				nodes[node.node_id]= node; 
				$('#sensor_nodes').append($('<option>', {value:node.node_id, text:node.location}));
			});
			if(result.data.length){
				selected_node = result.data[0].node_id;
				get_node_data(selected_node);
			}
			else{
				console.log('No Data Node Found');
			}
		}
	});
}

function change_node(id){
	selected_node = id.value;
    get_node_data(id.value);
}

limit = 1;
function set_limit(lim){
	limit = lim.value;
	get_node_data(selected_node);
}

colors = ['bg-c-yellow','bg-c-green','bg-c-pink','bg-c-lite-green','bg-c-yellow','bg-c-green','bg-c-pink','bg-c-lite-green','bg-c-yellow','bg-c-green','bg-c-pink','bg-c-lite-green']

function get_node_data(id){

	sensor_array = nodes[id].sensors;

	sensors_latest_value_div = '';

	// sensor_array.forEach(sen=>{
	// 	sensors_latest_value_div+=`<div class="col-md-3">
	// 	<div class="m-widget_content-item">
	// 		<span>`+sensor_code[sen]+' ('+sensor_units[sen]+`)</span>
	// 		<span class="m--font-accent" id="latest_`+sen+`_value"></span>
	// 	</div>
	// </div>`;
	// })
col_size = 12/sensor_array.length;
if(col_size>=3){
	col_size = parseInt(col_size);
}
else{
	col_size = 3;
}
	sensor_array.forEach((sen,i)=>{
		sensors_latest_value_div+=`	<div class="col-xl-`+col_size+` col-md-6">
		<div class="card `+colors[i]+` update-card">
			<div class="card-block">
				<div class="row align-items-end">
				&nbsp;<img  src="/images/`+sen+`.png" height="70" width="70">
					<div class="col-8">
						<h4 class="text-white"><span id="latest_`+sen+`_value"></span> `+sensor_units[sen]+`</h4>
						<h6 class="text-white m-b-0">`+sensor_code[sen]+`</h6>
					</div>
				</div>
			</div>
			<div class="card-footer">
				<p class="text-white m-b-0"><i class="feather flaticon-clock-1 text-white f-14 m-r-10"></i>update : <span id="latest_`+sen+`_value_time"></span></p>
			</div>
		</div>
	</div>`;
	})



	$('#main_container').html('');
// 	$('#main_container').html(`
// <div class="row">
// 	<div class="col-md-12">
// 		<div class="m-portlet m-portlet--skin-dark">
// 			<div class="m-portlet__body">
// 				<div class="m-widget29">
// 					<div class="m-widget_content">
// 						<div class="row">
// 							<div class="col-md-6">
// 								<h3 class="m-widget_content-title">Sensors <span style="font-size: 11px;
// 									font-weight: 500;
// 									font-family: Roboto;
// 									color: #afb2c1;">(Current Value)</span></h3>
// 							</div>
// 							<div class="col-md-6">
// 								<button onclick="update_sensor_data()" class="btn btn-primary float-right" style="padding-left:5px;padding-right:5px;padding-top:0px;padding-bottom:0px;font-size: 1.2rem;position:relative;">
// 								<strong><i class="flaticon-refresh" style="font-size: 2.2rem;"></i></strong>
// 								</button>
// 							</div>
// 						</div>
// 						<div class="m-widget_content-items">
// 							<div class="row">`+sensors_latest_value_div+`</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	</div>
// </div>`);

$('#main_container').html(`
<div class="row">`+sensors_latest_value_div+`</div>`);

	//console.log(nodes[id].sensors);
	$('#main_container').append(`<div class="row" id="graphs"></div>`);
	project = $('#projects').val();
	sensor_array.forEach(sensor=>{
		if(bk_user.role=="Super User (OEM)"){
			request_path = 	"/sensors/get_sersor_data_by_project/"+project+"/"+id+"/"+sensor+"/"+limit;
		}
		else{
			request_path = 	"/sensors/get_sersor_data/"+id+"/"+sensor+"/"+limit;
		}
		$.ajax({
			url: request_path,
			cache: false,
			processData: false,
			contentType: 'application/json',
			type: 'GET',
			success: function (result) {
				result = JSON.parse(result);
				data = [];
				time = [];
				// try{
				// 	var monthDateYear = new Date(result[0].time).toLocaleDateString('en-GB', {  
				// 		day : 'numeric',
				// 		month : 'short',
				// 		year : 'numeric'
				// 	});
				// 	$('#'+sensor+"_date").html("  ("+monthDateYear+")");
				// }
				// catch (e){}
				result.forEach(record=>{
					d = new Date(record.time).getTime();
					data.push([d,parseFloat(parseFloat(record.value).toFixed(2))]);
					
					datatime = new Date(record.time).toGMTString();
					time.push(datatime);
				});
				values = data.reverse();
				categories = time.reverse();
				latest_value = values.pop();
				console.log(latest_value);
				$('#latest_'+sensor+'_value').html(latest_value[1]);
				$('#latest_'+sensor+'_value_time').html(categories[categories.length-1]);
				values.push(latest_value);
				
				$('#graphs').append(`
					<div class="col-md-6">
						<div class="m-portlet m-portlet--skin-light">
							<div class="m-portlet__head">
								<div class="m-portlet__head-caption">
									<div class="m-portlet__head-title">
										<h4 class="m-portlet__head-text" style="color: black !important;">
										`+sensor_code[sensor]+`
										</h4>
									</div>
								</div>
							</div>

							<div class="m-portlet__body">
								<div class="outer">
									<div id="`+sensor+`_linetrend"></div>
								</div>
							</div>
						</div>
					</div>`);
					
				generate_chart(sensor+'_linetrend','spline',sensor_code[sensor],'',categories,values,lower_range[sensor],uper_range[sensor],sensor_units[sensor])
			}
		});
	})
}

function update_sensor_data(){
	node_id = $('#sensor_nodes').val();
	get_node_data(node_id);
}

function generate_chart(component,chart_type,name,title,categories,values,lower_range,uper_range,unit){
	warning_up = parseFloat(uper_range)+(uper_range/10);
	warning_down = parseFloat(lower_range)-(lower_range/10);
	chart = Highcharts.chart(component, {
		chart: {
		  type: chart_type,
		  zoomType: 'x'
		},
		title: {
		  text: title
		},
		credits: {
		  enabled: false
		},
		subtitle: {
		  text: ''
		},
		xAxis: {
		  //categories: categories
		  type: 'datetime'
		},
		// yAxis: {
		//   title: {
		// 	text: ''
		//   },
		//   labels: {
		// 	formatter: function () {
		// 	  return this.value;
		// 	}
		//   }
		// },

		yAxis: {
			title: {
			text: unit
			},
			plotBands: [{
				from: 0,
				to: warning_down,
				color: '#ffe8e8'
			  },{
				from: warning_down,
				to: lower_range,
				color: '#ffe499'
			  },{
				from: lower_range,
				to: uper_range,
				color: '#eaffe8'
			  },{
				from: uper_range,
				to: warning_up,
				color: '#ffe499'
			  },{
				from: warning_up,
				to: 1000,
				color: '#ffe8e8'
			  }],
			plotLines: [{
			id: 'limit-min',
			color: '#FF0000',
			dashStyle: 'ShortDash',
			width: 2,
			value: lower_range,
			zIndex: 1,
			label : {
			text : ''
			}
			}, {
			id: 'limit-max',
			color: '#FF0000',
			dashStyle: 'ShortDash',
			width: 2,
			value: uper_range,
			zIndex: 1,
			label : {
			text : ''
			}
			}],
			labels: {
				formatter: function () {
				return this.value;
				}
			}
			},

		tooltip: {
		  crosshairs: true,
		  shared: true
		},
		plotOptions: {
		  series: {
			dataLabels: {
			  enabled: true,
			}
		  },
		  spline: {
			marker: {
			  radius: 4,
			  lineColor: '#666666',
			  lineWidth: 1
			}
		  }
		},
		series: [{
		  name: name,
		  data: values
		}]
	  });  
}