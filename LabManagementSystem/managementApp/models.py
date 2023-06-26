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


class Parameters(models.Model):
    parameter = models.CharField(max_length=100)

    def __str__(self):
        return self.parameter


class Units(models.Model):
    unit = models.CharField(max_length=50)

    def __str__(self):
        return self.unit


class AccountEntry(models.Model):
    date = models.DateField()
    category = models.CharField(max_length=100)
    description = models.TextField()
    dr = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cr = models.DecimalField(max_digits=10, decimal_places=2, default=0)


class StaffProfile(models.Model):
    full_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    cast = models.CharField(max_length=50)
    cnic = models.CharField(max_length=15)
    mobile_number = models.CharField(max_length=15)
    address = models.TextField()
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    designation = models.CharField(
        max_length=50,
        choices=[
            ('admin', 'Admin'),
            ('pathologist', 'Pathologist'),
            ('receptionist', 'Receptionist'),
            ('clerk', 'Clerk')
        ]
    )


class Parameter(models.Model):
    parameter_name = models.CharField(max_length=255)
    parameter_unit = models.CharField(max_length=50)
    parameter_result_type = models.CharField(max_length=50)

    def __str__(self):
        return self.parameter_name

#
