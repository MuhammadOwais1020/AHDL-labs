# Generated by Django 4.2.3 on 2023-07-20 11:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managementApp', '0014_labregistration_labitems'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labregistration',
            name='self',
            field=models.CharField(max_length=100),
        ),
    ]