from .models import Patient, Result, ResultItems
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import redirect, render
from .models import Patient, Doctor, Parameters, Units, StaffProfile
from .models import AccountEntry
from django.views.decorators.http import require_POST
from .forms import PatientForm
from datetime import datetime
from datetime import date
from django.db.models import Sum
from django.db.models import Q
import os
from .models import Parameter
from .models import Parameter, RangeParameter
from .models import Test, TestItem
from io import BytesIO
from django.template.loader import get_template
from xhtml2pdf import pisa
from .models import LabRegistration, LabItems
from django.db import transaction
import sqlite3
from django.db import connection
from django.shortcuts import get_object_or_404
# Create your views here.

# admin index page


def index(request):
    return render(request, 'index.html')

# add patient data into database


@csrf_exempt
def add_patient(request):
    form = PatientForm(request.POST)
    if form.is_valid():
        form.save()
        last_patient = Patient.objects.last()
        last_patient_id = last_patient.id if last_patient else None

        response_data = {'status': 'success',
                         'message': 'Patient added successfully.', 'patient_id': last_patient_id}

    else:
        errors = form.errors.as_json()
        response_data = {'status': 'error',
                         'message': 'Form validation failed.', 'errors': errors}

    return JsonResponse(response_data)


# get all patients from databse
def get_patients_data(request):
    # Fetch patients' data from the database
    patients = Patient.objects.all()

    # Prepare the response data
    patients_data = []
    for patient in patients:
        patient_data = {
            'id': patient.id,
            'name': patient.patient_name,
            'mobile_number': patient.mobile_number,
            'cnic_number': patient.cnic_number,
            'email': patient.email,
            'gender': patient.gender,
            'city': patient.city,
            'age_years': patient.age_years,
            'age_months': patient.age_months,
            'age_days': patient.age_days
        }
        patients_data.append(patient_data)

    # Return the data as a JSON response
    response_data = {
        'patients': patients_data
    }
    return JsonResponse(response_data)


def get_doctors_names(request):
    print('inside get doctors name')
    doctors = Doctor.objects.all()
    doctor_names = [doctor.name for doctor in doctors]
    return JsonResponse(doctor_names, safe=False)


@csrf_exempt
def add_new_refered_by(request):
    print('inside add new doctor')
    if request.method == 'POST':
        new_refered_by_name = request.POST.get('name')

        # Check if the new refered by name already exists in the database
        if Doctor.objects.filter(name=new_refered_by_name).exists():
            return JsonResponse({'status': 'error', 'message': 'Refered by name already exists.'})

        # Save the new refered by name in the database
        refered_by = Doctor(name=new_refered_by_name)
        refered_by.save()

        return JsonResponse({'status': 'success', 'message': 'Refered by added successfully.'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})


@csrf_exempt
def check_patient_id(request):
    print('inside check patient id check')
    if request.method == 'POST':
        patient_id = request.POST.get('patientId')

        try:
            patient = Patient.objects.get(id=patient_id)

            # Populate patient information in a dictionary
            patient_data = {
                'id': patient_id,
                'name': patient.patient_name,
                'gender': patient.gender,
                'ageYears': patient.age_years,
                'ageMonths': patient.age_months,
                'ageDays': patient.age_days,
                'contact': patient.mobile_number,
                'cnic': patient.cnic_number,
                'email': patient.email,
                'city': patient.city
            }

            # Create a response with patient data
            response = {
                'status': 'success',
                'patient': patient_data
            }
        except Patient.DoesNotExist:
            # If patient not found, return status indicating the patient is not found
            response = {
                'status': 'error',
                'message': 'Patient ID not found'
            }

        return JsonResponse(response)


def get_parameters(request):
    parameters = Parameters.objects.all()
    parameter_list = [{'name': parameter.parameter}
                      for parameter in parameters]
    return JsonResponse(parameter_list, safe=False)


def get_units(request):
    units = Units.objects.all()
    unit_list = [{'name': unit.unit} for unit in units]
    return JsonResponse(unit_list, safe=False)


@csrf_exempt
def add_parameter(request):
    parameter = request.POST.get('parameter')

    try:
        # Check if the parameter already exists in the database
        if Parameters.objects.filter(parameter=parameter).exists():
            response_data = {'status': 'error',
                             'message': 'Parameter already exists.'}
        else:
            # Create a new parameter object and save it to the database
            new_parameter = Parameters(parameter=parameter)
            new_parameter.save()
            response_data = {'status': 'success',
                             'message': 'Parameter added successfully.'}
    except Exception as e:
        response_data = {'status': 'error', 'message': str(e)}

    return JsonResponse(response_data)


@csrf_exempt
def add_unit(request):
    if request.method == 'POST':
        unit = request.POST.get('unit')

        if unit:
            # Check if the unit already exists in the database
            if Units.objects.filter(unit=unit).exists():
                response_data = {'status': 'error',
                                 'message': 'Unit already exists.'}
            else:
                # Create a new unit object and save it to the database
                new_unit = Units(unit=unit)
                new_unit.save()
                response_data = {'status': 'success',
                                 'message': 'Unit added successfully.'}
        else:
            response_data = {'status': 'error',
                             'message': 'Invalid unit value.'}

        return JsonResponse(response_data)


@csrf_exempt
def add_account_entry(request):
    if request.method == 'POST':
        form_type = request.POST.get('transaction_type')
        date = request.POST.get('date')
        category = request.POST.get('category')
        description = request.POST.get('description')
        amount = request.POST.get('amount')
        dr_amount = 0
        cr_amount = 0

        if form_type == 'income':
            dr_amount = amount
            cr_amount = 0
        elif form_type == 'expense':
            dr_amount = 0
            cr_amount = amount
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid form type.'})

        entry = AccountEntry(date=date, category=category,
                             description=description, dr=dr_amount, cr=cr_amount)
        entry.save()

        return JsonResponse({'status': 'success', 'message': 'Account entry added successfully.'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})


@csrf_exempt
def get_account_entries(request):
    today = date.today()
    # Retrieve all account entries for today from the database
    entries = AccountEntry.objects.filter(date=today)

    today_str = today.strftime('%Y-%m-%d')
    starting_balance = calculate_starting_balance(today_str)
    print(f'starting balance: {starting_balance}')

    # Process the entries and create a list of dictionaries
    data = []
    for entry in entries:
        entry_data = {
            'date': entry.date,
            'category': entry.category,
            'description': entry.description,
            'dr': entry.dr,
            'cr': entry.cr
        }
        data.append(entry_data)

    # Append the starting balance to the data
    data.append({'starting_balance': starting_balance})

    return JsonResponse(data, safe=False)


