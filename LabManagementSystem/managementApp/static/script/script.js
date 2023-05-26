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

  // Form validation function
  function validateForm() {
    var patientName = $("#id_patient_name").val();
    var mobileNumber = $("#id_mobile_number").val();
    var cnicNumber = $("#id_cnic_number").val();
    var email = $("#id_email").val();
    var gender = $("#id_gender").val();
    var city = $("#id_city").val();
    var ageYears = $("#id_age_years").val();
    var ageMonths = $("#id_age_months").val();
    var ageDays = $("#id_age_days").val();

    // Add your custom validation logic here

    // Example: Check if required fields are empty
    if (
      patientName === "" ||
      mobileNumber === "" ||
      cnicNumber === "" ||
      email === "" ||
      gender === "" ||
      city === "" ||
      ageYears === "" ||
      ageMonths === "" ||
      ageDays === ""
    ) {
      alert("Please fill in all the required fields.");
      return false;
    }

    // Example: Check if age is valid
    if (
      parseInt(ageYears) <= 0 &&
      parseInt(ageMonths) <= 0 &&
      parseInt(ageDays) <= 0
    ) {
      alert("Please enter a valid age.");
      return false;
    }

    return true;
  }

  // AJAX form submission function
  $("#patientForm").submit(function (event) {
    event.preventDefault(); // Prevent default form submission

    if (validateForm()) {
      $.ajax({
        type: "POST",
        url: "{% url 'add_patient' %}",
        data: $(this).serialize(),
        success: function (response) {
          // Handle the success response
          console.log(response);
        },
        error: function (xhr, errmsg, err) {
          // Handle the error response
          console.log(xhr.status + ": " + xhr.responseText);
        },
      });
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
