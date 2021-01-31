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

- next
- snowpack
- apollo client

### Server

- graphql-yoga
- prisma orm
- nextauth
- postgresql
- redis

## Setup

### Postgres

#### Postgres CLI

Access postgres cli

```
sudo -u postgres psql
```

Creat database and user

```SQL
CREATE USER dbuser WITH PASSWORD 'dbuserpassword';
CREATE DATABASE dbname WITH OWNER = dbuser;
```
