var DatatablesDataSourceAjaxServer = function () {

	var initTable1 = function () {
		var table = $('#m_table_1');

		// begin first table
		table.DataTable({
			// dom: 'Bfrtip',
			buttons: [
				'print',
				'copyHtml5',
				'excelHtml5',
				'csvHtml5',
				'pdfHtml5'
			],
			rowCallback: function (row, data) {
				$(row).attr('id', 'row_' + data.id);
			},
			pageLength: 50,
			lengthMenu: [50, 100, 150, "All"],
			responsive: true,
			searchDelay: 500,
			processing: true,
			serverSide: true,
			ajax: {
				"url": "/sensors/sensor_mesh/get_datatables_list",
				"type": "POST"
			},
			columns: [
				{ name: 'Node ID', title: 'Node ID', data: 'node_id', className: 'dt-body-left' },
				{ name: 'Location', title: 'Location', data: 'location', className: 'dt-body-left' },
				{ name: 'Interval', title: 'Interval', data: 'interval', className: 'dt-body-left' },
				{ name: 'Sensors', title: 'Sensors', data: 'sensors', className: 'dt-body-left' },
				{ name: 'Actions', title: 'Actions', defaultContent: '', className: 'dt-body-left' },
			],
			columnDefs: [
				{
					targets: -1,
					title: 'Actions',
					orderable: false,
					render: function (data, type, full, meta) {
						return `
						<button type="button" onclick="edit_data('` + full._id + `');" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill edit_flight" id="edit_data" data-toggle="modal" data-target="#m_modal_5">
						<i class="la la-edit"></i>
						</button>
						<button type="button" onclick="delete_data('` + full._id + `');" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill edit_flight" id="delete_data">
						<i class="la la-trash"></i>
						</button>
						<button type="button" onclick="send_interval(` + full.node_id + `,` + full.interval + `,` + full.device_id + `);" class="btn btn-primary" id="send_interval">
						send interval
						</button>`;
					},
				},
			],
		});

	};

	return {

		//main function to initiate the module
		init: function () {
			initTable1();
		},

	};

}();

jQuery(document).ready(function () {
	DatatablesDataSourceAjaxServer.init();
});

function create_data() {
	$("#model_title").text("New Record");

	$("#row_id").val('');
	$('form#data_form').trigger("reset");

	$("#create_btn").show();
	$("#save_btn").hide();
}

function send_interval(topic,interval,device_id){
	//access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0NWYzM2Q1MzFjYmQ5YiIsImF1ZCI6IjQiLCJpYXQiOjE1OTcyMzI0MzMsIm5iZiI6MTU5NzIzMjQzMywiZXhwIjo0NzUwODMyNDMzLCJzY29wZXMiOiJbXSJ9.mUcrSkyASAXqrdvRmZhz_r7-1HrpnvU1JU-wau5399Y'
	//device_id = '1124405769'

	$.ajax({
		url: "/integration/axino/details",
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'GET',
		success: function (result) {
			access_token = result.token;
			$.ajax({
				url: "https://console.axino.co/api/v2/downlinks?access_token="+access_token+"&device_id="+device_id,
				type: 'POST',
				"data": {
					"payload": Base64.encode("interval="+interval),
					"topic": topic,
				},
				success: function (data) {
					if(data == "message qued"){
						console.log('message qued');
					}
					else{
						console.log(data);
					}
				}
			});
		}
	});
	
}

function create_submit() {
	var values = {};
	//values['sensors'] = [];
	$.each($('#data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
		// if(field.value == 'on'){
		// 	values['sensors'].push(field.name);
		// }
	});

	values['sensors'] = $('#sensors').val();

	$.ajax({
		url: "/sensors/sensor_mesh/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_5').modal('hide');
			$('.modal-backdrop').remove();

			$("#row_id").val('');
			$('form#data_form').trigger("reset");

			$('#m_table_1').DataTable().ajax.reload(null, false);
		}
	});
}

function edit_data(row_id) {
	$("#row_id").val('');
	$('form#data_form').trigger("reset");

	$("#row_id").val(row_id);

	$("#model_title").text("Edit Record");
	$("#create_btn").hide();
	$("#save_btn").show();

	$.ajax({
		url: "/sensors/sensor_mesh/details/" + row_id,
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'GET',
		success: function (result) {
			
			for (var key in result) {
				var value = result[key];
				// if(key=='sensors'){
				// 	value.forEach(sensor=>{
				// 		$('#'+sensor).attr("checked", "checked");
				// 	});
				// }
				if(key=='sensors'){
					$('#sensors').val(result[key]).change();
					// result[key].forEach(sensor => {
					// 	$('#sensors option[value='+sensor+']').attr('selected','selected');
					// });
				}
				$( "input[name='" + key + "']" ).val(value);
			}
		}
	});
}

function edit_submit() {

	var values = {};
	values['sensors'] = [];
	$.each($('#data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
		// if(field.value == 'on'){
		// 	values['sensors'].push(field.name);
		// }
	});

	values['sensors'] = $('#sensors').val();

	$.ajax({
		url: "/sensors/sensor_mesh/update",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'PUT',
		success: function (dataofconfirm) {
			$('#m_modal_5').modal('hide');
			$('.modal-backdrop').remove();

			$("#row_id").val('');
			$('form#data_form').trigger("reset");

			$('#m_table_1').DataTable().ajax.reload(null, false);
		}
	});
}

function delete_data(row_id) {
	$.ajax({
		url: "/sensors/sensor_mesh/delete",
		data: JSON.stringify({ row_id: row_id }),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'DELETE',
		success: function (dataofconfirm) {
			$('#m_table_1').DataTable().ajax.reload(null, false);
		}
	});
}

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
	
		input = Base64._utf8_encode(input);
	
		while (i < input.length) {
	
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
	
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
	
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
	
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
	
		}
	
		return output;
	},
	
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
	
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	
		while (i < input.length) {
	
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			output = output + String.fromCharCode(chr1);
	
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
	
		}
	
		output = Base64._utf8_decode(output);
	
		return output;
	
	},
	
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
	
		for (var n = 0; n < string.length; n++) {
	
			var c = string.charCodeAt(n);
	
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
	
		}
	
		return utftext;
	},
	
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
	
		while ( i < utftext.length ) {
	
			c = utftext.charCodeAt(i);
	
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
	
		}
	
		return string;
	}
	
	}