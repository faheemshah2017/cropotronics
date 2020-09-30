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
			pageLength: 100,
			lengthMenu: [50, 100, 150, "All"],
			responsive: true,
			searchDelay: 500,
			processing: true,
			serverSide: true,
			ajax: {
				"url": "/users/project/get_datatables_list",
				"type": "POST"
			},
			columns: [
				{ name: 'Name', title: 'Name', data: 'project', className: 'dt-body-left' },
				{ name: 'Owner', title: 'Owner', defaultContent: '', className: 'dt-body-left' },
				{ name: 'Owner Email', title: 'Owner Email', data: 'owner_email', className: 'dt-body-left' },
				{ name: 'Manager', title: 'Manager', defaultContent: '', className: 'dt-body-left' },
				{ name: 'Manager Email', title: 'Manager Email', data: 'manager_email', className: 'dt-body-left' },
				{ name: 'Actions', title: 'Actions', defaultContent: '', className: 'dt-body-left' },
			],
			columnDefs: [
				{
					"targets": [1],
					"visible": true,
					"searchable": true,
					render: function (data, type, full, meta) {
						return (full.owner_first_name + " " + full.owner_last_name);
					},
				},
				{
					"targets": [3],
					"visible": true,
					"searchable": true,
					render: function (data, type, full, meta) {
						return (full.manager_first_name + " " + full.manager_last_name);
					},
				},
				{
					targets: -1,
					title: 'Actions',
					orderable: false,
					render: function (data, type, full, meta) {
						return `
						<button type="button" onclick="edit_data('` + full._id + `');" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill edit_flight" id="edit_data" data-toggle="modal" data-target="#m_modal_5">
						<i class="la la-edit"></i>
						
						<button type="button" onclick="delete_data('` + full._id + `');" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill edit_flight" id="delete_data">
						<i class="la la-trash"></i>
						</button>`;
					},
				},
			],
		});

	};
// <button type="button" onclick="edi_user_privileges('` + full._id + `');" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill edit_user_privileges" id="edit_data" data-toggle="modal" data-target="#m_user_privileges">
//<i class="la la-lock"></i></button>
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
	$("#model_title").text("New User");

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
		url: "/users/add_new",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_2').modal('hide');
			$('.modal-backdrop').remove();

			$("#row_id").val('');
			$('form#data_form').trigger("reset");

			swal({
				type: "success",
				title: "New Project Created",
				showConfirmButton: !1,
				timer: 1500
			}).then(function () {
				$('#m_table_1').DataTable().ajax.reload(null, false);
				$('#m_modal_5').modal('hide');
			});
		}
	});
}

function edit_data(row_id) {
	$("#row_id").val('');
	$('form#data_form').trigger("reset");

	console.log(row_id)
	$("#row_id").val(row_id);

	$("#model_title").text("Edit User");
	$("#create_btn").hide();
	$("#save_btn").show();

	$.ajax({
		url: "/users/project/details/" + row_id,
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'GET',
		success: function (result) {
			console.log(result)
			for (var key in result) {
				$( "input[name='" + key + "']" ).val(result[key]);
			}
		}
	});
}

function edit_submit_user_privileges() {

	user_id = $("#user_row_id").val();

	var privilege_codes = []
	$("input.user_privileges:checked").each(function ()
	{
		privilege_codes.push($(this).val());
	});

	port_data = {
		user_id: user_id,
		privilege_codes: privilege_codes
	}
	
	$.ajax({
		url: "/users/update/privileges",
		data: JSON.stringify(port_data),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'PUT',
		success: function (dataofconfirm) {
			$('#m_user_privileges').modal('hide');
			$('.modal-backdrop').remove();

			$("#user_row_id").val('');
			$('form#user_privileges_form').trigger("reset");

			swal({
				type: "success",
				title: "User Privileges Updated",
				showConfirmButton: !1,
				timer: 1500
			}).then(function () {
				$('#m_table_1').DataTable().ajax.reload(null, false);
			});
		}
	});
}

function edi_user_privileges(row_id) {
	$("#user_row_id").val('');
	$('form#user_privileges_form').trigger("reset");

	$("#user_row_id").val(row_id);

}

function edit_submit() {

	var values = {};
	$.each($('#data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/users/update/project",
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
				title: "Project	Updated",
				showConfirmButton: !1,
				timer: 1500
			}).then(function () {
				$('#m_table_1').DataTable().ajax.reload(null, false);
				$('#m_table_1').DataTable().scroller.toPosition(values[row_id]);
				$('#m_modal_5').modal('hide');

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
				url: "/users/project/delete",
				data: JSON.stringify({ row_id: row_id }),
				cache: false,
				processData: false,
				contentType: 'application/json',
				type: 'DELETE',
				success: function (dataofconfirm) {
					$('#m_table_1').DataTable().ajax.reload(null, false);
					e.value && swal("Deleted!", "Deleted.", "success")
				}
			});
		}
	});
}