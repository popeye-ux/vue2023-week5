import userProductModal from './components/userProductModal.js'
VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);
VeeValidateI18n.loadLocaleFromURL('./js/zh_TW.json');
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const path = 'coldplay';
const app = Vue.createApp({
    components: {
        userProductModal,
    },
    data() {
        return {
            // apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            // path: 'coldplay',
            user: {
                email: '',
                name: '',
                address: '',
                phone: '',
            },
            userProductModal: null,
            allProducts: [],
            productDetail: {},
            productId: '',
            cartData: {},
            isLoadingItem: '',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            isLoading: false,
        };
    },
    methods: {
        // validate        
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/;
            return phoneNumber.test(value) ? true : "需要正確的電話號碼";
        },

        getAllProducts() {
            const url = `${apiUrl}/api/${path}/products/all`;
            this.isLoading = true;
            axios.get(url)
                .then(res => {
                    this.isLoading = false;
                    this.allProducts = res.data.products;
                })
                .catch(err => {
                    alert(err.data.message);
                })

        },
        openUserProductModal(id) {
            this.productId = id;
            this.userProductModal.show();
        },
        // 取得購物車內容
        getCart() {
            const url = `${apiUrl}/api/${path}/cart`;
            axios.get(url)
                .then(res => {
                    console.log(res);
                    this.cartData = res.data.data;
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        // 加入購物車
        addToCart(id, qty = 1) {
            const data = {
                product_id: id,
                qty,
            };

            this.isLoadingItem = id;
            const url = `${apiUrl}/api/${path}/cart`;
            axios.post(url, { data })
                .then(res => {
                    if (data.qty <= 0) {
                        alert('數量必須大於0');
                        // this.isLoadingItem = '';
                        return;
                    }
                    this.userProductModal.hide();
                    this.getCart();
                    this.isLoadingItem = '';
                    alert(res.data.message)
                })
                .catch(err => {
                    alert(err.data.message);
                    this.isLoadingItem = '';
                })
        },
        removeCartItem(id) {
            this.isLoadingItem = id;
            const url = `${apiUrl}/api/${path}/cart/${id}`;
            this.isLoadingItem = '';
            axios.delete(url)
                .then(res => {
                    // console.log(res);
                    this.getCart();
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        updateCartItem(item) {
            const data = {
                product_id: item.id,
                qty: item.qty,
            };
            this.isLoadingItem = item.id;
            const url = `${apiUrl}/api/${path}/cart/${item.id}`;
            axios.put(url, { data })
                .then(res => {
                    // console.log(res);
                    this.getCart();
                    this.isLoadingItem = '';
                })
                .catch(err => {
                    alert(err.data.message);
                    this.isLoadingItem = '';
                })
        },
        removeAllCart() {
            const url = `${apiUrl}/api/${path}/carts`;
            axios.delete(url)
                .then(res => {
                    alert(res.data.message)
                    this.getCart();
                    this.isLoadingItem = '';
                })
                .catch(err => {
                    alert(err.data.message);
                    this.isLoadingItem = '';
                })
        },
        submitOrders() {
            const url = `${apiUrl}/api/${path}/order`;
            const order = this.form;
            axios.post(url, { data: order })
                .then(res => {
                    alert(res.data.message)
                    this.isLoadingItem = '';
                    this.getCart();
                    this.$refs.form.resetForm();
                })
                .catch(err => {
                    alert(err.data.message);
                })
        }
    },
    mounted() {
        this.getAllProducts();
        this.getCart();
        this.userProductModal = new bootstrap.Modal(this.$refs.userProductModal.$el);
    }

});
// 全域註冊
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
});
app.component('VLoading', VueLoading.Component);


app.mount('#app')