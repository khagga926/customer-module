const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Customer = require('../models/Customer');

const router = express.Router();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 500 * 1024 }, // 500 KB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only .csv files are allowed!'));
    }
    cb(null, true);
  },
});

const processCsv = (filePath, handleRow) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const errors = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const [index, row] of results.entries()) {
          try {
            await handleRow(row, index, errors);
          } catch (error) {
            errors.push(`Row ${index + 1}: ${error.message}`);
          }
        }

        fs.unlinkSync(filePath); // Remove the uploaded file

        if (errors.length) {
          reject(new Error(errors.join(' ')));
        } else {
          resolve();
        }
      })
      .on('error', (error) => {
        fs.unlinkSync(filePath); // Remove the uploaded file
        reject(new Error(error.message));
      });
  });
};

// Upload customers
router.post('/customers', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ message: 'No file uploaded or file is too large.' });
  }

  const filePath = req.file.path;

  try {
    await processCsv(filePath, async (row, index, errors) => {
      // Check if all required fields are present in the row
      const requiredFields = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
      ];
      const missingFields = requiredFields.filter((field) => !row[field]);
      if (missingFields.length > 0) {
        throw new Error(
          `Missing required fields - ${missingFields.join(', ')}.`
        );
      }

      if ((row['B'] === 'COMPANY' || row['B'] === 'DEALER') && !row['O']) {
        throw new Error(`Email must be set for type ${row['B']}.`);
      }

      const existingCustomer = await Customer.findOne({ intnr: row['A'] });
      if (existingCustomer) {
        throw new Error(`Customer with intnr ${row['A']} already exists.`);
      }

      const addresses = [
        {
          company_name: row['H'],
          country: row['I'],
          city: row['J'],
          zip: row['K'],
          fax: row['L'],
          phone: row['M'],
          street: row['N'],
        },
      ];

      if (row['B'] === 'COMPANY' || row['B'] === 'DEALER') {
        addresses[0].email = row['O'];
      }

      const customer = new Customer({
        intnr: row['A'],
        type: row['B'],
        contact_persons: [
          {
            first_name: row['C'],
            last_name: row['D'],
            email: row['E'],
            mobile_phone: row['F'],
            birth_date: row['G'],
          },
        ],
        addresses: addresses,
      });

      await customer.save();
    });
    res.send({ message: 'File processed successfully' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Upload contact persons
router.post('/contact-persons', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ message: 'No file uploaded or file is too large.' });
  }

  const filePath = req.file.path;

  try {
    await processCsv(filePath, async (row, index, errors) => {
      // Check if all required fields are present in the row
      const requiredFields = ['A', 'C', 'D', 'E', 'F', 'G'];
      const missingFields = requiredFields.filter((field) => !row[field]);
      if (missingFields.length > 0) {
        throw new Error(
          `Missing required fields - ${missingFields.join(', ')}.`
        );
      }

      const customer = await Customer.findOne({ intnr: row['A'] });
      if (!customer) {
        throw new Error(`Customer with intnr ${row['A']} does not exist.`);
      }

      customer.contact_persons.push({
        first_name: row['C'],
        last_name: row['D'],
        email: row['E'],
        mobile_phone: row['F'],
        birth_date: row['G'],
      });

      await customer.save();
    });
    res.send({ message: 'File processed successfully' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Upload addresses
router.post('/addresses', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ message: 'No file uploaded or file is too large.' });
  }

  const filePath = req.file.path;

  try {
    await processCsv(filePath, async (row, index, errors) => {
      // Check if all required fields are present in the row
      const requiredFields = ['A', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
      const missingFields = requiredFields.filter((field) => !row[field]);
      if (missingFields.length > 0) {
        throw new Error(
          `Missing required fields - ${missingFields.join(', ')}.`
        );
      }

      const customer = await Customer.findOne({ intnr: row['A'] });
      if (!customer) {
        throw new Error(`Customer with intnr ${row['A']} does not exist.`);
      }

      customer.addresses.push({
        company_name: row['H'],
        country: row['I'],
        city: row['J'],
        zip: row['K'],
        fax: row['L'],
        phone: row['M'],
        street: row['N'],
        email: row['O'],
      });

      await customer.save();
    });
    res.send({ message: 'File processed successfully' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
