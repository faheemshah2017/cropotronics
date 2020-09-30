var width = 1920;
var height = 1920;
function update(activeAnchor) {
	var group = activeAnchor.getParent();

	var topLeft = group.get('.topLeft')[0];
	var topRight = group.get('.topRight')[0];
	var bottomRight = group.get('.bottomRight')[0];
	var bottomLeft = group.get('.bottomLeft')[0];
	var image = group.get('Image')[0];

	var anchorX = activeAnchor.getX();
	var anchorY = activeAnchor.getY();

	// update anchor positions
	switch (activeAnchor.getName()) {
		case 'topLeft':
			topRight.y(anchorY);
			bottomLeft.x(anchorX);
			break;
		case 'topRight':
			topLeft.y(anchorY);
			bottomRight.x(anchorX);
			break;
		case 'bottomRight':
			bottomLeft.y(anchorY);
			topRight.x(anchorX);
			break;
		case 'bottomLeft':
			bottomRight.y(anchorY);
			topLeft.x(anchorX);
			break;
	}

	image.position(topLeft.position());

	var width = topRight.getX() - topLeft.getX();
	var height = bottomLeft.getY() - topLeft.getY();
	if (width && height) {
		image.width(width);
		image.height(height);
	}
}
function addAnchor(group, x, y, name) {
	var layer = group.getLayer();

	if (name == 'topLeft') {

		var anchor = new Konva.Circle({
			x: x,
			y: y,
			stroke: '#666',
			fill: '#ddd',
			strokeWidth: 1,
			radius: 4,
			name: name,
			draggable: true,
			dragOnTop: false,
			group: group
		});

		anchor.setAttr("group", group);

		anchor.on('dragmove', function () {
			update(this);
			layer.draw();
		});

		anchor.on('mouseover touchstart', function () {
			this.fill('#ff0000');
			this.stroke(2);
			this.radius(8);
			layer.draw();
			group.draggable(false);
			this.moveToTop();
		});
		anchor.on('dragend', function () {
			group.draggable(true);
			layer.draw();
		});

		anchor.on('mouseout touchend', function () {
			this.fill('#ddd');
			this.stroke(1);
			this.radius(4);
			layer.draw();
		});

		anchor.on('click', function () {
			delete_component_from_db(group.attrs.title, group.attrs._id, group, layer);
		});

	}
	else {
		var anchor = new Konva.Circle({
			x: x,
			y: y,
			stroke: '#666',
			fill: '#ddd',
			strokeWidth: 1,
			radius: 4,
			name: name,
			draggable: true,
			dragOnTop: false
		});

		anchor.on('dragmove', function () {
			update(this);
			layer.draw();
		});
		anchor.on('mousedown touchstart', function () {
			group.draggable(false);
			this.moveToTop();
		});
		anchor.on('dragend', function () {
			group.draggable(true);
			layer.draw();
		});
		// add hover styling
		anchor.on('mouseover', function () {
			var layer = this.getLayer();
			document.body.style.cursor = 'pointer';
			this.strokeWidth(4);
			layer.draw();
		});
		anchor.on('mouseout', function () {
			var layer = this.getLayer();
			document.body.style.cursor = 'default';
			this.strokeWidth(2);
			layer.draw();
		});
	}
	anchor.hide();
	group.add(anchor);
	return anchor;
}
$.ajax({
	url: "/farm_maker/details/"+data_id,
	cache: false,
	processData: false,
	contentType: 'application/json',
	type: 'GET',
	success: function (result) {
		if (result.jsonText == 'empty') {
			stage = new Konva.Stage({
				container: 'container',
				width: width,
				height: height
			});
			layer = new Konva.Layer();
			stage.add(layer);
		}
		else {
			stage = Konva.Node.create(result.jsonText, 'container');

			stage.find('Layer').forEach((Layer) => {
				layer = Layer;
			});

			stage.add(layer);

			stage.find('Text').forEach((txt) => {
				txt.remove();
				layer.draw();
			});

			text = new Konva.Text({
				x: 880,
				y: 10,
				fontFamily: 'Calibri',
				fontSize: 20,
				text: '',
				fill: 'black'
			});

			layer.add(text);

			stage.on('mousemove', function () {
				var mousePos = stage.getPointerPosition();
				text.text('x: ' + Math.round((mousePos.x) / 38) + ', y: ' + Math.round((mousePos.y + 26) / 38));
				layer.draw();
			});

			stage.find('Circle').forEach((circle) => {
				ancorX = circle.getX();
				ancorY = circle.getY();
				ancorName = circle.getAttr('name');
				ancorParent = circle.getParent();
				circle.remove();
				anchor = addAnchor(ancorParent, ancorX, ancorY, ancorName);
				anchor.show();
				layer.draw();
			});
			tooltip = new Konva.Label({
				x: 170,
				y: 75,
				opacity: 0.75
			});

			tooltip.add(new Konva.Tag({
				fill: 'black',
				pointerDirection: 'down',
				pointerWidth: 10,
				pointerHeight: 10,
				lineJoin: 'round',
				shadowColor: 'black',
				shadowBlur: 10,
				shadowOffset: 10,
				shadowOpacity: 0.5
			}));
			tooltip_text = new Konva.Text({
				text: 'faheem',
				fontFamily: 'Calibri',
				fontSize: 18,
				padding: 5,
				fill: 'white'
			});

			tooltip.add(tooltip_text);
			stage.find('Group').forEach((group) => {
				group.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				});
				group.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(group.attrs.tooltip);
					layer.add(tooltip);
					layer.draw();
				});
				group.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});
			});

			stage.find('Image').forEach((imageNode) => {
				const src = imageNode.getAttr('src');
				const image = new Image();
				image.onload = () => {
					imageNode.image(image);
					imageNode.getLayer().batchDraw();
				}
				image.src = src;
				imageNode.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					layer.draw();
				});
				imageNode.on('mouseout', function () {
					document.body.style.cursor = 'default';
					layer.draw();
				});
			});
		}

	}
});
document.getElementById('load_from_db').addEventListener('click', function () {
	$.ajax({
		url: "/farm_maker/details/"+data_id,
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'GET',
		success: function (result) {
			if (result.jsonText == 'empty') {
				stage = new Konva.Stage({
					container: 'container',
					width: width,
					height: height
				});

				layer = new Konva.Layer();
				stage.add(layer);
			}
			else {
				stage = Konva.Node.create(result.jsonText, 'container');
				layer = new Konva.Layer();
				stage.add(layer);

				stage.find('Circle').forEach((circle) => {
					ancorX = circle.getX();
					ancorY = circle.getY();
					ancorName = circle.getAttr('name');
					ancorParent = circle.getParent();
					circle.remove();
					anchor = addAnchor(ancorParent, ancorX, ancorY, ancorName);
					anchor.show();
					layer.draw();
				});

				stage.find('Group').forEach((group) => {
					group.on('dblclick dbltap', function () {
						this.moveToTop();
						layer.draw();
					});
				});

				stage.find('Image').forEach((imageNode) => {
					const src = imageNode.getAttr('src');
					const image = new Image();
					image.onload = () => {
						imageNode.image(image);
						imageNode.getLayer().batchDraw();
					}
					imageNode.on('mouseover', function () {
						document.body.style.cursor = 'pointer';
						layer.draw();
					});
					imageNode.on('mouseout', function () {
						document.body.style.cursor = 'default';
						layer.draw();
					});
					image.src = src;
				});
			}
		}
	});

}, false
);

