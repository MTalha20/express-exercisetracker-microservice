# Exercise Tracker Microservice

The Exercise Tracker Microservice is a web application built with Express.js that allows users to register, log exercises, and view exercise logs. User and exercise data are stored remotely on a MongoDB Atlas database.

## Features

- User Registration: Users can create accounts and receive a unique user ID.
- Exercise Logging: Users can log exercise sessions with details.
- Exercise Logs: Users can view a log of all exercises they have added.
- Data Filtering: Users can filter exercise logs by date.
- Remote Database: User and exercise data are stored on a MongoDB Atlas database.

## Getting Started

### Prerequisites

Before getting started, make sure you have the following dependencies installed:

- Node.js: You can download it [here](https://nodejs.org/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MTalha20/exercise-tracker-microservice.git
   cd project-exercisetracker

npm install
npm start

## Usage
### Register
  Visit the app and click on the "Register" button.
  Fill in the registration form and submit it to create your account.
  You will receive a unique user ID upon successful registration.
### Log Exercises
  Log in with your user ID.
  Click on the "Log Exercise" button.
  Fill in the exercise details and submit the form to log your exercise session.

### View Exercise Logs
  After logging in, you can click on the "Exercise Logs" button to view a log of all exercises you have added.
### Filter Data
  On the "Exercise Logs" page, you can filter your exercise logs by date to view specific logs.

## Database
User and exercise data are stored on a MongoDB Atlas database. You can find the database connection details in the configuration file.

## Acknowledgments

This project's initial structure and inspiration were generously provided by [FreeCodeCamp](https://www.freecodecamp.org/). We have further modified and extended it as a learning project to meet our specific needs.