def get_filter_account_entries(request):
    filter_type = request.GET.get('filterType')
    from_date = request.GET.get('fromDate')
    to_date = request.GET.get('toDate')

    today = date.today()
    starting_balance = 0

    if filter_type == 'today':
        entries = AccountEntry.objects.filter(date=today)
        today_str = today.strftime('%Y-%m-%d')
        starting_balance = calculate_starting_balance(today_str)
    elif filter_type == 'all':
        entries = AccountEntry.objects.all()
        starting_balance = 0
    elif filter_type == 'custom':
        entries = AccountEntry.objects.filter(date__range=[from_date, to_date])
        today_str = from_date
        starting_balance = calculate_starting_balance(today_str)
    else:
        return JsonResponse([], safe=False)

    data = []
    for entry in entries:
        entry_data = {
            'date': entry.date.strftime('%Y-%m-%d'),
            'category': entry.category,
            'description': entry.description,
            'dr': entry.dr,
            'cr': entry.cr,
        }
        data.append(entry_data)

    # Append the starting balance to the data
    data.append({'starting_balance': starting_balance})

    return JsonResponse(data, safe=False)


def calculate_starting_balance(from_date):
    # Convert the from_date string to a datetime object
    date_obj = datetime.strptime(from_date, '%Y-%m-%d').date()

    # Retrieve the sum of dr and cr columns for entries before the given date
    balance = AccountEntry.objects.filter(
        date__lt=date_obj).aggregate(dr=Sum('dr'), cr=Sum('cr'))

    dr_sum = balance['dr'] or 0  # If dr_sum is None, set it to 0
    cr_sum = balance['cr'] or 0  # If cr_sum is None, set it to 0

    # Calculate the starting balance by subtracting cr_sum from dr_sum
    starting_balance = dr_sum - cr_sum

    return starting_balance


@csrf_exempt
def save_staff_profile(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        father_name = request.POST.get('father_name')
        cast = request.POST.get('cast')
        cnic = request.POST.get('cnic')
        mobile_number = request.POST.get('mobile_number')
        address = request.POST.get('address')
        username = request.POST.get('username')
        password = request.POST.get('password')
        designation = request.POST.get('designation')

        # Create a new StaffProfile object and save it to the database
        staff_profile = StaffProfile(
            full_name=full_name,
            father_name=father_name,
            cast=cast,
            cnic=cnic,
            mobile_number=mobile_number,
            address=address,
            username=username,
            password=password,
            designation=designation
        )
        staff_profile.save()

        return JsonResponse({'message': 'Staff profile created successfully.'})

    return JsonResponse({'message': 'Invalid request method.'})


@csrf_exempt
def get_staff_profiles(request):
    profiles = StaffProfile.objects.all()

    # Convert the queryset to a list of dictionaries
    data = []
    for profile in profiles:
        data.append({
            'full_name': profile.full_name,
            'father_name': profile.father_name,
            'cast': profile.cast,
            'cnic': profile.cnic,
            'mobile_number': profile.mobile_number,
            'address': profile.address,
            'username': profile.username,
            'designation': profile.designation
        })

    # Return the data as a JSON response
    return JsonResponse(data, safe=False)


@csrf_exempt
def make_parameter(request):
    if request.method == 'POST':
        parameter_name = request.POST.get('parameter_name')
        parameter_unit = request.POST.get('parameter_unit')
        parameter_result_type = request.POST.get('parameter_result_type')

        # Check if the parameter name already exists
        if Parameter.objects.filter(parameter_name=parameter_name).exists():
            return JsonResponse({'status': 'warning', 'message': 'Parameter name already exists.'})

        # Create a new Parameter object
        parameter = Parameter(parameter_name=parameter_name,
                              parameter_unit=parameter_unit,
                              parameter_result_type=parameter_result_type)

        try:
            # Save the parameter in the database
            parameter.save()
            return JsonResponse({'status': 'success', 'message': 'Parameter information saved successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': 'An error occurred while saving the parameter information.', 'error': str(e)})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})


@csrf_exempt
def get_all_parameters(request):
    if request.method == 'GET':
        try:
            # Retrieve all parameters from the database
            parameters = Parameter.objects.all()

            # Prepare the parameter data as a list of dictionaries
            parameter_data = []
            for parameter in parameters:
                parameter_data.append({
                    'id': parameter.id,
                    'parameter_name': parameter.parameter_name,
                    'parameter_unit': parameter.parameter_unit,
                    'parameter_result_type': parameter.parameter_result_type
                })

            return JsonResponse({'status': 'success', 'parameters': parameter_data})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': 'An error occurred while retrieving parameters.', 'error': str(e)})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})


@csrf_exempt
def update_parameters(request):
    if request.method == 'POST':
        # Get the parameter data from the AJAX request
        parameter_id = request.POST.get('id')
        parameter_name = request.POST.get('name')
        parameter_unit = request.POST.get('unit')
        parameter_type = request.POST.get('type')
        print(parameter_type)
        try:
            # Update the parameter values using the update() method
            Parameter.objects.filter(id=parameter_id).update(
                parameter_name=parameter_name, parameter_unit=parameter_unit, parameter_result_type=parameter_type)

            # Return a JSON response with success message
            response_data = {
                'status': 'success',
                'message': 'Parameter updated successfully!'
            }
            return JsonResponse(response_data)

        except Parameter.DoesNotExist:
            # Return a JSON response with error message if parameter does not exist
            response_data = {
                'status': 'error',
                'message': 'Parameter not found!'
            }
            return JsonResponse(response_data, status=404)

    # Return a JSON response with error message for invalid request method
    response_data = {
        'status': 'error',
        'message': 'Invalid request method!'
    }
    return JsonResponse(response_data, status=400)


