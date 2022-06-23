/*
Chase White
Chase_white@student.uml.edu
GUI I:  HW 4 multiplcation table:  JS file
6/22/22
*/

var tab_count = 1;

$( function() {
	//set init values of form text inputs to match slider defaults
	//could be done in the initialization of the sliders but this works for now
	$("#mincol").val(1);
	$("#maxcol").val(10);
	$("#minrow").val(1);
	$("#maxrow").val(10);

	//init column and row multihandle sliders to [0,10], ensure no range overlap, and on slide -> regenerate table if form is valid
    var slider_col = $( "#slider_col" ).slider({
    	min: -20,
    	max: 20,
    	values: [1, 10],
    	range: true,
    	slide: function(event, ui){
    		$("#mincol").val(ui.values[0]);
    		$("#maxcol").val(ui.values[1]);
    		check_and_submit();
    	}
    });
    var slider_row = $( "#slider_row" ).slider({
    	min: -20,
    	max: 20,
    	values: [1, 10],
    	range: true,
    	slide: function(event, ui){
    		$("#minrow").val(ui.values[0]);
    		$("#maxrow").val(ui.values[1]);
    		check_and_submit();
    	}
    });

    //after changing text input field, change sliders to match and regenerate table
    //pretty sure there's a faster, better way to do this, but this is working for now
    $("#mincol").on("change", function(){
    	slider_col.slider( "values", [$("#mincol").val(),$("#maxcol").val()]);
    	check_and_submit();
    });
    $("#maxcol").on("change", function(){
    	slider_col.slider( "values", [$("#mincol").val(),$("#maxcol").val()]);
    	check_and_submit();
    });
    $("#minrow").on("change", function(){
    	slider_row.slider( "values", [$("#minrow").val(),$("#maxrow").val()]);
    	check_and_submit();
    });
    $("#maxrow").on("change", function(){
    	slider_row.slider( "values", [$("#minrow").val(),$("#maxrow").val()]);
    	check_and_submit();
    });

    return validate_form();
});

//used in conjunction with validate plugin to make everything update in real-time
function check_and_submit(){
	if( $("#entry_form").valid() == true){
    	$("#entry_form").submit();
    }
}

function validate_form(){
	//this method is straight outta stackoverf.
	$.validator.addMethod("greaterThan", function (value, element, param) {
          var $otherElement = $(param);
          return parseInt(value, 10) > parseInt($otherElement.val(), 10);
    });

	//jQuery validate plugin function validates and alerts in real-time
	$("#entry_form").validate({
	    //we only need to tell the user that the field is required and in valid range
	    rules: {
	    	minrow: {
	        	required: true,
	        	range: [-20, 20]
	      	},
	      	maxrow: {
	      		required: true,
	        	range: [-20, 20],
	        	greaterThan: "#minrow"
	      	},
	      	mincol: {
	        	required: true,
	        	range: [-20, 20]
	      	},
	      	maxcol: {
	        	required: true,
	        	range: [-20, 20],
	        	greaterThan: "#mincol"
	      	}
	    },
	    //corresponding messages for when rules are broken
	    messages: {
	      	minrow: {
	      		required: "<div class='validate_msg'>No value entered; Please enter an integer number in range [-20, 20]</div>",
	    		range: "<div class='validate_msg'>Value out of range; Please enter an integer number in range [-20, 20]</div>"
	      	},
	     	maxrow: {
	    		required: "<div class='validate_msg'>No value entered; Please enter an integer number in range [-20, 20]</div>",
	    		range: "<div class='validate_msg'>Value out of range; Please enter an integer number in range [-20, 20]</div>",
	    		greaterThan: "<div class='validate_msg'>max value must be greater than min value</div>"
	      	},
	      	mincol: {
	        	required: "<div class='validate_msg'>No value entered; Please enter an integer number in range [-20, 20]</div>",
	    		range: "<div class='validate_msg'>Value out of range; Please enter an integer number in range [-20, 20]</div>"
	      	},
	      	maxcol: {
	        	required: "<div class='validate_msg'>No value entered; Please enter an integer number in range [-20, 20]</div>",
	    		range: "<div class='validate_msg'>Value out of range; Please enter an integer number in range [-20, 20]</div>",
	    		greaterThan: "<div class='validate_msg'>max value must be greater than min value</div>"
	      	}
	    },

  		submitHandler: function() {
    		return calculate_table();
    		//return false;
  		}
  	});
}

//function to display form-matching multiplication table
function calculate_table(){
	//get all input values from form
	var mincol = Number(document.getElementById("mincol").value);
	var maxcol = Number(document.getElementById("maxcol").value);
	var minrow = Number(document.getElementById("minrow").value);
	var maxrow = Number(document.getElementById("maxrow").value);
	console.log(mincol, maxcol, minrow, maxrow);

	//initialize the final HTML table output to the table opening with empty TL corner
	var table_output = "<table><tr><td></td>";

	//loop for heading row at top
	for (var i = mincol; i <= maxcol; i++){
		table_output += "<td>" + i + "</td>";
	}
	table_output += "</tr>"; //end first row (heading row)

	//rest of rows loop
	for (var i = minrow; i <= maxrow; i++){
    	table_output += "<tr><td>" + i + "</td>";
    	for (var j = mincol; j <= maxcol; j++){
    		table_output += "<td>" + i*j + "</td>";
    	}
    	table_output += "</tr>";
	}

	//finish off table w/ closing
	table_output += "</table>";
	console.log(table_output);

	//grab empty div and set its inner html to the content of the table, which displays it
	var multi_table = document.getElementById("multi_table");
	multi_table.innerHTML = table_output;


	return false;
}

//makes a new tab for the currently displayed multiplication table
function make_tab(){
	//get table contents
	var multi_table = $("#multi_table").html();

	//initiate tabs
	var tabs = $("#table_tabs").tabs();

	//label will reference div id tab t# where # is the number of tabs created
	var tab_label = "<li><a href='#t" + tab_count + "'>[" + $("#minrow").val() + ", " + $("#maxrow").val() + "] x [" + $("#mincol").val() + ", " + $("#maxrow").val() + "]</a><button type='button' class='btn-close' id='bt" + tab_count + "'></button></li>";
	
	//add the tab label and insert the table div contents
	$("#tabs_ul").append(tab_label);
	$("#tabs_ul").after("<div id='t" + tab_count + "'>" + multi_table + "</div>");
	
	//refresh to show on screen
	$("#table_tabs").tabs("refresh");

	//modified from jquery UI site to work on bootstrap button, used to delete specific tab
	tabs.on( "click", "button.btn-close", function() {
      var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
      $( "#" + panelId ).remove();
      tab_count--;
      tabs.tabs( "refresh" );
    });

	//increment tab_count so everything shows up on its own tab
	tab_count++;

	return false;
}

//deletes all current tabs
function delete_tabs(){
	if (tab_count > 1){
		$("#table_tabs").tabs("destroy");
		$("#table_tabs").html("<ul id='tabs_ul'></ul>");
		tab_count = 1;
	}
	return false;
}