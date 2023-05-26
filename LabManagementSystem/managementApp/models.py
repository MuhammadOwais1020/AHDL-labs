from django.db import models

# Create your models here.


class Patient(models.Model):
    patient_name = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=20)
    cnic_number = models.CharField(max_length=15)
    email = models.EmailField()
    gender = models.CharField(max_length=10)
    city = models.CharField(max_length=50)
    age_years = models.IntegerField()
    age_months = models.IntegerField()
    age_days = models.IntegerField()

    def __str__(self):
        return self.patient_name
