# Generated by Django 4.2.3 on 2023-07-20 11:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('managementApp', '0013_delete_labitems_delete_labregistration'),
    ]

    operations = [
        migrations.CreateModel(
            name='LabRegistration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('patient_id', models.CharField(max_length=100)),
                ('self', models.IntegerField()),
                ('datetime', models.DateTimeField()),
                ('patient_name', models.CharField(max_length=100)),
                ('gender', models.CharField(max_length=10)),
                ('age_years', models.IntegerField()),
                ('age_months', models.IntegerField()),
                ('age_days', models.IntegerField()),
                ('contact_no', models.CharField(max_length=100)),
                ('cnic', models.CharField(max_length=100)),
                ('pannel_case', models.IntegerField()),
                ('pannel_emp', models.IntegerField()),
                ('refered_by', models.CharField(max_length=100)),
                ('collection_by', models.CharField(max_length=100)),
                ('hospital', models.CharField(max_length=100)),
                ('special_refer', models.CharField(max_length=100)),
                ('phlebotomist', models.CharField(max_length=100)),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('concession', models.DecimalField(decimal_places=2, max_digits=10)),
                ('amount_paid', models.DecimalField(decimal_places=2, max_digits=10)),
                ('pannel_amount', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='LabItems',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lab', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='managementApp.labregistration')),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='managementApp.test')),
            ],
        ),
    ]
