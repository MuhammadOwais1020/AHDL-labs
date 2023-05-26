from django.http import JsonResponse
import json
from django.shortcuts import render
from .models import Patient

# Create your views here.

# admin index page


def index(request):
    return render(request, 'index.html')


# add patient


def add_patient(request):
    if request.method == 'POST':
        form = Patient(request.POST)
        if form.is_valid():
            patient = form.save()  # Save the form data to the database
            # Perform any additional processing

            # Create a JSON response with the patient data
            response_data = {
                'success': True,
                'message': 'Patient added successfully.',
                'patient': {
                    'id': patient.id,
                    'patient_name': patient.patient_name,
                    'mobile_number': patient.mobile_number,
                    'cnic_number': patient.cnic_number,
                    'email': patient.email,
                    'gender': patient.gender,
                    'city': patient.city,
                    'age_years': patient.age_years,
                    'age_months': patient.age_months,
                    'age_days': patient.age_days
                }
            }
            return JsonResponse(response_data)
        else:
            errors = form.errors.as_json()
            return JsonResponse({'success': False, 'errors': errors}, status=400)

    return render(request, 'add_patient.html', {'form': form})
