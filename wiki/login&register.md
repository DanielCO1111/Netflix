# Login and Registration Wiki

## Introduction

The login and registration guide for both our app and website. This document provides a detailed explanation of the process of accessing your account and creating a new one,
including the frontend, backend, and security considerations.
Login and registration are fundamental features of our netflix system, and designed to allow users to authenticate securely and access personalized features.


Follow the step-by-step instructions below to seamlessly login to your existing account or register for a new one.
Additionally, we'll provide insights into how authentication works behind the scenes and offer best practices for maintaining the security of your account credentials.

# Login

## WEB (REACT)
1. After running the react website as described in the setup guide, the Home Screen for non-authenticated users will appear.
   
2. If you already have an account, tap on the *'Get In'* button, and then type in your username and password. Incorrect username or password will result in failure and access to the website will be denied.

3. Successful login will grant the user access to the Hompage which allows the user to see movie recommendations, find movies by category, search for movies and see which movies have already been watched, and so on
  
### IMAGES

 **Home Screen (for non-authenticated users).**
 
![Home page](https://github.com/user-attachments/assets/ee8fecea-085d-4776-b4f8-1155238045de)

---

**Login Screen**

![Login page](https://github.com/user-attachments/assets/a3157fa4-baf9-4ed2-bfa0-8c5bd8a0c1ef)

 ---

## ANDROID
1. After running the Android app, the following screen will appear:

2. If you already have an account, tap on the *'Login'* button, and then type in your username and password. Incorrect username or password will result in failure and access to the website will be denied.

3. Successful login will grant the user access to the Hompage which allows the user to see movie recommendations, find movies by category, search for movies and see which movies have already been watched, and so on..

### IMAGES

 **Home Screen (for non-authenticated users).**
 
 ![WhatsApp Image 2025-02-06 at 14 18 24](https://github.com/user-attachments/assets/508f9edb-1e73-42c5-b3c7-c7d7a086ff37)

---

**Login Screen**
 
 ![WhatsApp Image 2025-02-06 at 14 55 54](https://github.com/user-attachments/assets/15b15eb0-1421-4727-8408-8e8fe6c0fd62)

# Registration

1. For registration, click on the *"Sign in"* (web) or "Register" (android) to get redirected to the registration page.

2. Follow the validation guidelines, making sure the fields all match the requirements. If these requirements are not met, login or registration will not be completed:
- All fields must be non-empty.
- Password must be at least 8 characters long.
- Password must contain both letters.
- Password must contain numbers.
- Confirm password must match the password.

3. Choose a profile picture: You can choose a profile picture from your local device or take a picture from your mobile device.
  3ץ


## REACT
 ![Register page](https://github.com/user-attachments/assets/00cb70b4-9c27-4929-a835-7d29ee2e0ff2)

   Demonstration of reaction fron invalid input for Web users
  
 ![image](https://github.com/user-attachments/assets/5b5566e5-9b91-40eb-a9f9-cefc5b5d9224)

## ANDROID
 ![WhatsApp Image 2025-02-06 at 14 43 07](https://github.com/user-attachments/assets/72a4a955-c16c-4c4b-91bb-411423b0d2a9)
 
 Demonstration of reaction fron invalid input for Android users
 
![WhatsApp Image 2025-02-06 at 14 36 47](https://github.com/user-attachments/assets/f92d018c-2844-4914-a513-25ce92309781) 
![WhatsApp Image 2025-02-06 at 14 36 47 (1)](https://github.com/user-attachments/assets/d216c27d-b76f-437e-ad61-16e99147f28d)



## Authentication
- Login Credentials: When a user attempts to log in, they provide their credentials, in our case a username and password.
  
- Client-Server Interaction: Upon entering their credentials, the client (such as a web browser or mobile app) sends a login request to the server. This request contains the user's credentials.

- Server-Side Verification: If a user is found in the system, a JWT token is created, encrypted with a private key which is returned in the body of a response with information about the user. A token is passed in each request as an "Authorization" HTTP header. If not found or expired - a response with a ststus 401 error is returned to the client side.

- In case of registration: A username is transferred from the client side. On the server side, it is checked whether a username already exists in the system.
If it does - a response is returned with 'ok' status code. Otherwise, a new user is registered in the DB.
Logout: When the user chooses to log out, the session is terminated, and any associated session tokens or cookies are invalidated. This prevents unauthorized access to the user's account.

**These are our users if you are interested to test them:**

 Login details for an Admin user which is in the database:
 
  *username - johndoe*
  
  *password - aX@12345678*
  
 login details for a user which is in the database:
 
 *username - AdiZ*
 
 *password - aX@0528086541*
