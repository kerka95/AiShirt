// AI Póló Studio - Main JavaScript

class AITShirtStudio {
    constructor() {
        this.selectedStyle = 'realistic';
        this.selectedColor = 'white';
        this.generatedImage = null;
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateCartCount();
        this.loadMockData();
    }
    
    bindEvents() {
        // Style selection
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectStyle(e));
        });
        
        // Color selection
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectColor(e));
        });
        
        // Generate button
        document.getElementById('generate-btn').addEventListener('click', () => this.generateDesign());
        
        // Add to cart button
        document.getElementById('add-to-cart-btn').addEventListener('click', () => this.addToCart());
        
        // Cart modal
        document.getElementById('cart-btn').addEventListener('click', () => this.showCart());
        document.getElementById('close-cart').addEventListener('click', () => this.hideCart());
        
        // Mobile menu
        document.getElementById('mobile-menu-btn').addEventListener('click', () => this.toggleMobileMenu());
        
        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', () => this.goToCheckout());
    }
    
    selectStyle(e) {
        // Remove active class from all buttons
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.classList.remove('border-indigo-500', 'bg-indigo-50');
            btn.classList.add('border-stone-300');
        });
        
        // Add active class to selected button
        e.currentTarget.classList.remove('border-stone-300');
        e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50');
        
        this.selectedStyle = e.currentTarget.dataset.style;
    }
    
    selectColor(e) {
        // Remove active class from all buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('ring-4', 'ring-indigo-300');
        });
        
        // Add active class to selected button
        e.currentTarget.classList.add('ring-4', 'ring-indigo-300');
        
        this.selectedColor = e.currentTarget.dataset.color;
        this.updateTShirtColor();
    }
    
    updateTShirtColor() {
        const tshirtBase = document.getElementById('tshirt-base');
        const colorMap = {
            'white': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
            'black': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop',
            'navy': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&h=600&fit=crop',
            'gray': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop',
            'red': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=600&fit=crop'
        };
        
        tshirtBase.src = colorMap[this.selectedColor];
    }
    
    async generateDesign() {
        const designInput = document.getElementById('design-input').value.trim();
        const generateBtn = document.getElementById('generate-btn');
        const generateText = document.getElementById('generate-text');
        const generateSpinner = document.getElementById('generate-spinner');
        
        if (!designInput) {
            this.showNotification('Kérlek, írd le a dizájn ötletedet!', 'warning');
            return;
        }
        
        // Show loading state
        generateBtn.disabled = true;
        generateText.textContent = 'AI dolgozik...';
        generateSpinner.classList.remove('hidden');
        
        try {
            // Simulate AI generation (in real implementation, this would call the actual API)
            await this.simulateAIGeneration(designInput, this.selectedStyle);
            
            // Show success
            this.showNotification('Dizájn sikeresen generálva!', 'success');
            
            // Enable add to cart button
            document.getElementById('add-to-cart-btn').disabled = false;
            
        } catch (error) {
            this.showNotification('Hiba történt a generálás során. Próbáld újra!', 'error');
        } finally {
            // Reset button state
            generateBtn.disabled = false;
            generateText.textContent = 'AI Dizájn Generálása';
            generateSpinner.classList.add('hidden');
        }
    }
    
    async simulateAIGeneration(prompt, style) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate mock image URL based on prompt and style
        const mockImages = {
            'realistic': [
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop'
            ],
            'cartoon': [
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop'
            ],
            'minimalist': [
                'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
            ],
            'abstract': [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop'
            ]
        };
        
        const images = mockImages[style] || mockImages['realistic'];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        
        this.generatedImage = randomImage;
        this.updateDesignPreview(randomImage);
    }
    
    updateDesignPreview(imageUrl) {
        const designOverlay = document.getElementById('design-overlay');
        const generatedDesign = document.getElementById('generated-design');
        
        generatedDesign.src = imageUrl;
        designOverlay.classList.remove('opacity-0');
        designOverlay.classList.add('opacity-100', 'fade-in');
    }
    
    addToCart() {
        if (!this.generatedImage) {
            this.showNotification('Előbb generálj egy dizájnt!', 'warning');
            return;
        }
        
        const designInput = document.getElementById('design-input').value.trim();
        
        const cartItem = {
            id: Date.now(),
            design: designInput,
            style: this.selectedStyle,
            color: this.selectedColor,
            image: this.generatedImage,
            price: 6990, // Price in HUF
            quantity: 1
        };
        
        this.cart.push(cartItem);
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Póló hozzáadva a kosárhoz!', 'success');
        
        // Reset form
        this.resetForm();
    }
    
    resetForm() {
        document.getElementById('design-input').value = '';
        document.getElementById('design-overlay').classList.add('opacity-0');
        document.getElementById('design-overlay').classList.remove('opacity-100');
        document.getElementById('add-to-cart-btn').disabled = true;
        this.generatedImage = null;
    }
    
    showCart() {
        const modal = document.getElementById('cart-modal');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        // Clear previous items
        cartItems.innerHTML = '';
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center text-stone-500 py-8">A kosár üres</p>';
            cartTotal.textContent = '0 Ft';
        } else {
            let total = 0;
            
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'flex items-center space-x-4 p-4 bg-stone-50 rounded-lg';
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.design}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-semibold text-stone-900">${item.design.substring(0, 30)}...</h4>
                        <p class="text-sm text-stone-600">Stílus: ${item.style} | Szín: ${item.color}</p>
                        <p class="text-sm font-semibold text-indigo-600">${item.price} Ft</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="p-1 text-stone-500 hover:text-red-500" onclick="app.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                cartItems.appendChild(cartItemElement);
            });
            
            cartTotal.textContent = `${total.toLocaleString()} Ft`;
        }
        
        modal.classList.remove('hidden');
    }
    
    hideCart() {
        document.getElementById('cart-modal').classList.add('hidden');
    }
    
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
        this.showCart(); // Refresh the cart display
        this.showNotification('Termék eltávolítva a kosárból!', 'info');
    }
    
    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
    toggleMobileMenu() {
        // Mobile menu implementation
        this.showNotification('Mobil menü - hamarosan!', 'info');
    }
    
    goToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('A kosár üres!', 'warning');
            return;
        }
        
        // In a real app, this would navigate to checkout page
        this.showNotification('Átirányítás a pénztárhoz...', 'info');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
        
        // Set notification style based on type
        const styles = {
            'success': 'bg-green-500 text-white',
            'error': 'bg-red-500 text-white',
            'warning': 'bg-yellow-500 text-black',
            'info': 'bg-blue-500 text-white'
        };
        
        notification.className += ` ${styles[type]}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    loadMockData() {
        // Load some mock data or initialize default state
        console.log('AI Póló Studio initialized');
    }
}

// Initialize the app
const app = new AITShirtStudio();

// Export for global access
window.app = app;