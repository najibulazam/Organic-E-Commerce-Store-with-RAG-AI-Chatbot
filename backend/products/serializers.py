from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'created_at']
    
    def get_image(self, obj):
        """Return full Cloudinary URL for the image"""
        if obj.image:
            return obj.image.url
        return None


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 
            'description', 'price', 'discount_price', 'final_price',
            'image', 'stock', 'available', 'featured', 'rating',
            'is_on_sale', 'created_at', 'updated_at'
        ]
    
    def get_image(self, obj):
        """Return full Cloudinary URL for the image"""
        if obj.image:
            return obj.image.url
        return None