@csrf_exempt
def save_range_parameters(request):
    print('inside save range parameter')
    # Get the parameter and unit values from the AJAX request
    parameter_name = request.POST.get('parameter')
    unit = request.POST.get('unit')

    try:
        # Check if the parameter already exists
        parameter = Parameter.objects.filter(
            parameter_name=parameter_name).first()

        if parameter:
            # Return a JSON response with a warning message
            response_data = {
                'status': 'warning',
                'message': 'Parameter already exists.'
            }
            return JsonResponse(response_data)

        # Save the parameter and unit in the Parameter model
        parameter = Parameter.objects.create(
            parameter_name=parameter_name,
            parameter_unit=unit,
            parameter_result_type="range"
        )

        # Get the last inserted parameter ID
        parameter_id = parameter.id

        child_parameters = request.POST.get('childParameters')

        # Convert the JSON string to a Python list
        child_parameters = json.loads(child_parameters)

        # Check if the child_parameters list is not empty
        if child_parameters:
            # Save the child parameters in the RangeParameter model
            for child_parameter in child_parameters:
                print('child')
                gender = child_parameter['gender']
                normal_value_from = child_parameter['normalValueFrom']
                normal_value_to = child_parameter['normalValueTo']
                age_from = child_parameter['ageFrom']
                age_to = child_parameter['ageTo']

            if normal_value_from and normal_value_to and age_from and age_to:
                RangeParameter.objects.create(
                    parameter_id=parameter_id,
                    gender=gender,
                    normal_value_from=normal_value_from,
                    normal_value_to=normal_value_to,
                    age_from=age_from,
                    age_to=age_to
                )
            else:
                print("Some values are missing. Child Record not saved.")

        print('1')

        female_parameters = request.POST.get('femaleParameters')

        # Convert the JSON string to a Python list
        female_parameters = json.loads(female_parameters)

        print('2')
        # Check if the female_parameters list is not empty
        if female_parameters:
            print('3')
            # Save the female parameters in the RangeParameter model
            for female_parameter in female_parameters:
                print('female')
                gender = female_parameter['gender']
                normal_value_from = female_parameter['normalValueFrom']
                normal_value_to = female_parameter['normalValueTo']
                age_from = female_parameter['ageFrom']
                age_to = female_parameter['ageTo']

                if normal_value_from and normal_value_to and age_from and age_to:
                    RangeParameter.objects.create(
                        parameter_id=parameter_id,
                        gender=gender,
                        normal_value_from=normal_value_from,
                        normal_value_to=normal_value_to,
                        age_from=age_from,
                        age_to=age_to
                    )
                else:
                    print("Some values are missing. Female Record not saved.")

        male_parameters = request.POST.get('maleParameters')

        # Convert the JSON string to a Python list
        male_parameters = json.loads(male_parameters)

        # Check if the male_parameters list is not empty
        if male_parameters:
            # Save the male parameters in the RangeParameter model
            for male_parameter in male_parameters:
                print('male')
                gender = male_parameter['gender']
                normal_value_from = male_parameter['normalValueFrom']
                normal_value_to = male_parameter['normalValueTo']
                age_from = male_parameter['ageFrom']
                age_to = male_parameter['ageTo']

                if normal_value_from and normal_value_to and age_from and age_to:
                    RangeParameter.objects.create(
                        parameter_id=parameter_id,
                        gender=gender,
                        normal_value_from=normal_value_from,
                        normal_value_to=normal_value_to,
                        age_from=age_from,
                        age_to=age_to
                    )
                else:
                    print("Some values are missing. Male Record not saved.")

        # Return a JSON response with success message
        response_data = {
            'status': 'success',
            'message': 'Range parameters saved successfully!'
        }
        return JsonResponse(response_data)

    except Exception as e:
        # Return a JSON response with error message
        response_data = {
            'status': 'error',
            'message': 'Failed to save range parameters.'
        }
        return JsonResponse(response_data, status=500)


@csrf_exempt
def get_range_parameters_by_parameter(request):
    print('inside get range parameter fucntion')
    # Get the parameter ID from the request
    parameter_id = request.POST.get('parameterId')

    # Retrieve the range parameters for the given parameter ID
    parameters = RangeParameter.objects.filter(parameter=parameter_id)

    # Serialize the parameter data
    parameter_data = []
    for parameter in parameters:
        print('get results')
        parameter_data.append({
            'id': parameter.id,
            'parameter_id': parameter.parameter_id,
            'gender': parameter.gender,
            'normal_value_from': parameter.normal_value_from,
            'normal_value_to': parameter.normal_value_to,
            'age_from': parameter.age_from,
            'age_to': parameter.age_to
        })

    print(parameter_data)
    # Return the serialized parameter data as JSON response
    return JsonResponse(parameter_data, safe=False)


