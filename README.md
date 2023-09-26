# Task Tracking System - Node.js & MySQL

This project is a simple task management system built with Node.js and MySQL. 
It includes CRUD operations for managing tasks and provides task metrics. You can set up and run the project either manually or using Docker.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
  - [Manual Setup](#manual-setup)
  - [Docker Setup (Optional)](#docker-setup-optional)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
  - [Example API Usage](#example-api-usage)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (https://nodejs.org/)
- MySQL server installed (https://www.mysql.com/)
- Docker installed (https://www.docker.com/) (optional)

## Installation

1. Clone this repository:

git clone <repository-url>

2. Navigate to the project directory:

cd nodejs-taskMgr

3.Install project dependencies:

npm install

4.Set up the MySQL Database:

Create a MySQL database for the project.

Update the database configuration in ./db.js with your MySQL credentials:

const sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'mysql',
});

5.Run Sequelize migrations to create the database tables:

npx sequelize-cli db:migrate

Running the Project
You can run the project either manually or using Docker.

Manual Setup
Start the Node.js server:
	npm start

Your Node.js server should now be running on http://localhost:3000.

Docker Setup (Optional)
1.Make sure Docker is installed and running.
2.Build the Docker image:
	docker-compose build
3.Start the Docker containers:
	docker-compose up
Your Node.js server and MySQL database will now be running in Docker containers.

API Endpoints
1.Create a Task:
	POST /task
2.Update a Task:
	PUT /task/:id
3.Get All Tasks (Paginated):
	GET /tasks?page=<page-number>&pageSize=<page-size>
4.Get Task Metrics:
	GET /task-metrics
Usage
You can interact with the API using tools like Postman or curl, or integrate it into your frontend application.

Example API Usage
1.Create a Task:
curl -X POST -H "Content-Type: application/json" -d '{
  "title": "Sample Task",
  "description": "This is a sample task",
  "status": "open",
  "dueDate": "2023-12-31"
}' http://localhost:3000/task

2.Update a Task:
curl -X PUT -H "Content-Type: application/json" -d '{
  "title": "Updated Task",
  "description": "This is an updated task",
  "status": "completed",
  "dueDate": "2023-12-31"
}' http://localhost:3000/task/1

3.Get All Tasks (Paginated):
curl http://localhost:3000/tasks?page=1&pageSize=10

4.Get Task Metrics:
curl http://localhost:3000/task-metrics