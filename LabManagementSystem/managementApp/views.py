from .models import Patient
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import Patient, Doctor, Parameters, Units
from .models import AccountEntry
from django.views.decorators.http import require_POST
from .forms import PatientForm
from datetime import datetime
from datetime import date
from django.db.models import Sum
from django.db.models import Q
import os

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
