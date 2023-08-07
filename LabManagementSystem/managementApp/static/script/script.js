var profileExpended = false;
var buttonGroupExpended = false;
var today = new Date().toLocaleDateString();

$(document).ready(function () {
  // Set the default heading text to today's date
  $("#entriesHeading").text("Today's Account Entries - " + today);

  var btn = pannelCaseCheckBox;
  btn.addEventListener("click", function () {
    var pannelCheckbox = document.getElementById("pannelCase");
    var pannelContent = document.getElementById("pannelContent");

    if (pannelCheckbox.checked) {
      pannelContent.style.display = "block";
    } else {
      pannelContent.style.display = "none";
    }
  });

  $("#expend-profile-checkbox").click(function () {
    if (profileExpended === false) {
      $(".less-than-down svg").css("rotate", "90deg");
      profileExpended = true;
    } else {
      $(".less-than-down svg").css("rotate", "-90deg");
      profileExpended = false;
    }
  });

  // add patient form validation
  function validateForm() {
    // Add your form validation logic here
    var patientName = document.getElementById("id_patient_name").value;
    var mobileNumber = document.getElementById("id_mobile_number").value;
    var cnicNumber = document.getElementById("id_cnic_number").value;
    var email = document.getElementById("id_email").value;
    var gender = document.getElementById("id_gender").value;
    var city = document.getElementById("id_city").value;
    var ageYears = document.getElementById("id_age_years").value;
    var ageMonths = document.getElementById("id_age_months").value;
    var ageDays = document.getElementById("id_age_days").value;

    // Perform your validation checks
    // Example: Check if required fields are filled
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
      alert("Please fill in all required fields.");
      return false;
    }

    // Add more validation logic as needed

    return true; // Return true if the form is valid
  }

  // add patient into database
  function submitForm() {
    var isValid = validateForm();
    if (isValid) {
      var patientName = document.getElementById("id_patient_name").value;
      var mobileNumber = document.getElementById("id_mobile_number").value;
      var cnicNumber = document.getElementById("id_cnic_number").value;
      var email = document.getElementById("id_email").value;
      var gender = document.getElementById("id_gender").value;
      var city = document.getElementById("id_city").value;
      var ageYears = document.getElementById("id_age_years").value;
      var ageMonths = document.getElementById("id_age_months").value;
      var ageDays = document.getElementById("id_age_days").value;

      var formData = new FormData();
      formData.append("patient_name", patientName);
      formData.append("mobile_number", mobileNumber);
      formData.append("cnic_number", cnicNumber);
      formData.append("email", email);
      formData.append("gender", gender);
      formData.append("city", city);
      formData.append("age_years", ageYears);
      formData.append("age_months", ageMonths);
      formData.append("age_days", ageDays);
      formData.append(
        "csrfmiddlewaretoken",
        document.getElementsByName("csrfmiddlewaretoken")[0].value
      );

      var url = addPatientUrl;

      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          if (response.status === "success") {
            $("#addPatientAlert").html(showAlert("success", response.message));
            hideAlert(3000);
            // Reset the form
            $("#addPatientForm")[0].reset();
          } else {
            $("#addPatientAlert").html(
              showAlert(
                "danger",
                response.message + "<br><br>" + response.errors
              )
            );
            hideAlert(300);
          }
        },
        error: function (xhr, status, error) {
          $("#addPatientAlert").html(
            showAlert(
              "danger",
              "An error occurred while processing the request. Please try again."
            )
          );
          hideAlert(3000);
        },
      });
    }
  }

  document
    .getElementById("addPatientForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      submitForm();
    });
});
// show alert box for feedback
function showAlert(type, message) {
  var alertDiv =
    '<div class="alert alert-' +
    type +
    '"><strong> ' +
    type.toUpperCase() +
    "!</strong> " +
    message +
    "</div > ";
  return alertDiv;
}
// hide alert after n number of seconds
function hideAlert(time) {
  setTimeout(function () {
    $("#addPatientAlert").hide();
    $("#addIncomeAlert").hide();
    $("#addExpenseAlert").hide();
    $("#staffProfileAlert").hide();
    $("#addParameterAlert").hide();
    $("#parameterEditALert").hide();
    $("#rangeParameterAlert").hide();
    $("#addTestAlert").hide();
    $("#updateTestAlert").hide();
    $("#addLabAlert").hide();
  }, time); // Hide after time seconds
}
// Fetch doctor names using AJAX
function getDoctors() {
  var url = getDoctorsName;

  $.ajax({
    url: url, // Replace with the appropriate URL
    type: "GET",
    success: function (data) {
      // Clear the existing options
      $("#referedBy").empty();

      // Add the default option
      $("#referedBy").append(
        $("<option>", { value: "", text: "-- Select Refered By --" })
      );

      // Add the doctor names as options
      $.each(data, function (index, name) {
        $("#referedBy").append($("<option>", { value: name, text: name }));
      });

      // Add the "Add New" option
      $("#referedBy").append(
        $("<option>", { value: "__add_new__", text: "Add New" })
      );
    },
    error: function (xhr, textStatus, error) {
      console.log(xhr.statusText);
    },
  });
}

// Handle change event of the select element
$("#referedBy").on("change", function () {
  var selectedValue = $(this).val();

  // If "Add New" option is selected
  if (selectedValue === "__add_new__") {
    // Show the modal dialog
    $("#addDoctorModal").modal("show");
  }
});

// Handle click event of the Add button in the modal
$("#addDoctorBtn").on("click", function () {
  var newDoctorName = $("#newDoctorName").val();
  var url = addDoctor;
  // Send the new doctor name to the server using AJAX
  $.ajax({
    url: url, // Replace with the appropriate URL
    type: "POST",
    data: { name: newDoctorName },
    success: function (response) {
      // Add the new option to the select element
      $("#referedBy").append(
        $("<option>", { value: newDoctorName, text: newDoctorName })
      );

      // Select the newly added option
      $("#referedBy").val(newDoctorName);

      // Hide the modal dialog
      $("#addDoctorModal").modal("hide");
    },
    error: function (xhr, textStatus, error) {
      console.log(xhr.statusText);
    },
  });
});

//button groups
function buttonGroup(n) {
  if (buttonGroupExpended === false) {
    $(".menu-btn-expended").hide();
    $("#menu-btn-expended-" + n).show();
    $("#menu-btn-expended-" + n + " .dropdown-svg").css("rotate", "90deg");
    buttonGroupExpended = true;
  } else {
    $(".menu-btn-expended").hide();
    $("#menu-btn-expended-" + n + " .dropdown-svg").css("rotate", "-90deg");
    buttonGroupExpended = false;
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
    // Call the fetchPatientsData function when needed
    fetchPatientsData();
  }
}

// LAB Menu
function labExpendedMenu(n) {
  $(".wind").hide();

  $("#lab-wind-" + n).show();

  if (n == 1) {
    $("#main-heading").html("New Lab");
    getDoctors();
    loadTestData();
  } else if (n == 2) {
    fetchLabRegistrationData();
    $("#main-heading").html("Lab History");
  }
}

// Test Menu
function testExpendedMenu(n) {
  $(".wind").hide();
  console.log("testExpendedMenu Called");
  $("#test-wind-" + n).show();
  console.log("N: " + n);
  switch (n) {
    case 1:
      $("#main-heading").html("Create New Test Parameter");
      loadParameterUnits();
      break;
    case 2:
      loadAllParameters();
      $("#main-heading").html("All Test Parameters");
      break;
    case 3:
      console.log(n);
      loadParametersForTest();
      $("#main-heading").html("Create New Test");
      break;
    case 4:
      fetchTestData();
      $("#main-heading").html("View All Tests");
      break;
    default:
      console.log("default case called");
      // Default case if none of the specified cases match
      break;
  }
}

// Staff Menu
function staffExpendedMenu(n) {
  $(".wind").hide();

  $("#staff-wind-" + n).show();
  if (n == 1) {
    $("#main-heading").html("Create Staff Profile");
  } else if (n == 2) {
    $("#main-heading").html("Staff List");
    loadStaffProfiles();
  }
}

// accounts
function financeExpendedMenu(n) {
  $(".wind").hide();
  $("#finance-wind-" + n).show();
  if (n == 1) {
    $("#main-heading").html("Accounts Cash Book");
  } else if (n == 2) {
    $("#main-heading").html("Account Entries");
    loadAccountEntries();
  }
}

// get all patients data
function fetchPatientsData() {
  var url = getPatients;
  $.ajax({
    url: url, // Replace with the actual URL endpoint
    type: "GET",
    dataType: "json",
    success: function (response) {
      // Handle the successful response
      if (response && response.patients) {
        var patients = response.patients;
        // Perform actions with the patients data

        // Example: Display the patients data in a table
        displayPatientsTable(patients);
      } else {
        console.log("No patients data available.");
      }
    },
    error: function (xhr, status, error) {
      // Handle the error
      console.error(error);
    },
  });
}

// Example function to display the patients data in a table
function displayPatientsTable(patients) {
  var tableBody = $("#patientsTable tbody");

  // Clear existing table rows
  tableBody = tableBody.empty();

  // Create table rows
  $.each(patients, function (index, patient) {
    var row = $("<tr>");
    row.append($("<td>").text(patient.id));
    row.append($("<td>").text(patient.name));
    row.append($("<td>").text(patient.mobile_number));
    row.append($("<td>").text(patient.cnic_number));
    row.append($("<td>").text(patient.gender));
    row.append($("<td>").text(patient.city));
    row.append($("<td>").text(patient.age_years));

    // Create profile button with SVG icon
    var profileBtn = $("<button>")
      .addClass("btn btn-primary btn-sm")
      .html(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.486 0-7 1.243-7 3v1h14v-1c0-1.757-4.514-3-7-3z"/></svg> View Profile'
      );
    profileBtn.on("click", function () {
      viewPatientProfile(patient);
    });

    row.append($("<td>").append(profileBtn));

    tableBody.append(row);
  });
}

// view Patient profile
function viewPatientProfile(patient) {
  // Create a modal element
  var modal = $(
    '<div class="modal fade" id="patientModal" tabindex="-1" role="dialog" aria-labelledby="patientModalLabel" aria-hidden="true">'
  );

  // Create the modal dialog
  var modalDialog = $(
    '<div class="modal-dialog modal-dialog-centered" role="document">'
  );

  // Create the modal content
  var modalContent = $('<div class="modal-content">');

  // Create the modal header
  var modalHeader = $(
    '<div class="modal-header" style="background-color:#049196;">'
  );
  var modalTitle = $(
    '<h5 class="modal-title text-white" id="patientModalLabel">Patient Profile</h5>'
  );

  modalHeader.append(modalTitle, closeButton);

  var closeButton = $(
    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
  );
  modalHeader.append(modalTitle, closeButton);

  // Create the modal body
  var modalBody = $('<div class="modal-body">');
  var patientDetails = $("<p>").html(
    "<strong>Name:</strong> " +
      patient.name +
      "<br>" +
      "<strong>Mobile Number:</strong> " +
      patient.mobile_number +
      "<br>" +
      "<strong>CNIC Number:</strong> " +
      patient.cnic_number +
      "<br>" +
      "<strong>Email:</strong> " +
      patient.email +
      "<br>" +
      "<strong>Gender:</strong> " +
      patient.gender +
      "<br>" +
      "<strong>City:</strong> " +
      patient.city +
      "<br>" +
      "<strong>Age :</strong> " +
      patient.age_years +
      " years " +
      patient.age_months +
      " months " +
      patient.age_days +
      " days"
  );
  modalBody.append(patientDetails);

  // Add the header and body to the modal content
  modalContent.append(modalHeader, modalBody);

  // Add the modal content to the modal dialog
  modalDialog.append(modalContent);

  // Add the modal dialog to the modal element
  modal.append(modalDialog);

  // Append the modal to the document body
  $("body").append(modal);

  // Show the modal
  $("#patientModal").modal("show");

  // Remove the modal from the DOM after it's closed
  $("#patientModal").on("hidden.bs.modal", function () {
    $(this).remove();
  });
}

