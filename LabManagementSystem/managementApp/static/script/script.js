var profileExpended = false;

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
  $(".menu-btn-expended").hide();
  $("#menu-btn-expended-" + n).show();
  console.log("inside extended button");
}

// Patient Expended Menu
function patientExpendedMenu(n) {
  // do something here
}

// LAB Menu
function labExpendedMenu(n) {
  // do something here
}

// Test Menu
function testExpendedMenu(n) {
  // do something here
}
