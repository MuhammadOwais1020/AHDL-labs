var profileExpended = false;
var buttonGroupExpended = false;

$(document).ready(function () {
  $("#expend-profile-checkbox").click(function () {
    if (profileExpended === false) {
      $(".less-than-down svg").css("rotate", "90deg");
      profileExpended = true;
    } else {
      $(".less-than-down svg").css("rotate", "-90deg");
      profileExpended = false;
    }
  });
});

//button groups
function buttonGroup(n) {
  if (buttonGroupExpended === false) {
    $(".menu-btn-expended").hide();
    $("#menu-btn-expended-" + n).show();
    $("#menu-btn-expended-" + n + " .dropdown-svg").css("rotate", "90deg");
    buttonGroupExpended = true;
    console.log("inside if");
  } else {
    $(".menu-btn-expended").hide();
    $("#menu-btn-expended-" + n + " .dropdown-svg").css("rotate", "-90deg");
    buttonGroupExpended = false;
    console.log("inside else");
  }
}

// Patient Expended Menu
function patientExpendedMenu(n) {
  // hide all wind
  $(".wind").hide();
  // show selected wind
  $("#patient-wind-" + n).show();
  // change main heading
  if (n == 1) {
    $("#main-heading").html("Add New Patient");
  } else if (n == 2) {
    $("#main-heading").html("All Patient List");
  }
}

// LAB Menu
function labExpendedMenu(n) {
  // do something here
}

// Test Menu
function testExpendedMenu(n) {
  // do something here
}
