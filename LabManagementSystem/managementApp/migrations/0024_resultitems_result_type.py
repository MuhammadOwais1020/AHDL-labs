# Generated by Django 4.2.3 on 2023-09-23 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managementApp', '0023_resultitems_parametername'),
    ]

    operations = [
        migrations.AddField(
            model_name='resultitems',
            name='result_type',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
