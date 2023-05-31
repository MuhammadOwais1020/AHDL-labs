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


class Lab(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    pannel_case = models.BooleanField()
    pannel_emp_id = models.CharField(max_length=100)
    referred_by = models.CharField(max_length=100)
    collected_by = models.CharField(max_length=100)
    hospital = models.CharField(max_length=100)
    special_refer = models.CharField(max_length=100)
    phlebotomist = models.CharField(max_length=100)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    concession = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    pannel_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Lab ID: {self.id}"


class Doctor(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
