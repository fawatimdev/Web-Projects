// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart_ar')) || [];

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartVat = document.getElementById('cart-vat');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// Contact form elements (if on contact page)
const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');
const closeSuccessBtn = document.getElementById('close-success');

// Filter buttons (if on menu page)
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

// Cart functions
function openCart() {
  cartModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartModal.classList.remove('open');
  document.body.style.overflow = '';
}

function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // If cart is empty
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h3>سلة التسوق فارغة</h3>
        <p>أضف بعض القهوة اللذيذة إلى سلتك!</p>
      </div>
    `;
    cartSubtotal.textContent = '0.00 ر.س';
    cartVat.textContent = '0.00 ر.س';
    cartTotal.textContent = '0.00 ر.س';
    return;
  }
  
  // Render cart items
  cartItemsContainer.innerHTML = '';
  
  cart.forEach(item => {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${convertToSAR(item.price).toFixed(2)} ر.س</div>
        <div class="cart-item-actions">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <span class="cart-item-quantity">${item.quantity}</span>
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
          <button class="remove-item" data-id="${item.id}">إزالة</button>
        </div>
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItemElement);
  });
  
  // Add event listeners to the new buttons
  document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
    btn.addEventListener('click', () => decreaseQuantity(btn.dataset.id));
  });
  
  document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
    btn.addEventListener('click', () => increaseQuantity(btn.dataset.id));
  });
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });
  
  // Update totals
  updateCartTotals();
}

// تحويل من الدولار إلى الريال السعودي
function convertToSAR(priceUSD) {
  return priceUSD * 3.75;
}

function updateCartTotals() {
  const subtotal = calculateSubtotal();
  const vat = calculateVAT(subtotal);
  const total = subtotal + vat;
  
  // عرض الأسعار بالريال السعودي
  cartSubtotal.textContent = `${convertToSAR(subtotal).toFixed(2)} ر.س`;
  cartVat.textContent = `${convertToSAR(vat).toFixed(2)} ر.س`;
  cartTotal.textContent = `${convertToSAR(total).toFixed(2)} ر.س`;
}

function calculateSubtotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateVAT(subtotal) {
  return subtotal * 0.15; // 15% VAT
}

function saveCartToLocalStorage() {
  localStorage.setItem('cart_ar', JSON.stringify(cart));
}

function addToCart(product) {
  // Check if item is already in cart
  const existingItemIndex = cart.findIndex(item => item.id == product.id);
  
  if (existingItemIndex !== -1) {
    // If item exists, increase quantity
    cart[existingItemIndex].quantity += 1;
  } else {
    // If not, add new item to cart
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  saveCartToLocalStorage();
  updateCartUI();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id != productId);
  saveCartToLocalStorage();
  updateCartUI();
}

function increaseQuantity(productId) {
  const item = cart.find(item => item.id == productId);
  if (item) {
    item.quantity += 1;
    saveCartToLocalStorage();
    updateCartUI();
  }
}

function decreaseQuantity(productId) {
  const item = cart.find(item => item.id == productId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      removeFromCart(productId);
      return;
    }
    saveCartToLocalStorage();
    updateCartUI();
  }
}

function clearCart() {
  cart = [];
  saveCartToLocalStorage();
  updateCartUI();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the cart UI
  updateCartUI();
  
  // Cart toggle
  if (cartIcon) {
    cartIcon.addEventListener('click', openCart);
  }
  
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }
  
  // Close cart when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      closeCart();
    }
  });
  
  // Cart actions
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('سيتم تنفيذ وظيفة الدفع هنا.');
    });
  }
  
  // Add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.closest('.product-card').querySelector('img').src
      };
      addToCart(product);
    });
  });
  
  // Mobile menu toggle
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }
  
  // Contact form validation (if on contact page)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset error messages
      document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
      });
      
      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Validate form
      let isValid = true;
      
      if (name === '') {
        document.getElementById('name-error').textContent = 'يرجى إدخال اسمك';
        isValid = false;
      }
      
      if (email === '') {
        document.getElementById('email-error').textContent = 'يرجى إدخال بريدك الإلكتروني';
        isValid = false;
      } else if (!isValidEmail(email)) {
        document.getElementById('email-error').textContent = 'يرجى إدخال عنوان بريد إلكتروني صحيح';
        isValid = false;
      }
      
      if (subject === '') {
        document.getElementById('subject-error').textContent = 'يرجى إدخال الموضوع';
        isValid = false;
      }
      
      if (message === '') {
        document.getElementById('message-error').textContent = 'يرجى إدخال رسالتك';
        isValid = false;
      } else if (message.length < 10) {
        document.getElementById('message-error').textContent = 'يجب أن تكون الرسالة 10 أحرف على الأقل';
        isValid = false;
      }
      
      // If valid, show success message
      if (isValid) {
        // In a real application, we would send data to the server here
        contactForm.reset();
        successMessage.classList.remove('hidden');
      }
    });
    
    // Close success message
    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener('click', () => {
        successMessage.classList.add('hidden');
      });
    }
  }
  
  // Menu filtering (if on menu page)
  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        
        // Filter products
        productCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});

// Helper functions
function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}