# How to run the website

## Requirements

- python:

    Check in a terminal if you have python: `python -V`.
    If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

   * Note -  For Windows systems, Python 3.x is installed as `python` by default.

## How to start the application

1. Open in the terminal this folder
2. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`.
3. If this port is already in use, follow next linux commands:
    - `sudo lsof -i tcp:8000`  to check which PID is using the port.
    - `sudo kill -9 <PID>`  to terminate the process that is occupying this port.
3. With your server running, visit the site: `http://localhost:8000` in the browser of your choice.
