// Set to your backend URL, for local testing use "http://localhost:3000"
const API_BASE = "http://localhost:3000"; 

new Vue({
  el: '#app',
  data: {
    lessons: [],           // fetched or mocked
    cart: [],              // [{ lessonId, qty, subject, price, location, imagePath, imageAlt }]
    showCart: false,
    sortBy: 'subject',
    sortAsc: true,
    query: '',
    searchTimer: null,
    checkout: { name: '', phone: '' },
    orderConfirmed: ''
  },
  computed: {
    cartTotalQty() {
      return this.cart.reduce((s, it) => s + it.qty, 0);
    },
    cartTotalPrice() {
      return this.cart.reduce((s, it) => s + (it.price * it.qty), 0);
    },
    filteredAndSorted() {
      const arr = this.lessons.slice();
      const attr = this.sortBy;

      arr.sort((a, b) => {
        let A = a[attr];
        let B = b[attr];
        if (typeof A === 'string') A = A.toLowerCase();
        if (typeof B === 'string') B = B.toLowerCase();
        if (A < B) return this.sortAsc ? -1 : 1;
        if (A > B) return this.sortAsc ? 1 : -1;
        return 0;
      });

      return arr;
    },
    validName() {
      return /^[A-Za-z ]+$/.test(this.checkout.name);
    },
    validPhone() {
      return /^\d+$/.test(this.checkout.phone);
    },
    canCheckout() {
      return this.cart.length > 0 && this.validName && this.validPhone;
    }
  },
  methods: {
    fullImagePath(path) {
      if (!path) return '';
      if (/^https?:\/\//.test(path)) return path;
      if (path[0] === '/') {
        return (API_BASE ? API_BASE : '') + path;
      }
      return path;
    },

    fetchLessons() {
      // --- MOCK data instead of backend call ---
      this.lessons = [
        { _id: '1', subject: 'Math',      location: 'Room A', price: 100, space: 5, imagePath: 'images/math.png',      imageAlt: 'Math icon' },
        { _id: '2', subject: 'English',   location: 'Room B', price: 90,  space: 6, imagePath: 'images/english.png',   imageAlt: 'English icon' },
        { _id: '3', subject: 'Biology',   location: 'Lab 1',  price: 120, space: 3, imagePath: 'images/biology.png',   imageAlt: 'Biology icon' },
        { _id: '4', subject: 'Physics',   location: 'Lab 2',  price: 130, space: 4, imagePath: 'images/physics.png',   imageAlt: 'Physics icon' },
        { _id: '5', subject: 'Chemistry', location: 'Lab 3',  price: 125, space: 2, imagePath: 'images/chemistry.png', imageAlt: 'Chemistry icon' },
        { _id: '6', subject: 'History',   location: 'Room C', price: 80,  space: 8, imagePath: 'images/history.png',   imageAlt: 'History icon' },
        { _id: '7', subject: 'Geography', location: 'Room D', price: 85,  space: 7, imagePath: 'images/geography.png', imageAlt: 'Geography icon' }
      ];
    },

    onSearchInput() {
      clearTimeout(this.searchTimer);
      const q = this.query.trim();
      this.searchTimer = setTimeout(() => {
        if (!q) {
          this.fetchLessons();
          return;
        }
        // For now just filter locally (mock server search)
        this.lessons = this.lessons.filter(
          l => l.subject.toLowerCase().includes(q.toLowerCase()) ||
               l.location.toLowerCase().includes(q.toLowerCase())
        );
      }, 300);
    },

    toggleSortOrder() {
      this.sortAsc = !this.sortAsc;
    },

    addToCart(lesson) {
      if (lesson.space <= 0) return;
      lesson.space = Number(lesson.space) - 1;

      const found = this.cart.find(it => it.lessonId === lesson._id);
      if (found) {
        found.qty += 1;
      } else {
        this.cart.push({
          lessonId: lesson._id,
          qty: 1,
          subject: lesson.subject,
          price: Number(lesson.price),
          location: lesson.location,
          imagePath: lesson.imagePath,
          imageAlt: lesson.imageAlt
        });
      }
      this.orderConfirmed = '';
    },

    removeFromCart(item) {
      const lesson = this.lessons.find(l => l._id === item.lessonId);
      if (lesson) lesson.space = Number(lesson.space) + item.qty;
      this.cart = this.cart.filter(it => it.lessonId !== item.lessonId);
    },

    clearCart() {
      this.cart.forEach(item => {
        const lesson = this.lessons.find(l => l._id === item.lessonId);
        if (lesson) lesson.space = Number(lesson.space) + item.qty;
      });
      this.cart = [];
    },

    toggleCart() {
      this.showCart = !this.showCart;
      this.orderConfirmed = '';
    },

    viewDetails(lesson) {
      alert(`Subject: ${lesson.subject}\nLocation: ${lesson.location}\nPrice: $${lesson.price}\nSpaces: ${lesson.space}`);
    },

    submitOrder() {
      if (!this.canCheckout) {
        alert('Please fill valid name and phone.');
        return;
      }
      // Mock order submit
      this.orderConfirmed = 'Order submitted successfully! (mock)';
      this.cart = [];
      this.checkout.name = '';
      this.checkout.phone = '';
      this.fetchLessons();
    }
  },
  created() {
    this.fetchLessons();
  }
});
