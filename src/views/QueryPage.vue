<template>
  <div class="query-page">
    <h1>Query Code</h1>
    <form @submit.prevent="fetchCode">
      <input v-model="code" placeholder="Enter Code" required />
      <button type="submit">Query</button>
    </form>
    <p class="message">{{ message }}</p>

    <!-- 显示产品信息 -->
    <div v-if="productName">
      <h2>Product Information</h2>
      <strong>Product Name:</strong> {{ productName }}<br />
      <strong>Product Description:</strong> {{ productDesc }}<br />
    </div>

    <ul class="code-list">
      <li v-for="item in codes" :key="item.id">
        <strong>Process Name:</strong> {{ item.processName }}<br />
        <strong>Content:</strong> {{ item.content }}<br />
        <img v-if="item.imgUrl" :src="item.imgUrl" alt="QR Code" />
        <button @click="openChainModal(item.code)">Submit Chain Data</button>
        <button @click="openQueryChainModal(item.code)">Query Chain Data</button>
      </li>
    </ul>

    <!-- Submit Chain Data Modal -->
    <div v-if="showChainModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showChainModal = false">&times;</span>
        <h2>Submit Chain Data for Code: {{ selectedCode }}</h2>
        <form @submit.prevent="submitChainData" class="form">
          <input v-model="chainData.privateKey" placeholder="Private Key" required />
          <textarea v-model="chainData.content" placeholder="Content" required></textarea>
          <input v-model="chainData.processName" placeholder="Process Name" required />
          <button type="submit">Submit</button>
        </form>
        <p class="message">{{ submitMessage }}</p>
      </div>
    </div>

    <!-- Query Chain Data Modal -->
    <div v-if="showQueryChainModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showQueryChainModal = false">&times;</span>
        <h2>Query Chain Data for Code: {{ selectedCode }}</h2>
        <p class="message">{{ queryChainMessage }}</p>
        <ul class="chain-data-list">
          <li v-for="item in chainDataList" :key="item.id">
            {{ item.content }} - Product: {{ item.productName }} - Process Name: {{ item.processName }} - Status: {{ item.chainStatus }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: '',
      message: '',
      codes: [],
      productName: '',
      productDesc: '',
      showChainModal: false,
      showQueryChainModal: false,
      selectedCode: '',
      chainData: {
        privateKey: '',
        content: '',
        processName: ''
      },
      submitMessage: '',
      queryChainMessage: '',
      chainDataList: []
    };
  },
  mounted() {
    // 获取 URL 中的 GET 参数
    const urlParams = new URLSearchParams(window.location.search);
    this.code = urlParams.get('code'); // 获取 code 参数

    // 如果 code 不为空，自动执行查询
    if (this.code) {
      this.fetchCode();
    }
  },
  methods: {
    async fetchCode() {
      try {
        const response = await fetch(`http://localhost:8007/queryCode?code=${this.code}`);
        const data = await response.json();
        console.log(data); // 查看返回的数据结构
        
        if (data.code === "1") {
          this.codes = data.o.list; // 获取 list 数组
          this.productName = data.o.product.productName; // 获取 productName
          this.productDesc = data.o.product.productDesc; // 获取 productDesc
          this.message = "Query successful";
        } else {
          this.codes = [];
          this.productName = '';
          this.productDesc = '';
          this.message = data.msg; // 显示错误信息
        }
      } catch (error) {
        console.error('Error querying codes:', error);
        this.message = 'Error querying codes'; // 显示错误信息
      }
    },
    openChainModal(code) {
      this.selectedCode = code;
      this.showChainModal = true; // 打开提交链数据模态框
    },
    openQueryChainModal(code) {
      this.selectedCode = code;
      this.showQueryChainModal = true; // 打开查询链数据模态框
      this.queryChainData(); // 直接查询链数据
    },
    async submitChainData() {
      try {
        const response = await fetch('http://localhost:8007/toChain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code: this.selectedCode, ...this.chainData })
        });
        const data = await response.json();
        this.submitMessage = data.msg;
      } catch (error) {
        console.error('Error submitting chain data:', error);
        this.submitMessage = 'Error submitting chain data';
      }
    },
    async queryChainData() {
      try {
        const response = await fetch(`http://localhost:8007/queryCode?code=${this.selectedCode}`);
        const data = await response.json();
        if (data.code === "1") {
          this.chainDataList = data.o.list; // 假设返回的数据结构
          this.queryChainMessage = "Query successful";
        } else {
          this.chainDataList = [];
          this.queryChainMessage = data.msg; // 显示错误信息
        }
      } catch (error) {
        console.error('Error querying chain data:', error);
        this.queryChainMessage = 'Error querying chain data'; // 显示错误信息
      }
    }
  }
};
</script>

<style scoped>
.query-page {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form {
  margin-bottom: 20px;
}

input, textarea {
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
  color: #d9534f; /* Red for error messages */
}

.code-list {
  list-style-type: none;
  padding: 0;
}

.code-list li {
  background: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Modal styles */
.modal {
  display: block; /* Show modal */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5); /* Black w/ opacity */
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
