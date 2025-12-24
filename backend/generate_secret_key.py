"""
Generate a secure SECRET_KEY for Django production deployment.
Run this script and copy the generated key to your environment variables.
"""

from django.core.management.utils import get_random_secret_key

if __name__ == '__main__':
    secret_key = get_random_secret_key()
    print("\n" + "="*70)
    print("🔑 Django SECRET_KEY Generator")
    print("="*70)
    print("\nYour new SECRET_KEY:")
    print(f"\n{secret_key}\n")
    print("="*70)
    print("\n📋 Instructions:")
    print("1. Copy the key above")
    print("2. Add to Render Environment Variables:")
    print("   SECRET_KEY=<paste-key-here>")
    print("3. NEVER commit this key to Git!")
    print("\n" + "="*70 + "\n")
