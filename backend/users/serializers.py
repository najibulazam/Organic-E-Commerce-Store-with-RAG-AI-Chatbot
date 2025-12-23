from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    class Meta:
        model = UserProfile
        fields = ['phone', 'profile_image', 'address', 'city', 'state', 'zip_code', 'country']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user model with profile"""
    profile = UserProfileSerializer(required=False)
    profile_image = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 
                  'profile_image', 'profile', 'date_joined']
        read_only_fields = ['id', 'date_joined']
    
    def get_profile_image(self, obj):
        """Get Cloudinary URL for profile image"""
        if hasattr(obj, 'profile') and obj.profile.profile_image:
            # CloudinaryField returns the URL directly
            return str(obj.profile.profile_image.url) if obj.profile.profile_image else None
        return None
    
    def get_phone(self, obj):
        return obj.profile.phone if hasattr(obj, 'profile') else None


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'phone']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        phone = validated_data.pop('phone', None)
        user = User.objects.create_user(**validated_data)
        if phone:
            user.profile.phone = phone
            user.profile.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    phone = serializers.CharField(required=False, allow_blank=True)
    profile_image = serializers.ImageField(required=False, allow_null=True, use_url=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    zip_code = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'profile_image', 
                  'address', 'city', 'state', 'zip_code', 'country']
    
    def validate_profile_image(self, value):
        """Validate image file"""
        if value:
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Image file size must be less than 5MB")
            
            # Check file type
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            ext = value.name.lower().split('.')[-1]
            if f'.{ext}' not in valid_extensions:
                raise serializers.ValidationError(
                    f"Invalid image format. Allowed formats: {', '.join(valid_extensions)}"
                )
        return value
    
    def update(self, instance, validated_data):
        # Extract profile fields
        profile_fields = ['phone', 'profile_image', 'address', 'city', 'state', 'zip_code', 'country']
        profile_data = {k: validated_data.pop(k) for k in profile_fields if k in validated_data}
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update profile fields
        if profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        
        return instance
