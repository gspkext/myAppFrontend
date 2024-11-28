<template>
  <div class="query-code">
    <h1>Query All Codes</h1>
    
    <h2>Query All Codes for Product ID: {{ productId }}</h2>
    <form @submit.prevent="queryCodes" class="form">
      <input v-model="queryCode.privateKey" placeholder="Private Key" required />
      <button type="submit">Query Codes</button>
    </form>
    <p class="message">{{ queryMessage }}</p>
    <ul class="code-list">
      <li v-for="code in codes" :key="code.id">
        {{ code.code }} - <img :src="code.imgUrl" alt="QR Code" />
        <button @click="openChainModal(code.code)">Submit Chain Data</button>
        <button @click="openQueryChainModal(code.code)">Query Chain Data</button>
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
        <p>Querying data for code: {{ selectedCode }}</p>
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
import config from '../config';

export default {
  props: {
    productId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      queryCode: {
        privateKey: ''
      },
      queryMessage: '',
      codes: [],
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
  methods: {
    async queryCodes() {
      try {
        const response = await fetch(`${config.API_URL}/queryAllCodeByProductId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: this.productId, privateKey: this.queryCode.privateKey })
        });
        const data = await response.json();
        if (data.code === "1") {
          this.codes = data.o;
          this.queryMessage = "Query successful";
        } else {
          this.codes = [];
          this.queryMessage = data.msg;
        }
      } catch (error) {
        console.error('Error querying codes:', error);
        this.queryMessage = 'Error querying codes';
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
        const response = await fetch(`${config.API_URL}/toChain`, {
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
        const response = await fetch(`${config.API_URL}/queryCode?code=${this.selectedCode}`);
        const data = await response.json();
        if (data.code === "1") {
          this.chainDataList = data.o.list; // Assuming the response structure
          this.queryChainMessage = "Query successful";
        } else {
          this.chainDataList = [];
          this.queryChainMessage = data.msg;
        }
      } catch (error) {
        console.error('Error querying chain data:', error);
        this.queryChainMessage = 'Error querying chain data';
      }
    }
  }
};
</script>

<style scoped>
.query-code {
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
