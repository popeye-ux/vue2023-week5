export default {
    props: ['id'],
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'coldplay',
            productDetail: {},
            qty: 1,
        }
    },
    watch: {
        id() {
            this.getProduct();
        }
    },
    methods: {
        getProduct() {
            const url = `${this.apiUrl}/api/${this.path}/product/${this.id}`;
            axios.get(url)
                .then(res => {
                    // console.log(res);
                    this.productDetail = res.data.product;
                })
                .catch(err => {
                    alert(err.data.message)
                })
        },
        addToCart() {
            this.$emit('add-cart', this.productDetail.id, this.qty);
        },
    },
    template: `
    <div
  class="modal fade"
  id="productModal"
  tabindex="-1"
  role="dialog"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
  ref="userProductModal"
>
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>{{productDetail.title}}</span>
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-6">
            <img class="img-fluid" :src="productDetail.imageUrl" alt="" />
          </div>
          <div class="col-sm-6">
            <span class="badge bg-primary rounded-pill">{{ }}</span>
            <p>商品描述：{{productDetail.description }}</p>
            <p>商品內容：{{productDetail.content }}</p>
            <div class="h5" v-if="productDetail.price===productDetail.origin_price">{{ productDetail.price }} 元</div>
            <div v-else>
            <del class="h6">原價 {{ productDetail.origin_price}} 元</del>
            <div class="h5">現在只要 {{productDetail.price }} 元</div>
            </div>
            <div>
              <div class="input-group">              
                <input type="number" class="form-control" min="1" v-model.number="qty"/>
                <button type="button" class="btn btn-primary" @click="addToCart">
                  加入購物車
                </button>
              </div>
            </div>
          </div>
          <!-- col-sm-6 end -->
        </div>
      </div>
    </div>
  </div>
</div>

    `
}