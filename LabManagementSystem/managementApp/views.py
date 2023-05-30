from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import Patient
from django.views.decorators.http import require_POST
from .forms import PatientForm

# Create your views here.

# admin index page


def index(request):
    return render(request, 'index.html')

# add patient data into database


@require_POST
def add_patient(request):
    form = PatientForm(request.POST)
    if form.is_valid():
        form.save()
        response_data = {'status': 'success',
                         'message': 'Patient added successfully.'}
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
