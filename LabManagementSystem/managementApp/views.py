from django.shortcuts import render

# Create your views here.

# admin index page 
def index(request):
    return render(request, 'index.html')