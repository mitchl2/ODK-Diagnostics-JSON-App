// JavaScript file

var update_shape_menu = function(curr) {
					var x_pos = Math.floor(curr.position().left + (curr.width() / 2.0));
					$("#x_pos").val(x_pos).data("val", x_pos);
					
					var y_pos = Math.floor(curr.position().top + (curr.height() / 2.0));
					$("#y_pos").val(y_pos).data("val", y_pos);

					$("#shape_width").val(Math.floor(curr.width()));
					$("#shape_height").val(Math.floor(curr.height()));
				}
				
var update_field_menu = function(curr) {
					console.log(curr.data());
					// check if the current shape has a name
					if ("Name" in curr.data()) {
						$("#Name").val(curr.data("Name"));
					} else {
						// shape doesn't currently have a name
						$("#Name").val(""); 
					}
					
					// check if the current shape has a type
					if ("shape_type" in curr.data()) {
						$("#shape_type_label").html(curr.data("shape_type") +' <span class="caret"></span>');
					} else {
						// shape doesn't currently have a type
						$("#shape_type_label").html("Type" +' <span class="caret"></span>');
					}
					
					// update all field properties with the 
					// respective values for the current shape
					$(".field_property").each(
						function() {
							$(this).val(curr.data($(this).data("label")));
						}
					);
				}

var reset_field_menu = function() {
					$(".field_property").val("");
					$("#shape_type_label").html("Type" +' <span class="caret"></span>');
					$("#Name").val("");
				}
				
var set_margin = function() {
				if ($("#viewing_window").children().length > 0) {
					var window_offset = Math.max((max_window_width - $("#viewing_window img").width()) / 2, 0);
					$("#viewing_window").css("margin-left", window_offset);
				}
			}

var make_global = function(g_name, g_val) {
				var $new_prop = $("<div/>").addClass("input-group input-group-sm");		
				var $prop_label = $("<span/>").addClass("input-group-addon").text(g_prop);
				var $input = $("<input/>").attr("type", "text").attr("readonly", true);
				$input.addClass("global_property").addClass("form-control").val(g_val);
				$input.data("label", g_prop);
				
				var $delete = $("<span/>").addClass("input-group-addon").append($("<i/>").addClass("fa fa-times-circle fa-sm"));
				
				var $edit = $("<span/>").addClass("input-group-addon").append($("<i/>").addClass("fa fa-pencil fa-sm"));
				$edit.on("click",
					function() {
						console.log("edit: " + $prop_label.text());
						$input.addClass("selected_global");
						$("#global_label").text($prop_label.text());
						$("#new_global_val").val($input.val());
						$("#update_global_dialog").dialog("open");
					}
				);
				
				$new_prop.append($prop_label).append($input).append($edit).append($delete);
				
				$("#global_properties fieldset").append($new_prop);

				$delete.on("click",
					function() {
						$new_prop.remove();
						$(this).remove();
					}
				);				
			}
	
var make_field = function(f_prop) {
				var $new_prop = $("<div/>").addClass("input-group input-group-sm");		
				var $prop_label = $("<span/>").addClass("input-group-addon").text(f_prop);
				var $input = $("<input/>").attr("type", "text").attr("readonly", true);
				$input.addClass("field_property").addClass("form-control");
				$input.data("label", f_prop);
				
				var $delete = $("<span/>").addClass("input-group-addon").append($("<i/>").addClass("fa fa-times-circle fa-sm"));
				var $edit = $("<span/>").addClass("input-group-addon").append($("<i/>").addClass("fa fa-pencil fa-sm"));
				
				$edit.on("click",
					function() {
						$input.addClass("selected_global");
						$("#field_label").text($input.data("label"));
						$("#new_field_val").val($input.val());
						$("#update_field_dialog").dialog("open");
					}
				);
				
				$new_prop.append($prop_label).append($input).append($edit).append($delete);				
				$("#field_properties fieldset").append($new_prop);

				$delete.on("click",
					function() {
						$new_prop.remove();
						$(this).remove();
					}
				);				
			}
			
