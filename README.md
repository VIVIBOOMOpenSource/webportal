## Viviboom Frontend

### Set up
1. Install npm & node
2. Git pull repo
3. `npm install`
4. `npm run start-dev`
5. If you get the error for step 4, you can either change the value for "start-dev" in package.json from `start-dev`: `cross-env PORT=3028 NODE_ENV=development react-scripts start` to `start-dev`: `cross-env PORT=3028 NODE_ENV=development react-scripts --openssl-legacy-provider start`, or downgrade your node to version 14
6. Set up express-viviboom if you haven't already so that the backend is also running

Frontend is hosted on
Local: localhost:3028

Release: https://www.release.viviboom.co/
Prod: https://www.viviboom.co/

### Collaboration guidelines
YOU MUST REPLACE ALL LOGOS, IMAGES AND ANIMATIONS USED TO YOUR OWN. THE IMAGES AND ANIMATIONS USED IN THE SOURCE CODE ARE COPYRIGHTED AND PROVIDED ONLY AS REFERENCE MATERIAL.

1. Create new branch called feature/* or fix/*. For instance, fix/read-me
2. Make a pull request
3. Assign someone to review the request


### File structure
The structure of this repo is as follows:

1. Apis - Keeps files related to API
2. Components - Anything that will load on the screen by itself
3. Config - Sets up multi-environment configurations in the application
4. Css - Stores all the images and styles
5. Data - Stores global constant variables
6. Enums - Defines a set of named constants
7. Hooks - Contains every single custom hook in the application
8. Js - external static files - During a refactor these should be merged into css & into the rest of the project.
9. Redux - Stores the actions and reducers used in redux 
10. Sass - external static files - During a refactor these should be merged into css & into the rest of the project.
11. Socket - Contains all event handlers involving socket
12. Store - Data that needs to be used across multiple components and/or needs predictable state
13. Tests - Verifies that the component renders properly
14. Translations - Maintains a collection of translated terms for the views that necessitate them
15. Utils - Utilities that enhance your code


### Conventions

Files - snake-case
Enums - PascalCase
Keys - PascalCase 
Variables - camelCase
Imported Objects - PascalCase

Style - Typically only use Margin & Padding in increments of 4 (unless there are obscure cases)

If the convention is not otherwise stated, refer to airbnb's convention
https://github.com/airbnb/javascript/tree/master/react


# DevOps Setup
- Site hosted via AWS Amplify
