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
