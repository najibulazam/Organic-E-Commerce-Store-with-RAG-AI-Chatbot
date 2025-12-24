"""
Management command to create a superuser automatically.
Run: python manage.py create_superuser_auto
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Creates a superuser automatically if none exists'

    def handle(self, *args, **options):
        username = 'admin'
        email = 'najibul.azm@gmail.com'
        password = 'admin'
        
        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'→ Superuser "{username}" already exists'))
        else:
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Superuser "{username}" created successfully'))
            self.stdout.write(self.style.SUCCESS(f'  Email: {email}'))
            self.stdout.write(self.style.WARNING(f'  ⚠️  Default password: {password} (change in production!)'))
