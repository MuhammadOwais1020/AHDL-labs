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
    path('get_account_entries', ma.get_account_entries,
         name="get_account_entries"),
    path('get_filter_account_entries', ma.get_filter_account_entries,
         name="get_filter_account_entries"),
    path('save_staff_profile', ma.save_staff_profile, name="save_staff_profile"),
    path('get_staff_profiles', ma.get_staff_profiles, name="get_staff_profiles"),
    path('make_parameter', ma.make_parameter, name="make_parameter"),
    path('get_all_parameters', ma.get_all_parameters, name="get_all_parameters"),
    path('update_parameters/', ma.update_parameters, name="update_parameters"),
    path('save_range_parameters', ma.save_range_parameters,
         name="save_range_parameters"),
    path('get_range_parameters_by_parameter', ma.get_range_parameters_by_parameter,
         name="get_range_parameters_by_parameter"),
    path('update_range_parameters', ma.update_range_parameters,
         name="update_range_parameters"),
    path('load_parameters_for_test', ma.load_parameters_for_test,
         name="load_parameters_for_test"),
    path('save_test_data', ma.save_test_data, name="save_test_data"),
    path('get_test_data', ma.get_test_data, name="get_test_data"),
    path('get_test_items', ma.get_test_items, name="get_test_items"),
    path('update_test_record', ma.update_test_record, name="update_test_record"),
    path('load_test_data', ma.load_test_data, name="load_test_data"),
    path('handle_lab_registration/', ma.handle_lab_registration, name="handle_lab_registration"),
    path('get_lab_registration_data', ma.get_lab_registration_data, name="get_lab_registration_data")
]
