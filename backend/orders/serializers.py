from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    product_image = serializers.SerializerMethodField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_slug', 'product_image', 'quantity', 'price', 'total_price']
    
    def get_product_image(self, obj):
        if obj.product.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
        return None


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    items = OrderItemSerializer(many=True)
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.CharField(source='email', read_only=True)
    customer_phone = serializers.CharField(source='phone', read_only=True)
    shipping_address = serializers.SerializerMethodField()
    total_price = serializers.DecimalField(source='total_amount', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'first_name', 'last_name', 'customer_name', 'customer_email', 'customer_phone',
            'email', 'phone', 'address', 'city', 'postal_code', 'country',
            'shipping_address', 'total_amount', 'total_price', 'status', 'items', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']
    
    def get_customer_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    
    def get_shipping_address(self, obj):
        return f"{obj.address}, {obj.city}, {obj.postal_code}, {obj.country}"
    
    def create(self, validated_data):
        """Create order with items"""
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order


class OrderListSerializer(serializers.ModelSerializer):
    """Simplified serializer for order list"""
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'first_name', 'last_name', 'email',
            'total_amount', 'status', 'items_count', 'created_at'
        ]
    
    def get_items_count(self, obj):
        return obj.items.count()