// Handle change event of the patientId field
$("#patientId").on("change", function () {
  console.log("patient id changed fucntion called");
  var patientId = $(this).val();
  var url = checkPatientId;
  // Send the patient ID to the server using AJAX
  $.ajax({
    url: url,
    type: "POST",
    data: { patientId: patientId },
    success: function (response) {
      if (response.status === "success") {
        var patient = response.patient;
        // Patient found, populate the HTML fields
        $("#patientName").val(patient.name);
        $("#gender").val(patient.gender);
        $("#ageYears").val(patient.ageYears);
        $("#ageMonths").val(patient.ageMonths);
        $("#ageDays").val(patient.ageDays);
        $("#contact").val(patient.contact);
        $("#cnic").val(patient.cnic);

        // Store patient information in JavaScript variables for temporary hold
        b_patientId = patient.id;
        b_patientName = patient.name;
        b_gender = patient.gender;
        b_ageYears = patient.ageYears;
        b_ageMonths = patient.ageMonths;
        b_ageDays = patient.ageDays;
        b_contact = patient.contact;
        b_cnic = patient.cnic;
      } else {
        // Show the patient registration modal
        $("#patientNotFoundModal").modal("show");
      }
    },
    error: function (xhr, textStatus, error) {
      console.log(xhr.statusText);
    },
  });
});

$("#registerPatientBtn").on("click", function () {
  console.log("inside patient register");
  var patientName = $("#modalPatientName").val();
  var mobileNumber = $("#modalContact").val();
  var cnicNumber = $("#modalCnic").val();
  var email = $("#modalEmail").val();
  var gender = $("#modalGender").val();
  var city = $("#modalCity").val();
  var ageYears = $("#modalAgeYears").val();
  var ageMonths = $("#modalAgeMonths").val();
  var ageDays = $("#modalAgeDays").val();
  var url = addPatientUrl;

  // Check if all required fields are filled
  if (patientName && mobileNumber && gender && city && ageYears) {
    var formData = new FormData();
    formData.append("patient_name", patientName);
    formData.append("mobile_number", mobileNumber);
    formData.append("cnic_number", cnicNumber);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("city", city);
    formData.append("age_years", ageYears);
    formData.append("age_months", ageMonths);
    formData.append("age_days", ageDays);
    formData.append("csrfmiddlewaretoken", "{{ csrf_token }}");

    $.ajax({
      url: url, // Replace with the appropriate URL for the add_patient view
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.status === "success") {
          // Patient added successfully
          var patient_id = response.patient_id;
          $("#patientId").val(patient_id);
          $("#patientName").val(patientName);
          $("#gender").val(gender);
          $("#ageYears").val(ageYears);
          $("#ageMonths").val(ageMonths);
          $("#ageDays").val(ageDays);
          $("#contact").val(mobileNumber);
          $("#cnic").val(cnicNumber);
          // Hide the modal
          $("#patientNotFoundModal").modal("hide");

          b_patientId = patient_id;
          b_patientName = patientName;
          b_gender = gender;
          b_ageYears = ageYears;
          b_ageMonths = ageMonths;
          b_ageDays = ageDays;
          b_contact = mobileNumber;
          b_cnic = cnicNumber;
        } else {
          // Form validation failed
          console.log(response.message);
          console.log(response.errors);
        }
      },
      error: function (xhr, textStatus, error) {
        console.log(xhr.statusText);
      },
    });
  } else {
    alert("Please fill in all required fields.");
  }
});

// Function to handle radio button change
function handleRelationChange() {
  var relativeRadio = document.getElementById("relativeRadio");
  var selfRadio = document.getElementById("selfRadio");

  var patientNameField = document.getElementById("patientName");
  var genderField = document.getElementById("gender");
  var ageYearsField = document.getElementById("ageYears");
  var ageMonthsField = document.getElementById("ageMonths");
  var ageDaysField = document.getElementById("ageDays");
  var contactField = document.getElementById("contact");
  var cnicField = document.getElementById("cnic");
  //
  // Check if "Relative" radio button is selected
  if (relativeRadio.checked) {
    // Empty the fields
    patientNameField.value = "";
    genderField.value = "";
    ageYearsField.value = "";
    ageMonthsField.value = "0";
    ageDaysField.value = "0";
    contactField.value = "";
    cnicField.value = "";
  } else if (selfRadio.checked) {
    // Fill the fields with values
    patientNameField.value = b_patientName;
    genderField.value = b_gender;
    ageYearsField.value = b_ageYears;
    ageMonthsField.value = b_ageMonths;
    ageDaysField.value = b_ageDays;
    contactField.value = b_contact;
    cnicField.value = b_cnic;
  }
}

// Attach event listener to the radio buttons
document
  .getElementById("relativeRadio")
  .addEventListener("change", handleRelationChange);

document
  .getElementById("selfRadio")
  .addEventListener("change", handleRelationChange);

// Function to load data for Parameters and Units select dropdowns
function loadParameterUnits() {
  // Fetch Parameters data from the server
  var url = getParameters;
  $.ajax({
    url: url, // Replace with the actual URL to fetch Parameters data
    method: "GET",
    success: function (response) {
      var selectParameter = $("#selectParameter");

      // Clear previous options
      selectParameter.empty();

      // Add default option
      selectParameter.append(
        $("<option></option>").val("").text("-- Select Parameter --")
      );

      // Add options from the response data
      for (var i = 0; i < response.length; i++) {
        var parameter = response[i];
        selectParameter.append(
          $("<option></option>").val(parameter.name).text(parameter.name)
        );
      }
      // Add new option
      selectParameter.append(
        $("<option></option>").val("__add_new__").text("Add New")
      );
    },
    error: function () {
      console.log("Error occurred while fetching Parameters data.");
    },
  });
  var url = getUnits;
  // Fetch Units data from the server
  $.ajax({
    url: url, // Replace with the actual URL to fetch Units data
    method: "GET",
    success: function (response) {
      var selectUnit = $("#selectUnit");
      var editUnit = $("#editParameterUnit");

      // Clear previous options
      selectUnit.empty();
      editUnit.empty();

      // Add default option
      selectUnit.append(
        $("<option></option>").val("").text("-- Select Unit --")
      );
      editUnit.append($("<option></option>").val("").text("-- Select Unit --"));

      // Add options from the response data
      for (var i = 0; i < response.length; i++) {
        var unit = response[i];
        selectUnit.append(
          $("<option></option>").val(unit.name).text(unit.name)
        );
        editUnit.append($("<option></option>").val(unit.name).text(unit.name));
      }

      // Add new option
      selectUnit.append(
        $("<option></option>").val("__add_new__").text("Add New")
      );
    },
    error: function () {
      console.log("Error occurred while fetching Units data.");
    },
  });
}

// Function to handle change event on Parameter dropdown
$("#selectParameter").change(function () {
  var selectedValue = $(this).val();
  console.log("inside parameter change");
  console.log("selected value: " + selectedValue);
  // Check if the selected value is "new"
  if (selectedValue === "__add_new__") {
    // Display the modal box for adding a new parameter
    $("#addParameterModal").modal("show");
  }
});

// Handle click on "Save" button in Add Parameter modal
$("#saveParameterBtn").click(function () {
  // Get the parameter value from the input field
  var parameter = $("#newParameter").val();
  var url = addParameter;
  // Make an AJAX request to add the parameter to the database
  $.ajax({
    url: url, // Replace with your server-side endpoint for adding parameters
    type: "POST",
    data: {
      parameter: parameter,
    },
    success: function (response) {
      // Handle the response from the server
      if (response.status === "success") {
        // Optionally, you can update the select dropdown with the new parameter option
        $("#selectParameter").append(
          "<option value='" + parameter + "'>" + parameter + "</option>"
        );
        // Close the modal
        $("#addParameterModal").modal("hide");
        loadParameterUnits();
      } else {
        // Error adding parameter
        alert("Failed to add parameter. Please try again.");
      }
    },
    error: function () {
      // Error making the AJAX request
      alert("Failed to add parameter. Please try again.");
    },
  });
});

function handleUnitChange() {
  var selectUnit = document.getElementById("selectUnit");
  var selectedOption = selectUnit.options[selectUnit.selectedIndex].value;

  console.log("inside unit change");
  console.log("selected value: " + selectedOption);

  if (selectedOption === "__add_new__") {
    // Open the modal box for adding a new unit
    $("#addUnitModal").modal("show");
  }
}

// Attach the event listener to the units select element
var selectUnit = document.getElementById("selectUnit");
selectUnit.addEventListener("change", handleUnitChange);

// Handle click on "Save" button in Add Unit modal
$("#saveUnitBtn").click(function () {
  // Get the unit value from the input field
  var unit = $("#newUnit").val();
  var url = addUnit;

  // Make an AJAX request to add the unit to the database
  $.ajax({
    url: url, // Replace with your server-side endpoint for adding units
    type: "POST",
    data: {
      unit: unit,
    },
    success: function (response) {
      // Handle the response from the server
      if (response.status === "success") {
        // Optionally, you can update the select dropdown with the new unit option
        $("#selectUnit").append(
          "<option value='" + unit + "'>" + unit + "</option>"
        );
        // Close the modal
        $("#addUnitModal").modal("hide");
        loadParameterUnits();
      } else {
        // Error adding unit
        alert("Failed to add unit. Please try again.");
      }
    },
    error: function () {
      // Error making the AJAX request
      alert("Failed to add unit. Please try again.");
    },
  });
});

// Handle click on "Add Parameter/Unit" button
$("#addParameterUnit").click(function () {
  var selectedParameter = $("#selectParameter").val();
  var selectedUnit = $("#selectUnit").val();

  if (
    selectedParameter &&
    selectedUnit &&
    selectedParameter != "__add_new__" &&
    selectUnit != "__add_new__"
  ) {
    // Both parameter and unit are selected
    var headingText = selectedParameter + " with " + selectedUnit;
    $("#parameter_heading").text(headingText);

    // Clear any error messages
    $("#parameter_span").text("");
    $("#unit_span").text("");

    $("#parameter-type-section").show();
  } else {
    // Show error messages for empty selections
    if (!selectedParameter) {
      $("#parameter_span").text("Select a parameter").css("color", "red");
    } else {
      $("#parameter_span").text("");
    }

    if (!selectedUnit) {
      $("#unit_span").text("Select a unit").css("color", "red");
    } else {
      $("#unit_span").text("");
    }

    // Clear the heading text
    $("#parameter_heading").text("Parameter Not Selected....!!");
    $("#parameter-type-section").hide();
  }
});

