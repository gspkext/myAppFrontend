<template>
  <div class="code-man">
    <h1>Code Management</h1>
    
    <h2>Create Code</h2>
    <div class="product-id">
      <label>Product ID:</label>
      <span>{{ productId }}</span>
    </div>
    <form @submit.prevent="createCode" class="form">
      <input v-model="newCode.privateKey" placeholder="Private Key" required />
      <button type="submit">Create Code</button>
    </form>
    <p class="message">{{ createMessage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    productId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      newCode: {
        privateKey: ''
      },
      createMessage: ''
    };
  },
  methods: {
    async createCode() {
      this.newCode.id = this.productId;
      try {
        const response = await fetch('http://localhost:8007/createCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newCode)
        });
        const data = await response.json();
        this.createMessage = data.msg;
      } catch (error) {
        console.error('Error creating code:', error);
        this.createMessage = 'Error creating code';
      }
    }
  }
};
</script>

<style scoped>
.code-man {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-id {
  margin-bottom: 20px;
}

.product-id label {
  font-weight: bold;
}

.form {
  margin-bottom: 20px;
}

input {
  width: calc(100% - 20px);
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #36a372;
}

.message {
  color: #d9534f;
}
</style>
