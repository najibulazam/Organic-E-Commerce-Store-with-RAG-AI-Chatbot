from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Order
from .serializers import OrderSerializer, OrderListSerializer


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for orders
    GET /api/orders/ - List all orders
    POST /api/orders/ - Create a new order
    GET /api/orders/{id}/ - Get order details
    """
    queryset = Order.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        return OrderSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        """Create a new order"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {
                'message': 'Order created successfully',
                'order': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
