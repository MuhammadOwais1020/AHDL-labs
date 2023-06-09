"""
URL configuration for LabManagementSystem project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from managementApp import views as ma

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", ma.index, name=""),
    path("add_patient/", ma.add_patient, name="add_patient"),
    path('get_patients_data/', ma.get_patients_data, name='get_patients_data'),
    path('get_doctors_names', ma.get_doctors_names, name="get_doctors_names"),
    path('add_new_refered_by', ma.add_new_refered_by, name="add_new_refered_by"),
    path('check_patient_id', ma.check_patient_id, name="check_patient_id"),
    path('get_units', ma.get_units, name="get_units"),
    path('get_parameters', ma.get_parameters, name="get_parameters"),
    path('add_parameter', ma.add_parameter, name="add_parameter"),
    path('add_unit', ma.add_unit, name="add_unit"),
    path('add_account_entry', ma.add_account_entry, name="add_account_entry"),
    path('get_account_entries', ma.get_account_entries, name="get_account_entries"),
    path('get_filter_account_entries', ma.get_filter_account_entries,
         name="get_filter_account_entries")
]
