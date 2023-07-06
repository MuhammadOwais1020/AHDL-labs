# Generated by Django 4.2.3 on 2023-07-04 09:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('managementApp', '0008_parameter'),
    ]

    operations = [
        migrations.CreateModel(
            name='RangeParameter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gender', models.CharField(max_length=10)),
                ('normal_value_from', models.DecimalField(decimal_places=2, max_digits=10)),
                ('normal_value_to', models.DecimalField(decimal_places=2, max_digits=10)),
                ('age_from', models.IntegerField()),
                ('age_to', models.IntegerField()),
                ('parameter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='managementApp.parameter')),
            ],
        ),
    ]