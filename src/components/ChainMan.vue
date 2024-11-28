<template>
  <div class="chain-man">
    <h1>Chain Management</h1>
    
    <h2>Submit Chain Data</h2>
    <form @submit.prevent="submitChainData" class="form">
      <input v-model="chainData.code" placeholder="Code" required />
      <input v-model="chainData.privateKey" placeholder="Private Key" required />
      <textarea v-model="chainData.content" placeholder="Content" required></textarea>
      <input v-model="chainData.processName" placeholder="Process Name" required />
      <button type="submit">Submit</button>
    </form>
    <p class="message">{{ submitMessage }}</p>

    <h2>Query Chain Data</h2>
    <form @submit.prevent="queryChainData" class="form">
      <input v-model="queryCode" placeholder="Code" required />
      <button type="submit">Query</button>
    </form>
    <p class="message">{{ queryMessage }}</p>
    <ul class="chain-data-list">
      <li v-for="item in chainDataList" :key="item.id">
        {{ item.content }} - Product: {{ item.productName }} - Process Name: {{ item.processName }} - Status: {{ item.chainStatus }}
      </li>
    </ul>
  </div>
</template>

<script>
import config from '../config'; 

export default {
  data() {
    return {
      chainData: {
        code: '',
        privateKey: '',
        content: '',
        processName: ''
      },
      submitMessage: '',
      queryCode: '',
      queryMessage: '',
      chainDataList: []
    };
  },
  methods: {
    async submitChainData() {
      try {
        const response = await fetch(`${config.API_URL}/toChain`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.chainData)
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
        const response = await fetch(`${config.API_URL}/queryCode?code=${this.queryCode}`);
        const data = await response.json();
        if (data.code === "1") {
          this.chainDataList = data.o.list; // Assuming the response structure
          this.queryMessage = "Query successful";
        } else {
          this.chainDataList = [];
          this.queryMessage = data.msg;
        }
      } catch (error) {
        console.error('Error querying chain data:', error);
        this.queryMessage = 'Error querying chain data';
      }
    }
  }
};
</script>

<style scoped>
.chain-man {
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

.chain-data-list {
  list-style-type: none;
  padding: 0;
}

.chain-data-list li {
  background: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
