//sensor_code = {'DO':'Dissolve Oxygen','pH':'pH','AT':'Air Temperature','AH':'Air Humidtity','WT':'Water Temperature','WL':'Water Level','humidity':'Humidity','nitrates':'Nitrates','nitrites':'Nitrites','ammonia':'Ammonia'}
sensor_nodes = [];

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
selected_sensor = "";
$.ajax({
	url: "/sensors/sensor_mesh/get_datatables_list",
	cache: false,
	processData: false,
	contentType: 'application/json',
	type: 'POST',
	success: function (result) {
        result.data.forEach(node=>{
            $('#sensor_nodes').append($('<option>', {value:node.node_id, text:node.location}));
		});
		sensor_nodes = result;
		result.data[0].sensors.forEach(sensor=>{
			$('#sensors').append($('<option>', {value:sensor, text:sensor_code[sensor]}));
			
		})
		if(result.data[0].sensors){
			$('#add_reading').removeAttr('style','display:none');
			selected_sensor = result.data[0].sensors[0];
			get_sensor_data(result.data[0].sensors[0]);
		}
        //get_node_data(result.data[0].node_id);
	}
});

function change_node(id){
	$('#sensors').html('');
	sensor_nodes.data.forEach(node=>{
		if(node.node_id==id.value){
			node.sensors.forEach(sensor=>{
				$('#sensors').append($('<option>', {value:sensor, text:sensor_code[sensor]}));
			})
			if(node.sensors){
				selected_sensor = node.sensors[0];
				get_sensor_data(node.sensors[0]);
			}
		}
	})
}

function change_sensor(id){
	$('#add_reading').removeAttr('style','display:none');
	selected_sensor = id.value;
    get_sensor_data(id.value);
}

function add_reading(){
	$("#node_id").val($('#sensor_nodes').val());
	$("#sensor_type").val($('#sensors').val());
}

function create_submit() {
	var values = {};
	$.each($('#data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});
	$.ajax({
		url: "/sensor/data/"+values['node_id'],
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_1').modal('hide');
			$('.modal-backdrop').remove();

			$("#node_id").val('');
			$("#sensor_type").val('');
			$('form#data_form').trigger("reset");

			swal({
				type: "success",
				title: "New Record Added",
				showConfirmButton: !1,
				timer: 1500
			}).then(function () {
				$('#m_table_1').DataTable().ajax.reload(null, false);
				get_sensor_data(values['type']);
			});
		}
	});
}

function delete_submit(){
	var values = {};

	$.each($('#data_form2').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	values['node_id'] = $('#sensor_nodes').val();
	values['sensor_type'] = $('#sensors').val();

	$('#m_modal_2').modal('hide');
	$('.modal-backdrop').remove();

	$.ajax({
        url: "/sensor_data/deleteMany",
		data: JSON.stringify(values),
        cache: false,
        processData: false,
        contentType: 'application/json',
        type: 'POST',
        success: function (result) {
			get_sensor_data($('#sensors').val());
		}
	});
	
	console.log(values);
}

limit = 1;
function set_limit(lim){
	limit = lim.value;
	get_sensor_data(selected_sensor);
}

function get_sensor_data(sensor){
	id = $('#sensor_nodes').val();
	$.ajax({
        url: "/sensors/get_sersor_data/"+id+"/"+sensor+"/"+limit,
        cache: false,
        processData: false,
        contentType: 'application/json',
        type: 'GET',
        success: function (result) {
			result = JSON.parse(result);
			data = [];
			time = [];
			result.forEach(record=>{
				d = new Date(record.time).getTime();
				data.push([d,parseFloat(parseFloat(record.value).toFixed(2))]);
				datatime = new Date(record.time).toLocaleTimeString();
				var monthDateYear = new Date(record.time).toLocaleDateString('en-GB', {  
					day : 'numeric',
					month : 'short',
					year : 'numeric'
				});
				time.push(monthDateYear+' '+datatime);
			});
			values = data.reverse();
			categories = time.reverse();
			generate_chart('linetrend','spline',sensor,sensor_code[sensor],categories,values)
		}
	});
	
	table = $('#m_table_1').DataTable({
		// dom: 'Bfrtip',
		destroy: true,
		buttons: [
			'print',
			'copyHtml5',
			'excelHtml5',
			'csvHtml5',
			'pdfHtml5'
		],
		aaSorting: [[0, 'desc']],
		rowCallback: function (row, data) {
			$(row).attr('id', 'row_' + data.id);
		},
		pageLength: 20,
		ajax: {
			"url": "/sensors/get_sensor_node_data/"+id+"/"+sensor,
			"type": "POST"
		},
		columns: [
			{ name: 'Time', title: 'Time', data: 'time', className: 'dt-body-left' },
			{ name: sensor_code[sensor], title: sensor_code[sensor], data: 'value', className: 'dt-body-left' },
			{ name: 'Actions', title: 'Actions', defaultContent: '', className: 'dt-body-left' }
		],
		columnDefs: [
			{
				targets: -1,
				title: 'Actions',
				orderable: false,
				render: function (data, type, full, meta) {
					return `
					<button type="button" onclick="delete_data('` + full._id + `');" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill edit_flight" id="delete_data">
					<i class="la la-trash"></i>
					</button>`;
				},
			},
		]
	});
}

function generate_chart(component,chart_type,name,title,categories,values){
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
		  type: 'datetime'
		},
		yAxis: {
		  title: {
			text: 'Total Amount'
		  },
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

function delete_data(row_id) {
	node_id = $('#sensor_nodes').val();
	$.ajax({
		url: "/sensor/data/"+node_id,
		data: JSON.stringify({ row_id: row_id }),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'DELETE',
		success: function (dataofconfirm) {
			get_sensor_data($('#sensors').val());
		}
	});
}

$('#buttonAddSeries').click(function() {
	
	$('#m_modal_3').modal('hide');
	$('.modal-backdrop').remove();

	var seriesLength = chart.series.length;
	for(var i = seriesLength - 1; i > -1; i--)
	{
		if(chart.series[i].name =='Moving Average'){
			chart.series[i].remove();
		}
	}

    var series = chart.series[0];
    var data = [];
    var period = $('#period').val();
    var sumForAverage = 0;
	var i;
	if(series.data.length<period){
		swal({
			type: "error",
			title: "Sorry period selected is greater than total values",
			showConfirmButton: 1
		}).then(function () {
		});
	}else{
		for(i=0;i<series.data.length;i++) {
			sumForAverage += series.data[i].y;
			if(i>=period) {
				sumForAverage -= series.data[i-period].y;
				avg = sumForAverage/period;
				avg = parseFloat(parseFloat(avg).toFixed(2));
				data.push([series.data[i].x, avg]);
			}
		}
		chart.addSeries({
			name: 'Moving Average',
			data: data
		});
	}
});