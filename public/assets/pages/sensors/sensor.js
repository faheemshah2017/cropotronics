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
        get_node_data(result.data[0].node_id);
	}
});

function change_node(id){
    get_node_data(id.value);
}

function get_node_data(id){
	sensor = sensor
	$.ajax({
        url: "/sensors/get_sersor_data/"+id+"/"+sensor,
        cache: false,
        processData: false,
        contentType: 'application/json',
        type: 'GET',
        success: function (result) {
			result = JSON.parse(result);
			data = [];
			time = [];
			result.forEach(record=>{
				data.push(parseFloat(parseFloat(record.value).toFixed(2)));
				datatime = new Date(record.time).toLocaleTimeString();
				time.push(datatime);
			});
			values = data.reverse();
			categories = time.reverse();
			generate_chart('linetrend','spline',sensor,title+' after every minute',categories,values)
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
			{ name: sensor, title: sensor, data: 'value', className: 'dt-body-left' }
		],
		columnDefs: [],
	});
}

function generate_chart(component,chart_type,name,title,categories,values){
	chart = Highcharts.chart(component, {
		chart: {
		  type: chart_type
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
		  categories: categories
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