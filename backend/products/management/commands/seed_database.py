"""
Management command to seed the database with sample products and categories.
Run: python manage.py seed_database
"""

from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = 'Seeds the database with initial product and category data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🌱 Starting database seeding...'))

        # Create categories
        categories_data = [
            {'name': 'Fruits', 'slug': 'fruits', 'description': 'Fresh organic fruits'},
            {'name': 'Vegetables', 'slug': 'vegetables', 'description': 'Farm-fresh organic vegetables'},
            {'name': 'Dairy', 'slug': 'dairy', 'description': 'Organic dairy products'},
            {'name': 'Grains & Cereals', 'slug': 'grains-cereals', 'description': 'Healthy organic grains'},
            {'name': 'Nuts & Seeds', 'slug': 'nuts-seeds', 'description': 'Nutritious organic nuts and seeds'},
            {'name': 'Beverages', 'slug': 'beverages', 'description': 'Refreshing organic beverages'},
            {'name': 'Snacks', 'slug': 'snacks', 'description': 'Healthy organic snacks'},
            {'name': 'Meat & Poultry', 'slug': 'meat-poultry', 'description': 'Organic meat products'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={'name': cat_data['name'], 'description': cat_data['description']}
            )
            categories[cat_data['slug']] = category
            status = '✓ Created' if created else '→ Exists'
            self.stdout.write(f'  {status}: {category.name}')

        # Create products
        products_data = [
            # Fruits
            {'name': 'Organic Apples', 'slug': 'organic-apples', 'category': 'fruits', 'price': 4.99, 'stock': 100, 'description': 'Fresh crispy organic apples, perfect for snacking', 'featured': True, 'rating': 4.8, 'image': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'},
            {'name': 'Organic Bananas', 'slug': 'organic-bananas', 'category': 'fruits', 'price': 2.99, 'stock': 150, 'description': 'Sweet organic bananas, rich in potassium', 'rating': 4.7, 'image': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400'},
            {'name': 'Organic Oranges', 'slug': 'organic-oranges', 'category': 'fruits', 'price': 5.99, 'stock': 80, 'description': 'Juicy organic oranges packed with vitamin C', 'rating': 4.6, 'image': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400'},
            {'name': 'Organic Strawberries', 'slug': 'organic-strawberries', 'category': 'fruits', 'price': 6.99, 'stock': 50, 'description': 'Sweet organic strawberries, farm fresh', 'featured': True, 'rating': 4.9, 'image': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400'},
            {'name': 'Organic Blueberries', 'slug': 'organic-blueberries', 'category': 'fruits', 'price': 8.99, 'stock': 60, 'description': 'Antioxidant-rich organic blueberries', 'rating': 4.8, 'image': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400'},
            {'name': 'Organic Avocados', 'slug': 'organic-avocados', 'category': 'fruits', 'price': 7.99, 'stock': 70, 'description': 'Creamy organic avocados, high in healthy fats', 'featured': True, 'rating': 4.7, 'image': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400'},
            
            # Vegetables
            {'name': 'Organic Carrots', 'slug': 'organic-carrots', 'category': 'vegetables', 'price': 3.49, 'stock': 120, 'description': 'Crunchy organic carrots, great for vitamin A', 'rating': 4.5, 'image': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400'},
            {'name': 'Organic Tomatoes', 'slug': 'organic-tomatoes', 'category': 'vegetables', 'price': 4.99, 'stock': 90, 'description': 'Fresh organic tomatoes, vine-ripened', 'featured': True, 'rating': 4.6, 'image': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'},
            {'name': 'Organic Broccoli', 'slug': 'organic-broccoli', 'category': 'vegetables', 'price': 3.99, 'stock': 70, 'description': 'Healthy organic broccoli, nutrient dense', 'rating': 4.4, 'image': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400'},
            {'name': 'Organic Spinach', 'slug': 'organic-spinach', 'category': 'vegetables', 'price': 2.99, 'stock': 100, 'description': 'Nutritious organic spinach, iron-rich', 'rating': 4.7, 'image': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'},
            {'name': 'Organic Kale', 'slug': 'organic-kale', 'category': 'vegetables', 'price': 3.99, 'stock': 80, 'description': 'Superfood organic kale, loaded with vitamins', 'rating': 4.5, 'image': 'https://images.unsplash.com/photo-1590777668717-c0f8e0577950?w=400'},
            {'name': 'Organic Bell Peppers', 'slug': 'organic-bell-peppers', 'category': 'vegetables', 'price': 5.99, 'stock': 75, 'description': 'Colorful organic bell peppers, vitamin C rich', 'rating': 4.6, 'image': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400'},
            
            # Dairy
            {'name': 'Organic Milk', 'slug': 'organic-milk', 'category': 'dairy', 'price': 5.99, 'stock': 60, 'description': 'Fresh organic whole milk, hormone-free', 'rating': 4.8, 'image': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'},
            {'name': 'Organic Cheese', 'slug': 'organic-cheese', 'category': 'dairy', 'price': 7.99, 'stock': 40, 'description': 'Artisan organic cheese, aged to perfection', 'featured': True, 'rating': 4.9, 'image': 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400'},
            {'name': 'Organic Greek Yogurt', 'slug': 'organic-greek-yogurt', 'category': 'dairy', 'price': 4.99, 'stock': 55, 'description': 'Creamy organic Greek yogurt, probiotic-rich', 'rating': 4.7, 'image': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'},
            {'name': 'Organic Butter', 'slug': 'organic-butter', 'category': 'dairy', 'price': 6.99, 'stock': 45, 'description': 'Premium organic butter, grass-fed', 'rating': 4.8, 'image': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'},
            
            # Grains
            {'name': 'Organic Brown Rice', 'slug': 'organic-brown-rice', 'category': 'grains-cereals', 'price': 8.99, 'stock': 80, 'description': 'Whole grain organic brown rice, high fiber', 'rating': 4.6, 'image': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'},
            {'name': 'Organic Quinoa', 'slug': 'organic-quinoa', 'category': 'grains-cereals', 'price': 12.99, 'stock': 50, 'description': 'Premium organic quinoa, complete protein', 'featured': True, 'rating': 4.8, 'image': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'},
            {'name': 'Organic Oats', 'slug': 'organic-oats', 'category': 'grains-cereals', 'price': 6.99, 'stock': 90, 'description': 'Rolled organic oats, heart-healthy', 'rating': 4.7, 'image': 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=400'},
            {'name': 'Organic Whole Wheat Bread', 'slug': 'organic-whole-wheat-bread', 'category': 'grains-cereals', 'price': 5.99, 'stock': 65, 'description': 'Freshly baked organic whole wheat bread', 'rating': 4.5, 'image': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'},
            
            # Nuts & Seeds
            {'name': 'Organic Almonds', 'slug': 'organic-almonds', 'category': 'nuts-seeds', 'price': 14.99, 'stock': 60, 'description': 'Raw organic almonds, vitamin E rich', 'featured': True, 'rating': 4.8, 'image': 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400'},
            {'name': 'Organic Chia Seeds', 'slug': 'organic-chia-seeds', 'category': 'nuts-seeds', 'price': 9.99, 'stock': 70, 'description': 'Nutritious organic chia seeds, omega-3 rich', 'rating': 4.7, 'image': 'https://images.unsplash.com/photo-1520950174652-308b60c22b3f?w=400'},
            {'name': 'Organic Walnuts', 'slug': 'organic-walnuts', 'category': 'nuts-seeds', 'price': 16.99, 'stock': 55, 'description': 'Premium organic walnuts, brain food', 'rating': 4.6, 'image': 'https://images.unsplash.com/photo-1598864948884-5e5c9c4d4aaa?w=400'},
            {'name': 'Organic Pumpkin Seeds', 'slug': 'organic-pumpkin-seeds', 'category': 'nuts-seeds', 'price': 11.99, 'stock': 65, 'description': 'Roasted organic pumpkin seeds, zinc-rich', 'rating': 4.5, 'image': 'https://images.unsplash.com/photo-1619610380485-2e1c5cef28ce?w=400'},
            
            # Beverages
            {'name': 'Organic Green Tea', 'slug': 'organic-green-tea', 'category': 'beverages', 'price': 8.99, 'stock': 100, 'description': 'Premium organic green tea, antioxidant-rich', 'rating': 4.7, 'image': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400'},
            {'name': 'Organic Orange Juice', 'slug': 'organic-orange-juice', 'category': 'beverages', 'price': 6.99, 'stock': 50, 'description': 'Fresh squeezed organic orange juice', 'rating': 4.6, 'image': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'},
            {'name': 'Organic Almond Milk', 'slug': 'organic-almond-milk', 'category': 'beverages', 'price': 5.99, 'stock': 75, 'description': 'Dairy-free organic almond milk', 'rating': 4.5, 'image': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'},
            {'name': 'Organic Coconut Water', 'slug': 'organic-coconut-water', 'category': 'beverages', 'price': 4.99, 'stock': 85, 'description': 'Refreshing organic coconut water', 'rating': 4.4, 'image': 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400'},
            
            # Snacks
            {'name': 'Organic Granola Bars', 'slug': 'organic-granola-bars', 'category': 'snacks', 'price': 7.99, 'stock': 80, 'description': 'Healthy organic granola bars, perfect snack', 'rating': 4.6, 'image': 'https://images.unsplash.com/photo-1560180995-f1e6f6ea2b89?w=400'},
            {'name': 'Organic Dark Chocolate', 'slug': 'organic-dark-chocolate', 'category': 'snacks', 'price': 9.99, 'stock': 60, 'description': '70% organic dark chocolate, antioxidant-rich', 'featured': True, 'rating': 4.9, 'image': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'},
            {'name': 'Organic Trail Mix', 'slug': 'organic-trail-mix', 'category': 'snacks', 'price': 12.99, 'stock': 70, 'description': 'Energy-boosting organic trail mix', 'rating': 4.7, 'image': 'https://images.unsplash.com/photo-1576699257240-c45a1164485c?w=400'},
            
            # Meat & Poultry
            {'name': 'Organic Chicken Breast', 'slug': 'organic-chicken-breast', 'category': 'meat-poultry', 'price': 14.99, 'stock': 40, 'description': 'Free-range organic chicken breast', 'rating': 4.8, 'image': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400'},
            {'name': 'Organic Ground Beef', 'slug': 'organic-ground-beef', 'category': 'meat-poultry', 'price': 16.99, 'stock': 35, 'description': 'Grass-fed organic ground beef', 'rating': 4.7, 'image': 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400'},
        ]

        for prod_data in products_data:
            category = categories[prod_data.pop('category')]
            product, created = Product.objects.get_or_create(
                slug=prod_data['slug'],
                defaults={**prod_data, 'category': category}
            )
            status = '✓ Created' if created else '→ Exists'
            self.stdout.write(f'  {status}: {product.name}')

        self.stdout.write(self.style.SUCCESS(f'\n✅ Database seeded successfully!'))
        self.stdout.write(self.style.SUCCESS(f'   Categories: {Category.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'   Products: {Product.objects.count()}'))
