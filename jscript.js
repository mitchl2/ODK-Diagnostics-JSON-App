// JavaScript file

var update_shape_menu = function(curr) {
					$('#x_pos').val(Math.floor(curr.position().left + (curr.width() / 2.0)))
					$('#y_pos').val(Math.floor(curr.position().top + (curr.height() / 2.0)))
					$('#shape_width').val(Math.floor(curr.width()))
					$('#shape_height').val(Math.floor(curr.height()))
				}
				
var update_udef_menu = function(curr) {
					$(".field_property").each(
						function() {
							$(this).val(curr.data($(this).attr("id")));
						}
					);
				}

var reset_udef_menu = function() {
					$(".field_property").val("");
				}
				
var set_margin = function() {
				if ($("#viewing_window").children().length > 0) {
					var window_offset = Math.max((max_window_width - $("#viewing_window img").width()) / 2, 0);
					$("#viewing_window").css("margin-left", window_offset);
				}
			}
				
var curr = 0; // current shape number
var max_window_width = 0; // used to set a max size on the viewing window
var img_view_offset = 15; // adds margin to the bottom of the viewing window and bottom of the screen
$(function() { 
	/* Sets all element in the toolbar menu to have the same height.
	   The code is from this StackOverflow post:
	   http://stackoverflow.com/questions/12330786/is-there-a-way-to-make-all-elements-in-a-row-class-the-same-height
	*/
	
	var boxes = $('.main_row');
	maxHeight = Math.max.apply(
	  Math, boxes.map(function() {
		return $(this).height();
	}).get());
	boxes.height(maxHeight);
	
	/* 
		Setup toolbar menu and properties menu
		
	*/
	
	// hacky way to invoke the file browse button
	// when the picture icon is selected
	$("#image_select").click(
		function() {
			$("#file_browse").click()
		}
	);
	
	$(window).resize(
		/* change maximum viewing_window size on the event
		of the window resizing - the selected image
		will be resized accordingly to fit the
		maximum width here */
		function() {
			max_window_width = 0;
			$(".main_row").each(
				function() {
					max_window_width += $(this).outerWidth();
				}
			);
			set_margin();
		}
	);
	$(window).resize()
	
	// dropdown selection for sample test images
	$("#dropdown").change(
		function(e) {
			if ($("#dropdown").val() == "none") {			
				if ($("#viewing_window img")) {
					$("#viewing_window img").remove();
					$("#viewing_window .shape").remove();
					$(".remove_image").css('visibility', 'hidden');
					$("#viewing_window").droppable("disable");
				}
			} else {
				var load = loadImage(
					$("#dropdown").val(),
					function (img) {
						if ($("#viewing_window img")) {
							$("#viewing_window img").remove();
							$("#viewing_window .shape").remove();
						}
						$(img).css("border", "1px solid black");
						$(".remove_image").css('visibility', 'visible');
						$("#viewing_window").droppable("enable");
						$("#viewing_window").width(img.width);
						$("#viewing_window").height(img.height);
						$("#viewing_window").prepend(img);
						set_margin();
					},
					{maxWidth: max_window_width,
					 maxHeight: 
						Math.max($(window).height() - ($("#page_title").outerHeight(true) + $("#toolbar").outerHeight(true) + img_view_offset), 0)
					}
				);
			}
		}
	);

	// initially set remove_image icon to hidden
	$(".remove_image").css('visibility', 'hidden');
	$(".remove_image").on("click",
		function() {
			$("#viewing_window").droppable("disable");
			$("#viewing_window img").remove();
			$("#image_select").val(null);
			$(".remove_image").css('visibility', 'hidden');
			$(".shape").remove();
			$(".shape_property").val(null);
			$(".field_property").val(null);
			$(".json_property").val(null);	
		}
	);

	// set image_select icon callback
	$("#file_browse").on("change", 
		function (e) {
			console.log("button clicked");
			loadImage(
				e.target.files[0],
				function (img) {
					if ($("#viewing_window img")) {
						$("#viewing_window img").remove();
						$("#viewing_window .shape").remove();
					}
					$(img).css("border", "1px solid black");
					$(".remove_image").css('visibility', 'visible');
					$("#viewing_window").droppable("enable");
					$("#viewing_window").width(img.width);
					$("#viewing_window").height(img.height);
					$("#viewing_window").prepend(img);
					set_margin();
				},
				{maxWidth: max_window_width,
				 maxHeight: 
					Math.max($(window).height() - ($("#page_title").outerHeight(true) + $("#toolbar").outerHeight(true) + img_view_offset), 0)
				}
			);
		}
	);	
	
	$("#copy_shape").on("click",
		function() {
			var curr_position = $(".selected_shape").position();
			var offset = 12;
			var $orig_shape = $(".selected_shape");
			var lock_ratio = $(".selected_shape").hasClass("circle_item");
			/* don't want the cloned shape to inherit the original draggable/resiable event handlers */
			$orig_shape.draggable("destroy");
			$orig_shape.resizable("destroy");
			
			// clone will copy all of the data fields and event handlers from the original shape
			var $new_shape = $(".selected_shape").clone(true);

			$new_shape.attr("id", $(".selected_shape").attr("id") + "_copy");
			$new_shape.draggable({helper: "invalid", containment: "parent", position: "absolute"})
			.resizable({containment: "parent", position: "absolute", handles: "all", aspectRatio: lock_ratio});
			
			// add draggable and resizable classes back to the original shape
			$orig_shape.draggable({helper: "invalid", containment: "parent", position: "absolute"})
			.resizable({containment: "parent", position: "absolute", handles: "all", aspectRatio: lock_ratio});
			
			var offset = 12;
			var left_offset = 0;
			var top_offset = 0;
			
			// calculate position of copied shape - accounts for special cases
			if (curr_position.top + $(".selected_shape").height() + offset > $("#viewing_window").height()) {
				top_offset = -offset;
			} else {
				top_offset = offset;
			}
			
			if (curr_position.left + $(".selected_shape").width() + offset > $("#viewing_window").width()) {
				left_offset = -offset;
			} else {
				left_offset = offset;
			}
			
			$new_shape.css({left:curr_position.left + left_offset, top:curr_position.top + top_offset});
			$(".selected_shape").removeClass("selected_shape");
			
			$new_shape.addClass("selected_shape");
			$new_shape.appendTo("#viewing_window");
		}
	);
	
	// on-click handler for shape type drowndown menu, set's the dropdown
	// menu's text to the currently selected type
	$("#shape_type li a").on("click",
		function() {
			$("#shape_type_label").html($(this).text() +' <span class="caret"></span>');
		}
	);
	
	/*
		Initiate Dialog windows
	*/
	
	// Shape properties dialog
	$("#field_prop_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Ok": function() {
				if ($("#new_field_prop").val().length == 0) {
					$(this).dialog("close"); // don't add property with blank name
					return;
				}
				
				var $new_prop = $("<div/>").addClass("input-group input-group-sm");
				var $prop_label = $("<span/>").addClass("input-group-addon").text($("#new_field_prop").val());
				
				var $input = $("<input/>").attr("type", "text").attr("readonly", true);
				$input.addClass("field_property").addClass("form-control").val($("#new_field_prop_val").val()).attr("id", $("#new_field_prop").val());
				
				var $delete = $("<span/>").addClass("input-group-addon").append($("<i/>").addClass("fa fa-times-circle fa-sm"));
				
				var $edit = $("<span/>").addClass("input-group-addon").append($("<i/>").addClass("fa fa-pencil fa-sm"));
				$edit.on("click",
					function() {
						console.log("edit button clicked")
						$("#field_label").text($prop_label.text());
						console.log("input value is: " + $input.val());
						$("#curr_value").val($input.val());
						$("#update_field_dialog").dialog("open");
					}
				);
				
				$new_prop.append($prop_label).append($input).append($edit).append($delete);
				
				$("#user_defined_properties fieldset").append($new_prop);

				$delete.on("click",
					function() {
						// remove this data from all shapes
						$(".shape").removeData($prop_label.text());
						$new_prop.remove();
						$(this).remove();
					}
				);
				
				$("#new_field_prop").val(null);
				$("#new_field_prop_val").val(null);
				$(this).dialog("close");
			},
			"Cancel": function() {
				$("#new_field_prop").val(null)
				$(this).dialog("close");
			}
		}
	});
	
	$("#add_field_property").on('click', 
		function() {
			$("#field_prop_dialog").dialog("open");
		}
	);
	
	// Update field dialog
	$("#update_field_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Ok": function() {
				$("#" + $("#field_label").text()).val($("#curr_value").val());
				$(".selected_shape").data($("#field_label").text(), $("#curr_value").val());
				$(this).dialog("close");
			}
		}
	});
	
	// JSON properties dialog
	$("#json_prop_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Ok": function() {
				if ($("#new_global_prop").val().length == 0) {
					$(this).dialog("close"); // don't add property with blank name
					return;
				}
			
				var $prop_label = $("<label/>").attr("for", "name").text($("#new_global_prop").val());
				var $prop_input = $("<input/>").addClass('input_form')
				$prop_input.attr("id", $("#new_global_prop").val()).addClass("json_property").attr("type", "text").val("");
				$prop_input.addClass("text ui-widget-content ui-corner-all");
				
				var $delete = $("<i/>").addClass("fa fa-minus-square fa-lg").css("float", "right");
				var $new_line = $("<br/>");
				
				$delete.on("click",
					function() {
						$prop_label.remove();
						$prop_input.remove();
						$new_line.remove();
						$(this).remove();
					}
				);
				
				$("#json_properties fieldset").append($prop_label);
				$("#json_properties fieldset").append($delete);
				$("#json_properties fieldset").append($prop_input);
				$("#json_properties fieldset").append($new_line);
				$("#new_global_prop").val(null)
				$(this).dialog("close");
			},
			"Cancel": function() {
				$("#new_global_prop").val(null)
				$(this).dialog("close");
			}
		}
	});
	
	$("#add_json_property").on('click', 
		function() {
			$("#json_prop_dialog").dialog("open");
		}
	);
	
	// JSON output dialog
	$("#create_json_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Ok": function() {
				$(this).dialog("close");
			}
		}
	});
	
	// Help menu dialog
	$("#help_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Ok": function() {
				$(this).dialog("close");
			}
		}
	});
	
	$("#help_button").on('click', 
		function() {
			$("#help_dialog").dialog("open");
		}
	);
	
	/*
		JSON Output Generator
	*/
	
	$("#make_json").click(
		function() {
			var json_output = "{\n";
			
			/* add all JSON file properties to the output */
			$(".json_property").each(
				function(index) {
					json_output += "\t\"" + $(this).attr("id") + "\":\"" + $(this).val() + "\",\n";
				}
			);
			
			/* add image height and width to JSON */
			json_output += "\t\"width\":" + "\"" + $("#viewing_window img").width() + "\",\n";
			json_output += "\t\"height\":" + "\"" + $("#viewing_window img").height() + "\",\n";
			
			json_output += "\t\"fields\": ";
			
			var shape_array = [];
			
			/* create an array of records for the shape and udef properties for each shape */
			$(".shape").each(
				function(index) {
					var curr_tuple = [];
					var udef_data = $(this).data()
					
					// determine shape type, NOTE: assumes shape type is either a square or circle
					var shape_type = $(this).hasClass("square_item") ? "square" : "circle";
					curr_tuple.push("\"shape_type\":\"" + shape_type + "\"");
					
					/* iterate over all user defined properties */
					for (ele in udef_data) {
						if (ele != 'uiDraggable' &&  ele != 'uiResizable') {
							curr_tuple.push("\"" + ele + "\":\"" + udef_data[ele] + "\"");
						}
					}
					
					/* add all shape properties to the tuple, NOTE: rounding all values down*/
					curr_tuple.push("\"x\":\"" + Math.floor($(this).position().left + ($(this).width() / 2.0)) + "\"");
					curr_tuple.push("\"y\":\"" + Math.floor($(this).position().top + ($(this).height() / 2.0)) + "\"");
					
					/* NOTE: assumes that shape is either a square or circle */
					if ($(this).hasClass("square_item")) {
						curr_tuple.push("\"width\":\"" + Math.floor($(this).width()) + "\"");
						curr_tuple.push("\"height\":\"" + Math.floor($(this).height()) + "\"");
					} else {
						curr_tuple.push("\"radius\":\"" + Math.floor($(this).width() / 2.0) + "\"");
					}
					
					shape_array.push("{" + curr_tuple + "}");
				}
			);
			
			json_output += "[";
			for (var i = 0; i < shape_array.length; i++) {
				json_output += shape_array[i];
				if (i != shape_array.length - 1) {
					json_output += ",\n\t\t";
				}
			}
			json_output += "]";
			
			json_output += "\n}";
			$("#json_text").val(json_output);
			$("#create_json_dialog").dialog("open");
		}
	);

	/*
		Initialize draggables and droppables
	*/
	
	$(".menu_shape").draggable({position: "relative", revert: true, stack: "#viewing_window"});
	$("#viewing_window").droppable({accept: ".menu_shape", tolerance: "fit"});
	
	$("#viewing_window").on("drop", 
		function(event, ui) {
			var $new_shape;
			$(".selected_shape").removeClass("selected_shape");
			
			if (ui.draggable.attr("id") == "make_box") {
				$new_shape = $("<div/>").attr("id", "box" + curr).addClass("selected_shape").addClass("square_item").addClass("shape");
			} else {
				$new_shape = $("<div/>").attr("id", "circle" + curr).addClass("selected_shape").addClass("circle_item").addClass("shape");
			} 
			
			var lock_ratio = $new_shape.hasClass("circle_item");
			$new_shape.draggable({helper: "invalid", containment: "parent", position: "absolute"})
					.resizable({containment: "parent", position: "absolute", handles: "all", aspectRatio: lock_ratio});
					
			$new_shape.css({top: ui.draggable.offset().top - $("#viewing_window").offset().top,
							left: ui.draggable.offset().left - $("#viewing_window").offset().left});
			
			/* set shape callback functions */
			$new_shape.on("click",
				function(event, ui) {
					$(".selected_shape").removeClass("selected_shape");
					$(this).addClass("selected_shape");
					update_shape_menu($(this));
					update_udef_menu($(this));
				}
			);
			
			$new_shape.on("drag",
				function() {
					$(".selected_shape").removeClass("selected_shape");
					$(this).addClass("selected_shape");
					update_shape_menu($(this));
				}
			);
			
			$new_shape.on("resize",
				function() {
					$(".selected_shape").removeClass("selected_shape");
					$(this).addClass("selected_shape");
					update_shape_menu($(this));
					console.log("shape being resized!");
				}
			);

			$new_shape.on("dblclick",
				function() {
					$(this).remove();
					$(".shape_property").val(null);
					$(".field_property").val(null);
				}
			);
			
			$new_shape.appendTo("#viewing_window");
			
			// update menu information for this shape
			update_shape_menu($new_shape);
			reset_udef_menu();
			curr += 1;
		}
	);
});