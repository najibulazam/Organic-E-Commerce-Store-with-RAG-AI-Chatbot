"""
Management command to build knowledge base for chatbot
Generates synthetic data from products, categories, and FAQs
Creates embeddings for RAG system
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from products.models import Product, Category
from chatbot.models import KnowledgeBase
import time


class Command(BaseCommand):
    help = 'Build knowledge base from products and FAQs, generate embeddings'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--rebuild',
            action='store_true',
            help='Delete existing knowledge base and rebuild',
        )
        parser.add_argument(
            '--lite',
            action='store_true',
            help='Use lightweight mode without embeddings (for memory-constrained environments)',
        )
    
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🤖 Building Chatbot Knowledge Base...'))
        
        # Clear existing knowledge base if rebuild flag is set
        if options['rebuild']:
            self.stdout.write('🗑️  Clearing existing knowledge base...')
            KnowledgeBase.objects.all().delete()
        
        # Initialize RAG engine for embedding generation
        use_lite = options.get('lite', False)
        
        if use_lite:
            self.stdout.write('📚 Using lightweight mode (no embeddings)...')
            from chatbot.rag_engine_lite import RAGEngineLite
            rag_engine = RAGEngineLite()
        else:
            try:
                self.stdout.write('📚 Initializing RAG engine with embeddings...')
                from chatbot.rag_engine import RAGEngine
                rag_engine = RAGEngine()
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'⚠️  Could not load full RAG engine: {e}'))
                self.stdout.write('   Falling back to lightweight mode...')
                from chatbot.rag_engine_lite import RAGEngineLite
                rag_engine = RAGEngineLite()
                use_lite = True
        
        # Build knowledge base
        self._generate_product_knowledge(rag_engine, use_lite)
        self._generate_category_knowledge(rag_engine, use_lite)
        self._generate_faq_knowledge(rag_engine, use_lite)
        
        # Summary
        total_entries = KnowledgeBase.objects.count()
        if not use_lite:
            entries_with_embeddings = KnowledgeBase.objects.exclude(embedding__isnull=True).count()
            self.stdout.write(self.style.SUCCESS(f'\n✅ Knowledge Base Built Successfully!'))
            self.stdout.write(f'   Total Entries: {total_entries}')
            self.stdout.write(f'   With Embeddings: {entries_with_embeddings}')
        else:
            self.stdout.write(self.style.SUCCESS(f'\n✅ Knowledge Base Built Successfully (Lite Mode)!'))
            self.stdout.write(f'   Total Entries: {total_entries}')
            self.stdout.write(f'   Mode: Keyword-based search (no embeddings)')
    
    def _generate_product_knowledge(self, rag_engine, use_lite=False):
        """Generate knowledge base entries from products"""
        self.stdout.write('\n📦 Processing Products...')
        
        products = Product.objects.filter(available=True).select_related('category')
        
        for product in products:
            # Create detailed product description for knowledge base
            content = self._create_product_content(product)
            
            # Generate embedding only if not in lite mode
            if not use_lite:
                self.stdout.write(f'   Embedding: {product.name[:40]}...')
                embedding = rag_engine.generate_embedding(content)
            else:
                self.stdout.write(f'   Adding: {product.name[:40]}...')
                embedding = None
            
            # Save to knowledge base
            KnowledgeBase.objects.create(
                content_type='product',
                content=content,
                metadata={
                    'product_id': product.id,
                    'product_name': product.name,
                    'category': product.category.name,
                    'price': str(product.final_price),
                    'stock': product.stock,
                    'rating': str(product.rating),
                    'is_on_sale': product.is_on_sale
                },
                embedding=embedding
            )
        
        self.stdout.write(self.style.SUCCESS(f'   ✓ Processed {products.count()} products'))
    
    def _create_product_content(self, product):
        """Create detailed content for product"""
        content = f"Product: {product.name}\n"
        content += f"Category: {product.category.name}\n"
        content += f"Description: {product.description}\n"
        content += f"Price: ${product.final_price}\n"
        
        if product.is_on_sale:
            content += f"Original Price: ${product.price} (ON SALE!)\n"
        
        content += f"Stock: {product.stock} units available\n"
        content += f"Rating: {product.rating}/5.0 stars\n"
        content += f"Status: {'Available' if product.available else 'Out of Stock'}\n"
        
        # Add searchable keywords
        keywords = [
            product.name.lower(),
            product.category.name.lower(),
            'organic',
            'natural'
        ]
        content += f"Keywords: {', '.join(keywords)}"
        
        return content
    
    def _generate_category_knowledge(self, rag_engine, use_lite=False):
        """Generate knowledge base entries from categories"""
        self.stdout.write('\n🏷️  Processing Categories...')
        
        categories = Category.objects.all()
        
        for category in categories:
            # Get products in this category
            product_count = category.products.filter(available=True).count()
            
            if product_count == 0:
                continue
            
            # Create category description
            content = f"Category: {category.name}\n"
            content += f"Description: {category.description}\n" if category.description else ""
            content += f"Available Products: {product_count}\n"
            
            # List some popular products
            popular_products = category.products.filter(available=True).order_by('-rating')[:5]
            if popular_products:
                content += "Popular items: "
                content += ", ".join([p.name for p in popular_products])
            
            # Generate embedding only if not in lite mode
            if not use_lite:
                self.stdout.write(f'   Embedding: {category.name}')
                embedding = rag_engine.generate_embedding(content)
            else:
                self.stdout.write(f'   Adding: {category.name}')
                embedding = None
            
            # Save to knowledge base
            KnowledgeBase.objects.create(
                content_type='category',
                content=content,
                metadata={
                    'category_id': category.id,
                    'category_name': category.name,
                    'product_count': product_count
                },
                embedding=embedding
            )
        
        self.stdout.write(self.style.SUCCESS(f'   ✓ Processed {categories.count()} categories'))
    
    def _generate_faq_knowledge(self, rag_engine, use_lite=False):
        """Generate knowledge base entries from FAQs"""
        self.stdout.write('\n❓ Processing FAQs...')
        
        # E-commerce FAQs
        faqs = [
            {
                'question': 'What are your shipping options and delivery times?',
                'answer': 'We offer standard shipping (5-7 business days) for $5.99 and express shipping (2-3 business days) for $12.99. Free standard shipping on orders over $50. We ship Monday through Friday.'
            },
            {
                'question': 'What is your return and refund policy?',
                'answer': 'We have a 30-day return policy. Items must be unused and in original packaging. We provide full refunds or exchanges. Return shipping is free for defective items. Refunds are processed within 5-7 business days after receiving the return.'
            },
            {
                'question': 'What payment methods do you accept?',
                'answer': 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted.'
            },
            {
                'question': 'Are all your products organic and certified?',
                'answer': 'Yes! All our products are certified organic by USDA or equivalent certification bodies. We source from trusted suppliers who maintain organic certification. Look for certification details on each product page.'
            },
            {
                'question': 'How can I track my order?',
                'answer': 'Once your order ships, you\'ll receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website. Orders typically ship within 1-2 business days.'
            },
            {
                'question': 'Do you offer international shipping?',
                'answer': 'Currently, we only ship within the United States. We\'re working on expanding to international shipping soon. Sign up for our newsletter to be notified when international shipping becomes available.'
            },
            {
                'question': 'Can I modify or cancel my order after placing it?',
                'answer': 'You can modify or cancel your order within 2 hours of placing it. After that, the order enters processing and cannot be changed. Contact customer support immediately if you need to make changes.'
            },
            {
                'question': 'What if I receive a damaged or defective product?',
                'answer': 'We\'re sorry if you received a damaged item! Contact us within 48 hours with photos of the damage. We\'ll send a replacement immediately at no cost, or process a full refund including return shipping.'
            },
            {
                'question': 'Do you have a loyalty or rewards program?',
                'answer': 'Yes! Our Organic Rewards program gives you 1 point for every dollar spent. 100 points = $5 off your next order. Members also get early access to sales and exclusive discounts.'
            },
            {
                'question': 'Are your products suitable for specific dietary needs?',
                'answer': 'Many of our products are suitable for various dietary needs including vegan, gluten-free, non-GMO, and allergen-free options. Each product page lists dietary information and allergen warnings. Use our filters to find products matching your needs.'
            },
            {
                'question': 'How do I know if a product is in stock?',
                'answer': 'Stock availability is shown on each product page. If an item is out of stock, you can sign up for restock notifications. We update inventory in real-time, so what you see is accurate.'
            },
            {
                'question': 'What makes your organic products different from regular products?',
                'answer': 'Our organic products are grown without synthetic pesticides, fertilizers, or GMOs. They\'re better for your health and the environment. All products meet strict organic certification standards for quality and purity.'
            },
            {
                'question': 'Can I purchase products as gifts?',
                'answer': 'Absolutely! You can add a gift message at checkout and ship directly to the recipient. We can also include a gift receipt without prices. Gift wrapping is available for $4.99 per item.'
            },
            {
                'question': 'Do you offer bulk or wholesale pricing?',
                'answer': 'Yes! We offer bulk discounts on orders of 10+ units of the same product. For wholesale inquiries, please contact our business team. Bulk orders typically ship within 3-5 business days.'
            },
            {
                'question': 'How do I contact customer support?',
                'answer': 'You can reach us via email at support@organicstore.com, by phone at 1-800-ORGANIC (Monday-Friday, 9 AM - 6 PM EST), or through our live chat. We respond to emails within 24 hours.'
            }
        ]
        
        for faq in faqs:
            content = f"Q: {faq['question']}\n\nA: {faq['answer']}"
            
            # Generate embedding only if not in lite mode
            if not use_lite:
                self.stdout.write(f'   Embedding: {faq["question"][:40]}...')
                embedding = rag_engine.generate_embedding(content)
            else:
                self.stdout.write(f'   Adding: {faq["question"][:40]}...')
                embedding = None
            
            # Save to knowledge base
            KnowledgeBase.objects.create(
                content_type='faq',
                content=content,
                metadata={
                    'question': faq['question'],
                    'answer': faq['answer']
                },
                embedding=embedding
            )
        
        self.stdout.write(self.style.SUCCESS(f'   ✓ Processed {len(faqs)} FAQs'))