var make_shape = function(curr_shape, resize_ratio) {
			var $new_shape;
			
			if (curr_shape["shape"] == "square") {
				$new_shape = $("<div/>").addClass("square_item").addClass("shape");
			} else {
				$new_shape = $("<div/>").addClass("circle_item").addClass("shape");
			} 
			
			var lock_ratio = $new_shape.hasClass("circle_item");
			$new_shape.draggable({helper: "invalid", containment: "parent", position: "absolute"})
					.resizable({containment: "parent", position: "absolute", handles: "all", aspectRatio: lock_ratio});

			/* set shape callback functions */
			$new_shape.on("click",
				function(event, ui) {
					$(".selected_shape").removeClass("selected_shape");
					$(this).addClass("selected_shape");
					update_shape_menu($new_shape);
					update_field_menu($new_shape);
				}
			);
			
			$new_shape.on("drag",
				function() {
					$(".selected_shape").removeClass("selected_shape");
					$(this).addClass("selected_shape");
					update_shape_menu($new_shape);
				}
			);
			
			$new_shape.on("resize",
				function() {
					$(".selected_shape").removeClass("selected_shape");
					$(this).addClass("selected_shape");
					update_shape_menu($new_shape);
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
	
			if ($new_shape.hasClass("circle_item")) {
				$new_shape.width(curr_shape["radius"] * 2 * resize_ratio);
				$new_shape.height(curr_shape["radius"] * 2 * resize_ratio);
				
				$new_shape.css({top: (curr_shape["y"] - curr_shape["radius"]) * resize_ratio,
								left: (curr_shape["x"] - curr_shape["radius"]) * resize_ratio});
			} else {
				$new_shape.width(curr_shape["width"] * resize_ratio);
				$new_shape.height(curr_shape["height"] * resize_ratio);
				
				$new_shape.css({top: (curr_shape["y"] - (curr_shape["height"] / 2.0)) * resize_ratio,
								left: (curr_shape["x"] - (curr_shape["width"] / 2.0)) * resize_ratio});
			}	
			
			/* iterate over all user defined properties */
			for (ele in curr_shape) {
				if (ele != 'uiDraggable' &&  ele != 'uiResizable') {
					$new_shape.data(ele, curr_shape[ele]);
				}
			}
		}
			
var parse_input = function(js_text) {
			var shape_state = ["shape", "x", "y", "width", "height", "radius", "shape_type", "Name"];
			
			for (g_prop in js_text) {
				if (g_prop == "width" || g_prop == "height") {
					continue; // ASSUMES picture already loaded
				} else if(g_prop == "fields") {
					continue; // process all fields below
				} else if (g_prop == "field_labels") {
					var fields = js_text[g_prop];
					for (curr in fields) {
						var f_prop = fields[curr];
						if (shape_state.indexOf(f_prop) == -1) {
							make_field(f_prop);
						}
					}
				} else {
					make_global(g_prop, js_text[g_prop]);
				}
			}	
			var shapes = js_text["fields"];
			
			var resize_ratio = 1;
			if($("#viewing_window img").width() != js_text["width"] && !$("#orig_size_checkbox").prop("checked")) {
				resize_ratio = 1.0 * $("#viewing_window img").width() / js_text["width"];
			}

			for (index in shapes) {
				make_shape(shapes[index], resize_ratio);
			}
			
			$("#viewing_window img").data("orig_width", js_text["width"]);
			$("#viewing_window img").data("orig_height", js_text["height"]);
			
			if ($("#orig_size_checkbox").prop("checked")) {
				console.log("setting image to original size");
				$("#viewing_window img").width(js_text["width"]);
				$("#viewing_window img").height(js_text["height"]);
			}
		}

/* Creates a text file and downloads the file when the function is called.
NOTE: this code relies on an HTML5 compatible browser.
This function is from the following stackoveflow post: http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server		
*/	
var download = function (filename, text) {
				var pom = document.createElement('a');
				pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				pom.setAttribute('download', filename);
				pom.click();
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
					$("#remove_image").css('visibility', 'hidden');
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
						$("#remove_image").css('visibility', 'visible');
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
	$("#remove_image").css('visibility', 'hidden');
	$("#remove_image").on("click",
		function() {
			$("#viewing_window").droppable("disable");
			$("#viewing_window img").remove();
			$("#image_select").val(null);
			$("#remove_image").css('visibility', 'hidden');
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
					$("#remove_image").css('visibility', 'visible');
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
			$(".selected_shape").data("shape_type", $(this).text());
		}
	);
	
	$("#shape_name").on("click",
		function() {
			$(".selected_shape").data("Name", $(this).text());
		}
	);
	
	/* event handlers for the shape position input boxes */
	$("#x_pos").on("change",
		function(e) {
			if (isNaN($("#x_pos").val()) || $("#x_pos").val() < 0) {
				// Error case: x value was invalid
				$("#x_pos").val($("#y_pos").data("val"));
			} 
			var largest_x = parseInt($("#x_pos").val()) + ($(".selected_shape").width() / 2);
			var smallest_x = parseInt($("#x_pos").val()) - ($(".selected_shape").width() / 2);
			
			if (largest_x < $("#viewing_window img").width() && smallest_x > 0) {
				// Valid x value
				$(".selected_shape").css({left: largest_x - $(".selected_shape").width()});
				$("#x_pos").data("val", $("#x_pos").val());
			} else {
				// Error case: x value was larger or smaller than the 
				// allowed x values, reset it to the original value
				$("#x_pos").val($("#x_pos").data("val"));
			}
		}
	);
	
	$("#y_pos").on("change",
		function() {
			if (isNaN($("#y_pos").val()) || $("#y_pos").val() < 0) {
				// Error case: y value was invalid, reset it to the original value
				$("#y_pos").val($("#y_pos").data("val"));
			} 
			var largest_y = parseInt($("#y_pos").val()) + ($(".selected_shape").height() / 2);
			var smallest_y = parseInt($("#y_pos").val()) - ($(".selected_shape").height() / 2);
			
			if (largest_y < $("#viewing_window img").height() && smallest_y > 0) {
				// Valid y value
				$(".selected_shape").css({top: largest_y - $(".selected_shape").height()});
				$("#y_pos").data("val", $("#y_pos").val());
			} else {
				// Error case: y value was larger or smaller than the
				// allowed y values, reset it to the original value
				$("#y_pos").val($("#y_pos").data("val"));
			}
		}
	);
	
	$("#shape_width").on("change",
		function() {
			if (isNaN($("#shape_width").val()) || $("#shape_width").val() < 0) {
				// Error case: width value was invalid
				$("#shape_width").val($(".selected_shape").width());
			} 
			var new_width = parseInt($("#shape_width").val());
			var largest_x = $(".selected_shape").position().left + new_width;
			
			if (largest_x < $("#viewing_window img").width()) {
				// Valid width value
				$(".selected_shape").width(new_width)
			} else {
				// Error case: width value larger than the maximum width value
				// allowed, reset it to the original value
				$("#shape_width").val($(".selected_shape").width());
			}
		}
	);
	
	$("#shape_height").on("change",
		function() {
			if (isNaN($("#shape_height").val()) || $("#shape_height").val() < 0) {
				// Error case: height value was invalid
				$("#shape_height").val($(".selected_shape").width());
			} 
			var new_height = parseInt($("#shape_height").val());
			var largest_y = $(".selected_shape").position().top + new_height;
			
			if (largest_y < $("#viewing_window img").height()) {
				// Valid height value
				$(".selected_shape").height(new_height)
			} else {
				// Error case: height value larger than the maximum height value
				// allowed, reset it to the original value
				$("#shape_height").val($(".selected_shape").height());
			}
		}
	);
	
	/*
		Initiate Dialog windows
	*/
	
	// Fields dialog
	$("#field_prop_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Ok": function() {
				if ($("#new_field_prop_label").val().length == 0) {
					$(this).dialog("close"); // don't add property with blank name
					return;
				}
				
				var $new_prop = $("<div/>").addClass("input-group input-group-sm");
				var $prop_label = $("<span/>").addClass("input-group-addon").text($("#new_field_prop_label").val());
				var $input = $("<input/>").attr("type", "text").attr("readonly", true);
				$input.addClass("field_property").addClass("form-control").val($("#new_field_prop_val").val());
				$input.data("label", $("#new_field_prop_label").val());
		
				var $delete = $("<span/>").addClass("input-group-addon").append($("<i/>").addClass("fa fa-times-circle fa-sm"));
				
				var $edit = $("<span/>").addClass("input-group-addon").append($("<i/>").addClass("fa fa-pencil fa-sm"));
				$edit.on("click",
					function() {
						$input.addClass("selected_field");
						$("#field_label").text($prop_label.text());
						$("#new_field_val").val($input.val());
						$("#update_field_dialog").dialog("open");
					}
				);
				
				$new_prop.append($prop_label).append($input).append($edit).append($delete);
				$("#field_properties fieldset").append($new_prop);
				
				// add the new property to the selected shape
				$(".selected_shape").data($("#new_field_prop_label").val(), $("#new_field_prop_val").val());

				$delete.on("click",
					function() {
						// remove this data from all shapes
						$(".shape").removeData($prop_label.text());
						$new_prop.remove();
						$(this).remove();
					}
				);
				
				$("#new_field_prop_label").val(null);
				$("#new_field_prop_val").val(null);
				$(this).dialog("close");
			},
			"Cancel": function() {
				$("#new_field_prop_label").val(null)
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
				$(".selected_field").val($("#new_field_val").val());
				$(".selected_shape").data($("#field_label").text(), $("#new_field_val").val());
				$(".selected_field").removeClass("selected_field");
				$(this).dialog("close");
			}
		}
	});
	
	$("#edit_name").on("click",
		function() {
			$("#Name").addClass("selected_field");
			$("#field_label").text("Name");
			$("#new_field_val").val($("#Name").val());
			$("#update_field_dialog").dialog("open");
		}
	);
	
	// Global properties dialog
	$("#global_prop_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Ok": function() {
				if ($("#new_global_prop_label").val().length == 0) {
					$(this).dialog("close"); // don't add property with blank name
					return;
				}
			
				var $new_prop = $("<div/>").addClass("input-group input-group-sm");
				var $prop_label = $("<span/>").addClass("input-group-addon").text($("#new_global_prop_label").val());
				
				var $input = $("<input/>").attr("type", "text").attr("readonly", true);
				$input.addClass("global_property").addClass("form-control").val($("#new_global_prop_val").val())
				$input.data("label", $("#new_global_prop_label").val());
				
				var $delete = $("<span/>").addClass("input-group-addon").append($("<i/>").addClass("fa fa-times-circle fa-sm"));
				
				var $edit = $("<span/>").addClass("input-group-addon").append($("<i/>").addClass("fa fa-pencil fa-sm"));
				$edit.on("click",
					function() {
						$input.addClass("selected_global");
						$("#global_label").text($prop_label.text());
						$("#new_global_val").val($input.val());
						$("#update_global_dialog").dialog("open");
					}
				);
				
				$new_prop.append($prop_label).append($input).append($edit).append($delete);
				
				$("#global_properties fieldset").append($new_prop);

				$delete.on("click",
					function() {
						// remove this data from all shapes
						$(".shape").removeData($prop_label.text());
						$new_prop.remove();
						$(this).remove();
					}
				);
				
				$("#new_global_prop_label").val(null);
				$("#new_global_prop_val").val(null);
				$(this).dialog("close");
				
			},
			"Cancel": function() {
				$("#new_global_prop_label").val(null)
				$(this).dialog("close");
			}
		}
	});
	
	$("#add_global_property").on('click', 
		function() {
			$("#global_prop_dialog").dialog("open");
		}
	);
	
	// Update global dialog
	$("#update_global_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Ok": function() {
				$(".selected_global").val($("#new_global_val").val());
				$(".selected_global").removeClass("selected_global");
				$(this).dialog("close");
			}
		}
	});
	
	// JSON output dialog
	$("#create_json_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 'auto',
		buttons: {
			"Download": function() {
				download($("#input_file_name").val(), $("#json_output_text").val());
			},
			"Cancel": function() {
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
	
	// set image_select icon callback
	$("#input_file_browse").on("change", 
		function (e) {
			try {
				console.log("load json input file");
				var fileToLoad = e.target.files[0];
				var fileReader = new FileReader();
				var json_text = "";
				
				fileReader.onload = function(fileLoadedEvent) 
				{
					json_text = fileLoadedEvent.target.result;				
					// remove current globals and fields before parsing
					$("#global_properties fieldset").empty();
					$("#field_properties fieldset").empty();
					$(".shape").remove();
					
					parse_input(JSON.parse(json_text));
					$("#input_file_browse").val(null);
				};
				fileReader.readAsText(fileToLoad, "UTF-8");
			} catch(e) {
				alert("Failed to load JSON file");
			}
		}
	);	
	
	$("#load_json").on("click",
		function() {
			$("#input_file_browse").click();
		}
	);

	/*
		JSON Output Generator
	*/
	
	$("#make_json").click(
		function() {
			var json_output = {};
			
			/* add all JSON file properties to the output */
			$(".global_property").each(
				function() {
					json_output[$(this).data("label")] = $(this).val();
				}
			);

			var scale_factor = 1;
			
			/* add image height and width to JSON */
			if ($("#viewing_window img").data("orig_width") && $("#viewing_window img").data("orig_height")) {
				json_output["width"] = $("#viewing_window img").data("orig_width");
				json_output["height"] = $("#viewing_window img").data("orig_height");
			
				scale_factor = 1.0 * $("#viewing_window img").data("orig_width") / $("#viewing_window img").width();
			} else {
				json_output["width"] = $("#viewing_window img").width();
				json_output["height"] = $("#viewing_window img").height();
			}

			/* create an array of objects for all shapes */
			var shape_array = [];
			var field_labels = [];

			$(".shape").each(
				function(index) {
					var curr_tuple = {};
					var field_data = $(this).data()
					
					// determine shape type, NOTE: assumes shape type is either a square or circle
					var shape_type = $(this).hasClass("square_item") ? "square" : "circle";
					curr_tuple["shape"] = shape_type;
					
					var shape_state = ["shape", "x", "y", "width", "height", "radius", "shape_type", "Name"];
					
					/* iterate over all user defined properties */
					for (ele in field_data) {
						if (ele != 'uiDraggable' &&  ele != 'uiResizable') {
							if (field_labels.indexOf(ele) == -1 && shape_state.indexOf(ele) == -1) {
								field_labels.push(String(ele));
							}
							curr_tuple[ele] = field_data[ele];
						}
					}
					
					/* add all shape properties to the tuple, NOTE: rounding all values down*/
					curr_tuple["x"] = Math.floor(($(this).position().left + ($(this).width() / 2.0)) * scale_factor);
					curr_tuple["y"] = Math.floor(($(this).position().top + ($(this).height() / 2.0)) * scale_factor);
					
					/* NOTE: assumes that shape is either a square or circle */
					if ($(this).hasClass("square_item")) {
						curr_tuple["width"] = Math.floor($(this).width() * scale_factor);
						curr_tuple["height"] = Math.floor($(this).height() * scale_factor);
						
					} else {
						curr_tuple["radius"] = Math.floor(($(this).width() / 2.0) * scale_factor);
					}
					
					shape_array.push(curr_tuple);
				}
			);

			json_output["fields"] = shape_array;
			json_output["field_labels"] = field_labels;
			
			$("#json_output_text").val(JSON.stringify(json_output, null, "\t"));
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
			$(".selected_shape").addClass("unselected_shape");
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
					update_field_menu($(this));
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
					$(".field_property").val(null);
				}
			);
			
			$new_shape.appendTo("#viewing_window");
			
			// update menu information for this shape
			update_shape_menu($new_shape);
			reset_field_menu();
			curr += 1;
		}
	);
});