@csrf_exempt
def update_range_parameters(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        parameter_id = data['parameterId']
        range_parameters = data['rangeParameters']
        print(f"ramge parameter: {range_parameters}")
        try:
            existing_parameters = RangeParameter.objects.filter(
                parameter=parameter_id)
            if existing_parameters:
                existing_parameters.delete()

            for range_parameter in range_parameters:
                # print('inside for loop')
                # print(range_parameter)
                gender = range_parameter['gender']
                normal_value_from = range_parameter['normalValueFrom']
                normal_value_to = range_parameter['normalValueTo']
                age_from = range_parameter['ageFrom']
                age_to = range_parameter['ageTo']
                print(f"gender :{gender}")
                print(f"normal value :{normal_value_from}")

                RangeParameter.objects.create(
                    parameter_id=parameter_id,
                    gender=gender,
                    normal_value_from=normal_value_from,
                    normal_value_to=normal_value_to,
                    age_from=age_from,
                    age_to=age_to
                )

            response_data = {
                'status': 'success',
                'message': 'Range parameters saved successfully!'
            }
            return JsonResponse(response_data)

        except Exception as e:
            response_data = {
                'status': 'error',
                'message': 'Error occurred while saving range parameters.'
            }
            return JsonResponse(response_data, status=500)

    else:
        response_data = {
            'status': 'error',
            'message': 'Invalid request method.'
        }
        return JsonResponse(response_data, status=400)


@csrf_exempt
def load_parameters_for_test(request):
    # Retrieve parameter data from the Parameter model
    parameters = Parameter.objects.all().values(
        "id", "parameter_name", "parameter_unit", "parameter_result_type")

    # Convert QuerySet to list of dictionaries
    parameter_data = list(parameters)

    # Return the parameter data as JSON response
    return JsonResponse(parameter_data, safe=False)


@csrf_exempt
def save_test_data(request):
    if request.method == "POST":
        try:
            # Get the field values from the request
            data = json.loads(request.body)
            test_name = data['testName']
            test_duration = data['testDuration']
            test_department = data['testDepartment']
            test_price = data['testPrice']
            parameter_ids = data['parameterIDs']
            print(f"Data: {data}")
            print(f"parameter IDs: {parameter_ids}")
            print('1')

            # Check if the test name already exists
            if Test.objects.filter(test_name=test_name).exists():
                print('2')
                response_data = {
                    "status": "warning",
                    "message": "Test name already exists. Please choose a different name.",
                }
                return JsonResponse(response_data, safe=False)

            # Create a new Test object and save it
            en = Test(test_name=test_name, test_duration=test_duration,
                      test_department=test_department, test_price=test_price)
            en.save()
            print('3')

            # Retrieve the ID of the last inserted record
            test_id = en.id
            print('4')
            # Save the parameter IDs in the TestItem model
            for parameter_id in parameter_ids:
                print(f"Test ID: {test_id}")
                print(f"Parameter ID: {parameter_id}")
                test_item = TestItem(
                    parameter_id=parameter_id, test_id=test_id)
                test_item.save()
            print('5')
            # Return a success response
            response_data = {
                "status": "success",
                "message": "Test data saved successfully!",
            }
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            print("yuy:", e)
            # Return an error response if any exception occurs
            response_data = {
                "status": "danger",
                "message": "An error occurred while saving the test data.",
            }
            return JsonResponse(response_data, safe=False)

    else:
        # Return an error response for invalid request method
        response_data = {
            "status": "danger",
            "message": "Invalid request method.",
        }
        return JsonResponse(response_data, safe=False)


@csrf_exempt
def get_test_data(request):
    print('inside get test data method')
    # Retrieve data from the Test model
    tests = Test.objects.all()

    # Serialize the data
    test_data = []
    for test in tests:
        test_data.append({
            'test_id': test.id,
            'test_name': test.test_name,
            'test_duration': test.test_duration,
            'test_department': test.test_department,
            'test_price': test.test_price
        })

    # Return the serialized data as a JSON response
    return JsonResponse(test_data, safe=False)


@csrf_exempt
def get_test_items(request):
    if request.method == "GET":
        test_id = request.GET.get("testId")

        try:
            test_items = TestItem.objects.filter(
                test_id=test_id).select_related("parameter")
            test_items_data = []
            for test_item in test_items:
                test_items_data.append(
                    {
                        "parameter_id": test_item.parameter_id,
                        "parameter_name": test_item.parameter.parameter_name,
                        "parameter_unit": test_item.parameter.parameter_unit,
                        "parameter_result_type": test_item.parameter.parameter_result_type,
                    }
                )

            response_data = {
                "status": "success",
                "testItems": test_items_data,
            }
            return JsonResponse(response_data)
        except Exception as e:
            response_data = {
                "status": "error",
                "message": "Error occurred while fetching test items.",
            }
            return JsonResponse(response_data, status=500)

    response_data = {
        "status": "error",
        "message": "Invalid request method.",
    }
    return JsonResponse(response_data, status=400)


@csrf_exempt
def update_test_record(request):
    if request.method == "POST":
        try:
            # Get the data from the request
            requestData = json.loads(request.body)
            testId = requestData.get("testId")
            testDuration = requestData.get("testDuration")
            testDepartment = requestData.get("testDepartment")
            testPrice = requestData.get("testPrice")
            parameterIDs = requestData.get("parameterIDs")

            # Update the Test model
            test = Test.objects.get(id=testId)
            test.test_duration = testDuration
            test.test_department = testDepartment
            test.test_price = testPrice
            test.save()

            # Delete existing TestItem records for the given test
            TestItem.objects.filter(test=test).delete()

            # Create new TestItem records with the parameter IDs
            for parameterID in parameterIDs:
                parameter = Parameter.objects.get(id=parameterID)
                TestItem.objects.create(test=test, parameter=parameter)

            # Return a success response
            response_data = {
                "status": "success",
                "message": "Test record updated successfully!",
            }
            return JsonResponse(response_data)

        except Exception as e:
            # Return an error response if any exception occurs
            response_data = {
                "status": "error",
                "message": "Error occurred while updating the test record.",
            }
            return JsonResponse(response_data, status=500)

    else:
        # Return an error response for invalid request method
        response_data = {
            "status": "error",
            "message": "Invalid request method.",
        }
        return JsonResponse(response_data, status=400)


@csrf_exempt
def load_test_data(request):
    if request.method == "GET":
        try:
            # Retrieve the test data from the Test model
            test_data = Test.objects.values(
                "id", "test_name", "test_duration", "test_department", "test_price")

            # Convert the queryset to a list of dictionaries
            test_data_list = list(test_data)

            # Return the test data as a JSON response
            return JsonResponse(test_data_list, safe=False)

        except Exception as e:
            # Return an error response if any exception occurs
            response_data = {
                "status": "error",
                "message": "Error occurred while loading test data.",
            }
            return JsonResponse(response_data, status=500)

    else:
        # Return an error response for invalid request method
        response_data = {
            "status": "error",
            "message": "Invalid request method.",
        }
        return JsonResponse(response_data, status=400)


def render_to_pdf(template_src, context_dict={}):
    template = get_template(template_src)
    html = template.render(context_dict)

    # Add CSS style to set the width
    pdf_css = """
        <style>
            @page {
                size: 220px;
                margin: 0;
            }
            @media print {
                body {
                    width: 220px;
                }
            }
        </style>
    """
    html_with_css = pdf_css + html

    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html_with_css.encode("UTF-8")), result)
    if not pdf.err:
        return HttpResponse(result.getvalue(), content_type='application/pdf')
    return None


def handle_lab_registration_testing(request):
    if request.method == 'POST':
        # Get the test IDs from the hidden input field
        test_ids_string = request.POST.get('labTableForTestsData')
        test_ids = test_ids_string.split(',') if test_ids_string else []

        print(f'Test IDs: {test_ids}')

        data = {
            'hello': test_ids
        }

        return render(request, 'invoice.html', data)
    else:
        data = {
            'hello': 'error'
        }
        # Render the initial form page here
        return render(request, 'invoice.html', data)


