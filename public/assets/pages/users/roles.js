
var DatatablesDataSourceAjaxServer = function () {
	var initTable1 = function () {
		var populate_privileges_dd = function () {
			$.ajax({
				url: "/users/privileges/get_all_privileges_names",
				cache: false,
				processData: false,
				contentType: 'application/json',
				dataType: 'json',
				type: 'GET',
				success: function (result) {

					
					var $dropdown = $("#all_privileges");
					$.each(result, function () {
						all_privileges_data[this.code] = this.name;
						$dropdown.append($("<li></li>").attr('id', this.code).text(this.name).addClass('list-group-item'));
					});

					
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
							"url": "/users/roles/get_datatables_list",
							"type": "POST"
						},
						columns: [
							{ name: 'Name', title: 'Name', data: 'name', className: 'dt-body-left' },
							{ name: 'Privileges', title: 'Privileges', data: 'privileges', className: 'dt-body-left' },
							{ name: 'Actions', title: 'Actions', defaultContent: '', className: 'dt-body-left' },
						],
						columnDefs: [
							{
								targets: -1,
								title: 'Actions',
								orderable: false,
								render: function (data, type, full, meta) {
									return `
									<button type="button" onclick="edit_data('` + full._id + `');" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill edit_flight" id="edit_data" data-toggle="modal" data-target="#m_modal_2">
									<i class="la la-edit"></i>
									</button>
									<button type="button" onclick="delete_data('` + full._id + `');" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill edit_flight" id="delete_data">
									<i class="la la-trash"></i>
									</button>`;
								},
							},
							{
								targets: 1,
								render: function (data, type, full, meta) {
									console.log(full);
									var li = '';
									full.privileges.forEach(element => {
										li += `<li>`+all_privileges_data[element]+`</li>`
									});

									output = `<ul>`+li+`
									</ul>`;

									return output;
								},
							},
						],
					});
				}
			});
		}();

	};

	return {

		//main function to initiate the module
		init: function () {
			initTable1();
		},

	};

}();

all_privileges_data = [];

jQuery(document).ready(function () {
	var selected = new Array();
	
	DatatablesDataSourceAjaxServer.init();
	$('body').on('click', '.list-group .list-group-item', function () {
		$(this).toggleClass('active');
	});
	$('.list-arrows button').click(function () {
		var $button = $(this), actives = '';
		if ($button.hasClass('move-left')) {
			actives = $('.list-right ul li.active');
			$('.list-right ul li.active').toggleClass('active');
			actives.clone().appendTo('.list-left ul');
			actives.remove();
			selected = [];
			var list = document.getElementById('selected_privileges');
			var list_items = list.getElementsByTagName("li");
			var array = new Array();
			array.push(list_items);
			array.forEach(function(currentValue, index, arr){
				for (var i = 0; i < currentValue.length; i++) {
					selected.push(currentValue[i].id);
				}
			});
			$('#privileges').val(selected);
		} else if ($button.hasClass('move-right')) {
			actives = $('.list-left ul li.active');
			$('.list-left ul li.active').toggleClass('active');
			actives.clone().appendTo('.list-right ul');
			actives.remove();
			selected = [];
			var list = document.getElementById('selected_privileges');
			var list_items = list.getElementsByTagName("li");
			var array = new Array();
			array.push(list_items);
			array.forEach(function(currentValue, index, arr){
				for (var i = 0; i < currentValue.length; i++) {
					selected.push(currentValue[i].id);
				}
			});
			$('#privileges').val(selected);
		}
	});
	$('.dual-list .selector').click(function () {
		var $checkBox = $(this);
		if (!$checkBox.hasClass('selected')) {
			$checkBox.addClass('selected').closest('.well').find('ul li:not(.active)').addClass('active');
			$checkBox.children('i').removeClass('fa-square').addClass('fa-check-square');
		} else {
			$checkBox.removeClass('selected').closest('.well').find('ul li.active').removeClass('active');
			$checkBox.children('i').removeClass('fa-check-square').addClass('fa-square');
		}
	});
	$('[name="SearchDualList"]').keyup(function (e) {
		var code = e.keyCode || e.which;
		if (code == '9') return;
		if (code == '27') $(this).val(null);
		var $rows = $(this).closest('.dual-list').find('.list-group li');
		var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
		$rows.show().filter(function () {
			var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
			return !~text.indexOf(val);
		}).hide();
	});
});

function create_data() {
	$("#selected_privileges").empty();
	$("#all_privileges").empty();
	
	Object.keys(all_privileges_data).forEach(function(key) {
		$('#all_privileges').append($("<li></li>").attr('id', key).text(all_privileges_data[key]).addClass('list-group-item'));
	});
	
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
		url: "/users/roles/add",
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
				title: "New Record created",
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
		url: "/users/roles/details/" + row_id,
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'GET',
		success: function (result) {
			$('#selected_privileges').empty();
			for (var key in result) {
				var value = result[key];
				if(key == 'privileges'){
					$.each(value,function(index,val){
						$('#selected_privileges').append($("<li></li>").attr('id', val).text(all_privileges_data[val]).addClass('list-group-item'));
						
						$('#all_privileges #'+val).remove(); 
					});
				}
				$( "input[name='" + key + "']" ).val(value);
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
		url: "/users/roles/update",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'PUT',
		success: function (dataofconfirm) {
			console.log(dataofconfirm);
			$('#m_modal_2').modal('hide');
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
				url: "/users/roles/delete",
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