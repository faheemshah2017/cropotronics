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
				"url": "/integration/api/get_datatables_list",
				"type": "POST"
			},
			columns: [
				{ name: 'Name', title: 'Name', data: 'name', className: 'dt-body-left' },
				{ name: 'Created On', title: 'Created On', data: 'created_on', className: 'dt-body-left' },
				{ name: 'Expires On', title: 'Expires On', data: 'expires_on', className: 'dt-body-left' },
				{ name: 'Actions', title: 'Actions', defaultContent: '', className: 'dt-body-left' },
			],
			columnDefs: [
				// {
				// 	"targets": [1],
				// 	"visible": true,
				// 	"searchable": true,
				// 	render: function (data, type, full, meta) {
				// 		return (full.owner_first_name + " " + full.owner_last_name);
				// 	},
				// },
				// {
				// 	"targets": [3],
				// 	"visible": true,
				// 	"searchable": true,
				// 	render: function (data, type, full, meta) {
				// 		return (full.manager_first_name + " " + full.manager_last_name);
				// 	},
				// },
				{
					targets: -1,
					title: 'Actions',
					orderable: false,
					render: function (data, type, full, meta) {
						return `
						<button type="button" onclick="view_token('` + full.token + `');" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill" id="view_token">
						<i class="la la-eye"></i>
						</button>
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
	$("#model_title").text("Create Token");

	$("#row_id").val('');
	$('form#data_form').trigger("reset");

	$("#create_btn").show();
}

function view_token(token){
	$("#access_token").val(token);
	$('#m_modal_2').modal('show');
}

function create_submit() {
	var values = {};
	$.each($('#data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/integration/api/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (token) {
			$('#m_modal_5').modal('hide');

			$("#row_id").val('');
			$('form#data_form').trigger("reset");

			$('#m_modal_2').modal('show');
			$("#access_token").val(token);

			// swal({
			// 	type: "success",
			// 	title: "New Token Created",
			// 	showConfirmButton: !1,
			// 	timer: 1500
			// }).then(function () {
			// 	$('#m_table_1').DataTable().ajax.reload(null, false);
			// 	$('#m_modal_5').modal('hide');
			// });
		}
	});
}

function done_token(){
	$('#m_table_1').DataTable().ajax.reload(null, false);
	$('.modal-backdrop').remove();
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
				url: "/integration/api/delete",
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