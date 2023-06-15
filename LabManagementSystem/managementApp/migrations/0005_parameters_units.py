# Generated by Django 4.2 on 2023-06-01 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managementApp', '0004_doctor'),
    ]

    operations = [
        migrations.CreateModel(
            name='Parameters',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parameter', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Units',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unit', models.CharField(max_length=50)),
            ],
        ),
    ]