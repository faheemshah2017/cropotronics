if(bk_data){
	for (var key in bk_data) {
		var value = bk_data[key];
		if(key == '_id'){
			$( "input[name='row_id']" ).val(value);
		}
		else if(key == 'project_id'){
			$( "input[name='" + key + "']" ).val(value);
		}
		else{
			$( "textarea[name='" + key + "']" ).val(value);
		}
	}
}

function create_submit() {
	var values = {};
	$.each($('#data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});
	if($('#row_id').val()==''){
		$.ajax({
			url: "/integration/axino/add",
			data: JSON.stringify(values),
			cache: false,
			processData: false,
			contentType: 'application/json',
			type: 'POST',
			success: function (dataofconfirm) {
				swal({
					type: "success",
					title: "Integration Saved",
					showConfirmButton: !1,
					timer: 1500
				}).then(function () {
				});
			}
		});
	}
	else{
		$.ajax({
			url: "/integration/axino/update",
			data: JSON.stringify(values),
			cache: false,
			processData: false,
			contentType: 'application/json',
			type: 'PUT',
			success: function (dataofconfirm) {

				swal({
					type: "success",
					title: "Integration Updated",
					showConfirmButton: !1,
					timer: 1500
				}).then(function () {
				});
			}
		});
	}
}