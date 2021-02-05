# yoga-next-boilerplate

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)

## General info

This is a boilerplate for a web server client application

## Usage

- Register - Send confirmation email
- Login
- Forgot Password
- Logout
- Cookies and Http Header
- Authentication middleware
- Rate limiting
- Locking accounts
- Edit user
- User administration panel
- Delete account
- Jest testing

## Technologies

Project is created with:

### Client

- typescript
- next
- snowpack
- apollo client
- tailwindcss
- chakra-ui
- zustand

### Server

- typescript
- graphql-yoga
- prisma
- nextauth
- postgresql
- redis
- jest

## Setup

### Postgres

#### Postgres CLI

Creat database and user

```SQL
CREATE USER dbuser WITH PASSWORD 'dbuserpassword';
CREATE DATABASE dbname WITH OWNER = dbuser;
```

### Project

Clone project

```
git clone https://github.com/heitzlki/yoga-next-boilerplate
cd yoga-next-boilerplate/
```

### Dependecies

Install dependencies

```
yarn install
```
