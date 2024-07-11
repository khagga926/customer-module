<template>
  <div class="customer-page">
    <div class="sidebar">
      <div class="sidebar-header">
        <p>{{ loggedInUserName }}</p>
        <p>Last login: {{ lastLogin }}</p>
      </div>
      <div class="sidebar-menu">
        <div class="upload-section">
          <label for="uploadCustomer">Upload Customer (CSV, max 500 KB):</label>
          <input
            type="file"
            id="uploadCustomer"
            @change="uploadFile('customer', $event)"
            accept=".csv"
          />
        </div>
        <div class="upload-section">
          <label for="uploadContactPerson"
            >Upload Contact Persons (CSV, max 500 KB):</label
          >
          <input
            type="file"
            id="uploadContactPerson"
            @change="uploadFile('contact_person', $event)"
            accept=".csv"
          />
        </div>
        <div class="upload-section">
          <label for="uploadAddress">Upload Addresses (CSV, max 500 KB):</label>
          <input
            type="file"
            id="uploadAddress"
            @change="uploadFile('address', $event)"
            accept=".csv"
          />
        </div>
      </div>
    </div>
    <div class="main-content">
      <h2>Customers</h2>
      <input
        type="text"
        placeholder="Search by all columns"
        v-model="searchQuery"
      />
      <table>
        <thead>
          <tr>
            <th @click="sort('intnr')">Internal number</th>
            <th @click="sort('contact_persons.0.first_name')">First name</th>
            <th @click="sort('contact_persons.0.last_name')">Last name</th>
            <th @click="sort('addresses.0.company_name')">Company name</th>
            <th @click="sort('addresses.0.country')">Country</th>
            <th @click="sort('addresses.0.zip')">Zip</th>
            <th @click="sort('addresses.0.city')">City</th>
            <th @click="sort('addresses.0.street')">Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, index) in sortedCustomers" :key="customer._id">
            <td>{{ customer.intnr }}</td>
            <td>{{ customer.contact_persons[0].first_name }}</td>
            <td>{{ customer.contact_persons[0].last_name }}</td>
            <td>{{ customer.addresses[0].company_name }}</td>
            <td>{{ customer.addresses[0].country }}</td>
            <td>{{ customer.addresses[0].zip }}</td>
            <td>{{ customer.addresses[0].city }}</td>
            <td>{{ customer.addresses[0].street }}</td>
            <td>
              <button @click="editCustomer(customer)">Edit</button>
              <button @click="deleteCustomer(customer._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Edit Customer</h2>
        <form @submit.prevent="updateCustomer">
          <!-- Form fields remain unchanged -->
          <div class="form-group">
            <label for="intnr">Internal number:</label>
            <input type="text" v-model="editCustomerData.intnr" required />
          </div>
          <div class="form-group">
            <label for="firstName">First Name:</label>
            <input
              type="text"
              v-model="editCustomerData.contact_persons[0].first_name"
              required
            />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name:</label>
            <input
              type="text"
              v-model="editCustomerData.contact_persons[0].last_name"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              v-model="editCustomerData.contact_persons[0].email"
              required
            />
          </div>
          <div class="form-group">
            <label for="companyName">Company name:</label>
            <input
              type="text"
              v-model="editCustomerData.addresses[0].company_name"
            />
          </div>
          <div class="form-group">
            <label for="country">Country:</label>
            <input
              type="text"
              v-model="editCustomerData.addresses[0].country"
              required
            />
          </div>
          <div class="form-group">
            <label for="zip">Zip:</label>
            <input
              type="text"
              v-model="editCustomerData.addresses[0].zip"
              required
            />
          </div>
          <div class="form-group">
            <label for="city">City:</label>
            <input
              type="text"
              v-model="editCustomerData.addresses[0].city"
              required
            />
          </div>
          <div class="form-group full-width">
            <label for="street">Address:</label>
            <input
              type="text"
              v-model="editCustomerData.addresses[0].street"
              required
            />
          </div>
          <div class="form-group full-width">
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CustomersPage',
  data() {
    return {
      customers: [],
      searchQuery: '',
      sortKey: '',
      sortOrder: 'asc',
      showEditModal: false,
      editCustomerData: null,
      loggedInUserName: '',
      lastLogin: '',
    };
  },
  computed: {
    sortedCustomers() {
      let sortedArray = this.customers.filter((customer) => {
        return (
          customer.contact_persons[0].first_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          customer.contact_persons[0].last_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          customer.addresses[0].company_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          customer.addresses[0].country
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          customer.addresses[0].zip
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          customer.addresses[0].city
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          customer.addresses[0].street
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      });

      if (this.sortKey) {
        sortedArray.sort((a, b) => {
          let result = 0;
          const keys = this.sortKey.split('.');
          let aValue = a;
          let bValue = b;

          for (const key of keys) {
            aValue = aValue[key];
            bValue = bValue[key];
          }

          if (aValue < bValue) result = -1;
          if (aValue > bValue) result = 1;

          return this.sortOrder === 'asc' ? result : -result;
        });
      }

      return sortedArray;
    },
  },
  methods: {
    async fetchCustomers() {
      const response = await axios.get('http://localhost:3000/api/customers');
      this.customers = response.data;
    },
    async fetchUser() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;
        this.loggedInUserName = `${user.first_name} ${user.last_name}`;
        this.lastLogin = new Date(user.updated_at).toLocaleString();
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    sort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    editCustomer(customer) {
      this.editCustomerData = JSON.parse(JSON.stringify(customer)); // Deep copy to avoid direct mutation
      this.showEditModal = true;
    },
    async updateCustomer() {
      try {
        await axios.put(
          `http://localhost:3000/api/customers/${this.editCustomerData._id}`,
          this.editCustomerData
        );
        this.fetchCustomers();
        this.closeEditModal();
      } catch (error) {
        console.error('Error updating customer:', error);
      }
    },
    async deleteCustomer(id) {
      if (confirm('Are you sure you want to delete this customer?')) {
        await axios.delete(`http://localhost:3000/api/customers/${id}`);
        this.fetchCustomers();
      }
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editCustomerData = null;
    },
    async uploadFile(type, event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 500 * 1024) {
        alert('File size exceeds 500 KB');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        let endpoint = '';
        if (type === 'customer') {
          endpoint = 'http://localhost:3000/api/upload/customers';
        } else if (type === 'contact_person') {
          endpoint = 'http://localhost:3000/api/upload/contact-persons';
        } else if (type === 'address') {
          endpoint = 'http://localhost:3000/api/upload/addresses';
        }

        const response = await axios.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('File uploaded successfully');
        this.fetchCustomers();
      } catch (error) {
        alert(`Error uploading file: ${error.response.data.message}`);
      }
    },
  },
  mounted() {
    this.fetchCustomers();
    this.fetchUser();
  },
};
</script>

<style scoped>
.customer-page {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  margin-bottom: 20px;
}

.sidebar-menu input {
  margin-bottom: 10px;
  background-color: #808080;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.sidebar-menu input:hover {
  background-color: #4caf50;
}

.upload-section {
  margin-bottom: 15px;
}

.upload-section label {
  display: block;
  margin-bottom: 5px;
}

.upload-section input {
  padding: 5px;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.main-content h2 {
  margin-bottom: 20px;
}

.main-content input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

th {
  cursor: pointer;
}

th:hover {
  background-color: #f1f1f1;
}

button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
}

button:hover {
  background-color: #4caf50;
  color: white;
}

.modal-content {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 600px;
  max-width: 90%;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  color: white;
}

h2 {
  margin-bottom: 20px;
}

form {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
}

label {
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
