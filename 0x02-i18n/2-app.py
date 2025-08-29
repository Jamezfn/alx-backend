#!/usr/bin/env python
"""Basic Babel setup"""

from flask import Flask, render_template
from flask_babel import Babel

class Config:
    """App configuration for Babel"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

app = Flask(__name__)
app.config.from_object(Config)

#babel = Babel(app)

#@babel.locale_selector
def get_locale():
    """Select the best language match from request"""
    return request.accept_languages.best_match(app.config['LANGUAGES'])

babel = Babel(app, locale_selector=get_locale)

@app.route('/')
def welcome():
    """Root route"""
    return render_template('1-index.html')

if __name__ == '__main__':
    app.run(debug=True)