// Get the radio buttons and the "Make Parameter" button
var rangeRadio = $("#range");
var detectedNotDetectedRadio = $("#detectedNotDetected");
var positiveNegativeRadio = $("#positiveNegative");
var textRadio = $("#text");
var makeParameterBtn = $("#makeParameterBtn");
var parameterNormalValues = $("#parameterNormalValues");

// Hide the "Make Parameter" button initially
$("#makeParameterBtn").hide();
$("#parameterNormalValues").hide();

// Handle click events on the radio buttons
rangeRadio.click(function () {
  console.log("rande radio button clicked");
  makeParameterBtn.hide();
  parameterNormalValues.show();
});

detectedNotDetectedRadio.click(function () {
  makeParameterBtn.toggle(detectedNotDetectedRadio.is(":checked"));
  console.log("detected radio button clicked");
  parameterNormalValues.hide();
});

positiveNegativeRadio.click(function () {
  makeParameterBtn.toggle(positiveNegativeRadio.is(":checked"));
  console.log("positive radio button clicked");
  parameterNormalValues.hide();
});

textRadio.click(function () {
  makeParameterBtn.toggle(textRadio.is(":checked"));
  console.log("text radio button clicked");
  parameterNormalValues.hide();
});

// Add Row button click event for Male section
$("#addMaleRowBtn").click(function () {
  var maleRow = `
      <tr>
        <td><input type="text" class="form-control" name="male_normal_from[]" placeholder="Value From" /></td>
        <td><input type="text" class="form-control" name="male_normal_to[]" placeholder="Value To" /></td>
        <td><input type="text" class="form-control" name="male_age_from[]" placeholder="Age From" /></td>
        <td><input type="text" class="form-control" name="male_age_to[]" placeholder="Age To" /></td>
        <td><button type="button" class="btn btn-danger btn-remove-row">Remove</button></td>
      </tr>
    `;
  $("#maleTableBody").append(maleRow);
});

// Add Row button click event for Female section
$("#addFemaleRowBtn").click(function () {
  var femaleRow = `
      <tr>
        <td><input type="text" class="form-control" name="female_normal_from[]" placeholder="Value From" /></td>
        <td><input type="text" class="form-control" name="female_normal_to[]" placeholder="Value To"/></td>
        <td><input type="text" class="form-control" name="female_age_from[]" placeholder="Age From" /></td>
        <td><input type="text" class="form-control" name="female_age_to[]" placeholder="Age To" /></td>
        <td><button type="button" class="btn btn-danger btn-remove-row">Remove</button></td>
      </tr>
    `;
  $("#femaleTableBody").append(femaleRow);
});

// Add Row button click event for Child section
$("#addChildRowBtn").click(function () {
  var childRow = `
        <tr>
            <td><input type="number" class="form-control" name="childNormalValueFrom[]" placeholder="Value From"></td>
            <td><input type="number" class="form-control" name="childNormalValueTo[]" placeholder="Value To"></td>
            <td><input type="number" class="form-control" name="childAgeFrom[]" placeholder="Age From"></td>
            <td><input type="number" class="form-control" name="childAgeTo[]" placeholder="Age To"></td>
            <td><button type="button" class="btn btn-danger btn-remove-row">Remove</button></td>
        </tr>
    `;
  $("#childTableBody").append(childRow);
});

// Remove row button click event
$(document).on("click", ".btn-remove-row", function () {
  // Get the table body of the row
  var tableBody = $(this).closest("tbody");
  // Remove the parent row
  $(this).closest("tr").remove();

  // // If no rows left, add an empty row
  // if (tableBody.children().length === 0) {
  //   addEmptyRow(tableBody);
  // }
});

// // Function to add an empty row to the table body
// // Function to add an empty row to the table body
// function addEmptyRow(tableBody) {
//   var row = `
//     <tr>
//       <td>
//         <select name="gender[]">
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Child">Child</option>
//         </select>
//       </td>
//       <td><input type="text" name="normalValueFrom[]" value=""></td>
//       <td><input type="text" name="normalValueTo[]" value=""></td>
//       <td><input type="text" name="ageFrom[]" value=""></td>
//       <td><input type="text" name="ageTo[]" value=""></td>
//       <td>
//         <button type="button" class="btn btn-danger btn-remove-row">Remove</button>
//       </td>
//     </tr>
//   `;
//   tableBody.append(row);
// }

// Function to validate the income entry form

function validateIncomeForm() {
  var incomeDescription = document.getElementById("incomeDescription").value;
  var incomeAmount = document.getElementById("incomeAmount").value;
  var incomeDate = document.getElementById("incomeDate").value;
  var incomeCategory = document.getElementById("incomeCategory").value;

  // Perform validation checks

  if (incomeAmount === "") {
    alert("Please enter the income amount.");
    return false;
  }

  if (incomeDate === "") {
    alert("Please select the income date.");
    return false;
  }

  if (incomeCategory === null || incomeCategory === "") {
    alert("Please select the income category.");
    return false;
  }

  // All checks passed, form is valid
  return true;
}

// Function to validate the expense entry form
function validateExpenseForm() {
  var expenseDescription = document.getElementById("expenseDescription").value;
  var expenseAmount = document.getElementById("expenseAmount").value;
  var expenseDate = document.getElementById("expenseDate").value;
  var expenseCategory = document.getElementById("expenseCategory").value;

  // Perform validation checks

  if (expenseAmount === "") {
    alert("Please enter the expense amount.");
    return false;
  }

  if (expenseDate === "") {
    alert("Please select the expense date.");
    return false;
  }

  if (expenseCategory === null || expenseCategory === "") {
    alert("Please select the expense category.");
    return false;
  }

  // All checks passed, form is valid
  return true;
}

// Attach event handler to the income form submit button
$("#incomeForm").submit(function (event) {
  event.preventDefault(); // Prevent the form from submitting

  // Validate the income form
  if (validateIncomeForm()) {
    submitIncomeForm();
  }
});

// Attach event handler to the expense form submit button
$("#expenseForm").submit(function (event) {
  event.preventDefault(); // Prevent the form from submitting

  // Validate the expense form
  if (validateExpenseForm()) {
    submitExpenseForm();
  }
});

// expence entry
function submitExpenseForm() {
  // Get the expense form data
  var formData = {
    transaction_type: "expense",
    amount: $("#expenseAmount").val(),
    date: $("#expenseDate").val(),
    category: $("#expenseCategory").val(),
    description: $("#expenseDescription").val(),
  };
  var url = addAccountEntry;
  // Make an AJAX request to submit the expense form data
  $.ajax({
    url: url, // Replace with your server-side endpoint for submitting the form
    type: "POST",
    data: formData,
    success: function (response) {
      if (response.status === "success") {
        console.log("expense success");
        $("#addExpenseAlert").html(
          showAlert("success", "Expense added successfully!")
        );
        hideAlert(3000);
        $("#expenseForm")[0].reset();
      } else {
        $("#addExpenseAlert").html(
          showAlert("danger", "Failed to add expense. Please try again.")
        );
        hideAlert(3000);
      }
    },
    error: function () {
      $("#addExpenseAlert").html(
        showAlert("danger", "Failed to add expense. Please try again.")
      );
      hideAlert(3000);
    },
  });
}

// income entry
function submitIncomeForm() {
  // Get the income form data
  var formData = {
    transaction_type: "income",
    amount: $("#incomeAmount").val(),
    date: $("#incomeDate").val(),
    category: $("#incomeCategory").val(),
    description: $("#incomeDescription").val(),
  };
  var url = addAccountEntry;
  // Make an AJAX request to submit the income form data
  $.ajax({
    url: url, // Replace with your server-side endpoint for submitting the form
    type: "POST",
    data: formData,
    success: function (response) {
      if (response.status === "success") {
        console.log("income success");

        $("#addIncomeAlert").html(
          showAlert("success", "Income added successfully!")
        );
        hideAlert(3000);
        $("#incomeForm")[0].reset();
      } else {
        $("#addIncomeAlert").html(
          showAlert("danger", "Failed to add income. Please try again.")
        );
        hideAlert(3000);
      }
    },
    error: function () {
      $("#addIncomeAlert").html(
        showAlert("danger", "Failed to add income. Please try again.")
      );
      hideAlert(3000);
    },
  });
}

// load account entries
function loadAccountEntries() {
  // Make an AJAX request to the server to fetch the account entries data
  var url = getAccountEntries;
  var balance = 0;

  $.ajax({
    url: url, // Replace with your server-side endpoint for fetching account entries
    type: "GET",
    success: function (response) {
      // Clear the table body
      $("#accountEntriesTable tbody").empty();

      // Store the starting balance
      var starting_balance = 0;
      var totalDr = 0;
      var totalCr = 0;

      // Find the starting balance entry and store its value
      for (var i = 0; i < response.length; i++) {
        if (response[i].hasOwnProperty("starting_balance")) {
          starting_balance = response[i].starting_balance;
          response.splice(i, 1); // Remove the starting balance entry from the response
          break;
        }
      }

      var startingBalance = parseFloat(starting_balance);
      var balance = startingBalance;

      // Add the starting balance row
      var startingRow = $("<tr>");
      $("<td>").text("").appendTo(startingRow);
      $("<td>").text("").appendTo(startingRow);
      $("<td>").text("Starting Balance").addClass("bold").appendTo(startingRow);
      $("<td>").text("").appendTo(startingRow);
      $("<td>").text("").appendTo(startingRow);
      $("<td>").text(starting_balance).addClass("bold").appendTo(startingRow);
      startingRow.prependTo("#accountEntriesTable tbody");

      // Iterate over the response data and populate the table
      response.forEach(function (entry) {
        var row = $("<tr>");
        $("<td>").text(entry.date).appendTo(row);
        $("<td>").text(entry.category).appendTo(row);
        $("<td>").text(entry.description).appendTo(row);
        if (entry.dr == 0) {
          $("<td>").text("").addClass("bg-green").appendTo(row);
        } else {
          $("<td>").text(entry.dr).addClass("bg-green").appendTo(row);
        }
        if (entry.cr == 0) {
          $("<td>").text("").addClass("bg-red").appendTo(row);
        } else {
          $("<td>").text(entry.cr).addClass("bg-red").appendTo(row);
        }

        // Calculate the balance in each row
        balance += parseFloat(entry.dr);
        balance -= parseFloat(entry.cr);

        if (balance < 0) {
          $("<td>").text(balance).addClass("text-red").appendTo(row);
        } else {
          $("<td>").text(balance).addClass("text-green").appendTo(row);
        }
        row.appendTo("#accountEntriesTable tbody");
      });

      // Calculate the sum of DR and CR amounts
      var totalDr = response.reduce(function (sum, entry) {
        return sum + parseFloat(entry.dr);
      }, 0);
      var totalCr = response.reduce(function (sum, entry) {
        return sum + parseFloat(entry.cr);
      }, 0);

      // Calculate the closing balance
      var closingBalance = startingBalance + totalDr - totalCr;

      // Add the total row
      var totalRow = $("<tr>");
      $("<td>").text("").appendTo(totalRow);
      $("<td>").text("").appendTo(totalRow);
      $("<td>").text("Closing Balance").addClass("bold").appendTo(totalRow);
      $("<td>").text(totalDr).addClass("bold bg-green").appendTo(totalRow);
      $("<td>").text(totalCr).addClass("bold bg-red").appendTo(totalRow);
      $("<td>").text(closingBalance).addClass("bold").appendTo(totalRow);

      totalRow.appendTo("#accountEntriesTable tbody");
    },
    error: function () {
      // Error handling
      alert("Failed to fetch account entries. Please try again.");
    },
  });
}

