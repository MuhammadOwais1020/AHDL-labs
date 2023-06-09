from django import forms
from .models import Patient
from .models import AccountEntry


class PatientForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = ['patient_name', 'mobile_number', 'cnic_number', 'email',
                  'gender', 'city', 'age_years', 'age_months', 'age_days']
