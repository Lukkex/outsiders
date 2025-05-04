# Outsiders FC
![alt text](https://github.com/Lukkex/outsiders/blob/main/public/images/outsiders4.png)
---
<p align="center">
The Outsiders are a volunteer soccer program that competes against the inmate teams in various prisons across California. The goal of this project is to create a secure and user-friendly web platform for managing the soccer volunteer program at Folsom Prison. The platform will allow administrators to upload and manage required forms for volunteers, schedule meeting times, and facilitate the exchange of sensitive player information securely with the state. Volunteers will be able to sign up, submit forms, and view their schedules with ease, while administrators will be able to manage users, teams, and events.
</p>

# Our Project

<p align="center">
Our project creates a welcome space for players and coaches to unite and organize these prison sports meets. The website covers event creation, announcement, and signup, as well as registration— and storage of player authorization forms, all under the umbrella of user authentication and secure databases. This environment is built to facilitate this process and relieve the burden of organization from the backs of local coaches.
</p>

# Team Tech Deck

  <table align="center">
    <tr>
      <th>Devs</th>
      <th>Contact Info</th>
    </tr>
    <tr>
      <td>William Lorence</td>
      <td>williamlorence@csus.edu</td>
    </tr>
    <tr>
      <td>Hunter Brown</td>
      <td>hbrown4@csus.edu</td>
    </tr>
    <tr>
      <td>Connor Yep</td>
      <td>connoryep@csus.edu</td>
    </tr>
    <tr>
      <td>Christian Young</td>
      <td>christianyoung@csus.edu</td>
    </tr>
    <tr>
      <td>Shawnee Porkat</td>
      <td>sporkat@csus.edu</td>
    </tr>
    <tr>
      <td>Wencai Ma</td>
      <td>wencaiyang2@csus.edu</td>
    </tr>
    <tr>
      <td>Trenton Suddaby</td>
      <td>trentonsuddaby@csus.edu</td>
    </tr>
    <tr>
      <td>Qasim Ali</td>
      <td>qali@csus.edu</td>
    </tr>
  </table>

# User-Interface

## Home Page

![image](/public/images/Home.png)
This is where players land after logging in, this page provides a friendly welcome atmosphere, and helps direct players to the next steps in using the app.

## Log In

![image](/public/images/Sign%20In.png)
Players login to their account here. If they forgot their password, they can fix that here.

## Account Creation

![image](/public/images/Sign%20Up.png)
If users don't have an account, they create one on this page. Additionally, there is functionality to add two factor authentication. and email verification upon creation.

## Registration

Selecting Forms             |  Submission
:-------------------------:|:-------------------------:
![](/public/images/Forms.png) | ![](/public/images/Forms%202.png)
Players need to use this page first, where they submit all their required forms and select which prisons they will play at.

## Scheduling

![image](/public/images/Scheduling.png)
Users navigate to scheduling to RSVP for events set by coaches.

## Settings

![image](/public/images/Settings.png)
An important page for account management, allowing users to view their information, reset password, seek help with the app, or delete their account and all information.

# Database ERD
![image](/public/images/ERD.png)
The simple setup for the database, nice and compact!

# Setting up the Outsiders App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

Dependencies:
<ul>
  <li>Npm v10.8.2</li>
  <li>Node v20.18.0</li>
  <li>Jest v27.5.1</li>
  <li>Git v2.48.1.windows.1</li>
</ul>

<ul>
  <li>Install all the above dependencies.</li>
  <li>Navigate to a local directory in your IDE terminal (Bash, Powershell, Terminal, VSCode, etc) where you wish to clone the remote repository. Run ‘git clone https://github.com/Lukkex/outsiders’ in the command line to clone the remote repository.</li>
  <li>This will populate your local directory with all the working code and test files for running tests.</li>
  <li>Now run ‘npm install’ to install required dependencies</li>
  <li>Some important dependencies to check for are the following (in package.json):</li>
    <ul>
      <li>jest-dom:  version 6.6.3</li>
      <li>Babel-jest: version 29.7.0</li>
      <li>Jest : version 27.5.1</li>
      <li>Jest-json-reporter: 1.2.2</li>
      <li>Node.js: version 20.18.0</li>
      <li>React: version 18.3.1</li>
      <li>Aws-amplify: version 6.13.4</li>
      <li>Aws-cli: version 0.0.2</li>
    </ul>
  <li>
    The app is now installed and setup!
  </li>
</ul>

# Deployment
Placeholder...

# Testing

Running tests is as simple as running the command <b>npx jest (test file location)</b>. The command can also simply be run as <b>npx jest</b> to run all test files. Tests output in the console.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs dependencies in order to run the following commands.\
Creates node_modules directory.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