$("#filter-option").change(function () {
  var selectedFilter = $(this).val();
  if (selectedFilter === "custom") {
    $("#from-date").show();
    $("#to-date").show();
  } else {
    $("#from-date").hide();
    $("#to-date").hide();
  }
});

// Function to get the heading text based on the filter option
function getHeadingText(filterOption) {
  switch (filterOption) {
    case "today":
      return "Today's Account Entries - " + today;
    case "all":
      return "All Account Entries";
    case "custom":
      fromDate = $("#from-date").val();
      toDate = $("#to-date").val();
      return "Account Entries - from " + fromDate + " to " + toDate;
    default:
      return "";
  }
}

function handleFilter() {
  // Get the selected filter type
  var filterType = $("#filter-option").val();

  // Check the filter type and perform the appropriate action
  if (filterType === "today") {
    // Filter by today's date
    var today = new Date().toISOString().split("T")[0]; // Get today's date in the format YYYY-MM-DD
    getDataFromServer(filterType, today, today); // Call the function to retrieve data from the server
  } else if (filterType === "all") {
    // Filter for all entries
    getDataFromServer(filterType, null, null); // Pass null dates to retrieve all data
  } else if (filterType === "custom") {
    // Filter by custom date range
    var fromDate = $("#from-date").val();
    var toDate = $("#to-date").val();
    getDataFromServer(filterType, fromDate, toDate); // Call the function to retrieve data from the server with custom dates
  }
}

function getDataFromServer(filterType, fromDate, toDate) {
  // Make an AJAX request to the Python function with the selected filter parameters
  var url = getFilterAccountEntries;
  $.ajax({
    url: url,
    type: "GET",
    data: {
      filterType: filterType,
      fromDate: fromDate,
      toDate: toDate,
    },
    success: function (response) {
      // Clear the table body
      $("#accountEntriesTable tbody").empty();

      // Store the starting balance
      var starting_balance = 0;
      var totalDr = 0;
      var totalCr = 0;

      // Find the starting balance entry and store its value
      for (var i = 0; i < response.length; i++) {
        if (response[i].hasOwnProperty("starting_balance")) {
          starting_balance = response[i].starting_balance;
          response.splice(i, 1); // Remove the starting balance entry from the response
          break;
        }
      }

      var startingBalance = parseFloat(starting_balance);
      var balance = startingBalance;

      // Add the starting balance row
      var startingRow = $("<tr>");
      $("<td>").text("").appendTo(startingRow);
      $("<td>").text("").appendTo(startingRow);
      $("<td>").text("Starting Balance").addClass("bold").appendTo(startingRow);
      $("<td>").text("").appendTo(startingRow);
      $("<td>").text("").appendTo(startingRow);
      $("<td>").text(starting_balance).addClass("bold").appendTo(startingRow);
      startingRow.prependTo("#accountEntriesTable tbody");

      // Iterate over the response data and populate the table
      response.forEach(function (entry) {
        var row = $("<tr>");
        $("<td>").text(entry.date).appendTo(row);
        $("<td>").text(entry.category).appendTo(row);
        $("<td>").text(entry.description).appendTo(row);
        if (entry.dr == 0) {
          $("<td>").text("").addClass("bg-green").appendTo(row);
        } else {
          $("<td>").text(entry.dr).addClass("bg-green").appendTo(row);
        }
        if (entry.cr == 0) {
          $("<td>").text("").addClass("bg-red").appendTo(row);
        } else {
          $("<td>").text(entry.cr).addClass("bg-red").appendTo(row);
        }

        // Calculate the balance in each row
        balance += parseFloat(entry.dr);
        balance -= parseFloat(entry.cr);

        if (balance < 0) {
          $("<td>").text(balance).addClass("text-red").appendTo(row);
        } else {
          $("<td>").text(balance).addClass("text-green").appendTo(row);
        }
        row.appendTo("#accountEntriesTable tbody");
      });

      // Calculate the sum of DR and CR amounts
      var totalDr = response.reduce(function (sum, entry) {
        return sum + parseFloat(entry.dr);
      }, 0);
      var totalCr = response.reduce(function (sum, entry) {
        return sum + parseFloat(entry.cr);
      }, 0);

      // Calculate the closing balance
      var closingBalance = startingBalance + totalDr - totalCr;

      // Add the total row
      var totalRow = $("<tr>");
      $("<td>").text("").appendTo(totalRow);
      $("<td>").text("").appendTo(totalRow);
      $("<td>").text("Closing Balance").addClass("bold").appendTo(totalRow);
      $("<td>").text(totalDr).addClass("bold bg-green").appendTo(totalRow);
      $("<td>").text(totalCr).addClass("bold bg-red").appendTo(totalRow);
      $("<td>").text(closingBalance).addClass("bold").appendTo(totalRow);

      totalRow.appendTo("#accountEntriesTable tbody");
    },
    error: function () {
      // Error handling
      alert("Failed to fetch account entries. Please try again.");
    },
  });
}

$("#filterButton").click(function () {
  handleFilter();
  // Update the heading text based on the selected filter
  var selectedFilter = $("#filter-option").val();
  var headingText = getHeadingText(selectedFilter);
  $("#entriesHeading").text(headingText);
  console.log("insise entries fucntion");
});

function validateStaffProfileForm() {
  // Get form fields
  var fullName = document.getElementById("staffFullName").value;
  var fatherName = document.getElementById("staffFatherName").value;
  var cast = document.getElementById("staffCast").value;
  var cnic = document.getElementById("staffCNIC").value;
  var mobileNumber = document.getElementById("staffMobileNumber").value;
  var address = document.getElementById("staffAddress").value;
  var username = document.getElementById("staffUsername").value;
  var password = document.getElementById("staffPassword").value;
  var designation = document.getElementById("staffDesignation").value;

  // Validate form fields
  if (fullName === "") {
    alert("Please enter the full name.");
    return false;
  }
  if (fatherName === "") {
    alert("Please enter the father's name.");
    return false;
  }
  if (cast === "") {
    alert("Please enter the cast.");
    return false;
  }
  if (cnic === "") {
    alert("Please enter the CNIC.");
    return false;
  }
  if (mobileNumber === "") {
    alert("Please enter the mobile number.");
    return false;
  }
  if (address === "") {
    alert("Please enter the address.");
    return false;
  }
  if (username === "") {
    alert("Please enter the username.");
    return false;
  }
  if (password === "") {
    alert("Please enter the password.");
    return false;
  }
  if (designation === "") {
    alert("Please select the designation.");
    return false;
  }

  // Form validation passed, submit the form
  return true;
}

// Prevent form submission and handle submit event
$("#staffProfileForm").submit(function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Validate the form
  if (!validateStaffProfileForm()) {
    return; // Stop form submission if validation fails
  }

  // Get the form data
  var fullName = $("#staffFullName").val();
  var fatherName = $("#staffFatherName").val();
  var cast = $("#staffCast").val();
  var cnic = $("#staffCNIC").val();
  var mobileNumber = $("#staffMobileNumber").val();
  var address = $("#staffAddress").val();
  var username = $("#staffUsername").val();
  var password = $("#staffPassword").val();
  var designation = $("#staffDesignation").val();

  // Create the data object
  var formData = {
    full_name: fullName,
    father_name: fatherName,
    cast: cast,
    cnic: cnic,
    mobile_number: mobileNumber,
    address: address,
    username: username,
    password: password,
    designation: designation,
  };
  var url = saveStaffProfile;
  // Send the AJAX request
  $.ajax({
    url: url,
    type: "POST",
    data: formData,
    success: function (response) {
      $("#staffProfileAlert").html(
        showAlert("success", "Staff Profile created successfully!")
      );
      hideAlert(3000);
      // Reset the form
      $("#staffProfileForm")[0].reset();
    },
    error: function () {
      alert("");

      $("#staffProfileAlert").html(
        showAlert(
          "error",
          "An error occurred while creating the staff profile.!"
        )
      );
      hideAlert(3000);
    },
  });
});

function loadStaffProfiles() {
  // Make the AJAX request
  var url = getStaffProfiles;
  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    success: function (response) {
      // Clear the table body
      $("#staffTableBody").empty();

      // Iterate over the response data and populate the table
      response.forEach(function (profile) {
        var row = $("<tr>");
        $("<td>").text(profile.full_name).appendTo(row);
        $("<td>").text(profile.father_name).appendTo(row);
        $("<td>").text(profile.cast).appendTo(row);
        $("<td>").text(profile.cnic).appendTo(row);
        $("<td>").text(profile.mobile_number).appendTo(row);
        $("<td>").text(profile.address).appendTo(row);
        $("<td>").text(profile.username).appendTo(row);
        $("<td>").text(profile.designation).appendTo(row);
        row.appendTo("#staffTableBody");
      });
    },
    error: function () {
      alert("An error occurred while loading staff profiles.");
    },
  });
}

$("#makeParameterBtn").click(function () {
  console.log("btn clicked");
  // Get the selected parameter name and unit
  var parameterName = $("#selectParameter").val();
  var parameterUnit = $("#selectUnit").val();

  // Get the selected parameter result type
  var parameterResultType = $("input[name='parameterType']:checked").val();

  // Create the data object
  var data = {
    parameter_name: parameterName,
    parameter_unit: parameterUnit,
    parameter_result_type: parameterResultType,
  };
  var url = make_parameter_vrbl;
  // Make the AJAX request to the Python file
  $.ajax({
    url: url,
    type: "POST",
    data: data,
    success: function (response) {
      console.log("1");
      $("#addParameterAlert").show();
      $("#addParameterAlert").html(
        showAlert(response.status, response.message)
      );
      hideAlert(3000);
    },
    error: function (xhr, status, error) {
      $("#addParameterAlert").show();
      $("#addParameterAlert").html(
        showAlert(response.status, response.message)
      );
      hideAlert(3000);
    },
  });
});

function loadAllParameters() {
  var url = get_all_parameters;
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (response.status === "success") {
        var parameterTableBody = $("#parameterTableBody");
        parameterTableBody.empty();

        // Iterate over the parameter records and append rows to the table
        for (var i = 0; i < response.parameters.length; i++) {
          var parameter = response.parameters[i];
          var row = $("<tr>");
          row.append($("<td>").text(parameter.id));
          row.append($("<td>").text(parameter.parameter_name));
          row.append($("<td>").text(parameter.parameter_unit));
          row.append($("<td>").text(parameter.parameter_result_type));
          var editButton = $("<button>")
            .addClass("btn btn-primary")
            .text("Edit");
          editButton.click(
            (function (param) {
              return function () {
                openEditModal(param);
              };
            })(parameter)
          );
          row.append($("<td>").append(editButton));
          parameterTableBody.append(row);
        }
      } else {
        alert("An error occurred while loading parameters.");
      }
    },
    error: function () {
      alert("An error occurred while loading parameters.");
    },
  });
}

