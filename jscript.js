// JavaScript file

var update_shape_menu = function(curr) {
					$('#x_pos').val(Math.floor(curr.position().left))
					$('#y_pos').val(Math.floor(curr.position().top))
					$('#shape_width').val(Math.floor(curr.width()))
					$('#shape_height').val(Math.floor(curr.height()))
				}
				
var update_udef_menu = function(curr) {
					$(".udef_property").each(
						function() {
							$(this).val(curr.data($(this).attr("id")));
						}
					);
				}

var reset_udef_menu = function() {
					$(".udef_property").val("");
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
					max_window_width += $(this).width();
				}
			);
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
				loadImage(
					$("#dropdown").val(),
					function (img) {
						if ($("#viewing_window img")) {
							$("#viewing_window img").remove();
						}
						$(img).css("border", "1px solid black");
						$(".remove_image").css('visibility', 'visible');
						$("#viewing_window").droppable("enable");
						$("#viewing_window").width(img.width);
						$("#viewing_window").height(img.height);
						$("#viewing_window").prepend(img);
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
			$(".udef_property").val(null);
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
				},
				{maxWidth: max_window_width,
				 maxHeight: 
					Math.max($(window).height() - ($("#page_title").outerHeight(true) + $("#toolbar").outerHeight(true) + img_view_offset), 0)
				}
			);
		}
	);	
	
	/*
		Initiate Dialog windows
	*/
	
	// Shape properties dialog
	$("#udef_prop_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Ok": function() {
				if ($("#new_udef_prop").val().length == 0) {
					$(this).dialog("close"); // don't add property with blank name
					return;
				}
			
				var $prop_label = $("<label/>").attr("for", "name").text($("#new_udef_prop").val());
				var $prop_input = $("<input/>").addClass('input_form')
				$prop_input.attr("id", $("#new_udef_prop").val()).addClass("udef_property").attr("type", "text").val("");
				$prop_input.addClass("text ui-widget-content ui-corner-all");
				
				var $delete = $("<i/>").addClass("fa fa-minus-square fa-lg").css("float", "right");
				var $new_line = $("<br/>");
				
				$delete.on("click",
					function() {
						// remove this data from all shapes
						$(".shape").removeData($prop_input.attr("id"));
						$prop_label.remove();
						$prop_input.remove();
						
						$new_line.remove();
						$(this).remove();
					}
				);
				
				$("#user_defined_properties fieldset").append($prop_label);
				$("#user_defined_properties fieldset").append($delete);
				$("#user_defined_properties fieldset").append($prop_input);
				$("#user_defined_properties fieldset").append($new_line);
				$("#new_udef_prop").val(null)
				$(this).dialog("close");
			},
			"Cancel": function() {
				$("#new_udef_prop").val(null)
				$(this).dialog("close");
			}
		}
	});
	
	$("#add_udef_property").on('click', 
		function() {
			$("#udef_prop_dialog").dialog("open");
		}
	);
	
	$("#update_udef_prop").click(
		function() {
			$(".udef_property").each(
				function(index, element) {
					// add all of the current property/value pairs to the selected_shape shape
					$(".selected_shape").data($(this).attr("id"), $(this).val());
				}
			);
	});
	
	// JSON properties dialog
	$("#json_prop_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Ok": function() {
				if ($("#new_json_prop").val().length == 0) {
					$(this).dialog("close"); // don't add property with blank name
					return;
				}
			
				var $prop_label = $("<label/>").attr("for", "name").text($("#new_json_prop").val());
				var $prop_input = $("<input/>").addClass('input_form')
				$prop_input.attr("id", $("#new_json_prop").val()).addClass("json_property").attr("type", "text").val("");
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
				$("#new_json_prop").val(null)
				$(this).dialog("close");
			},
			"Cancel": function() {
				$("#new_json_prop").val(null)
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
			
			json_output += "\t\"fields\": ";
			
			var shape_array = [];
			
			/* create an array of records for the shape and udef properties for each shape */
			$(".shape").each(
				function(index) {
					var curr_tuple = [];
					var udef_data = $(this).data()
					
					/* iterate over all user defined properties */
					for (ele in udef_data) {
						if (ele != 'uiDraggable' &&  ele != 'uiResizable') {
							curr_tuple.push("\"" + ele + "\":\"" + udef_data[ele] + "\"");
						}
					}
					
					/* add all shape properties to the tuple, NOTE: hard-coded values! */
					curr_tuple.push("\"x\":\"" + $(this).position().left + "\"");
					curr_tuple.push("\"y\":\"" + $(this).position().top + "\"");
					curr_tuple.push("\"width\":\"" + $(this).width() + "\"");
					curr_tuple.push("\"height\":\"" + $(this).height() + "\"");
					
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
			
			if (ui.draggable.attr("id") == "make_box") {
				$new_shape = $("<div/>").attr("id", "box" + curr).addClass("selected_shape").addClass("square_item").addClass("shape");
			} else {
				$new_shape = $("<div/>").attr("id", "circle" + curr).addClass("selected_shape").addClass("circle_item").addClass("shape");
			} 
			
			$(".selected_shape").removeClass("selected_shape");
			$new_shape.draggable({helper: "invalid", containment: "parent", position: "absolute"})
					.resizable({containment: "parent", position: "absolute", handles: "all"});
					
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
				}
			);

			$new_shape.on("dblclick",
				function() {
					$(this).remove();
					$(".shape_property").val(null);
					$(".udef_property").val(null);
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