<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Add Product</h2>
      <form @submit.prevent="addProduct">
        <input v-model="newProduct.productName" placeholder="Product Name" required />
        <input v-model="newProduct.productDesc" placeholder="Product Description" required />
        <input v-model="newProduct.address" placeholder="Address" required />
        <input v-model="newProduct.privateKey" placeholder="Private Key" required />
        <button type="submit">Add Product</button>
      </form>
      <p class="message">{{ addMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newProduct: {
        productName: '',
        productDesc: '',
        address: '',
        privateKey: ''
      },
      addMessage: ''
    };
  },
  methods: {
    async addProduct() {
      try {
        const response = await fetch('http://localhost:8007/product/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newProduct)
        });
        const data = await response.json();
        this.addMessage = data.msg;
        this.$emit('product-added'); // Emit event to notify parent
        this.$emit('close'); // Close modal
      } catch (error) {
        console.error('Error adding product:', error);
        this.addMessage = 'Error adding product';
      }
    }
  }
};
</script>

<style scoped>
.modal {
  display: block; /* Show modal */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 90%;
  max-width: 500px; /* 限制最大宽度 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

h2 {
  text-align: center; /* 标题居中 */
  color: #333; /* 标题颜色 */
}

form {
  display: flex;
  flex-direction: column; /* 垂直排列输入框 */
  gap: 10px; /* 输入框之间的间距 */
}

input {
  padding: 10px; /* 内边距 */
  border: 1px solid #ccc; /* 边框 */
  border-radius: 5px; /* 圆角 */
  font-size: 16px; /* 字体大小 */
}

input:focus {
  border-color: #007bff; /* 聚焦时边框颜色 */
  outline: none; /* 去掉默认的聚焦轮廓 */
}

button {
  background-color: #007bff; /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 去掉边框 */
  padding: 10px; /* 内边距 */
  border-radius: 5px; /* 圆角 */
  cursor: pointer; /* 鼠标指针 */
  font-size: 16px; /* 字体大小 */
  transition: background-color 0.3s; /* 背景颜色过渡效果 */
}

button:hover {
  background-color: #0056b3; /* 悬停时背景颜色 */
}

.message {
  text-align: center; /* 消息居中 */
  color: #d9534f; /* 错误消息颜色 */
}
</style>