function openEditModal(parameter) {
  // Populate the modal with the parameter details

  $("#editParameterId").val(parameter.id);
  $("#editParameterName").val(parameter.parameter_name);
  $("#editParameterUnit").val(parameter.parameter_unit);
  // Get the editParameterResultType select element
  var editParameterResultType = document.getElementById(
    "editParameterResultType"
  );

  // Get the parameter_result_type value from the server or any other source
  var parameterResultType = parameter.parameter_result_type;

  // Clear existing options
  editParameterResultType.innerHTML = "";

  // Add options based on parameter_result_type
  if (parameterResultType === "range") {
    var option = document.createElement("option");
    option.value = "range";
    option.text = "Range";
    editParameterResultType.add(option);
    $("#rangeParameterDiv").show();
    fetchRangeParameters(parameter.id);
  } else {
    $("#rangeParameterDiv").hide();
    var option1 = document.createElement("option");
    option1.value = "positiveNegative";
    option1.text = "Positive/Negative";
    editParameterResultType.add(option1);

    var option2 = document.createElement("option");
    option2.value = "detectedNotDetected";
    option2.text = "Detected/Not Detected";
    editParameterResultType.add(option2);

    var option3 = document.createElement("option");
    option3.value = "text";
    option3.text = "Text";
    editParameterResultType.add(option3);
  }

  // Show the modal
  $("#editParameterModal").modal("show");
}

function saveEditedParameter() {
  console.log("inside edit parameter function");
  // Get the updated parameter values
  var parameterId = document.getElementById("editParameterId").value;
  var parameterName = document.getElementById("editParameterName").value;
  var parameterUnit = document.getElementById("editParameterUnit").value;
  var parameterType = document.getElementById("editParameterResultType").value;
  console.log(parameterType);

  if (parameterType === "range") {
    console.log("range parameter selected");

    // Get the values from the table
    var table = document.getElementById("rangeParameterResultTable");
    var rows = table.getElementsByTagName("tr");
    var rangeParameters = [];

    // Iterate through the table rows (skip the header row)
    for (var i = 1; i < rows.length; i++) {
      var cells = rows[i].getElementsByTagName("td");

      // Get the values from the cells
      var genderSelect = cells[0].querySelector("select");
      var gender = genderSelect.value;
      var normalValueFrom = cells[1].querySelector("input").value;
      var normalValueTo = cells[2].querySelector("input").value;
      var ageFrom = cells[3].querySelector("input").value;
      var ageTo = cells[4].querySelector("input").value;
      console.log("gender: " + gender);
      console.log("valuefrom: " + normalValueFrom);
      console.log("value to: " + normalValueTo);
      console.log("age from: " + ageFrom);
      console.log("age to: " + ageTo);
      // Check if all fields are filled
      if (gender && normalValueFrom && normalValueTo && ageFrom && ageTo) {
        // Create an object with the values
        var rangeParameter = {
          gender: gender,
          normalValueFrom: normalValueFrom,
          normalValueTo: normalValueTo,
          ageFrom: ageFrom,
          ageTo: ageTo,
        };

        // Add the range parameter to the array
        rangeParameters.push(rangeParameter);
      }
    }

    // Prepare the data to be sent via AJAX
    var requestData = {
      parameterId: parameterId,
      rangeParameters: rangeParameters,
    };

    var url = update_range_parameters;

    // Send the data to the Python file using AJAX
    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(requestData), // Convert the requestData to JSON string
      contentType: "application/json", // Set the content type to JSON
      success: function (response) {
        loadAllParameters();
        $("#parameterEditALert").show();
        $("#parameterEditALert").html(
          showAlert(response.status, response.message)
        );
        hideAlert(3000);
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);

        // Show alert or perform any other action
      },
    });
  } else {
    console.log("else selected of parameter");
    // Create the data object
    var url = update_parameter;

    // Make the AJAX request
    $.ajax({
      url: url,
      type: "POST",
      data: {
        id: parameterId,
        name: parameterName,
        unit: parameterUnit,
        type: parameterType,
      },
      success: function (response) {
        loadAllParameters();
        $("#parameterEditALert").show();
        $("#parameterEditALert").html(
          showAlert(response.status, response.message)
        );
        hideAlert(3000);
      },
    });
  }
}

function saveRangeParameters() {
  console.log("inside save rnage paramater");
  // Get the selected parameter and unit
  var selectedParameter = document.getElementById("selectParameter").value;
  var selectedUnit = document.getElementById("selectUnit").value;

  // Get the values from the Child table
  var childTable = document.getElementById("childTable");
  var childRows = childTable.getElementsByTagName("tr");
  var childParameters = [];

  for (var i = 1; i < childRows.length; i++) {
    var cells = childRows[i].getElementsByTagName("td");
    var normalValueFrom = cells[0].getElementsByTagName("input")[0].value;
    var normalValueTo = cells[1].getElementsByTagName("input")[0].value;
    var ageFrom = cells[2].getElementsByTagName("input")[0].value;
    var ageTo = cells[3].getElementsByTagName("input")[0].value;

    var childParameter = {
      gender: "Child",
      normalValueFrom: normalValueFrom,
      normalValueTo: normalValueTo,
      ageFrom: ageFrom,
      ageTo: ageTo,
    };
    console.log("child: " + childParameter);
    console.log(normalValueFrom);
    console.log(normalValueTo);
    console.log(ageFrom);
    console.log(ageTo);
    childParameters.push(childParameter);
  }

  // Get the values from the Female table
  var femaleTable = document.getElementById("femaleTable");
  var femaleRows = femaleTable.getElementsByTagName("tr");
  var femaleParameters = [];

  for (var j = 1; j < femaleRows.length; j++) {
    var cells = femaleRows[j].getElementsByTagName("td");
    var normalValueFrom = cells[0].getElementsByTagName("input")[0].value;
    var normalValueTo = cells[1].getElementsByTagName("input")[0].value;
    var ageFrom = cells[2].getElementsByTagName("input")[0].value;
    var ageTo = cells[3].getElementsByTagName("input")[0].value;

    var femaleParameter = {
      gender: "Female",
      normalValueFrom: normalValueFrom,
      normalValueTo: normalValueTo,
      ageFrom: ageFrom,
      ageTo: ageTo,
    };
    console.log("Female: " + femaleParameter);
    console.log(normalValueFrom);
    console.log(normalValueTo);
    console.log(ageFrom);
    console.log(ageTo);
    femaleParameters.push(femaleParameter);
  }

  // Get the values from the Male table
  var maleTable = document.getElementById("maleTable");
  var maleRows = maleTable.getElementsByTagName("tr");
  var maleParameters = [];

  for (var k = 1; k < maleRows.length; k++) {
    var cells = maleRows[k].getElementsByTagName("td");
    var normalValueFrom = cells[0].getElementsByTagName("input")[0].value;
    var normalValueTo = cells[1].getElementsByTagName("input")[0].value;
    var ageFrom = cells[2].getElementsByTagName("input")[0].value;
    var ageTo = cells[3].getElementsByTagName("input")[0].value;

    var maleParameter = {
      gender: "Male",
      normalValueFrom: normalValueFrom,
      normalValueTo: normalValueTo,
      ageFrom: ageFrom,
      ageTo: ageTo,
    };
    console.log("male: " + maleParameter);
    console.log(normalValueFrom);
    console.log(normalValueTo);
    console.log(ageFrom);
    console.log(ageTo);
    maleParameters.push(maleParameter);
  }
  console.log("make parameter: " + maleParameters);

  // Prepare the data to be sent via AJAX
  var requestData = {
    parameter: selectedParameter,
    unit: selectedUnit,
    childParameters: JSON.stringify(childParameters),
    femaleParameters: JSON.stringify(femaleParameters),
    maleParameters: JSON.stringify(maleParameters),
  };

  var url = save_range_parameters;

  // Send the data to the Python file using AJAX
  $.ajax({
    url: url,
    type: "POST",
    data: requestData,
    success: function (response) {
      console.log(response.status);
      console.log(response.message);
      resetTableEntries();
      $("#rangeParameterAlert").show();
      $("#rangeParameterAlert").html(
        showAlert(response.status, response.message)
      );
      hideAlert(3000);
    },
    error: function (xhr, status, error) {
      $("#rangeParameterAlert").show();
      $("#rangeParameterAlert").html(
        showAlert(
          "error",
          "An error occurred while saving the range parameters."
        )
      );
      hideAlert(3000);
    },
  });
}

$("#makeRangeParameter").click(function () {
  var allTables = [$("#childTable"), $("#femaleTable"), $("#maleTable")];
  var hasValues = false;

  // Iterate over each table
  for (var i = 0; i < allTables.length; i++) {
    var table = allTables[i];
    var tableRows = table.find("tbody tr");
    var allRowsHaveValues = true;

    // Check if each row has values in each column
    for (var j = 0; j < tableRows.length; j++) {
      var row = tableRows[j];
      var inputs = $(row).find("input");

      // Check if any input field is empty
      for (var k = 0; k < inputs.length; k++) {
        if ($(inputs[k]).val() === "") {
          allRowsHaveValues = false;
          break;
        }
      }

      // Break the loop if any row doesn't have values
      if (!allRowsHaveValues) {
        break;
      }
    }

    // If at least one row has values, set hasValues to true
    if (tableRows.length > 0 && allRowsHaveValues) {
      hasValues = true;
      break;
    }
  }

  // Call saveRangeParameters() if at least one table has values
  if (hasValues) {
    saveRangeParameters();
  } else {
    // Display a message or perform any other action if no table has values
    alert("Please enter values in at least one row of any table.");
  }
});

function resetTableEntries() {
  var tables = ["childTableBody", "femaleTableBody", "maleTableBody"];

  for (var i = 0; i < tables.length; i++) {
    var tableBody = document.getElementById(tables[i]);
    var rows = tableBody.getElementsByTagName("tr");

    for (var j = 0; j < rows.length; j++) {
      var cells = rows[j].getElementsByTagName("td");

      for (var k = 0; k < cells.length - 1; k++) {
        // Exclude the last cell
        var inputs = cells[k].getElementsByTagName("input");

        for (var l = 0; l < inputs.length; l++) {
          inputs[l].value = "";
        }
      }
    }
  }
}

