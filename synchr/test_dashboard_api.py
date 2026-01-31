import os
import django
import traceback
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, force_authenticate

import sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'horilla.settings')
sys.path.append(os.getcwd())
django.setup()

from horilla_api.api_views.employee.views import EmployeeDashboardAPIView

def test_view():
    try:
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            print("No superuser found")
            return
        
        print(f"Testing with user: {user.username}")
        factory = APIRequestFactory()
        request = factory.get('/api/v1/employee/dashboard/')
        force_authenticate(request, user=user)
        view = EmployeeDashboardAPIView.as_view()
        response = view(request)
        print('STATUS:', response.status_code)
        if hasattr(response, 'data'):
            print('DATA:', response.data)
        else:
            print('CONTENT:', response.content)
    except Exception:
        traceback.print_exc()

if __name__ == "__main__":
    test_view()