document.getElementById('clear_all').addEventListener('click', function () {
	stage = new Konva.Stage({
		container: 'container',
		width: width,
		height: height
	});

	layer = new Konva.Layer();
	stage.add(layer);
}, false
);

document.getElementById('save_to_db').addEventListener('click', function () {
	save_design();
	swal({
		type: "success",
		title: "Farm Saved",
		showConfirmButton: !1,
		timer: 1500
	}).then(function () {
	});
}, false
);
function save_design() {
	stage.find('Text').forEach((txt) => {
		txt.remove();
		layer.draw();
	});
	var json = stage.toJSON();
	values = {
		jsonText: json
	}
	$.ajax({
		url: "/farm_maker/update/"+data_id,
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'PUT',
		success: function (dataofconfirm) {
		}
	});
}
document.getElementById('add_aquarium').addEventListener('click', function () {
	$('#m_modal_aquarium').modal('show');
}, false
);
document.getElementById('add_sump').addEventListener('click', function () {
	$('#m_modal_sump').modal('show');
}, false
);
document.getElementById('add_media_bed').addEventListener('click', function () {
	// Media Bed
	$('#m_modal_media_bed').modal('show');
}, false
);
document.getElementById('add_dwc').addEventListener('click', function () {
	// DWC
	$('#m_modal_dwc').modal('show');
}, false
);
document.getElementById('add_nft').addEventListener('click', function () {
	// NFT Image
	$('#m_modal_nft').modal('show');
}, false
);
document.getElementById('add_biofilter').addEventListener('click', function () {
	$('#m_modal_bio_filter').modal('show');
}, false
);
document.getElementById('add_mechanicalfilter').addEventListener('click', function () {
	$('#m_modal_mechanical_filter').modal('show');
}, false
);
document.getElementById('add_motor').addEventListener('click', function () {
	$('#m_modal_water_pump').modal('show');
}, false
);
// Add Fishes event listner
document.getElementById('add_fishes').addEventListener('click',function () {
		$.ajax({
			url: "/system_components/aquarium/get_datatables_list",
			cache: false,
			processData: false,
			contentType: 'application/json',
			dataType: 'json',
			type: 'POST',
			success: function (result) {
				aquariums = result.data;
				$("#aquarium").empty();
				aquariums.forEach(aquarium => {
					$('#aquarium').append($('<option>', { value: aquarium.name, text: aquarium.name }));
				});
			}
		});
		$('#m_modal_fishes').modal('show');
	}, false
);
// Add Plants event listner
document.getElementById('add_plants').addEventListener('click',function () {
		$.ajax({
			url: "/system_components/growing_area/get_datatables_list",
			cache: false,
			processData: false,
			contentType: 'application/json',
			dataType: 'json',
			type: 'POST',
			success: function (result) {
				growing_areas = result.data;
				$("#growing_area").empty();
				growing_areas.forEach(growing_area => {
					$('#growing_area').append($('<option>', { value: growing_area.type, text: growing_area.name }));
				});
			}
		});
		$('#m_modal_plants').modal('show');
	}, false
);
// Add Air Pump event listner
document.getElementById('add_pump').addEventListener('click', function () {
	$('#m_modal_air_pump').modal('show');
}, false
);
// Add Sensor Mesh event listner
document.getElementById('add_sensor_mesh').addEventListener('click', function () {
	$('#m_modal_sensor_mesh').modal('show');
}, false
);
// Build "dynamic" rulers by adding items
$(function () {
	$(".ruler[data-items]").each(function () {
		var ruler = $(this).empty(),
			len = Number(ruler.attr("data-items")) || 0,
			item = $(document.createElement("li")),
			i;
		for (i = 0; i < len; i++) {
			ruler.append(item.clone().text(i + 1));
		}
	});
});
function add_text(e) {
	$("#title_text").html($(e).attr('title'));
}
function remove_text() {
	$("#title_text").html('');
}
// Add Media Bed
function add_media_bed() {
	var values = {};
	$.each($('#media_bed_data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});
	values['type'] = 'Media Bed';
	$.ajax({
		url: "/system_components/growing_area/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_media_bed').modal('hide');
			$('.modal-backdrop').remove();

				var object_width = values['length'] * 19;
				var object_heigth = values['width'] * 19;

				var media_bedImg = new Konva.Image({
					width: object_width,
					height: object_heigth,
					src: '/images/media_bed.jpg',
					shadowOffset: { x: 6, y: 6 },
					shadowOpacity: 0.3,
					shadowBlur: 9
				});
				var media_bedGroup = new Konva.Group({
					x: 30,
					y: 30,
					draggable: true,
					title: 'system_components/growing_area',
					_id: dataofconfirm,
					tooltip: values['name']
				});
				layer.add(media_bedGroup);
				media_bedGroup.add(media_bedImg);
				var media_bed_anchor1 = addAnchor(media_bedGroup, 0, 0, 'topLeft');
				var media_bed_anchor2 = addAnchor(media_bedGroup, object_width, 0, 'topRight');
				var media_bed_anchor3 = addAnchor(media_bedGroup, object_width, object_heigth, 'bottomRight');
				var media_bed_anchor4 = addAnchor(media_bedGroup, 0, object_heigth, 'bottomLeft');

				media_bedGroup.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					media_bed_anchor1.show();
					media_bed_anchor2.show();
					media_bed_anchor3.show();
					media_bed_anchor4.show();
					layer.draw();
				});
				media_bedGroup.on('mouseout', function () {
					document.body.style.cursor = 'default';
					media_bed_anchor1.hide();
					media_bed_anchor2.hide();
					media_bed_anchor3.hide();
					media_bed_anchor4.hide();
					layer.draw();
				});
				media_bedGroup.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				});

				var tooltip = new Konva.Label({
					x: 170,
					y: 75,
					opacity: 0.75
				});

				tooltip.add(new Konva.Tag({
					fill: 'black',
					pointerDirection: 'down',
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: 'round',
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffset: 10,
					shadowOpacity: 0.5
				}));
				var tooltip_text = new Konva.Text({
					text: 'faheem',
					fontFamily: 'Calibri',
					fontSize: 18,
					padding: 5,
					fill: 'white'
				});

				tooltip.add(tooltip_text);


				media_bedGroup.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(values['name']);
					layer.add(tooltip);
					layer.draw();
				});

				media_bedGroup.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});

				var imageObj1 = new Image();
				imageObj1.onload = function () {
					media_bedImg.image(imageObj1);
					layer.draw();
				};
				imageObj1.src = '/images/media_bed.jpg';
				save_design();
		}
	});
}
// Add DWC Bed
function add_dwc() {
	var values = {};
	$.each($('#dwc_data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});
	values['type'] = 'Deep Water';
	$.ajax({
		url: "/system_components/growing_area/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_dwc').modal('hide');
			$('.modal-backdrop').remove();

				var object_width = values['length'] * 19;
				var object_heigth = values['width'] * 19;

				var dwcimg = new Konva.Image({
					width: object_width,
					height: object_heigth,
					src: '/images/dwc.png',
					shadowOffset: { x: 6, y: 6 },
					shadowOpacity: 0.3,
					shadowBlur: 9
				});

				var dwcGroup = new Konva.Group({
					x: 30,
					y: 30,
					draggable: true,
					title: 'system_components/growing_area',
					_id: dataofconfirm,
					tooltip: values['name']
				});
				layer.add(dwcGroup);
				dwcGroup.add(dwcimg);
				var dwc_anchor1 = addAnchor(dwcGroup, 0, 0, 'topLeft');
				var dwc_anchor2 = addAnchor(dwcGroup, object_width, 0, 'topRight');
				var dwc_anchor3 = addAnchor(dwcGroup, object_width, object_heigth, 'bottomRight');
				var dwc_anchor4 = addAnchor(dwcGroup, 0, object_heigth, 'bottomLeft');

				dwcGroup.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					dwc_anchor1.show();
					dwc_anchor2.show();
					dwc_anchor3.show();
					dwc_anchor4.show();
					layer.draw();
				});
				dwcGroup.on('mouseout', function () {
					document.body.style.cursor = 'default';
					dwc_anchor1.hide();
					dwc_anchor2.hide();
					dwc_anchor3.hide();
					dwc_anchor4.hide();
					layer.draw();
				});
				dwcGroup.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				});
				var tooltip = new Konva.Label({
					x: 170,
					y: 75,
					opacity: 0.75
				});

				tooltip.add(new Konva.Tag({
					fill: 'black',
					pointerDirection: 'down',
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: 'round',
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffset: 10,
					shadowOpacity: 0.5
				}));
				var tooltip_text = new Konva.Text({
					text: 'faheem',
					fontFamily: 'Calibri',
					fontSize: 18,
					padding: 5,
					fill: 'white'
				});

				tooltip.add(tooltip_text);


				dwcGroup.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(values['name']);
					layer.add(tooltip);
					layer.draw();
				});

				dwcGroup.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});
				var dwcimageObj = new Image();
				dwcimageObj.onload = function () {
					dwcimg.image(dwcimageObj);
					layer.draw();
				};
				dwcimageObj.src = '/images/dwc.png';
				save_design();
		}
	});
}
// Add NFT Pipe
function add_nft() {
	var values = {};
	$.each($('#nft_data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});
	values['type'] = 'NFT';
	$.ajax({
		url: "/system_components/growing_area/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_nft').modal('hide');
			$('.modal-backdrop').remove();

				var object_width = values['length'] * 19;
				var object_heigth = values['width'] * 19;

				var nftImg = new Konva.Image({
					width: object_width,
					height: object_heigth,
					src: '/images/nft_h.png',
					shadowOffset: { x: 6, y: 6 },
					shadowOpacity: 0.3,
					shadowBlur: 9
				});

				var nftGroup = new Konva.Group({
					x: 30,
					y: 30,
					draggable: true,
					title: 'system_components/growing_area',
					_id: dataofconfirm,
					tooltip: values['name']
				});
				layer.add(nftGroup);
				nftGroup.add(nftImg);
				var nft_anchor1 = addAnchor(nftGroup, 0, 0, 'topLeft');
				var nft_anchor2 = addAnchor(nftGroup, object_width, 0, 'topRight');
				var nft_anchor3 = addAnchor(nftGroup, object_width, object_heigth, 'bottomRight');
				var nft_anchor4 = addAnchor(nftGroup, 0, object_heigth, 'bottomLeft');

				nftGroup.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					nft_anchor1.show();
					nft_anchor2.show();
					nft_anchor3.show();
					nft_anchor4.show();
					layer.draw();
				});
				nftGroup.on('mouseout', function () {
					document.body.style.cursor = 'default';
					nft_anchor1.hide();
					nft_anchor2.hide();
					nft_anchor3.hide();
					nft_anchor4.hide();
					layer.draw();
				});

				nftGroup.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				});
				var tooltip = new Konva.Label({
					x: 170,
					y: 75,
					opacity: 0.75
				});

				tooltip.add(new Konva.Tag({
					fill: 'black',
					pointerDirection: 'down',
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: 'round',
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffset: 10,
					shadowOpacity: 0.5
				}));
				var tooltip_text = new Konva.Text({
					text: 'faheem',
					fontFamily: 'Calibri',
					fontSize: 18,
					padding: 5,
					fill: 'white'
				});

				tooltip.add(tooltip_text);


				nftGroup.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(values['name']);
					layer.add(tooltip);
					layer.draw();
				});

				nftGroup.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});

				var imageObj5 = new Image();
				imageObj5.onload = function () {
					nftImg.image(imageObj5);
					layer.draw();
				};
				imageObj5.src = '/images/nft_h.png';
				save_design();
		}
	});
}
// ADD FISHES
function add_fishes() {
	var values = {};
	$.each($('#data_form_fishes').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/fish_management/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_fishes').modal('hide');
			$('.modal-backdrop').remove();

				var fishesimg = new Konva.Image({
					width: 100,
					height: 100,
					src: '/images/fishes.png'
				});
				var fishesGroup = new Konva.Group({
					x: 30,
					y: 30,
					draggable: true,
					title: 'fish_management',
					_id: dataofconfirm,
					tooltip: values['biomass'] + ' KG Biomass Of ' + values['fish_type']
				});
				layer.add(fishesGroup);
				fishesGroup.add(fishesimg);
				var fishes_anchor1 = addAnchor(fishesGroup, 0, 0, 'topLeft');
				var fishes_anchor2 = addAnchor(fishesGroup, 100, 0, 'topRight');
				var fishes_anchor3 = addAnchor(fishesGroup, 100, 100, 'bottomRight');
				var fishes_anchor4 = addAnchor(fishesGroup, 0, 100, 'bottomLeft');

				fishesGroup.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					fishes_anchor1.show();
					fishes_anchor2.show();
					fishes_anchor3.show();
					fishes_anchor4.show();
					layer.draw();
				});
				fishesGroup.on('mouseout', function () {
					document.body.style.cursor = 'default';
					fishes_anchor1.hide();
					fishes_anchor2.hide();
					fishes_anchor3.hide();
					fishes_anchor4.hide();
					layer.draw();
				});
				fishesGroup.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				});

				var tooltip = new Konva.Label({
					x: 170,
					y: 75,
					opacity: 0.75
				});

				tooltip.add(new Konva.Tag({
					fill: 'black',
					pointerDirection: 'down',
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: 'round',
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffset: 10,
					shadowOpacity: 0.5
				}));
				var tooltip_text = new Konva.Text({
					text: 'faheem',
					fontFamily: 'Calibri',
					fontSize: 18,
					padding: 5,
					fill: 'white'
				});

				tooltip.add(tooltip_text);


				fishesGroup.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(values['biomass'] + ' KG Biomass Of ' + values['fish_type']);
					layer.add(tooltip);
					layer.draw();
				});

				fishesGroup.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});

				var fishesimageObj = new Image();
				fishesimageObj.onload = function () {
					fishesimg.image(fishesimageObj);
					layer.draw();
				};
				fishesimageObj.src = '/images/fishes.png';
				save_design();
		}
	});
}
// Add Plants
function add_plants() {
	var values = {};
	$.each($('#data_form_plants').serializeArray(), function (i, field) {
		if(field.name!='growing_area'){
			values[field.name] = field.value;
		}
		else{
			values[field.name] = $('#growing_area option:selected').text();
			values['growing_area_type'] = field.value;
		}
	});

	$.ajax({
		url: "/plant_management/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_plants').modal('hide');
			$('.modal-backdrop').remove();

				var object_width = 100;
				var object_heigth = 30;
				if(values['growing_area_type']=='NFT'){
					var plantsimg = new Konva.Image({
						width: object_width,
						height: object_heigth,
						src: '/images/plants_nft.png'
					});
				}
				else{
					var object_width = 100;
					var object_heigth = 100;
					var plantsimg = new Konva.Image({
						width: object_width,
						height: object_heigth,
						src: '/images/plants.png'
					});
				}
				

				var plantsGroup = new Konva.Group({
					x: 30,
					y: 30,
					draggable: true,
					title: 'plant_management',
					_id: dataofconfirm,
					tooltip: values['count'] + ' Heads of ' + values['plant_type']
				});
				layer.add(plantsGroup);
				plantsGroup.add(plantsimg);
				var plants_anchor1 = addAnchor(plantsGroup, 0, 0, 'topLeft');
				var plants_anchor2 = addAnchor(plantsGroup, object_width, 0, 'topRight');
				var plants_anchor3 = addAnchor(plantsGroup, object_width, object_heigth, 'bottomRight');
				var plants_anchor4 = addAnchor(plantsGroup, 0, object_heigth, 'bottomLeft');

				plantsGroup.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					plants_anchor1.show();
					plants_anchor2.show();
					plants_anchor3.show();
					plants_anchor4.show();
					layer.draw();
				});
				plantsGroup.on('mouseout', function () {
					document.body.style.cursor = 'default';
					plants_anchor1.hide();
					plants_anchor2.hide();
					plants_anchor3.hide();
					plants_anchor4.hide();
					layer.draw();
				});
				plantsGroup.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				});


				var tooltip = new Konva.Label({
					x: 170,
					y: 75,
					opacity: 0.75
				});

				tooltip.add(new Konva.Tag({
					fill: 'black',
					pointerDirection: 'down',
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: 'round',
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffset: 10,
					shadowOpacity: 0.5
				}));
				var tooltip_text = new Konva.Text({
					text: 'faheem',
					fontFamily: 'Calibri',
					fontSize: 18,
					padding: 5,
					fill: 'white'
				});

				tooltip.add(tooltip_text);


				plantsGroup.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(values['count'] + ' Heads of ' + values['plant_type']);
					layer.add(tooltip);
					layer.draw();
				});

				plantsGroup.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});

				var plantsimageObj = new Image();
				plantsimageObj.onload = function () {
					plantsimg.image(plantsimageObj);
					layer.draw();
				};
				if(values['growing_area_type']=='NFT'){
					plantsimageObj.src = '/images/plants_nft.png';
				}
				else{
					plantsimageObj.src = '/images/plants.png';
				}
				save_design();
		}
	});
}
// Add Aquarium
function add_aquarium() {
	var values = {};
	$.each($('#aquarium_data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/system_components/aquarium/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_aquarium').modal('hide');
			$('.modal-backdrop').remove();

				object_width = values['length'] * 19;
				object_heigth = values['width'] * 19;

				var aquariumImg2 = new Konva.Image({
					width: object_width,
					height: object_heigth,
					src: '/images/aquarium.jpg',
					shadowOffset: { x: 6, y: 6 },
					shadowOpacity: 0.3,
					shadowBlur: 9
					// ,
					// rotation:15
				});
				var aquariumGroup = new Konva.Group({
					x: 30,
					y: 30,
					draggable: true,
					title: 'system_components/aquarium',
					_id: dataofconfirm,
					tooltip: values['name']
				});
				layer.add(aquariumGroup);
				aquariumGroup.add(aquariumImg2);
				var aquarium_anchor1 = addAnchor(aquariumGroup, 0, 0, 'topLeft');
				var aquarium_anchor2 = addAnchor(aquariumGroup, object_width, 0, 'topRight');
				var aquarium_anchor3 = addAnchor(aquariumGroup, object_width, object_heigth, 'bottomRight');
				var aquarium_anchor4 = addAnchor(aquariumGroup, 0, object_heigth, 'bottomLeft');

				aquariumGroup.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					aquarium_anchor1.show();
					aquarium_anchor2.show();
					aquarium_anchor3.show();
					aquarium_anchor4.show();
					layer.draw();
				});
				aquariumGroup.on('mouseout', function () {
					document.body.style.cursor = 'default';
					aquarium_anchor1.hide();
					aquarium_anchor2.hide();
					aquarium_anchor3.hide();
					aquarium_anchor4.hide();
					layer.draw();
				});

				aquariumGroup.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				});
				var tooltip = new Konva.Label({
					x: 170,
					y: 75,
					opacity: 0.75
				});

				tooltip.add(new Konva.Tag({
					fill: 'black',
					pointerDirection: 'down',
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: 'round',
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffset: 10,
					shadowOpacity: 0.5
				}));
				var tooltip_text = new Konva.Text({
					text: 'faheem',
					fontFamily: 'Calibri',
					fontSize: 18,
					padding: 5,
					fill: 'white'
				});

				tooltip.add(tooltip_text);


				aquariumGroup.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(values['name']);
					layer.add(tooltip);
					layer.draw();
				});

				aquariumGroup.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});

				var imageObj3 = new Image();
				imageObj3.onload = function () {
					aquariumImg2.image(imageObj3);
					layer.draw();
				};
				imageObj3.src = '/images/aquarium.jpg';
				save_design();
		}
	});
}
// Add Sump
function add_sump() {
	var values = {};
	$.each($('#sump_data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/system_components/sump/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_sump').modal('hide');
			$('.modal-backdrop').remove();

				var object_width = values['length'] * 19;
				var object_heigth = values['width'] * 19;

				var sumpImg = new Konva.Image({
					width: object_width,
					height: object_heigth,
					src: '/images/sump.png',
					shadowOffset: { x: 6, y: 6 },
					shadowOpacity: 0.3,
					shadowBlur: 9
				});

				var sumpGroup = new Konva.Group({
					x: 30,
					y: 30,
					draggable: true,
					title: 'system_components/sump',
					_id: dataofconfirm,
					tooltip: values['name']
				});
				layer.add(sumpGroup);
				sumpGroup.add(sumpImg);
				var sump_anchor1 = addAnchor(sumpGroup, 0, 0, 'topLeft');
				var sump_anchor2 = addAnchor(sumpGroup, object_width, 0, 'topRight');
				var sump_anchor3 = addAnchor(sumpGroup, object_width, object_heigth, 'bottomRight');
				var sump_anchor4 = addAnchor(sumpGroup, 0, object_heigth, 'bottomLeft');

				sumpGroup.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					sump_anchor1.show();
					sump_anchor2.show();
					sump_anchor3.show();
					sump_anchor4.show();
					layer.draw();
				});
				sumpGroup.on('mouseout', function () {
					document.body.style.cursor = 'default';
					sump_anchor1.hide();
					sump_anchor2.hide();
					sump_anchor3.hide();
					sump_anchor4.hide();
					layer.draw();
				});

				sumpGroup.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				});
				var tooltip = new Konva.Label({
					x: 170,
					y: 75,
					opacity: 0.75
				});

				tooltip.add(new Konva.Tag({
					fill: 'black',
					pointerDirection: 'down',
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: 'round',
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffset: 10,
					shadowOpacity: 0.5
				}));

				var tooltip_text = new Konva.Text({
					text: 'faheem',
					fontFamily: 'Calibri',
					fontSize: 18,
					padding: 5,
					fill: 'white'
				});

				tooltip.add(tooltip_text);


				sumpGroup.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(values['name']);
					layer.add(tooltip);
					layer.draw();
				});

				sumpGroup.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});

				var imageObj4 = new Image();
				imageObj4.onload = function () {
					sumpImg.image(imageObj4);
					layer.draw();
				};
				imageObj4.src = '/images/sump.png';
				save_design();
		}
	});
}
// Add Water Pump
function add_water_pump() {
	var values = {};
	$.each($('#water_pump_data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/system_controls/water_pump/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_water_pump').modal('hide');
			$('.modal-backdrop').remove();

				var motorimg = new Konva.Image({
					width: 100,
					height: 100,
					src: '/images/motor.png'
				});

				var motorGroup = new Konva.Group({
					x: 30,
					y: 30,
					draggable: true,
					title: 'system_controls/water_pump',
					_id: dataofconfirm,
					tooltip: values['name']
				});
				layer.add(motorGroup);
				motorGroup.add(motorimg);
				var motor_anchor1 = addAnchor(motorGroup, 0, 0, 'topLeft');
				var motor_anchor2 = addAnchor(motorGroup, 100, 0, 'topRight');
				var motor_anchor3 = addAnchor(motorGroup, 100, 100, 'bottomRight');
				var motor_anchor4 = addAnchor(motorGroup, 0, 100, 'bottomLeft');

				motorGroup.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					motor_anchor1.show();
					motor_anchor2.show();
					motor_anchor3.show();
					motor_anchor4.show();
					layer.draw();
				});
				motorGroup.on('mouseout', function () {
					document.body.style.cursor = 'default';
					motor_anchor1.hide();
					motor_anchor2.hide();
					motor_anchor3.hide();
					motor_anchor4.hide();
					layer.draw();
				});
				motorGroup.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				});

				var tooltip = new Konva.Label({
					x: 170,
					y: 75,
					opacity: 0.75
				});

				tooltip.add(new Konva.Tag({
					fill: 'black',
					pointerDirection: 'down',
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: 'round',
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffset: 10,
					shadowOpacity: 0.5
				}));

				var tooltip_text = new Konva.Text({
					text: 'faheem',
					fontFamily: 'Calibri',
					fontSize: 18,
					padding: 5,
					fill: 'white'
				});

				tooltip.add(tooltip_text);


				motorGroup.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(values['name']);
					layer.add(tooltip);
					layer.draw();
				});

				motorGroup.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});

				var motorimageObj = new Image();
				motorimageObj.onload = function () {
					motorimg.image(motorimageObj);
					layer.draw();
				};
				motorimageObj.src = '/images/motor.png';
				save_design();
		}
	});
}
// Add Air Pump
function add_air_pump() {
	var values = {};
	$.each($('#air_pump_data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/system_controls/air_pump/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_air_pump').modal('hide');
			$('.modal-backdrop').remove();

				var air_pumpimg = new Konva.Image({
					width: 50,
					height: 50,
					src: '/images/air_pump.png'
				});

				var air_pumpGroup = new Konva.Group({
					x: 30,
					y: 30,
					draggable: true,
					title: 'system_controls/air_pump',
					_id: dataofconfirm,
					tooltip: values['name']
				});
				layer.add(air_pumpGroup);
				air_pumpGroup.add(air_pumpimg);

				var air_pump_anchor1 = addAnchor(air_pumpGroup, 0, 0, 'topLeft');
				var air_pump_anchor2 = addAnchor(air_pumpGroup, 50, 0, 'topRight');
				var air_pump_anchor3 = addAnchor(air_pumpGroup, 50, 50, 'bottomRight');
				var air_pump_anchor4 = addAnchor(air_pumpGroup, 0, 50, 'bottomLeft');

				air_pumpGroup.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					air_pump_anchor1.show();
					air_pump_anchor2.show();
					air_pump_anchor3.show();
					air_pump_anchor4.show();
					layer.draw();
				});
				air_pumpGroup.on('mouseout', function () {
					document.body.style.cursor = 'default';
					air_pump_anchor1.hide();
					air_pump_anchor2.hide();
					air_pump_anchor3.hide();
					air_pump_anchor4.hide();
					layer.draw();
				});
				air_pumpGroup.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				});
				var tooltip = new Konva.Label({
					x: 170,
					y: 75,
					opacity: 0.75
				});

				tooltip.add(new Konva.Tag({
					fill: 'black',
					pointerDirection: 'down',
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: 'round',
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffset: 10,
					shadowOpacity: 0.5
				}));

				var tooltip_text = new Konva.Text({
					text: 'faheem',
					fontFamily: 'Calibri',
					fontSize: 18,
					padding: 5,
					fill: 'white'
				});

				tooltip.add(tooltip_text);


				air_pumpGroup.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(values['name']);
					layer.add(tooltip);
					layer.draw();
				});

				air_pumpGroup.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});
				var air_pumpimageObj = new Image();
				air_pumpimageObj.onload = function () {
					air_pumpimg.image(air_pumpimageObj);
					layer.draw();
				};
				air_pumpimageObj.src = '/images/air_pump.png';
				save_design();
		}
	});
}
// Add Mechanical Filter
function add_mechanical_filter() {
	var values = {};
	$.each($('#mechanical_filter_data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/system_components/mechanical_filters/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_mechanical_filter').modal('hide');
			$('.modal-backdrop').remove();

				var object_width = values['length'] * 19;
				var object_heigth = values['width'] * 19;

				var mechanicalfilterImg = new Konva.Image({
					width: object_width,
					height: object_heigth,
					src: '/images/mechanicalfilter.png',
					shadowOffset: { x: 6, y: 6 },
					shadowOpacity: 0.3,
					shadowBlur: 9
				});

				var mechanicalfilterGroup = new Konva.Group({
					x: 30,
					y: 30,
					draggable: true,
					title: 'system_components/mechanical_filters',
					_id: dataofconfirm,
					tooltip: values['name']
				});
				layer.add(mechanicalfilterGroup);
				mechanicalfilterGroup.add(mechanicalfilterImg);
				var mechanicalfilter_anchor1 = addAnchor(mechanicalfilterGroup, 0, 0, 'topLeft');
				var mechanicalfilter_anchor2 = addAnchor(mechanicalfilterGroup, object_width, 0, 'topRight');
				var mechanicalfilter_anchor3 = addAnchor(mechanicalfilterGroup, object_width, object_heigth, 'bottomRight');
				var mechanicalfilter_anchor4 = addAnchor(mechanicalfilterGroup, 0, object_heigth, 'bottomLeft');

				mechanicalfilterGroup.on('mouseover', function () {
					document.body.style.cursor = 'pointer';
					mechanicalfilter_anchor1.show();
					mechanicalfilter_anchor2.show();
					mechanicalfilter_anchor3.show();
					mechanicalfilter_anchor4.show();
					layer.draw();
				});
				mechanicalfilterGroup.on('mouseout', function () {
					document.body.style.cursor = 'default';
					mechanicalfilter_anchor1.hide();
					mechanicalfilter_anchor2.hide();
					mechanicalfilter_anchor3.hide();
					mechanicalfilter_anchor4.hide();
					layer.draw();
				});

				mechanicalfilterGroup.on('dblclick dbltap', function () {
					this.moveToTop();
					layer.draw();
				}); var tooltip = new Konva.Label({
					x: 170,
					y: 75,
					opacity: 0.75
				});

				tooltip.add(new Konva.Tag({
					fill: 'black',
					pointerDirection: 'down',
					pointerWidth: 10,
					pointerHeight: 10,
					lineJoin: 'round',
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffset: 10,
					shadowOpacity: 0.5
				}));
				var tooltip_text = new Konva.Text({
					text: 'faheem',
					fontFamily: 'Calibri',
					fontSize: 18,
					padding: 5,
					fill: 'white'
				});

				tooltip.add(tooltip_text);


				mechanicalfilterGroup.on('click', function () {
					var mousePos = stage.getPointerPosition();
					tooltip.position({
						x: mousePos.x,
						y: mousePos.y
					});
					tooltip_text.text(values['name']);
					layer.add(tooltip);
					layer.draw();
				});

				mechanicalfilterGroup.on('mouseout', function () {
					tooltip.remove();
					layer.draw();
				});

				var imageObj7 = new Image();
				imageObj7.onload = function () {
					mechanicalfilterImg.image(imageObj7);
					layer.draw();
				};
				imageObj7.src = '/images/mechanicalfilter.png';
				save_design();
		}
	});
}
// Add Bio Filter
function add_bio_filter() {
	var values = {};
	$.each($('#bio_filter_data_form').serializeArray(), function (i, field) {
		values[field.name] = field.value;
	});

	$.ajax({
		url: "/system_components/bio_filters/add",
		data: JSON.stringify(values),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'POST',
		success: function (dataofconfirm) {
			$('#m_modal_bio_filter').modal('hide');
			$('.modal-backdrop').remove();

			var object_width = values['length'] * 19;
			var object_heigth = values['width'] * 19;

			var biofilterImg = new Konva.Image({
				width: object_width,
				height: object_heigth,
				src: '/images/biofilter.png',
				shadowOffset: { x: 6, y: 6 },
				shadowOpacity: 0.3,
				shadowBlur: 9
			});

			var biofilterGroup = new Konva.Group({
				x: 30,
				y: 30,
				draggable: true,
				title: 'system_components/bio_filters',
				_id: dataofconfirm,
				tooltip: values['name']
			});
			layer.add(biofilterGroup);
			biofilterGroup.add(biofilterImg);
			var biofilter_anchor1 = addAnchor(biofilterGroup, 0, 0, 'topLeft');
			var biofilter_anchor2 = addAnchor(biofilterGroup, object_width, 0, 'topRight');
			var biofilter_anchor3 = addAnchor(biofilterGroup, object_width, object_heigth, 'bottomRight');
			var biofilter_anchor4 = addAnchor(biofilterGroup, 0, object_heigth, 'bottomLeft');

			biofilterGroup.on('mouseover', function () {
				document.body.style.cursor = 'pointer';
				biofilter_anchor1.show();
				biofilter_anchor2.show();
				biofilter_anchor3.show();
				biofilter_anchor4.show();
				layer.draw();
			});
			biofilterGroup.on('mouseout', function () {
				document.body.style.cursor = 'default';
				biofilter_anchor1.hide();
				biofilter_anchor2.hide();
				biofilter_anchor3.hide();
				biofilter_anchor4.hide();
				layer.draw();
			});

			biofilterGroup.on('dblclick dbltap', function () {
				this.moveToTop();
				layer.draw();
			});
			var tooltip = new Konva.Label({
				x: 170,
				y: 75,
				opacity: 0.75
			});

			tooltip.add(new Konva.Tag({
				fill: 'black',
				pointerDirection: 'down',
				pointerWidth: 10,
				pointerHeight: 10,
				lineJoin: 'round',
				shadowColor: 'black',
				shadowBlur: 10,
				shadowOffset: 10,
				shadowOpacity: 0.5
			}));

			var tooltip_text = new Konva.Text({
				text: 'faheem',
				fontFamily: 'Calibri',
				fontSize: 18,
				padding: 5,
				fill: 'white'
			});

			tooltip.add(tooltip_text);


			biofilterGroup.on('click', function () {
				var mousePos = stage.getPointerPosition();
				tooltip.position({
					x: mousePos.x,
					y: mousePos.y
				});
				tooltip_text.text(values['name']);
				layer.add(tooltip);
				layer.draw();
			});

			biofilterGroup.on('mouseout', function () {
				tooltip.remove();
				layer.draw();
			});
			var imageObj6 = new Image();
			imageObj6.onload = function () {
				biofilterImg.image(imageObj6);
				layer.draw();
			};
			imageObj6.src = '/images/biofilter.png';
			save_design();
		}
	});
}
// Add Sensor Mesh
function add_sensor_mesh() {
	var values = {};
	//values['sensors'] = [];
	$.each($('#sensor_mesh_data_form').serializeArray(), function (i, field) {
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
			$('#m_modal_sensor_mesh').modal('hide');
			$('.modal-backdrop').remove();

			var object_width = 40;
			var object_heigth = 60;

			var sensor_meshImg = new Konva.Image({
				width: object_width,
				height: object_heigth,
				src: '/images/sensor_mesh2.png',
				shadowOffset: { x: 6, y: 6 },
				shadowOpacity: 0.3,
				shadowBlur: 9
			});

			var sensor_meshGroup = new Konva.Group({
				x: 30,
				y: 30,
				draggable: true,
				title: 'sensors/sensor_mesh',
				_id: dataofconfirm,
				tooltip: 'Node '+values['node_id']+' ('+values['sensors']+')'
			});
			layer.add(sensor_meshGroup);
			sensor_meshGroup.add(sensor_meshImg);
			var sensor_mesh_anchor1 = addAnchor(sensor_meshGroup, 0, 0, 'topLeft');
			var sensor_mesh_anchor2 = addAnchor(sensor_meshGroup, object_width, 0, 'topRight');
			var sensor_mesh_anchor3 = addAnchor(sensor_meshGroup, object_width, object_heigth, 'bottomRight');
			var sensor_mesh_anchor4 = addAnchor(sensor_meshGroup, 0, object_heigth, 'bottomLeft');

			sensor_meshGroup.on('mouseover', function () {
				document.body.style.cursor = 'pointer';
				sensor_mesh_anchor1.show();
				sensor_mesh_anchor2.show();
				sensor_mesh_anchor3.show();
				sensor_mesh_anchor4.show();
				layer.draw();
			});
			sensor_meshGroup.on('mouseout', function () {
				document.body.style.cursor = 'default';
				sensor_mesh_anchor1.hide();
				sensor_mesh_anchor2.hide();
				sensor_mesh_anchor3.hide();
				sensor_mesh_anchor4.hide();
				layer.draw();
			});

			sensor_meshGroup.on('dblclick dbltap', function () {
				this.moveToTop();
				layer.draw();
			});
			var tooltip = new Konva.Label({
				x: 170,
				y: 75,
				opacity: 0.75
			});

			tooltip.add(new Konva.Tag({
				fill: 'black',
				pointerDirection: 'down',
				pointerWidth: 10,
				pointerHeight: 10,
				lineJoin: 'round',
				shadowColor: 'black',
				shadowBlur: 10,
				shadowOffset: 10,
				shadowOpacity: 0.5
			}));

			var tooltip_text = new Konva.Text({
				text: 'faheem',
				fontFamily: 'Calibri',
				fontSize: 18,
				padding: 5,
				fill: 'white'
			});

			tooltip.add(tooltip_text);


			sensor_meshGroup.on('click', function () {

				var mousePos = stage.getPointerPosition();
				tooltip.position({
					x: mousePos.x,
					y: mousePos.y
				});
				tooltip_text.text('Node '+values['node_id']+' ('+values['sensors']+')');
				layer.add(tooltip);
				layer.draw();
			});

			sensor_meshGroup.on('mouseout', function () {
				tooltip.remove();
				layer.draw();
			});
			var imageObj6 = new Image();
			imageObj6.onload = function () {
				sensor_meshImg.image(imageObj6);
				layer.draw();
			};
			imageObj6.src = '/images/sensor_mesh2.png';
			save_design();
		}
	});
}
// Delete component from db
function delete_component_from_db(collection, row_id, group, layer) {

	$.ajax({
		url: "/"+collection + "/delete",
		data: JSON.stringify({ row_id: row_id }),
		cache: false,
		processData: false,
		contentType: 'application/json',
		type: 'DELETE',
		success: function (dataofconfirm) {
			group.remove();
			layer.draw();
			save_design();
		}
	});
}

