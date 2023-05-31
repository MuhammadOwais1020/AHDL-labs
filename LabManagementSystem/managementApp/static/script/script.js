var profileExpended = false;
var buttonGroupExpended = false;

$(document).ready(function () {
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
    }, time); // Hide after time seconds
  }
});

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
  // do something here
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
