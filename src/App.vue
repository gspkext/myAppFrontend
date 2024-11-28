<template>
  <div id="app">
    <header>
      <h1>Product Management System</h1>
      <div class="button-group">
        <button @click="showProductModal = true" class="btn">Add Product</button>
        <router-link to="/query">
          <button class="btn">Query Code</button>
        </router-link>
      </div>
    </header>

    <main>
      <h2>All Products</h2>
      <div class="product-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.productName }}</td>
              <td>{{ product.productDesc }}</td>
              <td>{{ product.address }}</td>
              <td>
                <button @click="openCodeModal(product.id)" class="action-btn">Add Code</button>
                <button @click="openQueryModal(product.id)" class="action-btn">Query All Codes</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <ProductForm v-if="showProductModal" @close="showProductModal = false" @product-added="fetchProducts" />

    <div v-if="showCodeModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showCodeModal = false">&times;</span>
        <CodeMan :productId="selectedProductId" @close="showCodeModal = false" />
      </div>
    </div>

    <div v-if="showQueryModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showQueryModal = false">&times;</span>
        <QueryCode :productId="selectedProductId" @close="showQueryModal = false" />
      </div>
    </div>

    <ChainMan v-if="showChainModal" @close="showChainModal = false" />
    
    <router-view />
  </div>
</template>

<script>
import ProductForm from './components/ProductForm.vue';
import CodeMan from './components/CodeMan.vue';
import QueryCode from './components/QueryCode.vue';
import ChainMan from './components/ChainMan.vue';

export default {
  components: {
    ProductForm,
    CodeMan,
    QueryCode,
    ChainMan
  },
  data() {
    return {
      showProductModal: false,
      showCodeModal: false,
      showQueryModal: false,
      showChainModal: false,
      selectedProductId: null,
      products: []
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch('http://localhost:8007/queryProducts');
        const data = await response.json();
        if (data.code === "1") {
          this.products = data.o;
        } else {
          this.products = [];
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    openCodeModal(productId) {
      this.selectedProductId = productId;
      this.showCodeModal = true;
    },
    openQueryModal(productId) {
      this.selectedProductId = productId;
      this.showQueryModal = true;
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>

<style>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
  background-image: url('@/assets/pattern.jpg'); /* 添加小图片作为背景 */
  background-size: auto; /* 保持小图片的原始大小 */
  background-repeat: repeat; /* 重复小图片填满背景 */
  background-position: top left; /* 背景图片从左上角开始 */
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  color: #333;
}

.button-group {
  margin-bottom: 20px;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}

.product-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.action-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: #218838;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