function fetchRangeParameters(parameterId) {
  console.log("fetchRangeParameters function runs");
  var url = get_range_parameters_by_parameter;
  console.log("Parameter ID: " + parameterId);
  var tableBody = document
    .getElementById("rangeParameterResultTable")
    .getElementsByTagName("tbody")[0];

  // Clear existing table rows
  tableBody.innerHTML = "";

  // Send request to Python function to get range parameters
  $.ajax({
    url: url,
    type: "POST",
    data: { parameterId: parameterId },
    success: function (response) {
      console.log(response);
      // Loop through the range parameters and create table rows
      response.forEach(function (parameter) {
        var row = document.createElement("tr");

        // Gender dropdown
        var genderCell = document.createElement("td");
        var genderSelect = document.createElement("select");
        genderSelect.name = "gender";
        genderSelect.classList.add("form-select"); // Add the form-select class
        var genderOptions = ["Male", "Female", "Child"];
        genderOptions.forEach(function (option) {
          var genderOption = document.createElement("option");
          genderOption.value = option;
          genderOption.text = option;
          if (option === parameter.gender) {
            genderOption.selected = true; // Select the option if it matches the parameter's gender value
          }
          genderSelect.appendChild(genderOption);
        });

        genderCell.appendChild(genderSelect);
        row.appendChild(genderCell);

        // Normal Value From input
        var normalValueFromCell = document.createElement("td");
        var normalValueFromInput = document.createElement("input");
        normalValueFromInput.type = "text";
        normalValueFromInput.name = "normalValueFrom[]";
        normalValueFromInput.value = parameter.normal_value_from;
        normalValueFromInput.classList.add("form-control"); // Add the form-control class
        normalValueFromCell.appendChild(normalValueFromInput);
        row.appendChild(normalValueFromCell);

        // Normal Value To input
        var normalValueToCell = document.createElement("td");
        var normalValueToInput = document.createElement("input");
        normalValueToInput.type = "text";
        normalValueToInput.name = "normalValueTo[]";
        normalValueToInput.value = parameter.normal_value_to;
        normalValueToInput.classList.add("form-control"); // Add the form-control class
        normalValueToCell.appendChild(normalValueToInput);
        row.appendChild(normalValueToCell);

        // Age From input
        var ageFromCell = document.createElement("td");
        var ageFromInput = document.createElement("input");
        ageFromInput.type = "text";
        ageFromInput.name = "ageFrom[]";
        ageFromInput.value = parameter.age_from;
        ageFromInput.classList.add("form-control"); // Add the form-control class
        ageFromCell.appendChild(ageFromInput);
        row.appendChild(ageFromCell);

        // Age To input
        var ageToCell = document.createElement("td");
        var ageToInput = document.createElement("input");
        ageToInput.type = "text";
        ageToInput.name = "ageTo[]";
        ageToInput.value = parameter.age_to;
        ageToInput.classList.add("form-control"); // Add the form-control class
        ageToCell.appendChild(ageToInput);
        row.appendChild(ageToCell);

        // Remove button
        var removeCell = document.createElement("td");
        var removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn btn-danger btn-remove-row";
        removeButton.innerText = "Remove";
        removeButton.addEventListener("click", function () {
          removeTableRow(row);
        });
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);

        tableBody.appendChild(row);
      });
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error(
        "An error occurred while fetching range parameters:",
        error
      );
    },
  });
}

function removeTableRow(row) {
  row.remove();
}

$("#editaddRowButton").click(function () {
  // Get the input field values
  var gender = $("#editgenderSelect").val();
  var normalValueFrom = $("#editnormalValueFromInput").val();
  var normalValueTo = $("#editnormalValueToInput").val();
  var ageFrom = $("#editageFromInput").val();
  var ageTo = $("#editageToInput").val();

  // Check if all input fields are filled
  if (gender && normalValueFrom && normalValueTo && ageFrom && ageTo) {
    var confirmAdd = confirm("Are you sure you want to add these values?");
    if (confirmAdd) {
      // Create a new row with the entered values
      var newRow = $("<tr></tr>");

      // Gender cell
      var genderCell = $("<td></td>");
      var genderSelect = $("<select></select>")
        .addClass("form-select")
        .attr("name", "gender");

      var genderOptions = ["Male", "Female", "Child"];
      genderOptions.forEach(function (option) {
        var genderOption = $("<option></option>").val(option).text(option);
        if (option === gender) {
          genderOption.prop("selected", true); // Select the option with matching value
        }
        genderSelect.append(genderOption);
      });

      genderCell.append(genderSelect);
      newRow.append(genderCell);

      // Normal Value From cell
      var normalValueFromCell = $("<td></td>");
      var normalValueFromInput = $("<input>")
        .attr("type", "text")
        .addClass("form-control")
        .attr("name", "normalValueFrom")
        .attr("value", normalValueFrom);
      normalValueFromCell.append(normalValueFromInput);
      newRow.append(normalValueFromCell);

      // Normal Value To cell
      var normalValueToCell = $("<td></td>");
      var normalValueToInput = $("<input>")
        .attr("type", "text")
        .addClass("form-control")
        .attr("name", "normalValueTo")
        .attr("value", normalValueTo);
      normalValueToCell.append(normalValueToInput);
      newRow.append(normalValueToCell);

      // Age From cell
      var ageFromCell = $("<td></td>");
      var ageFromInput = $("<input>")
        .attr("type", "text")
        .addClass("form-control")
        .attr("name", "ageFrom")
        .attr("value", ageFrom);
      ageFromCell.append(ageFromInput);
      newRow.append(ageFromCell);

      // Age To cell
      var ageToCell = $("<td></td>");
      var ageToInput = $("<input>")
        .attr("type", "text")
        .addClass("form-control")
        .attr("name", "ageTo")
        .attr("value", ageTo);
      ageToCell.append(ageToInput);
      newRow.append(ageToCell);

      // Remove button
      var removeCell = $("<td></td>");
      var removeButton = $("<button></button>")
        .attr("type", "button")
        .addClass("btn btn-danger btn-remove-row")
        .text("Remove");
      removeButton.on("click", function () {
        $(this).closest("tr").remove();
      });
      removeCell.append(removeButton);
      newRow.append(removeCell);

      // Append the new row to the table
      $("#rangeParameterResultTable tbody").append(newRow);

      // Reset the input fields
      $("#editgenderSelect").val("");
      $("#editnormalValueFromInput").val("");
      $("#editnormalValueToInput").val("");
      $("#editageFromInput").val("");
      $("#editageToInput").val("");
    }
  } else {
    alert("Please fill in all input fields.");
  }
});

function loadParametersForTest() {
  console.log("function logged in");
  var url = load_parameters_for_test; // Replace with the actual URL to fetch parameter data

  // Send request to Python function to get parameters
  $.ajax({
    url: url,
    type: "GET",
    success: function (response) {
      var parameterSelect = document.getElementById("testParameterSelect");
      // var parameterSelectEdit = document.getElementById(
      //   "testParameterSelectEdit"
      // );

      // Clear existing options
      parameterSelect.innerHTML =
        "<option value=''>-- Select Parameter Name --</option>";

      // parameterSelectEdit.innerHTML =
      // "<option value=''>-- Select Parameter Name --</option>";

      // Add options for each parameter
      response.forEach(function (parameter) {
        var optionText =
          parameter.parameter_name + ", " + parameter.parameter_unit;

        var option = document.createElement("option");
        option.value = parameter.id;
        option.text = optionText;

        parameterSelect.appendChild(option);
        // parameterSelectEdit.appendChild(option);
      });
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error("An error occurred while fetching parameters:", error);
    },
  });
}

// Add Parameter button click event
$("#addParameterButton").click(function () {
  var parameterSelect = document.getElementById("testParameterSelect");
  var selectedOption = parameterSelect.options[parameterSelect.selectedIndex];

  // Check if a parameter is selected
  if (!selectedOption || !selectedOption.value) {
    alert("Please select a parameter name first.");
    return;
  }

  var parameterId = selectedOption.value;
  var parameterText = selectedOption.text;
  var parameterName = parameterText.split(",")[0].trim();
  var parameterUnit = parameterText.split(",")[1].trim();

  // Create a new row with the entered values
  var newRow = $("<tr></tr>");
  newRow.append("<td>" + parameterId + "</td>");
  newRow.append("<td>" + parameterName + "</td>");
  newRow.append("<td>" + parameterUnit + "</td>");
  newRow.append(
    "<td><button type='button' class='btn btn-danger btn-remove-row'>Remove</button></td>"
  );

  // Append the new row to the table body
  $("#parameterTestTable tbody").append(newRow);

  // Clear the parameter selection
  parameterSelect.selectedIndex = 0;
});

// Remove row button click event
$(document).on("click", ".btn-remove-row", function () {
  $(this).closest("tr").remove();
});

$(document).on("click", "#createTestButton", function () {
  // Get the field values
  var testName = $("#testName").val();
  var testDuration = $("#testDuration").val();
  var testDepartment = $("#testDepartment").val();
  var testPrice = $("#testPrice").val();

  // Validate the fields
  if (!testName || !testDuration || !testDepartment || !testPrice) {
    alert("Please fill in all the fields.");
    return;
  }

  // Check if the table has at least one row
  var rowCount = $("#parameterTestTable tbody tr").length;
  if (rowCount === 0) {
    alert("Please add at least one parameter row.");
    return;
  }

  // Prepare the data to be sent via AJAX
  var requestData = {
    testName: testName,
    testDuration: testDuration,
    testDepartment: testDepartment,
    testPrice: testPrice,
    parameterIDs: [],
  };

  // Iterate through the table rows
  $("#parameterTestTable tbody tr").each(function () {
    var parameterID = $(this).find("td:first").text();
    console.log(parameterID);
    requestData.parameterIDs.push(parameterID);
  });

  var url = save_test_data; // Replace with your server endpoint

  // Send the data to the server using AJAX
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(requestData),
    contentType: "application/json",
    success: function (response) {
      $("#addTestAlert").show();
      $("#addTestAlert").html(showAlert(response.status, response.message));
      hideAlert(3000);
    },
    error: function (xhr, status, error) {
      // Handle the error response from the server
      console.error(error);
      // Add your own code here
    },
  });
});

