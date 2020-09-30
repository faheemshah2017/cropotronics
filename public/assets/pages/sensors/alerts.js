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
				"url": "/sensors/alerts/get_datatables_list",
				"type": "POST"
			},
			columns: [
				{ name: 'Time', title: 'time', data: 'time', className: 'dt-body-left' },
				{ name: 'Name', title: 'Name', data: 'sensor_title', className: 'dt-body-left' },
				{ name: 'Key', title: 'Key', data: 'sensor_key', className: 'dt-body-left' },
				{ name: 'Value', title: 'value', data: 'value', className: 'dt-body-left' },
				{ name: 'Message', title: 'Message', data: 'message', className: 'dt-body-left' },
				{ name: 'Actions', title: 'Actions', defaultContent: '', className: 'dt-body-left' },
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
	$.ajax({
		url: "/sensors/alert_emails/details",
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'GET',
		success: function (result) {
			$("#alert_emails").val(result.emails);
			$("#row_id").val(result._id);
		}
	});
	DatatablesDataSourceAjaxServer.init();
});

function edit_submit() {
	var values = {};
	$.each($('#data_form1').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});
	$.ajax({
		url: "/sensors/alert_emails/update",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'PUT',
		success: function (dataofconfirm) {
			swal({
				type: "success",
				title: "Record has been saved",
				showConfirmButton: !1,
				timer: 1500
			}).then(function () {
			});
		}
	});
}

function delete_data(row_id) {
	
	swal({
		title: "Are you sure?",
		text: "You won't be able to revert this!",
		type: "warning",
		showCancelButton: !0,
		confirmButtonText: "Yes, delete it!"
	}).then(function (ev) {

		if (ev.value) {
			$.ajax({
				url: "/sensors/alerts/delete",
				data: JSON.stringify({ row_id: row_id }),
				cache: false,
				processData: false,
				contentType: 'application/json',
				type: 'DELETE',
				success: function (dataofconfirm) {
					$('#m_table_1').DataTable().ajax.reload(null, false);
					ev.value && swal("Deleted!", "Deleted.", "success")
				}
			});
		}
	});
}