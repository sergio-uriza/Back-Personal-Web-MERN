# Back-Personal-Web-MERN



## Table of Contents

- [Get the Project](#get-the-project)
- [Project Dependencies](#project-dependencies)
- [Project Scripts](#project-scripts)
- [Environment Variables](#environment-variables)
- [Authors ](#authors )
- [License](#license)


## Get the project

- [ ] [Go to the repository in github](https://github.com/sergio266/Back-Personal-Web-MERN) and review the project structure, you can download it the *.zip* or just use the command:

```
cd folder_location
git clone https://github.com/sergio266/Back-Personal-Web-MERN.git
```


## Project Dependencies
- ***`Express:`*** It is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

- ***`Dotenv:`*** It is a zero-dependency module that loads environment variables from a *.env* file into *process.env*. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.

- ***`Typescript:`*** It is a strict syntactical superset of JavaScript and adds optional static typing to the language. It is designed for the development of large applications and transpiles to JavaScript.

- ***`Eslint:`*** It is a static code analysis tool for identifying problematic patterns found in JavaScript code. Rules in ESLint are configurable, and customized rules can be defined and loaded. ESLint covers both code quality and coding style issues.

- ***`Jest:`*** It is a delightful JavaScript Testing Framework with a focus on simplicity and built on top of Jasmine.

- ***`Webpack:`*** It is a free and open-source module bundler for JavaScript. It can transform front-end assets such as HTML, CSS, and images if the corresponding loaders are included. Webpack takes modules with dependencies and generates static assets representing those modules.

- ***`Mongoose:`*** It provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

- ***`Cors`*** It is a NodeJS package for providing a Connect/Express middleware that can be used to enable CORS (Cross-Origin Resource Sharing). This is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources.

- ***`Helmet`*** It helps you secure your Express apps by setting various HTTP headers. Helmet is a Express middleware, the top-level function is a wrapper around 15 smaller middlewares.

- ***`Nodemon:`*** It is a utility that will monitor for any changes in your source and automatically restart your server. Perfect for development. Nodemon does not require any additional changes to your code or method of development and is a replacement wrapper for node.

- ***`Swagger:`*** It is a set of open source software tools for designing, building, documenting, and using RESTful web services. Includes automated documentation, code generation, and test case generation

- ***`Tsoa:`*** It is a framework with integrated OpenAPI compiler to build Node.js serve-side applications using TypeScript. It can target express, hapi, koa and more frameworks at runtime. tsoa applications are type-safe by default and handle runtime validation seamlessly.

- ***`Serve:`*** It helps you serve a static site, single page application or just a static file (no matter if on your device or on the local network). It also provides a neat interface for listing the directory's contents.

- ***`Supertest:`*** It provides a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent.

- ***`Zod:`*** Zod is a TypeScript-first schema declaration and validation library used to process any data type, from a simple string to a complex nested object. It is designed to be as developer-friendly as possible. Its goal is to eliminate duplicative type declarations. Zod will automatically infer the static TypeScript type.


## Project Scripts

- *"test":* Running this script will start the testing process with Jest (Without Confg).

- *"clean":* Running this script will will permanently delete all files in the 'dist' folder.

- *"swagger":* Running this script will create the files and routes corresponding to the documentation implemented in the controllers of the endpoints of the project.

- *"format":* Running this script will format all of the project's code using the Prettier tool under the parameters set in its configuration file.

- *"lint":* Running this script you will be able to print to the terminal all those errors and warnings thrown by es-lint, after analyzing the project code according to its configuration.

- *"lint-fix":* Running this script you will allow es-lint to fix as many errors and warnings as possible and print the remaining errors and warnings to the terminal, after analyzing the project's code according to its configuration.

- *"dev":* Running this script will  execute the TS code of the application in a development environment, keeping a constant monitor for any changes to re-execute the script.

- *"build":* Running this script will trigger the *clean* script to then compile the project code with *tsc*. This causes the conversion of TypeScript files to generated Javascript files in the 'dist' folder.

- *"start":* Running this script will execute the main compiled JS file in NodeJS using the globally available node command.



## Environment Variables

You must create an ***.env*** file in the root of the project with the following environment variables:
- PORT: Indicating the port number to deploy the local server. For instance:
~~~
    PORT = 8000
~~~
- SECRET_ACC_TOKEN: Secret key used to encrypt access tokens. For instance:
~~~
    SECRET_ACC_TOKEN = Y0uRS3Cr3tK3y1
~~~
- SECRET_REF_TOKEN: Secret key used to encrypt refresh tokens. For instance:
~~~
    SECRET_REF_TOKEN = Y0uRS3Cr3tK3y2
~~~
- DB_CONNECTION_PATH: Local or remote hosting address of your Mongodb database. For instance:
~~~
    DB_CONNECTION_PATH = mongodb://localhost:27017/yourdatabase
~~~
- CORS_ORIGIN: Specify the origin that is allowed to access the resources of the response. For instance:
~~~
    CORS_ORIGIN = https://example.org
~~~




## Authors 
It is a personal project of S.U.


## License
No open source project.


## Project status

Ready!