@csrf_exempt
def handle_lab_registration(request):
    if request.method == "POST":
        try:
            with transaction.atomic():
                # Retrieve the form data
                patient_id = request.POST.get('patientId')
                relation = request.POST.get('relation')
                date_time = request.POST.get('dateTime')
                patient_name = request.POST.get('patientName')
                gender = request.POST.get('gender')
                age_years = request.POST.get('ageYears')
                age_months = request.POST.get('ageMonths')
                age_days = request.POST.get('ageDays')
                contact = request.POST.get('contact')
                cnic = request.POST.get('cnic')
                pannel_case = request.POST.get('pannelCase')
                refered_by = request.POST.get('referedBy')
                collection_by = request.POST.get('collectionBy')
                hospital = request.POST.get('hospital')
                special_refer = request.POST.get('specialRefer')
                phlebotomist = request.POST.get('phlebotomist')

                # Retrieve the 'pannelEmp' and other fields with default value of 0
                try:
                    pannel_emp = int(request.POST.get('pannelEmp'))
                except (TypeError, ValueError):
                    pannel_emp = 0

                try:
                    total_amount = int(request.POST.get('totalAmount'))
                except (TypeError, ValueError):
                    total_amount = 0

                try:
                    concession = int(request.POST.get('concession'))
                except (TypeError, ValueError):
                    concession = 0

                try:
                    amount_paid = int(request.POST.get('amountPaid'))
                except (TypeError, ValueError):
                    amount_paid = 0

                try:
                    pannel_amount = int(request.POST.get('pannelAmount'))
                except (TypeError, ValueError):
                    pannel_amount = 0

                # Save the LabRegistration data
                lab_registration = LabRegistration.objects.create(
                    patient_id=patient_id,
                    relation=relation,
                    datetime=date_time,
                    patient_name=patient_name,
                    gender=gender,
                    age_years=age_years,
                    age_months=age_months,
                    age_days=age_days,
                    contact_no=contact,
                    cnic=cnic,
                    pannel_case=pannel_case,
                    pannel_emp=pannel_emp,
                    refered_by=refered_by,
                    collection_by=collection_by,
                    hospital=hospital,
                    special_refer=special_refer,
                    phlebotomist=phlebotomist,
                    total_amount=total_amount,
                    concession=concession,
                    amount_paid=amount_paid,
                    pannel_amount=pannel_amount,
                )

                # Retrieve test_ids and save LabItems
                test_ids = request.POST.get('labTableForTestsData').split(',')

                for test_id in test_ids:
                    LabItems.objects.create(
                        test_id=test_id, lab_id=lab_registration.id)

            # Return a success response
            response_data = {
                "status": "success",
                "message": "Lab registration saved successfully.",
                "lab_id": lab_registration.id
            }
            return JsonResponse(response_data)

        except Exception as e:
            response_data = {
                "status": "danger",
                "message": "error: " + str(e),
            }
            return JsonResponse(response_data)
    else:
        response_data = {
            "status": "danger",
            "message": "Invalid request method",
        }
        return JsonResponse(response_data)


@csrf_exempt
def handle_lab_registrationS(request):
    if request.method == 'POST':
        # Retrieve form data
        patient_id = request.POST.get('patientId')
        relation = request.POST.get('relation')

        if relation == 'self':
            relation = 1
        else:
            relation = 0

        print(f'Relation: {relation}')
        print(type(relation))

        datetime = request.POST.get('dateTime')
        patient_name = request.POST.get('patientName')
        gender = request.POST.get('gender')
        age_years = int(request.POST.get('ageYears'))
        age_months = int(request.POST.get('ageMonths'))
        age_days = int(request.POST.get('ageDays'))
        contact_no = request.POST.get('contact')
        cnic = request.POST.get('cnic')
        pannel_case = 'pannelCase' in request.POST

        if pannel_case == True:
            pannel_case = 1
        else:
            pannel_case = 0

        print(f'Pannel Case: {pannel_case}')
        print(type(pannel_case))

        # Retrieve pannel_emp from POST data and set a default value of 0 if not found
        pannel_emp = request.POST.get('pannelEmp', 0)

        # Convert the value to an integer (if it's a valid integer), otherwise keep it as 0
        try:
            pannel_emp = int(pannel_emp)
        except ValueError:
            pannel_emp = 0

        refered_by = request.POST.get('referedBy')
        collection_by = request.POST.get('collectionBy')
        hospital = request.POST.get('hospital')
        special_refer = request.POST.get('specialRefer')
        phlebotomist = request.POST.get('phlebotomist')

       # Retrieve total_amount from POST data and set a default value of 0 if not found
        total_amount = request.POST.get('totalAmount', 0)

        # Convert the value to a float (if it's a valid float), otherwise keep it as 0
        try:
            total_amount = float(total_amount)
        except ValueError:
            total_amount = 0

        # Retrieve concession from POST data and set a default value of 0 if not found
        concession = request.POST.get('concession', 0)

        # Convert the value to a float (if it's a valid float), otherwise keep it as 0
        try:
            concession = float(concession)
        except ValueError:
            concession = 0

        # Retrieve amount_paid from POST data and set a default value of 0 if not found
        amount_paid = request.POST.get('amountPaid', 0)

        # Convert the value to a float (if it's a valid float), otherwise keep it as 0
        try:
            amount_paid = float(amount_paid)
        except ValueError:
            amount_paid = 0

        # Retrieve pannel_amount from POST data and set a default value of 0 if not found
        pannel_amount = request.POST.get('pannelAmount', 0)

        # Convert the value to a float (if it's a valid float), otherwise keep it as 0
        try:
            pannel_amount = float(pannel_amount)
        except ValueError:
            pannel_amount = 0

        # Get the test IDs from the hidden input field
        test_ids_string = request.POST.get('labTableForTestsData')
        test_ids = test_ids_string.split(',') if test_ids_string else []

        print(f'Test IDs: {test_ids}')

        print(f"RELATEION: {relation}")

        lab_status = 'pending'
        labitem_status = 'pending'

        try:
            # Save LabRegistration
            lab_registration = LabRegistration.objects.create(
                patient_id=patient_id,
                relation=relation,
                datetime=datetime,
                patient_name=patient_name,
                gender=gender,
                age_years=age_years,
                age_months=age_months,
                age_days=age_days,
                contact_no=contact_no,
                cnic=cnic,
                pannel_case=pannel_case,
                pannel_emp=pannel_emp,
                refered_by=refered_by,
                collection_by=collection_by,
                hospital=hospital,
                special_refer=special_refer,
                phlebotomist=phlebotomist,
                total_amount=total_amount,
                concession=concession,
                amount_paid=amount_paid,
                pannel_amount=pannel_amount,
                lab_status=lab_status
            )
        except:
            print('Error: got error when saving LabRegistration data in database')

        try:
            print(f'Going to start LabItems')
            # Save LabItems
            for test_id in test_ids:
                print(f'Test ID: {test_id}')
                print(f'Lab Registration ID: {lab_registration.id}')
                LabItems.objects.create(
                    test_id=test_id, lab_id=lab_registration.id, labitem_status=labitem_status)
        except:
            print('Error: got error when saving LabItems data in database')

         # Fetch records from Test model using test_ids list
        test_records = Test.objects.filter(id__in=test_ids)

        final_amount = total_amount - concession

        # Prepare the data dictionary to be sent to the template
        data = {
            'lab_registration': lab_registration,
            'test_records': test_records,
            'final_amount': final_amount
        }

        # return render(request, "invoice.html", data)
        pdf = render_to_pdf('invoice.html', data)
        return HttpResponse(pdf, content_type='application/pdf')

    # Handle other request methods if needed
    return redirect('error')


