# Aida

> Your digital assistant for meeting new people 👬🏼

My 3rd year final project for [BSc Artificial Intelligence and Computer Science](https://www.cs.bham.ac.uk/admissions/undergraduate/degrees/aics) at the [University of Birmingham](https://www.birmingham.ac.uk).

## How To Use

### Server

1. Install dependencies

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Start the server

```bash
python -m flask run
rq worker # Starts a job queue
rqscheduler # Starts a job scheduler
```

### App

1. Install dependencies

```bash
cd app
yarn install
```

2. Start the app

```bash
yarn start
```

### Admin Website

1. Install dependencies

```bash
cd app
yarn install
```

2. Start the website

```bash
yarn start
```
