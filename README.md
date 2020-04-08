# Aida

> Your digital assistant for meeting new people 👬🏼

My 3rd year final project for [BSc Artificial Intelligence and Computer Science](https://www.cs.bham.ac.uk/admissions/undergraduate/degrees/aics) at the [University of Birmingham](https://www.birmingham.ac.uk).

## How To Use

### Server

1. Install dependencies

```bash
cd server
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
```

2. Start a job queue

```bash
rq worker
```

3. Start a job scheduler

```bash
rqscheduler
```

4. Start the server

```bash
python -m flask run
rq worker # Starts a job queue
```

### App

1. Install dependencies

```bash
cd app
yarn install
```

2. Run on an Android device or emulator

```bash
yarn run android
```

3. Run on an iOS device or emulator

```bash
yarn run ios
```

### Admin Website

1. Install dependencies

```bash
cd website
yarn install
```

2. Start the website

```bash
yarn start
```