# new get lab registration data
@csrf_exempt
def get_lab_registration_data(request):
    data = []  # Create an empty list to store the data

    type_param = request.POST.get('type_param')
    values_param = request.POST.get('values_param')

    print(f"Type: {type_param}")
    print(f"Value: {values_param}")

    # Check the value of type_param
    if type_param == "all":
        # Retrieve all data in reverse order of lr.id
        sql_query = '''
            SELECT lr.id, lr.patient_name, li.id AS LAB_Item, t.id AS test_id, t.test_name, datetime, lr.gender, lr.pannel_case, li.labitem_status 
            FROM managementApp_labregistration lr, managementApp_labitems li, managementApp_test t 
            WHERE lr.id = li.lab_id AND li.test_id = t.id
            ORDER BY lr.id DESC;
        '''
    elif type_param == "id":
        # Retrieve data where lr.id matches values_param in reverse order of lr.id
        sql_query = '''
            SELECT lr.id, lr.patient_name, li.id AS LAB_Item, t.id AS test_id, t.test_name, datetime, lr.gender, lr.pannel_case, li.labitem_status 
            FROM managementApp_labregistration lr, managementApp_labitems li, managementApp_test t 
            WHERE lr.id = li.lab_id AND li.test_id = t.id AND lr.id = %s
            ORDER BY lr.id DESC;
        '''
    elif type_param == "name":
        # Retrieve data where lr.patient_name matches values_param in reverse order of lr.id
        sql_query = '''
            SELECT lr.id, lr.patient_name, li.id AS LAB_Item, t.id AS test_id, t.test_name, datetime, lr.gender, lr.pannel_case, li.labitem_status 
            FROM managementApp_labregistration lr, managementApp_labitems li, managementApp_test t 
            WHERE lr.id = li.lab_id AND li.test_id = t.id AND lr.patient_name = %s
            ORDER BY lr.id DESC;
        '''
    elif type_param == "status":
        # Retrieve data where li.labitem_status matches values_param in reverse order of lr.id
        sql_query = '''
            SELECT lr.id, lr.patient_name, li.id AS LAB_Item, t.id AS test_id, t.test_name, datetime, lr.gender, lr.pannel_case, li.labitem_status 
            FROM managementApp_labregistration lr, managementApp_labitems li, managementApp_test t 
            WHERE lr.id = li.lab_id AND li.test_id = t.id AND li.labitem_status = %s
            ORDER BY lr.id DESC;
        '''
    else:
        # Handle invalid type_param value
        return JsonResponse({"error": "Invalid type_param value"}, status=400)

    if type_param == 'all':
        # Execute the raw query using the manager for the model
        lab_registrations = LabRegistration.objects.raw(sql_query)
    else:
        # Execute the raw query using the manager for the model
        lab_registrations = LabRegistration.objects.raw(
            sql_query, [values_param])

    # Loop through the results and format the data
    for lab_registration in lab_registrations:
        lab_id = lab_registration.id
        patient_name = lab_registration.patient_name
        labitem_id = lab_registration.LAB_Item
        test_id = lab_registration.test_id
        test_name = lab_registration.test_name
        datetime = lab_registration.datetime.strftime(
            "%Y-%m-%d %H:%M")  # Format datetime as string
        gender = lab_registration.gender
        pannel_case = lab_registration.pannel_case
        labitem_status = lab_registration.labitem_status

        # Add the data for the current LabRegistration object to the list
        data.append({
            'lab_id': lab_id,
            'patient_name': patient_name,
            'labitem_id': labitem_id,
            'test_id': test_id,
            'test_name': test_name,
            'datetime': datetime,
            'gender': gender,
            'pannel_case': pannel_case,
            'labitem_status': labitem_status
        })

    # Return the data as a JSON response
    return JsonResponse(data, safe=False)


@csrf_exempt
def get_complete_lab_data(request):
    lab_id = request.POST.get('lab_id')
    labitem_id = request.POST.get('labitem_id')

    try:
        lab_registration = get_object_or_404(LabRegistration, id=lab_id)
        lab_item = get_object_or_404(LabItems, id=labitem_id)
        test = lab_item.test

        # Get associated TestItems for the test
        test_items = TestItem.objects.filter(test=test)
        parameters_list = []

        for test_item in test_items:
            parameters = Parameter.objects.filter(testitem=test_item)
            parameters_data = list(parameters.values(
                'id', 'parameter_name', 'parameter_unit', 'parameter_result_type'))
            parameters_list.extend(parameters_data)

        data = {
            'lab_registration': {
                'lab_id': lab_registration.id,
                'patient_id': lab_registration.patient_id,
                'age_years': lab_registration.age_years,
                'age_months': lab_registration.age_months,
                'age_days': lab_registration.age_days,
                'patient_name': lab_registration.patient_name,
                'gender': lab_registration.gender,
            },
            'test_id': test.id,
            'labItem_id': lab_item.id,
            'test_name': test.test_name,
            'parameters': parameters_list,
        }

        return JsonResponse(data, safe=False)

    except (LabRegistration.DoesNotExist, LabItems.DoesNotExist, Test.DoesNotExist):
        return JsonResponse({'error': 'Lab Registration, LabItems, or Test not found'}, status=404)


# @csrf_exempt
# def get_complete_lab_data(request):
#     lab_id = request.POST.get('lab_id')
#     labitem_id = request.POST.get('labitem_id')

#     # print(f"Lab ID: {lab_id}")
#     try:
#         lab_registration = LabRegistration.objects.get(id=lab_id)
#         lab_items = LabItems.objects.filter(lab=lab_registration)
#         tests = Test.objects.filter(labitems__in=lab_items)
#         parameters = Parameter.objects.filter(testitem__test__in=tests)

#         # print(f"Lab Registration: {lab_registration}")
#         # print(f"Tests: {tests}")
#         # print(f"Parameters: {parameters}")

#         # Create a list to store test data along with test_id and parameters
#         tests_with_parameters = []

#         i = 0
#         for test in tests:
#             test_parameters = parameters.filter(testitem__test=test)
#             parameters_list = list(test_parameters.values())

#             labItem_ids = lab_items.filter(test=test).values_list('id', flat=True)  # Get labItem_ids for this test
#             labItem_ids = list(labItem_ids)
#             print(f'LAB Items-->> {labItem_ids}')
#             print(f"lab_item_id: {labItem_ids[i]}")
#             test_data = {
#                 'test_id': test.id,
#                 'labItem_id': labItem_ids[i],  # List of labItem_ids for this test
#                 'test_name': test.test_name,
#                 'parameters': parameters_list,
#             }
#             tests_with_parameters.append(test_data)
#             i += 1


#         # Serialize the data and convert it to a JSON response
#         data = {
#             'lab_registration': {
#                 'patient_id': lab_registration.patient_id,
#                 'age_years': lab_registration.age_years,
#                 'age_months': lab_registration.age_months,
#                 'age_days': lab_registration.age_days,
#                 'patient_name': lab_registration.patient_name,
#                 'gender': lab_registration.gender,

