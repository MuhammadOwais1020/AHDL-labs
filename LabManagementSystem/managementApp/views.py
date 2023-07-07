from .models import Patient
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
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
            Parameter.objects.filter(id=parameter_id).update(parameter_name=parameter_name, parameter_unit=parameter_unit, parameter_result_type=parameter_type)

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
        parameter = Parameter.objects.filter(parameter_name=parameter_name).first()

        # if parameter:
        #     # Return a JSON response with a warning message
        #     response_data = {
        #         'status': 'warning',
        #         'message': 'Parameter already exists.'
        #     }
        #     return JsonResponse(response_data)

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
        
        print(child_parameters)
        print(type(child_parameters))
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
        print(female_parameters)
        print(type(female_parameters))
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

        print(male_parameters)
        print(type(male_parameters))

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
            existing_parameters = RangeParameter.objects.filter(parameter=parameter_id)
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