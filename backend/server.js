const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { authenticateToken } = require('./middleware/auth');
const hpp = require('hpp');  // Prevent HTTP Parameter Pollution attacks
const xss = require('xss-clean'); // Sanitize user inputs to prevent XSS attacks

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

app.use(helmet());
app.disable('x-powered-by');

app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

app.use(morgan('dev'));

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
connectDB();

const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Security Middleware - HPP and XSS
app.use(hpp()); // Protect against HTTP Parameter Pollution
app.use(xss()); // Sanitize user input

app.use('/api', authenticateToken, apiRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(frontendPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error.';
  res.status(statusCode).json({ message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