#             },
#             'tests_with_parameters': tests_with_parameters,
#         }

#         return JsonResponse(data, safe=False)

#     except LabRegistration.DoesNotExist:
#         return JsonResponse({'error': 'Lab Registration not found'}, status=404)


# @csrf_exempt
# def fetch_range_values(request):
#     print('----------------------')
#     print('----------START-------')
#     print('----------------------')
#     parameter_id = request.POST.get('parameter_id')
#     gender = request.POST.get('gender')

#     print("Parameter ID:", parameter_id)  # Debug print statement
#     print("Gender: ", gender)

#     # return JsonResponse({'message': 'Found'}, status=404)
#     try:
#         print('inside try')
#         range_parameters = RangeParameter.objects.filter(parameter_id=parameter_id)
#         print('after getting record')
#         if range_parameters.exists():
#             range_parameter = range_parameters.first()  # Choose one of the matching records
#             response_data = {
#                 'min_value': range_parameter.normal_value_from,
#                 'max_value': range_parameter.normal_value_to
#             }
#         print('after getting data from database')
#         return JsonResponse(response_data)
#     except RangeParameter.DoesNotExist:
#         print('inside except rangeparameter')
#         return JsonResponse({'message': 'No record found'}, status=404)


# @csrf_exempt
# def fetch_range_values(request):
#     print('----------------------')
#     print('----------START-------')
#     print('----------------------')
#     parameter_id = request.POST.get('parameter_id')

#     try:
#         range_parameters = RangeParameter.objects.filter(parameter_id=parameter_id)
#         genders = []

#         # Step 1: Fetch and save male records
#         male_records = range_parameters.filter(gender='Male')
#         male_data = []
#         if male_records.exists():
#             for record in male_records:
#                 male_data.append({
#                     'gender': record.gender,
#                     'normal_value_from': record.normal_value_from,
#                     'normal_value_to': record.normal_value_to,
#                     'age_from': record.age_from,
#                     'age_to': record.age_to,
#                 })
#             genders.append('Male')

#         # Step 2: Fetch and save female records
#         female_records = range_parameters.filter(gender='Female')
#         female_data = []
#         if female_records.exists():
#             for record in female_records:
#                 female_data.append({
#                     'gender': record.gender,
#                     'normal_value_from': record.normal_value_from,
#                     'normal_value_to': record.normal_value_to,
#                     'age_from': record.age_from,
#                     'age_to': record.age_to,
#                 })
#             genders.append('Female')

#         # Step 3: Fetch and save child records
#         child_records = range_parameters.filter(gender='Child')
#         child_data = []
#         if child_records.exists():
#             for record in child_records:
#                 child_data.append({
#                     'gender': record.gender,
#                     'normal_value_from': record.normal_value_from,
#                     'normal_value_to': record.normal_value_to,
#                     'age_from': record.age_from,
#                     'age_to': record.age_to,
#                 })
#             genders.append('Child')

#         # Step 4: Check for similar records and prepare response
#         if len(genders) == 1:
#             response_data = male_data + female_data + child_data
#             gender_status = genders[0]
#         else:
#             # Check if records for all genders are the same
#             all_records = male_data + female_data + child_data
#             same_records = all(r == all_records[0] for r in all_records)
#             if same_records:
#                 response_data = all_records[:1]  # Return only one record
#                 gender_status = 'Similar'
#             else:
#                 response_data = all_records  # Return all records
#                 gender_status = 'Dissimilar'

#         # Step 5: Prepare and return the final response
#         final_response = {
#             'gender_status': gender_status,
#             'data': response_data,
#             'genders':genders
#         }

#         return JsonResponse(final_response)

#     except RangeParameter.DoesNotExist:
#         return JsonResponse({'message': 'No record found'}, status=404)


@csrf_exempt
def fetch_range_values(request):
    parameter_id = request.POST.get('parameter_id')

    try:
        # Fetch male records
        male_records = RangeParameter.objects.filter(parameter_id=parameter_id, gender='Male').values(
            'gender', 'normal_value_from', 'normal_value_to', 'age_from', 'age_to'
        )

        # Fetch female records
        female_records = RangeParameter.objects.filter(parameter_id=parameter_id, gender='Female').values(
            'gender', 'normal_value_from', 'normal_value_to', 'age_from', 'age_to'
        )

        # Fetch child records
        child_records = RangeParameter.objects.filter(parameter_id=parameter_id, gender='Child').values(
            'gender', 'normal_value_from', 'normal_value_to', 'age_from', 'age_to'
        )

        genders = []
        data = []

        if male_records:
            genders.append('Male')
            data.extend(male_records)

        if female_records:
            genders.append('Female')
            data.extend(female_records)

        if child_records:
            genders.append('Child')
            data.extend(child_records)

        # Check if all records have the same normal_value_from and normal_value_to
        same_records = all(
            record['normal_value_from'] == data[0]['normal_value_from'] and
            record['normal_value_to'] == data[0]['normal_value_to']
            for record in data
        )

        if same_records:
            response_data = {
                'gender_status': 'Single',
                'data': {
                    **data[0],
                    'unit': Parameter.objects.get(id=parameter_id).parameter_unit
                },
                'genders': genders
            }
        else:
            if len(genders) > 1:
                gender_status = 'Multiple'
            else:
                gender_status = 'Single'

            response_data = {
                'gender_status': gender_status,
                'data': [
                    {**record,
                        'unit': Parameter.objects.get(id=parameter_id).parameter_unit}
                    for record in data
                ],
                'genders': genders
            }

        return JsonResponse(response_data)
    except RangeParameter.DoesNotExist:
        return JsonResponse({'message': 'No record found'}, status=404)


