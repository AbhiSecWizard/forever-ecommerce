<!-- Hey ! -->
# E-Commerce REST API Documentation


A RESTful API for a MERN Stack E-commerce application built using Node.js, Express.js, MongoDB, and Mongoose.

The API supports user authentication, product management, shopping cart operations, order management, and online payments through Stripe and Razorpay.

## Base URL

```text
http://localhost:4000
```

For production, replace the base URL with your deployed backend URL.

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt
- Cloudinary
- Stripe
- Razorpay

---

## API Endpoints Overview

| Module | Method | Endpoint | Access |
|---|---|---|---|
| Health Check | GET | `/` | Public |
| Register | POST | `/api/user/register` | Public |
| Login | POST | `/api/user/login` | Public |
| Admin Login | POST | `/api/user/admin` | Public |
| List Products | GET | `/api/product/list` | Public |
| Single Product | GET | `/api/product/single` | Public |
| Add Product | POST | `/api/product/add` | Admin |
| Remove Product | DELETE | `/api/product/remove` | Admin |
| Get Cart | GET | `/api/cart/get` | User |
| Add To Cart | POST | `/api/cart/add` | User |
| Update Cart | PUT | `/api/cart/update` | User |
| Place COD Order | POST | `/api/order/place` | User |
| Place Stripe Order | POST | `/api/order/stripe` | User |
| Verify Stripe | POST | `/api/order/verifyStripe` | User |
| Place Razorpay Order | POST | `/api/order/razorpay` | User |
| Verify Razorpay | POST | `/api/order/verifyRazorpay` | User |
| User Orders | POST | `/api/order/userorders` | User |
| All Orders | POST | `/api/order/list` | Admin |
| Update Order Status | POST | `/api/order/status` | Admin |

---

# 1. User Authentication APIs

Base route: `/api/user`

## 1.1 Register User

Create a new user account.

**Endpoint**

```http
POST /api/user/register
```

**Request Body**

```json
{
  "name": "Abhishek",
  "email": "abhishek@example.com",
  "password": "password123"
}
```

**Success Response — 200**

```json
{
  "success": true,
  "token": "JWT_TOKEN"
}
```

**Possible Errors**

- `400` — Missing required fields or invalid email.
- `500` — Server error.

The password is hashed using bcrypt before saving the user to MongoDB.

## 1.2 Login User

Authenticate an existing user.

**Endpoint**

```http
POST /api/user/login
```

**Request Body**

```json
{
  "email": "abhishek@example.com",
  "password": "password123"
}
```

**Success Response — 200**

```json
{
  "success": true,
  "token": "JWT_TOKEN"
}
```

**Possible Errors**

- `400` — User does not exist or invalid credentials.
- `500` — Server error.

## 1.3 Admin Login

Authenticate the administrator using credentials stored in environment variables.

**Endpoint**

```http
POST /api/user/admin
```

**Request Body**

