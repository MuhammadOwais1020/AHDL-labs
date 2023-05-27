from django.db import models

# Create your models here.


class Patient(models.Model):
    patient_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=15)
    cnic_number = models.CharField(max_length=15)
    email = models.EmailField()
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    city = models.CharField(max_length=255)
    age_years = models.PositiveIntegerField()
    age_months = models.PositiveIntegerField()
    age_days = models.PositiveIntegerField()

    def __str__(self):
        return self.patient_name
