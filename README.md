# Installation Guide

## ViviBoomFrontend (Web Portal)

### Prequisites
- Install [Node.js](https://nodejs.org/en/) & NPM: Download and install Node.js from the official website (https://nodejs.org/) which includes npm by default.
- Clone the repository.
    ```bash
    git clone git@github.com:VIVIBOOMOpenSource/webportal.git
    ```
- Navigate to the project directory:
    ```bash
    cd webportal
    ```
- Install the dependencies:
    ```bash
    npm install 
    ```
- Start the development server:
    ```bash
    npm run start-dev
    ```
    **Note -** If you encounter an error during this step, you have two options:
    1. Update the `start-dev` script in package.json
        - From:
            ```json
            "start-dev": "cross-env PORT=3028 NODE_ENV=development react-scripts start"
            ```
        - To:
            ```json
            "start-dev": "cross-env PORT=3028 NODE_ENV=development react-scripts --openssl-legacy-provider start"
            ```
    1. [Downgrade Node.js to version 14](https://github.com/VIVIBOOMOpenSource/VIVIBOOMOpenSource/blob/main/nodejs-downgrade.md).

    
- Open your web browser and navigate to http://localhost:3000 to access the web portal.

- _Set up `express-viviboom` if you haven't already so that the backend is also running_

## Contribute to the project
We welcome contributions to make this project even better! Whether it's fixing bugs, adding new features, improving documentation, or optimizing performance, your help is appreciated.

Before you get started, please read the [Contribution Guidelines](https://github.com/VIVIBOOMOpenSource/VIVIBOOMOpenSource/blob/main/contribution.md) to understand the process and conventions.

Thank you for contributing to the project! 🚀