function fetchTestData() {
  console.log("inside fetch test data");
  var url = get_test_data; // Replace with the actual URL endpoint

  // Send request to Python function to get test data
  $.ajax({
    url: url,
    type: "GET",
    success: function (response) {
      // Get the table body element
      var tableBody = document.getElementById("testTableBody");

      // Clear existing table rows
      tableBody.innerHTML = "";

      // Loop through the test data and create table rows
      response.forEach(function (test) {
        var testId = test.test_id;
        var testName = test.test_name;
        var testDuration = test.test_duration;
        var testDepartment = test.test_department;
        var testPrice = test.test_price;

        // Create a new table row
        var row = document.createElement("tr");

        // Add data cells to the row
        var idCell = document.createElement("td");
        idCell.textContent = testId;
        row.appendChild(idCell);

        var nameCell = document.createElement("td");
        nameCell.textContent = testName;
        row.appendChild(nameCell);

        var durationCell = document.createElement("td");
        durationCell.textContent = testDuration;
        row.appendChild(durationCell);

        var departmentCell = document.createElement("td");
        departmentCell.textContent = testDepartment;
        row.appendChild(departmentCell);

        var priceCell = document.createElement("td");
        priceCell.textContent = testPrice;
        row.appendChild(priceCell);

        // Add the details button to the last column
        var detailsCell = document.createElement("td");
        var detailsButton = document.createElement("button");
        detailsButton.textContent = "View Details";
        detailsButton.classList.add("btn", "btn-primary"); // Add the "btn" and "btn-primary" classes
        detailsButton.addEventListener("click", function () {
          // Call a function to handle the details button click
          viewDetails(test);
        });
        detailsCell.appendChild(detailsButton);
        row.appendChild(detailsCell);

        // Add the row to the table body
        tableBody.appendChild(row);
      });
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error("An error occurred while fetching test data:", error);
    },
  });
}
var modal = new bootstrap.Modal(document.getElementById("testDetailsModal"));
// Function to handle the details button click
function viewDetails(test) {
  // Set the test details in the modal
  var modalContent = document.querySelector("#testDetailsModal .modal-body");
  // Set the initial test details in the modal content
  modalContent.innerHTML = `
  <h3 id="testNameInput">${test.test_name}</h3>
  <input type="hidden" id="testIdInput" value="${test.test_id}">
          <div class="form-group">
            <label for="testDurationInput">Test Duration:</label>
            <input type="text" class="form-control" id="testDurationInput" value="${test.test_duration}">
          </div>
          <div class="form-group">
            <label for="testDepartmentSelect">Department:</label>
            <select class="form-control" id="testDepartmentSelect">
              <option value="Department 1">Department 1</option>
              <option value="Department 2">Department 2</option>
              <option value="Department 3">Department 3</option>
            </select>
          </div>
          <div class="form-group">
            <label for="testPriceInput">Test Price:</label>
            <input type="text" class="form-control" id="testPriceInput" value="${test.test_price}">
          </div>
          <hr>
           <div class="row">
              <div class="col-sm-10">
                <select id="testParameterSelectEdit" class="form-select">
                  <option value="">Select Parameter Name</option>
                </select>
              </div>
              <div class="col-sm-2">
                <button onclick="addParameterTestButtonFunction()" id="addParameterTestButton" type="button" class="btn btn-primary max-width">Add Parameter</button>
              </div>
            </div>
            <hr>
          <table id="testItemsTable" class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Parameter Name</th>
                <th>Parameter Unit</th>
                <th>Action<th>
              </tr>
            </thead>
            <tbody id="testItemsTableBody">
            </tbody>
          </table>
        `;

  loadParametersForTest();

  // Get the table body element
  var tableBody = modalContent.querySelector("#testItemsTableBody");
  // Send an AJAX request to fetch the test items
  var url = get_test_items; // Replace with your server endpoint
  var requestData = {
    testId: test.test_id,
  };

  $.ajax({
    url: url,
    type: "GET",
    data: requestData,
    success: function (response) {
      // Handle the success response from the server
      if (response.status === "success") {
        var testItems = response.testItems;

        // Populate the test items in the table
        testItems.forEach(function (testItem) {
          var row = document.createElement("tr");
          row.innerHTML = `
            <td>${testItem.parameter_id}</td>
            <td>${testItem.parameter_name}</td>
            <td>${testItem.parameter_unit}</td>
            <td>
              <button type="button" class="btn btn-danger btn-remove">Remove</button>
            </td>
          `;

          // Add event listener to remove button
          row
            .querySelector(".btn-remove")
            .addEventListener("click", function () {
              // Get the parent row and remove it from the table
              var parentRow = this.closest("tr");
              parentRow.remove();
            });

          tableBody.appendChild(row);
        });
      } else {
        console.error("Error:", response.message);
      }
    },
    error: function (xhr, status, error) {
      // Handle the error response from the server
      console.error("Error:", error);
    },
  });

  // Open the modal
  var modal = new bootstrap.Modal(document.getElementById("testDetailsModal"));
  console.log("Department: " + test.test_department);
  // Get the testDepartmentSelect element
  var departmentSelect = document.getElementById("testDepartmentSelect");

  // Iterate through the options and select the matching value
  for (var i = 0; i < departmentSelect.options.length; i++) {
    if (departmentSelect.options[i].value === test.test_department) {
      departmentSelect.options[i].selected = true;
      break;
    }
  }
  modal.show();
}

function addParameterTestButtonFunction() {
  console.log("add parameter test button fucntion called");

  var parameterSelect = document.getElementById("testParameterSelectEdit");
  var selectedOption = parameterSelect.options[parameterSelect.selectedIndex];

  // Check if a parameter is selected
  if (!selectedOption || !selectedOption.value) {
    alert("Please select a parameter name first.");
    return;
  }
  console.log("inside if value is selected");
  // Get the selected option from the testParameterSelectEdit
  var selectedOption = $("#testParameterSelectEdit option:selected");
  var optionText = selectedOption.text();
  console.log("value: " + selectedOption);
  console.log("text: " + optionText);

  // Split the option text by comma
  var splitText = optionText.split(",");

  // Get the values
  var parameterID = selectedOption.val();
  var parameterName = splitText[0].trim();
  var parameterUnit = splitText[1].trim();

  // Create a new row with the entered values
  var newRow = $("<tr></tr>");
  newRow.append("<td>" + parameterID + "</td>");
  newRow.append("<td>" + parameterName + "</td>");
  newRow.append("<td>" + parameterUnit + "</td>");

  // Add the remove button
  var removeButton = $("<button></button>")
    .addClass("btn btn-danger btn-remove")
    .text("Remove");
  var removeCell = $("<td></td>").append(removeButton);
  newRow.append(removeCell);

  console.log("Row: " + newRow);

  // Append the new row to the table
  $("#testItemsTableBody").append(newRow);

  // Clear the selected option
  selectedOption.prop("selected", false);
}

$(document).on("click", "#updateTestRecord", function () {
  // Get the field values
  var testId = $("#testIdInput").val();
  var testDuration = $("#testDurationInput").val();
  var testDepartment = $("#testDepartmentSelect").val();
  var testPrice = $("#testPriceInput").val();

  // Get the parameter IDs from the table
  var parameterIDs = [];
  $("#testItemsTable tbody tr").each(function () {
    var parameterID = $(this).find("td:first").text();
    parameterIDs.push(parameterID);
  });

  // Prepare the data to be sent via AJAX
  var requestData = {
    testId: testId,
    testDuration: testDuration,
    testDepartment: testDepartment,
    testPrice: testPrice,
    parameterIDs: parameterIDs,
  };

  var url = update_test_record; // Replace with your server endpoint

  // Send the data to the server using AJAX
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(requestData),
    contentType: "application/json",
    success: function (response) {
      fetchTestData();
      $("#updateTestAlert").show();
      $("#updateTestAlert").html(showAlert(response.status, response.message));
      hideAlert(3000);
    },
    error: function (xhr, status, error) {
      // Handle the error response from the server
      console.error(error);
      // Add your own code here
      $("#updateTestAlert").show();
      $("#updateTestAlert").html(showAlert(response.status, response.message));
      hideAlert(3000);
    },
  });
});

function loadTestData() {
  console.log("inside loadTestData function");
  var url = load_test_data;
  // Send an AJAX request to the server to load test data
  $.ajax({
    url: url, // Replace with your server endpoint
    type: "GET",
    success: function (response) {
      // Access the select element
      var testCodeSelect = document.getElementById("testCode");

      // Clear existing options
      testCodeSelect.innerHTML = "";

      // Create a default option with a default message
      var defaultOption = document.createElement("option");
      defaultOption.text = "-- Select Test Code --";
      defaultOption.value = "";
      // defaultOption.disabled = true;
      defaultOption.selected = true;

      // Append the default option to the select element
      testCodeSelect.appendChild(defaultOption);

      // Loop through the test data and create options for each record
      response.forEach(function (test) {
        // Create an option element
        var option = document.createElement("option");

        // Set the text and value of the option
        option.text = test.test_name;
        option.value = `${test.id},${test.test_name},${test.test_duration},${test.test_department},${test.test_price}`;

        // Append the option to the select element
        testCodeSelect.appendChild(option);
      });
    },
    error: function (xhr, status, error) {
      // Handle the error response from the server
      console.error(error);
      // Add your own code here
    },
  });
}

// Add an event listener to the testCode select element
var testCodeSelect = document.getElementById("testCode");
testCodeSelect.addEventListener("change", function () {
  // Get the selected value
  var selectedValue = testCodeSelect.value;

  // Check if a test code is selected
  if (selectedValue) {
    // Split the selected value by comma
    var [id, test_name, test_duration, test_department, test_price] =
      selectedValue.split(",");

    const tableBody = document.getElementById("labTableForTestsBody");
    const tableBodyHidden = document.getElementById(
      "labTableForTestsBody-invoice"
    );

    // Create a new row
    const newRow = tableBody.insertRow();
    const newRowHidden = tableBodyHidden.insertRow();

    // Set data attributes for each cell (test ID and test price)
    newRow.setAttribute("data-test-id", id);
    newRow.setAttribute("data-test-price", test_price);

    // Add cells to the new row
    const idCell = newRow.insertCell();
    idCell.textContent = id;

    const testNameCell = newRow.insertCell();
    testNameCell.textContent = test_name;

    // hidden
    const testNameCellHidden = newRowHidden.insertCell();
    testNameCellHidden.textContent = test_name;

    const testDepartmentCell = newRow.insertCell();
    testDepartmentCell.textContent = test_department;

    const testDurationCell = newRow.insertCell();
    testDurationCell.textContent = test_duration;

    // hidden
    const testDurationCellHidden = newRowHidden.insertCell();
    testDurationCellHidden.textContent = test_duration;

    const testPriceCell = newRow.insertCell();
    testPriceCell.textContent = test_price;

    // hidden
    const testPriceCellHidden = newRowHidden.insertCell();
    testPriceCellHidden.textContent = test_price;

    // Remove button
    const removeCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-danger btn-remove-row";
    removeButton.innerText = "Remove";
    removeButton.addEventListener("click", function () {
      removeTableRow(newRow);
      calculateAmount();
    });

    removeCell.appendChild(removeButton);
    newRow.appendChild(removeCell);
  }
});

function calculateAmount() {
  var totalAmount = 0;
  var discount = 0;
  var finalAmount = 0;
  var amountPaid = 0;

  // Calculate total amount
  var labTable = document.getElementById("labTableForTests");
  var rows = labTable.querySelectorAll("tbody tr");
  rows.forEach(function (row) {
    var rateCell = row.cells[4];
    var rate = parseFloat(rateCell.textContent) || 0;
    totalAmount += rate;
  });

  // Get concession value
  var concessionInput = document.getElementById("concession");
  var concession = parseFloat(concessionInput.value) || 0;

  // Calculate discount
  discount = (totalAmount * concession) / 100;

  // Calculate final amount
  finalAmount = totalAmount - discount;

  // Get amount paid
  var amountPaidInput = document.getElementById("amountPaid");
  amountPaid = parseFloat(amountPaidInput.value) || 0;

  // Calculate amount due
  var amountDue = finalAmount - amountPaid;

  // Update the totalAmount, finalAmount, and amountDue fields
  document.getElementById("totalAmount").value = totalAmount;
  document.getElementById("finalAmount").value = finalAmount;
  document.getElementById("amountDue").value = amountDue;
}

document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners to trigger the calculateAmount function
  document
    .getElementById("testCode")
    .addEventListener("change", calculateAmount);
  document
    .getElementById("concession")
    .addEventListener("input", calculateAmount);
  document
    .getElementById("amountPaid")
    .addEventListener("input", calculateAmount);
});

function labRegistrationFromValidation() {
  var patientId = document.getElementById("patientId").value;
  var dateTime = document.getElementById("dateTime").value;
  var patientName = document.getElementById("patientName").value;
  var gender = document.getElementById("gender").value;
  var ageYears = document.getElementById("ageYears").value;
  var contact = document.getElementById("contact").value;
  var cnic = document.getElementById("cnic").value;
  var testCode = document.getElementById("testCode").value;
  var totalAmount = document.getElementById("totalAmount").value;
  var referedBy = document.getElementById("referedBy").value;
  var collectionBy = document.getElementById("collectionBy").value;

  if (
    !patientId ||
    !dateTime ||
    !patientName ||
    !gender ||
    !ageYears ||
    !contact ||
    !cnic ||
    !testCode ||
    !totalAmount ||
    !referedBy ||
    !collectionBy
  ) {
    alert("Please fill in all the required fields.");
    return false;
  }

  // Additional validation logic for other fields if needed

  return true;
}

var pannel_case = false;

