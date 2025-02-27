# Compilation and Execution

## Introduction

This guide explains how to compile and run the application.

---

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