```json
{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

**Success Response — 200**

```json
{
  "success": true,
  "token": "ADMIN_JWT_TOKEN"
}
```

**Possible Errors**

- `400` — Invalid credentials.
- `500` — Server error.

---

# 2. Product APIs

Base route: `/api/product`

## 2.1 List All Products

Fetch all products from the database.

**Endpoint**

```http
GET /api/product/list
```

**Authentication:** Not required.

**Success Response — 200**

```json
{
  "success": true,
  "products": [
    {
      "_id": "PRODUCT_ID",
      "name": "Classic T-Shirt",
      "description": "Comfortable cotton t-shirt",
      "price": 499,
      "category": "Men",
      "subCategory": "Topwear",
      "bestseller": true,
      "sizes": ["S", "M", "L", "XL"],
      "image": [
        "https://example.com/image.jpg"
      ],
      "date": 1720000000000
    }
  ]
}
```

Product IDs, dates, and image URLs above are illustrative.

## 2.2 Get Single Product

Fetch details of a specific product.

**Endpoint**

```http
GET /api/product/single
```

**Request Body**

```json
{
  "productId": "PRODUCT_ID"
}
```

**Success Response — 200**

```json
{
  "success": true,
  "product": {
    "_id": "PRODUCT_ID",
    "name": "Classic T-Shirt",
    "description": "Comfortable cotton t-shirt",
    "price": 499,
    "category": "Men",
    "subCategory": "Topwear",
    "bestseller": true,
    "sizes": ["S", "M", "L", "XL"],
    "image": [
      "https://example.com/image.jpg"
    ]
  }
}
```

**Note:** This endpoint reads `productId` from `req.body`. For better REST API compatibility, consider changing it to `GET /api/product/single/:productId`.

## 2.3 Add Product

Add a new product with images.

**Endpoint**

```http
POST /api/product/add
```

**Authentication:** Admin token required.

**Content-Type**

```http
multipart/form-data
```

**Form Data**

| Field | Type | Description |
|---|---|---|
| name | String | Product name |
| description | String | Product description |
| price | Number | Product price |
| category | String | Product category |
| subCategory | String | Product subcategory |
| sizes | JSON String | Array of available sizes |
| bestseller | String | `"true"` or `"false"` |
| image1 | File | First product image |
| image2 | File | Second product image |
| image3 | File | Third product image |
| image4 | File | Fourth product image |

**Example Form Data**

```text
name: Classic T-Shirt
description: Comfortable cotton t-shirt
price: 499
category: Men
subCategory: Topwear
sizes: ["S","M","L","XL"]
bestseller: true
image1: [Choose File]
```

**Success Response — 200**

```json
{
  "success": true,
  "message": "Product Added"
}
```

Images are uploaded to Cloudinary, and their secure URLs are stored in MongoDB.

## 2.4 Remove Product

Delete a product from the database.

**Endpoint**

```http
DELETE /api/product/remove
```

**Authentication:** Admin token required.

**Request Body**

```json
{
  "id": "PRODUCT_ID"
}
```

**Success Response — 200**

```json
{
  "success": true,
  "message": "Product Removed"
}
```

---

# 3. Shopping Cart APIs

Base route: `/api/cart`

All cart endpoints require user authentication.

## Authentication Header

```http
token: USER_JWT_TOKEN
```

The `authUser` middleware verifies the token and provides the authenticated user's ID through `req.userId`.

## 3.1 Get User Cart

Fetch the authenticated user's cart.

**Endpoint**

```http
GET /api/cart/get
```

**Headers**

```http
token: USER_JWT_TOKEN
```

**Success Response — 200**

```json
{
  "success": true,
  "cartData": {
    "PRODUCT_ID_1": {
      "M": 2,
      "L": 1
    },
    "PRODUCT_ID_2": {
      "XL": 3
    }
  }
}
```

The cart stores product IDs, sizes, and quantities.

## 3.2 Add Product To Cart

Add a product or increase its quantity in the cart.

**Endpoint**

```http
POST /api/cart/add
```

**Request Body**

```json
{
  "itemId": "PRODUCT_ID",
  "size": "M"
}
```

**Success Response — 200**

```json
{
  "success": true,
  "message": "Added To Cart"
}
```

If the product and size already exist, the quantity increases by one.

## 3.3 Update Cart Quantity

Update the quantity of a product in the cart.

**Endpoint**

```http
PUT /api/cart/update
```

**Request Body**

```json
{
  "itemId": "PRODUCT_ID",
  "size": "M",
  "quantity": 3
}
```

**Success Response — 200**

```json
{
  "success": true,
  "message": "Cart Updated"
}
```

**Possible Errors**

- `404` — User or product not found.
- `500` — Server error.

---

# 4. Order APIs

Base route: `/api/order`

All user order endpoints require a valid user JWT token.

## 4.1 Place Order — Cash On Delivery (COD)

Create an order with cash on delivery as the payment method.

**Endpoint**

```http
POST /api/order/place
```

**Request Body**

```json
{
  "items": [
    {
      "name": "Classic T-Shirt",
      "price": 499,
      "quantity": 2,
      "size": "M"
    }
  ],
  "amount": 1008,
  "address": {
    "firstName": "Abhishek",
    "lastName": "Yadav",
    "email": "abhishek@example.com",
    "street": "Main Street",
    "city": "Delhi",
    "state": "Delhi",
    "zipcode": "110001",
    "country": "India",
    "phone": "9876543210"
  }
}
```

**Success Response — 200**

```json
{
  "success": true,
  "message": "Order Placed"
}
```

**Order Details**

- Payment method: `COD`
- Payment status: `false`
- Order status: `Order Placed`

The user's cart is cleared after the order is saved.

## 4.2 Place Order — Stripe

Create an order and generate a Stripe Checkout Session.

**Endpoint**

```http
POST /api/order/stripe
```

**Request Body**

Uses the same `items`, `amount`, and `address` structure as the COD endpoint.

**Success Response — 200**

```json
{
  "success": true,
  "session_url": "STRIPE_CHECKOUT_URL"
}
```

Redirect the user to `session_url` to complete payment.

**Payment Flow**

1. Frontend sends order details to the backend.
2. Backend saves the order with payment status `false`.
3. Backend creates a Stripe Checkout Session.
4. User completes or cancels payment.
5. Stripe redirects the user to the frontend verification page.
6. Frontend calls the Stripe verification endpoint.

**Redirect URLs**

```text
/verify?success=true&orderId=ORDER_ID
```

```text
/verify?success=false&orderId=ORDER_ID
```

## 4.3 Verify Stripe Payment

Update the order after the Stripe checkout flow.

**Endpoint**

```http
POST /api/order/verifyStripe
```

**Request Body**

```json
{
  "success": "true",
  "orderId": "ORDER_ID"
}
```

**Success Response — 200**

```json
{
  "success": true
}
```

If payment fails:

```json
{
  "success": false,
  "message": "Payment Failed"
}
```

**Important:** The current implementation trusts the `success` value sent by the frontend. In production, verify the payment with Stripe on the server before marking an order as paid. Also verify that the order belongs to the authenticated user.

## 4.4 Place Order — Razorpay

Create a Razorpay order for online payment.

**Endpoint**

```http
POST /api/order/razorpay
```

**Request Body**

Uses the same `items`, `amount`, and `address` structure as the COD endpoint.

**Success Response — 200**

```json
{
  "success": true,
  "order": {
    "id": "RAZORPAY_ORDER_ID",
    "amount": 100800,
    "currency": "INR",
    "receipt": "ORDER_ID"
  },
  "orderId": "ORDER_ID"
}
```

The Razorpay amount is expressed in paise.

For example:

```text
₹1008 = 100800 paise
```

Use the returned Razorpay order ID to open the Razorpay Checkout on the frontend.

## 4.5 Verify Razorpay Payment

Verify the Razorpay payment signature and update the order.

**Endpoint**

```http
POST /api/order/verifyRazorpay
```

**Request Body**

```json
{
  "razorpay_order_id": "RAZORPAY_ORDER_ID",
  "razorpay_payment_id": "RAZORPAY_PAYMENT_ID",
  "razorpay_signature": "RAZORPAY_SIGNATURE",
  "orderId": "ORDER_ID"
}
```

**Success Response — 200**

```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

