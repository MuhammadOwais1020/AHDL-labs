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
    console.log("expended function called");
  } else if (n == 2) {
    $("#main-heading").html("Lab History");
  }
}

// Test Menu
function testExpendedMenu(n) {
  $(".wind").hide();

  $("#test-wind-" + n).show();
  if (n == 1) {
    $("#main-heading").html("Create New Test Parameter");
    loadParameterUnits();
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

      // Clear previous options
      selectUnit.empty();

      // Add default option
      selectUnit.append(
        $("<option></option>").val("").text("-- Select Unit --")
      );

      // Add options from the response data
      for (var i = 0; i < response.length; i++) {
        var unit = response[i];
        selectUnit.append(
          $("<option></option>").val(unit.name).text(unit.name)
        );
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

// Remove row button click event
$(document).on("click", ".btn-remove-row", function () {
  // Get the table body of the row
  var tableBody = $(this).closest("tbody");
  // Remove the parent row
  $(this).closest("tr").remove();

  // If no rows left, add an empty row
  if (tableBody.children().length === 0) {
    addEmptyRow(tableBody);
  }
});

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
