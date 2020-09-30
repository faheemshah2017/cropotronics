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
				"url": "/sales/get_datatables_list",
				"type": "POST"
			},
			columns: [
				{ name: 'Date', title: 'Date', data: 'date', className: 'dt-body-left' },
				{ name: 'Title', title: 'Title', data: 'title', className: 'dt-body-left' },
				{ name: 'Description', title: 'Description', data: 'description', className: 'dt-body-left' },
				{ name: 'Amount', title: 'Amount', data: 'amount', className: 'dt-body-left' },
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

function create_submit() {
	var values = {};
	$.each($('#data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/sales/add",
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

			swal({
				type: "success",
				title: "New Record Added",
				showConfirmButton: !1,
				timer: 1500
			}).then(function () {
				$('#m_table_1').DataTable().ajax.reload(null, false);
			});
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
		url: "/sales/details/" + row_id,
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'GET',
		success: function (result) {
			
			for (var key in result) {
				var value = result[key];
				if (key == 'description') {
					$("textarea[name='" + key + "']").val(value);
				}
				else{
					$( "input[name='" + key + "']" ).val(value);
				}
			}
		}
	});
}

function edit_submit() {

	var values = {};
	$.each($('#data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/sales/update",
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

			swal({
				type: "success",
				title: "Record has been saved",
				showConfirmButton: !1,
				timer: 1500
			}).then(function () {
				$('#m_table_1').DataTable().ajax.reload(null, false);
				$('#m_table_1').DataTable().scroller.toPosition(values[row_id]);

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
				url: "/sales/delete",
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