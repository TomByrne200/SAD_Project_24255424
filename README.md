# SAD_Project_24255424
# INSECURE BRANCH: CONTAINS CODE VULNERABILITIES
Branch contains SQL Injection, XSS and Sensitive data exposure

FOR PROJECT USE!!! 
# BlogSpace

BlogSpace is a simple open-source blog website built with node.js, Express and SQLite3 for the NCI Secure Application Development project 2026. This project demonstrates the difference between secure and insecure implementation of the same application.

## BRANCHES

main - the base for the application. sets the skeleton for both the secure and insecure branch

insecure - contains SQL Injection, refective, stored, and DOM-based XSS, and Data exposure

secure- this branch is a fixed version of the insecure branch, solving all vulnerabilities and adding logging and monitoring

## Requirements

Node.js 20 or later
npm
git

## Installation

git clone https://github.com/TomByrne200/SAD_Project_24255424.git

cd SAD_Project_24255424

git checkout main/secure/insecure

npm install

npm run seed

npm start

open http://localhost:3000

## Test Accounts

Username - admin, bruno, alex

password - AdminPwd1999!, BrunoPwd2026!, AlexPwd2008!

role - only applies to admin = admin

## Scripts

npm start - runs app

npm run dev - run with auto restart nodemon

npm run seed - Reset database to default test accounts

## License
MIT. See LICENSE.

