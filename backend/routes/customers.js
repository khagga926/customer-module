const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
});

// Get a customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer.' });
  }
});

// Create a new customer
router.post('/', async (req, res) => {
  const customer = new Customer(req.body);
  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create customer.' });
  }
});

// Update a customer by ID
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    Object.assign(customer, req.body);
    customer.updated_at = Date.now();
    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update customer.' });
  }
});

// Delete a customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Customer.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer.' });
  }
});

module.exports = router;