@csrf_exempt
def save_lab_results(request):
    print('funciton one')

    inputValue = ''
    resultValue = ''
    resultType = ''

    if request.method == 'POST':
        resultData = request.POST.get('resultData')
        dbLabId = request.POST.get('dbLabId')
        dbLabitemId = request.POST.get('dbLabitemId')
        dbTestName = request.POST.get('dbTestName')
        remarks = request.POST.get('remarks')
        record_type = request.POST.get('record_type')
        result_id_pg = request.POST.get('result_id_pg')

        print(f"Result DATA: {resultData}")

        resultData = resultData.split('/nl/')

        if resultData:
            resultData = resultData[:-1]

        try:
            with transaction.atomic():
                # Create a savepoint before starting the transaction
                sid = transaction.savepoint()

                if record_type == "create":
                    # Save data to Result model ONCE
                    result = Result.objects.create(
                        lab_id=dbLabId,
                        labitem_id=dbLabitemId,
                        test_name=dbTestName
                    )

                print('outside result item loop')
                for item in resultData:
                    item = item.split(',,')
                    print('inside result item loop')
                    parameterName = item[0]
                    radioValue = item[1]
                    inputValue = item[2]
                    normalRange = item[3]

                    if radioValue != '':
                        resultValue = radioValue
                        values = inputValue
                    else:
                        resultValue = inputValue
                        values = ''

                    if normalRange not in ['positiveNegative', 'detectedNotDetected', 'text']:
                        resultType = 'range'
                    else:
                        resultType = normalRange

                    if record_type == "create":
                        # Save data to ResultItems model
                        result_item = ResultItems(
                            result=result,
                            result_value=resultValue,
                            values=values,
                            type_normal_range=normalRange if normalRange not in [
                                'positiveNegative', 'detectedNotDetected', 'text'] else '',
                            remarks=remarks if remarks else '',
                            parameterName=parameterName,
                            result_type=resultType

                        )
                        result_item.save()

                        # Update LabItems status to 'Processing'
                        lab_item = LabItems.objects.get(pk=dbLabitemId)
                        lab_item.labitem_status = 'Processing'
                        lab_item.save()

                    else:
                        result_item_to_delete = ResultItems.objects.get(
                            result=result_id_pg)
                        result_item_to_delete.delete()

                        # Create a new record with the same information, but replace result with result_id_pg
                        result_item = ResultItems(
                            result=result_id_pg,  # Replace with the new result_id_pg
                            result_value=resultValue,
                            values=values,
                            type_normal_range=normalRange if normalRange not in [
                                'positiveNegative', 'detectedNotDetected', 'text'] else '',
                            remarks=remarks if remarks else '',
                            parameterName=parameterName,
                            result_type=resultType
                        )
                        result_item.save()

                        # Update LabItems status to 'Processing'
                        lab_item = LabItems.objects.get(pk=dbLabitemId)
                        lab_item.labitem_status = 'Ready'
                        lab_item.save()

                # If all data is saved successfully, commit the transaction
                transaction.savepoint_commit(sid)

                return JsonResponse({'status': 'success', 'message': 'Results saved successfully.'})
        except Exception as e:
            # If an error occurs during saving, handle it here.
            # You may need to reverse previously saved data.
            transaction.savepoint_rollback(sid)
            print(f'Error: {str(e)}')
            return JsonResponse({'status': 'danger', 'message': f'Error: {str(e)}'}, status=500)
    else:
        return JsonResponse({'status': 'danger', 'message': 'Invalid request method.'}, status=400)


@csrf_exempt
def save_lab_results_too(request):
    if request.method == 'POST':
        # Get the JSON data sent from the JavaScript code
        resultData = request.POST.get('resultData')
        remarks = request.POST.get('remarks')

        print(f"ResultData: {resultData}")
        print(f"Remarks {remarks}")

        return JsonResponse({'message': 'Results saved successfully.'})

    else:
        return JsonResponse({'message': 'Invalid request method.'}, status=400)


@csrf_exempt
def get_result_items(request):
    # You can change this to POST if needed
    labitem_id = request.GET.get('labitem_id')

    # Query the ResultItems model to get data based on labitem_id
    result_items = ResultItems.objects.filter(result__labitem_id=labitem_id)

    # Serialize the data into a JSON format
    data = [{'result_id': item.result_id, 'result_value': item.result_value, 'values': item.values, 'type_normal_range': item.type_normal_range,
             'remarks': item.remarks, 'parameterName': item.parameterName, 'result_type': item.result_type} for item in result_items]

    print(f"Data: {data}")
    return JsonResponse(data, safe=False)


@csrf_exempt
def print_lab_record(request):
    labitem_id = request.POST.get('labitem_id')

    variables = {
        "text": 0,
        "range": 0,
        "positive": 0,
        "detective": 0
    }

    report = ""
    remarks = ""

    try:
        # Get LabItems details
        lab_item = LabItems.objects.get(id=labitem_id)

        # Get LabRegistration details
        lab_registration = LabRegistration.objects.get(id=lab_item.lab_id)

        # Get Result details
        result = Result.objects.get(labitem=lab_item)

        # Get ResultItems details (multiple records)
        result_items = ResultItems.objects.filter(result=result)

        for ri in result_items:
            remarks = ri.remarks
            if ri.result_type == "text":
                variables["text"] += 1
            elif ri.result_type == "range":
                variables["range"] += 1
            elif ri.result_type == "positiveNegative":
                variables["positive"] += 1
            elif ri.result_type == "detectedNotDetected":
                variables["detective"] += 1

        max_variable = max(variables, key=variables.get)

        report = max_variable

        # Get Test name from the associated Test model
        test_name = lab_item.test.test_name

        # Extract relevant fields from LabRegistration
        patient_name = lab_registration.patient_name
        age_years = lab_registration.age_years
        age_months = lab_registration.age_months
        age_days = lab_registration.age_days
        gender = lab_registration.gender
        lab_date = lab_registration.datetime
        lab_id = lab_registration.id
        refered_by = lab_registration.refered_by
        pannel_emp = lab_registration.pannel_emp

        # Create a dictionary to organize the collected data
        labitem_details = {
            'patient_name': patient_name,
            'age_years': age_years,
            'age_months': age_months,
            'age_days': age_days,
            'gender': gender,
            'lab_date': lab_date,
            'lab_id': lab_id,
            'refered_by': refered_by,
            'pannel_emp': pannel_emp,
            'test_name': test_name,
            'remarks': remarks,
            'result_items': result_items  # Directly include result_items
        }

        pdf = render_to_pdf(f'{report}.html', labitem_details)
        return HttpResponse(pdf, content_type='application/pdf')

    except LabItems.DoesNotExist:
        return None  # LabItem with the given labitem_id doesn't exist

    except Result.DoesNotExist:
        return None  # Result associated with the LabItem doesn't exist

    except ResultItems.DoesNotExist:
        return None  # No ResultItems associated with the Result

    except LabRegistration.DoesNotExist:
        return None  # LabRegistration associated with the LabItem doesn't exist


def render_to_pdf(template_src, context_dict={}):
    template = get_template(template_src)
    html = template.render(context_dict)
    result = BytesIO()
    # , link_callback=fetch_resources)
    pdf = pisa.pisaDocument(BytesIO(html.encode("UTF-8")), result)
    if not pdf.err:
        return HttpResponse(result.getvalue(), content_type='application/pdf')
    return None