var form = document.getElementById("labRegistrationFrom");
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  if (labRegistrationFromValidation()) {
    // Retrieve the form data
    const formData = {
      patientId: $("#patientId").val(),
      relation: $('input[name="relation"]:checked').val(),
      dateTime: $("#dateTime").val(),
      patientName: $("#patientName").val(),
      gender: $("#gender").val(),
      ageYears: $("#ageYears").val(),
      ageMonths: $("#ageMonths").val(),
      ageDays: $("#ageDays").val(),
      contact: $("#contact").val(),
      cnic: $("#cnic").val(),
      pannelCase: $("#pannelCase").is(":checked"),
      pannelEmp: $("#pannelEmp").val(),
      referedBy: $("#referedBy").val(),
      collectionBy: $("#collectionBy").val(),
      hospital: $("#hospital").val(),
      specialRefer: $("#specialRefer").val(),
      phlebotomist: $("#phlebotomist").val(),
      totalAmount: $("#totalAmount").val(),
      concession: $("#concession").val(),
      finalAmount: $("#finalAmount").val(),
      amountPaid: $("#amountPaid").val(),
      amountDue: $("#amountDue").val(),
      pannelAmount: $("#pannelAmount").val(),
    };

    // Retrieve the rows from the table
    const tableBody = document.getElementById("labTableForTestsBody");
    let tableContent = $("#labTableForTestsBody-invoice")[0].innerHTML;
    const rows = tableBody.getElementsByTagName("tr");
    const testIds = [];
    for (const row of rows) {
      const testIdCell = row.getElementsByTagName("td")[0];
      const testId = testIdCell.textContent.trim();
      testIds.push(testId);
    }

    // Add the test IDs to the form data
    formData.labTableForTestsData = testIds.join(",");
    var url = handle_lab_registration;
    pannel_case = formData.pannelCase;
    // Send the form data to the server using AJAX
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: "json",
      success: function (response) {
        if (response.status == "success") {
          if (formData.pannelCase == true) {
            $("#pannel-case-invoice").show();
            $("#pannel-case-invoice").text(
              "Pannel Case, Pannel ID: " + formData.pannelEmp
            );
          } else {
            $("#pannel-case-invoice").hide();
          }
          $("#patient-id-invoice").text("Patient ID: " + formData.patientId);
          $("#patient-name-invoice").text(
            "Patient Name: " + formData.patientName
          );
          $("#gender-invoice").text("Gender: " + formData.gender);
          $("#refered-by-invoice").text("Refered By: " + formData.referedBy);
          $("#datetime-invoice").text("Datetime: " + formData.dateTime);
          $("#age-invoice").text(
            "Age: " +
              formData.ageYears +
              " years " +
              formData.ageMonths +
              " months " +
              formData.ageDays +
              " days"
          );
          $("#contact-no-invoice").text("Contact No: " + formData.contact);
          $("#hospital-invoice").text("Hospital: " + formData.hospital);
          $("#lab-items-invoice-body")[0].innerHTML = tableContent;
          addValuesToRows();

          $(".supper-container").hide();
          $("#invoice").show();
          generateNow("#barcode", response.lab_id);
          window.print();
        } else {
          $(".supper-container").hide();
          $("#complete-body").show();
          $("#addLabAlert").show();
          $("#addLabAlert").html(showAlert(response.status, response.message));
          hideAlert(5000);
        }
      },
      error: function (error) {
        // Handle errors if any
        alert("Error occurred while saving data.");
      },
    });
  }
});

// bar code generating
function generateNow(barcode, id) {
  JsBarcode(barcode, id, {
    width: 3,
  });
}

$(".close-svg").on("click", function () {
  $("#invoice").hide();
  $("#edit-lab-results").hide();
  $("#complete-body").show();
  // Get the form element
  const form = document.getElementById("labRegistrationFrom");

  // Reset the form to its initial state
  form.reset();
  $("#labTableForTestsBody")[0].innerHTML = "";
});

// Function to add values to individual rows in the table
function addValuesToRows() {
  // Load selected rows

  // Get the table body of lab-items-invoice-body
  const tableBody = document.getElementById("lab-items-invoice-body");

  // Create a new row
  const newRow = tableBody.insertRow();

  // Add the first column with the text "Total Amount"
  const emptyCell = newRow.insertCell();
  emptyCell.textContent = "";

  const firstCell = newRow.insertCell();
  firstCell.textContent = "Total Amount";
  firstCell.classList.add("bold");

  // Add the second column with the actual Total Amount value
  const secondCell = newRow.insertCell();
  secondCell.textContent = $("#totalAmount").val();
  secondCell.classList.add("bold");

  // Pannel Amount
  if (pannel_case == true) {
    const pannelAmountRow = tableBody.insertRow();

    const emptyCell5 = pannelAmountRow.insertCell();
    emptyCell5.textContent = "";

    const pannelAmountFirstCell = pannelAmountRow.insertCell();
    pannelAmountFirstCell.textContent = "Pannel Amount";
    pannelAmountFirstCell.classList.add("bold");

    const pannelAmountSecondCell = pannelAmountRow.insertCell();
    pannelAmountSecondCell.textContent = $("#pannelAmount").val();
    pannelAmountSecondCell.classList.add("bold");
  } else {
    // Concession
    if (!($("#concession").val() == "" || $("#concession").val() == 0)) {
      const concessionRow = tableBody.insertRow();

      const emptyCell1 = concessionRow.insertCell();
      emptyCell1.textContent = "";

      const concessionFirstCell = concessionRow.insertCell();
      concessionFirstCell.textContent = "Concession";
      concessionFirstCell.classList.add("bold");

      const concessionSecondCell = concessionRow.insertCell();
      concessionSecondCell.textContent = $("#concession").val();
      concessionSecondCell.classList.add("bold");

      // Final Amount
      const finalAmountRow = tableBody.insertRow();

      const emptyCel2 = finalAmountRow.insertCell();
      emptyCel2.textContent = "";

      const finalAmountFirstCell = finalAmountRow.insertCell();
      finalAmountFirstCell.textContent = "Final Amount";
      finalAmountFirstCell.classList.add("bold");

      const finalAmountSecondCell = finalAmountRow.insertCell();
      finalAmountSecondCell.textContent = $("#finalAmount").val();
      finalAmountSecondCell.classList.add("bold");
    }

    // Amount Paid
    const amountPaidRow = tableBody.insertRow();

    const emptyCell3 = amountPaidRow.insertCell();
    emptyCell3.textContent = "";

    const amountPaidFirstCell = amountPaidRow.insertCell();
    amountPaidFirstCell.textContent = "Amount Paid";
    amountPaidFirstCell.classList.add("bold");

    const amountPaidSecondCell = amountPaidRow.insertCell();
    amountPaidSecondCell.textContent = $("#amountPaid").val();
    amountPaidSecondCell.classList.add("bold");

    // Amount Due
    const amountDueRow = tableBody.insertRow();

    const emptyCell4 = amountDueRow.insertCell();
    emptyCell4.textContent = "";

    const amountDueFirstCell = amountDueRow.insertCell();
    amountDueFirstCell.textContent = "Amount Due";
    amountDueFirstCell.classList.add("bold");

    const amountDueSecondCell = amountDueRow.insertCell();
    amountDueSecondCell.textContent = $("#amountDue").val();
    amountDueSecondCell.classList.add("bold");
  }
}

// load lab registration data
function fetchLabRegistrationData() {
  var url = get_lab_registration_data;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Call a function to display the data in the table
      displayDataInTable(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Function to display the data in the table
function displayDataInTable(data) {
  const tableBody = document.getElementById("lab-registration-table-body");

  // Clear the existing table content
  tableBody.innerHTML = "";

  // Loop through the data and create table rows for each record
  data.forEach((record) => {
    const row = document.createElement("tr");

    // Create table cells for each field and add them to the row
    const labIdCell = document.createElement("td");
    labIdCell.textContent = record.lab_id;
    row.appendChild(labIdCell);

    const testIdCell = document.createElement("td");
    testIdCell.textContent = record.test_id;
    row.appendChild(testIdCell);

    console.log("Test ID: " + record.test_id);

    const testNameCell = document.createElement("td");
    testNameCell.textContent = record.test_name;
    row.appendChild(testNameCell);

    const datetimeCell = document.createElement("td");
    datetimeCell.textContent = record.datetime;
    row.appendChild(datetimeCell);

    const genderCell = document.createElement("td");
    genderCell.textContent = record.gender;
    row.appendChild(genderCell);

    const pannelCaseCell = document.createElement("td");
    pannelCaseCell.textContent = record.pannel_case;
    row.appendChild(pannelCaseCell);

    // Add a button in the 7th column for edit
    const editCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn btn-primary max-width";
    editButton.addEventListener("click", () => {
      // Call the editRecord function and pass the lab_id for editing
      editLabRecord(record);
    });
    editCell.appendChild(editButton);
    row.appendChild(editCell);

    const labitemStatusCell = document.createElement("td");

    // Set text content and background color based on labitem_status value
    if (record.labitem_status === "Pending") {
      labitemStatusCell.textContent = record.labitem_status;
      labitemStatusCell.style.color = "red";
    } else if (record.labitem_status === "Processing") {
      labitemStatusCell.textContent = record.labitem_status;
      labitemStatusCell.style.color = "yellow";
    } else if (record.labitem_status === "Ready") {
      const printButton = document.createElement("button");
      printButton.textContent = "Print";
      printButton.className = "btn btn-success";
      labitemStatusCell.appendChild(printButton);
    }

    row.appendChild(labitemStatusCell);

    // Add the row to the table body
    tableBody.appendChild(row);
  });
}

function editLabRecord(record) {
  console.log("inside editLab record");
  $(".supper-container").hide();
  $("#edit-lab-results").show();

  var test_id = record.test_id;

  const requestData = {
    lab_id: record.lab_id,
  };
  var url = get_complete_lab_data;
  // Send an AJAX POST request to the server
  $.ajax({
    type: "POST",
    url: url, // Replace this with the actual URL to your Django view
    data: requestData,
    dataType: "json",
    success: function (response) {
      console.log(response);
      $("#registered-lab-id").text("Lab Registration ID #" + record.lab_id);
      // Populate the lab registration details
      $("#lab-edit-result-patient-id").text(
        response.lab_registration.patient_id
      );
      $("#lab-edit-result-relation").text(response.lab_registration.relation);
      $("#lab-edit-result-datetime").text(response.lab_registration.datetime);
      $("#lab-edit-result-patient-name").text(
        response.lab_registration.patient_name
      );
      // Add other fields from LabRegistration model as needed

      // Clear the previous test data and populate the new test data
      $("#lab-edit-result-tests-with-parameters").empty();

      // Loop through the test data and populate the HTML
      for (const test_data of response.tests_with_parameters) {
        if (test_data.test_id == test_id) {
          var testHtml = `<hr class="my-4"><h2>${test_data.test_name} (ID: ${test_data.test_id})</h2><hr class="my-4"><ul>`;
          for (const parameter of test_data.parameters) {
            testHtml += `<li>
                        <strong>Parameter Name:</strong> ${parameter.parameter_name}<br>
                        <strong>Parameter Unit:</strong> ${parameter.parameter_unit}<br>
                        <strong>Parameter Result Type:</strong> ${parameter.parameter_result_type}
                       </li><hr class="my-2">`;
          }
          testHtml += "</ul>";
          $("#lab-edit-result-tests-with-parameters").append(testHtml);
        }
      }
    },
    error: function (xhr, status, error) {
      // Handle any errors that occur during the request
      console.error("Error:", error);
    },
  });
}
