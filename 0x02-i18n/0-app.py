#!/usr/bin/env python
"""Basic Flask app"""

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def welcome():
    """Root route that renders index.html"""
    return render_template('0-index.html')

if __name__ == "__main__":
    app.run(debug=True)