$('#grow_area').keyup(function() {
	area = $('#grow_area').val();
	var width = area/6;
	var length = 6;
	$('#grow_unit_width').val(width);
	$('#grow_unit_length').val(length);
 });

 $('#grow_unit_width').keyup(function() { 
	var width = $('#grow_unit_width').val();
	if($('#grow_unit_length').val()==''){
		var length = width;
		$('#grow_unit_length').val(length);
	}else{
		var length = $('#grow_unit_length').val();
	}
	var area = width*length;
	$('#grow_area').val(area);
 });
 $('#grow_unit_length').keyup(function() { 
	var length = $('#grow_unit_length').val();
	if($('#grow_unit_width').val()==''){
		var width = length;
		$('#grow_unit_width').val(width);
	}else{
		var width = $('#grow_unit_width').val();
	}
	var area = width*length;
	$('#grow_area').val(area);
 });


//======================= Transformer ======================//
// var tr = new Konva.Transformer({
// 	anchorStroke: 'gray',
// 	anchorFill: 'gray',
// 	anchorSize: 10,
// 	rotateAnchorOffset: 20,
// 	borderEnabled: false,
// 	borderStroke: 'green',
// 	enabledAnchors: ['top-right', 'bottom-left', 'bottom-right'],
// 	borderDash: [3, 3]
//   });
// layer.add(tr);
// tr.attachTo(aquariumGroup);
// layer.draw();

// var aquarium_anchor1 = addAnchor(aquariumGroup, 0, 0, 'topLeft');

// aquariumGroup.on('click', function () {
// 	document.body.style.cursor = 'pointer';
// 	tr.show();
// 	aquarium_anchor1.show();
// 	layer.draw();
// });
// aquariumGroup.on('dblclick dbltap', function () {
// 	document.body.style.cursor = 'default';
// 	tr.hide();
// 	aquarium_anchor1.hide();
// 	layer.draw();
// });