**Possible Errors**

- `400` — Missing payment details or invalid signature.
- `500` — Server error.

The backend verifies the signature using HMAC-SHA256 and the Razorpay secret key.

---

# 5. User Order APIs

## 5.1 Get Logged-In User Orders

Fetch all orders belonging to the authenticated user.

**Endpoint**

```http
POST /api/order/userorders
```

**Headers**

```http
token: USER_JWT_TOKEN
```

**Request Body**

No request body is required.

**Success Response — 200**

```json
{
  "success": true,
  "orders": [
    {
      "_id": "ORDER_ID",
      "userId": "USER_ID",
      "items": [
        {
          "name": "Classic T-Shirt",
          "price": 499,
          "quantity": 2,
          "size": "M"
        }
      ],
      "amount": 1008,
      "paymentMethod": "COD",
      "payment": false,
      "status": "Order Placed",
      "date": 1720000000000
    }
  ]
}
```

---

# 6. Admin Order APIs

These endpoints require a valid admin token.

## 6.1 Get All Orders

Fetch all orders for the admin panel.

**Endpoint**

```http
POST /api/order/list
```

**Headers**

```http
token: ADMIN_JWT_TOKEN
```

**Success Response — 200**

```json
{
  "success": true,
  "orders": []
}
```

The `orders` array contains all orders stored in the database.

## 6.2 Update Order Status

Update the status of an existing order.

**Endpoint**

```http
POST /api/order/status
```

**Request Body**

```json
{
  "orderId": "ORDER_ID",
  "status": "Shipped"
}
```

**Success Response — 200**

```json
{
  "success": true,
  "message": "Status Updated"
}
```

Example order statuses:

```text
Order Placed
Packing
Shipped
Out for Delivery
Delivered
Cancelled
```

These are example status values. The current controller accepts the supplied status string without restricting it to a predefined list.

---

# 7. Authentication Guide

## User Authentication

After registering or logging in, the backend returns a JWT token.

Include that token in the headers of protected user requests.

```http
token: USER_JWT_TOKEN
```

## Admin Authentication

After successful admin login, use the returned admin JWT token for protected admin requests.

```http
token: ADMIN_JWT_TOKEN
```

**Note:** The `adminAuth` middleware must validate the admin token. Do not use a normal user token for admin-only endpoints.

---

# 8. Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=4000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Never commit your `.env` file or expose secret keys in frontend code.

---

# 9. Important Notes

- All protected routes require the appropriate authentication token.
- Product images are uploaded to Cloudinary.
- Product and order data are stored in MongoDB.
- Cart data is stored against the authenticated user's account.
- The backend uses INR as the payment currency.
- The delivery charge in the current order controller is ₹10.
- The order amount and product prices should be validated on the backend before creating orders or payment sessions.
- Stripe and Razorpay payments should be verified server-side before marking an order as paid.
- Use HTTPS in production.

---

# 10. Run The Backend

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

For development with Nodemon:

```bash
npm run server
```

The API will be available at:

```text
http://localhost:4000
```

---
## Server-Side Environment Variables

Create a `.env` file in your backend/server directory and add the following variables:

```env
# MongoDB URL
MONGODB_URI=

# Cloudinary Setup
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
CLOUDINARY_NAME=

# JWT Secret
JWT_SECRET=

# Admin Credentials
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Stripe Keys
STRIPE_SECRET_KEY=

# Razorpay Keys
RAZORPAY_KEY_SECRET=
RAZORPAY_KEY_ID=

## Client-Side Environment Variables

Create a `.env` file in your frontend directory:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=

#Admin password and email
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=qwerty123


**Developed with ❤️ using the MERN Stack**