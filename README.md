# NETFLIX project README
# Implementation of Netflix for web (with React) and Android application

----

GitHub: https://github.com/DanielCO1111/NETFLIX-project.git

JIRA :  https://live-team-h3a06qsw.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog

Scrum Master : Daniel Cohen.

---

## Project Overview

This project is a Netflix-inspired streaming application (based RESTful API) built using Android (MVVM Architecture) and Web Technologies (React, HTML, CSS, JavaScript, Bootstrap).
It serves as the frontend component, interacting with the backend server to provide various features, Which includes user authentication, movie browsing, recommendations, and administrative functionalities.
The project utilizes client-server TCP sockets, multithreading, MongoDB databases, including Node.js, Docker, working with C++ and more.

## Features

**User Interface**

+ Home Screen (for non-authenticated users)

+ Login & Registration Screen

+ Main Dashboard (for authenticated users)

+ Movie Information Screen

+ Movie Playback Screen

+ Search Results Screen

 + Movie recommendation system

+ Admin Panel (for authorized users)

+ Dark Mode / Light Mode Toggle

**Backend Functionality**

+ User authentication with JWT tokens

+ CRUD operations for movies and categories (Admin only)

+ Fetching movies from an API (http://foo.com/api/movies)

+ Search movies by category

+ Secure routes for different user roles

+ Movie recommendation system

## Tech Stack

**Web Application**

MVC Architecture

React (with hooks: useState, useRef, Router)

HTML, CSS, Bootstrap, JavaScript

Component-based structure

**Android Application**

MVVM Architecture

Room Database

Repository Pattern

LiveData & ViewModel

**Backend & Database**

Node.js for backend logic

MongoDB for data storage

Client-server TCP sockets for real-time communication

Multithreading to handle concurrent requests

Docker for containerized deployment

C++ for backend performance integration 

## Setup Instructions

**Prerequisites**

+ Node.js & npm (for React frontend)

+ Android Studio (for Android application)

+ Docker (for backend deployment)

+ JIRA & GitHub for project management

**Installation for Web Application**

1.Clone the repository:

```
git clone https://github.com/DanielCO1111/NETFLIX-project.git
cd my-new-app
```

2.Install dependencies:
```
npm install
```

3.Start the application:
```
npm start
```
**Installation for Android Application**

1.Open the Android project in Android Studio

2.Build & run on an emulator or device

**Build and Run Backend Server (Using Docker)**

Run the command:
```
 docker-compose build     
 docker-compose up -d
```
Now, the database suppose to be updated automatically with the docker.

Updating the database in mongodb manually:

```
 docker exec -it mongodb mongoimport --host localhost --port 27017 --db movieDB --collection movies --file /docker-entrypoint-initdb.d/movieDB.movies.json --jsonArray
 
 docker exec -it mongodb mongoimport --host localhost --port 27017 --db movieDB --collection users --file /docker-entrypoint-initdb.d/movieDB.users.json --jsonArray

 docker exec -it mongodb mongoimport --host localhost --port 27017 --db movieDB --collection moviemappings --file /docker-entrypoint-initdb.d/movieDB.moviemappings.json --jsonArray
 
 docker exec -it mongodb mongoimport --host localhost --port 27017 --db movieDB --collection usermappings --file /docker-entrypoint-initdb.d/movieDB.usermappings.json --jsonArray
 
 docker exec -it mongodb mongoimport --host localhost --port 27017 --db movieDB --collection categories --file /docker-entrypoint-initdb.d/movieDB.categories.json --jsonArray
```
*Steps that can be taken to verify that the Action database has indeed been updated:*

 get in the mongo shell through the contained:
 ```
docker exec -it mongodb mongosh
```

 switch to the right database:
```
use movieDB
```

checking the count of documents in each collection:
```
   db.movies.countDocuments()
   db.users.countDocuments()
   db.categories.countDocuments()
   db.moviemappings.countDocuments()
   db.usermappings.countDocuments()
   exit
```
 Droping the collecions:
 ```
  db.movies.drop()
  db.users.drop()
  db.categories.drop()
  db.moviemappings.drop()
  db.usermappings.drop()
```

Then restart the backend and frontend:
```
docker-compose restart backend  docker-compose restart frontend
```

After everything has set, use the app on:
```
http://localhost:3001/
```

 Login details for an Admin user which is in the database:
 
  *username - johndoe*
  
  *password - aX@12345678*
  
 login details for a user which is in the database:
 
 *username - AdiZ*
 
 *password - aX@0528086541*

 ## Visual Examples of the functionalities:

 **Home Screen (for non-authenticated users).**
 
 Web
 
![Home page](https://github.com/user-attachments/assets/ee8fecea-085d-4776-b4f8-1155238045de)

 Android
 
![WhatsApp Image 2025-02-06 at 14 18 24](https://github.com/user-attachments/assets/508f9edb-1e73-42c5-b3c7-c7d7a086ff37)

---

**Registration Screen**

Web

 ![Register page](https://github.com/user-attachments/assets/00cb70b4-9c27-4929-a835-7d29ee2e0ff2)
 
  Demonstration of reaction fron invalid input for Web users
  
 ![image](https://github.com/user-attachments/assets/5b5566e5-9b91-40eb-a9f9-cefc5b5d9224)

 Android
 
 ![WhatsApp Image 2025-02-06 at 14 43 07](https://github.com/user-attachments/assets/72a4a955-c16c-4c4b-91bb-411423b0d2a9)
 
 Demonstration of reaction fron invalid input for Android users
 
![WhatsApp Image 2025-02-06 at 14 36 47](https://github.com/user-attachments/assets/f92d018c-2844-4914-a513-25ce92309781)  ![WhatsApp Image 2025-02-06 at 14 36 47 (1)](https://github.com/user-attachments/assets/d216c27d-b76f-437e-ad61-16e99147f28d)



---

**Login & Registration Screen**

 Web
 
![Login page](https://github.com/user-attachments/assets/a3157fa4-baf9-4ed2-bfa0-8c5bd8a0c1ef)

 Android

 ![WhatsApp Image 2025-02-06 at 14 55 54](https://github.com/user-attachments/assets/15b15eb0-1421-4727-8408-8e8fe6c0fd62)

 ---

**Main Dashboard (for authenticated users)**


***Random movie part:***

-Dark mode

![Main page - random movie part](https://github.com/user-attachments/assets/a94088b2-2de4-4f37-a933-4f2a6a96e4f9)

-Light mode

![Main page - light theme](https://github.com/user-attachments/assets/7f51cfe9-57f6-483e-af3f-062bb4b57c51)

---

***Movie recommendations system***

![Main page - recommended movies slider](https://github.com/user-attachments/assets/941d6982-4974-4bd6-856f-7b6c426a2d91)

***Watched movies slider***

![Main page - watched movies slider](https://github.com/user-attachments/assets/d07800f5-3813-4a93-a131-7f4e0f49b2dd)

---

***All movies slider***

![Main page - all movies slider](https://github.com/user-attachments/assets/0fea29ec-f090-47eb-a9d9-267364c9aa8a)

---

***categories slider***

![Main page categories slider](https://github.com/user-attachments/assets/041e23bc-8132-4bd6-bd12-24c800c41afb)

---

***searching***

![Category - list movies by genre](https://github.com/user-attachments/assets/e70735f2-692e-418c-abd4-0a22778ae8ec)
![image](https://github.com/user-attachments/assets/472b15f8-7389-4755-9281-78bbe317ac35)

---

**Movie info page**

![Movie info page](https://github.com/user-attachments/assets/4721b5cd-c925-4864-a270-f9f83abd416a)

![Movie info page - recommendation part](https://github.com/user-attachments/assets/6a68e458-5e5d-4126-8fcf-3eeb74aa564b)

---

***Movie player***

![Movie player](https://github.com/user-attachments/assets/953d1a77-ac00-4fce-aeb8-785f80a247f4)

 ---
 
***Admin page***

-categories part

 ![Admin page - categories part](https://github.com/user-attachments/assets/ae9ae7b5-d110-4e50-844b-c86a45344b3b)

 -movies part
 
![Admin page - movies part](https://github.com/user-attachments/assets/00b844dd-b52c-49d4-b594-5e8cfcfd9e18)



 

 
