# GlaxOJ
GlaxOJ is an online judge application. Like all online judges, it contains a set of coding problems, allows its authenticated users to solve them and get verdicts. It allows some extended features too that users can enjoy.

Live site: [GlaxOJ](https://glaxoj.herokuapp.com/) 

![GlaxOJ Landing Page](https://i.imgur.com/zii0mHk.png)

# Tech-Stack
##### Frontend
URL: [./Frontend](https://github.com/rahathossain690/GlaxOJ/tree/master/Frontend)
1. Tailwindcss
2. React


##### Backend
1. Node-js
2. PostgreSQL database
3. Sequelize ORM

and Dockerized.

##### Deployment
1. Heroku with docker

# Installation
1. Install nodejs.
2. Install npm.
3. Install postgreSQL and configure database and provide your configuration here [./config](https://github.com/rahathossain690/GlaxOJ/tree/master/config).
4. Type `npm install` and `cd Frontend && npm install`.
5. Rewrite your preferable .env files.
6. Type `npm start` for backend and `cd Frontend && npm install` for frontend.

# Features / Usage
Users can -
##### Problem
1. View problems with Pagination.
2. Query over problem properties.
3. view a specific problem.
4. Submit solution (Currently supports C++ only).


##### Rank
1. View the ranklist.


##### Status
1. View current judge status.
2. Query over submission properties.


##### User
1. View user informations like total submissions, solves, solved problems, tried problems etc.
2. View user's submissions.


##### Authentication
1. Can authenticate with Google OAuth only.


##### Admin (Restricted)
1. Create / disable / update / delete problems.
2. Watch out the users (Along with the power of disabling another user, giving / taking adminstration power to other), submissions and other informations.
3. Remove submission.
4. Turn judge status on / off.

# Contribution
Feel free to contribute and share your thoughts on this project.

# Acknowledgment
This is OJ is based on a long time dream and a so-called short time class project (Thanks to COVID). The name was suggested by [Farhan Fuad](https://github.com/farhanfuad35) Bro. A big shoutout and a little thanks to [Faiaz Khan](https://github.com/faiazamin) for trusting me and agreeing for this as our project idea. A little thanks to [NJ Rafi](https://github.com/njrafi) vai too. Rest of all the big thanks go to stack-overflow, all the stack-docs, all the kind hearted wingless angels and their tech blogs, github issues and all the gods solving there and my lost hairs / sleeps / will to live / chance of getting a girlfriend.
