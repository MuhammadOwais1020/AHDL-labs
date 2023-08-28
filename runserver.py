from django.core.management import execute_from_command_line
from LabManagementSystem import settings

if __name__ == "__main__":
    settings.DEBUG = True  # Set DEBUG mode
    execute_from_command_line(["manage.py", "runserver"])
