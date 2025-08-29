#!/usr/bin/env python

from flask import Flask, render_template, request, g
from flask_babel import Babel, _, format_datetime
import pytz
from pytz.exceptions import UnknownTimeZoneError
from datetime import datetime

class Config:
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

app = Flask(__name__)
app.config.from_object(Config)

def get_locale():
    locale = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale

    if g.get("user"):
        user_locale = g.user.get("locale")
        if user_locale in app.config['LANGUAGES']:
            return user_locale

    header_locale = request.accept_languages.best_match(app.config['LANGUAGES'])
    if header_locale:
        return header_locale

    return app.config['BABEL_DEFAULT_LOCALE']

def get_timezone():
    tz_param = request.args.get("timezone")
    if tz_param:
        try:
            return pytz.timezone(tz_param).zone
        except UnknownTimeZoneError:
            pass

    if g.get("user"):
        user_tz = g.user.get("timezone")
        if user_tz:
            try:
                return pytz.timezone(user_tz).zone
            except UnknownTimeZoneError:
                pass

    return "UTC"

babel = Babel(app, locale_selector=get_locale, timezone_selector=get_timezone)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}

def get_user():
    """Return user dict if ID exists, else None"""
    try:
        user_id = int(request.args.get("login_as"))
        return users.get(user_id)
    except (TypeError, ValueError):
        return None

@app.before_request
def before_request():
    """Find user and set in flask.g"""
    g.user = get_user()

@app.route('/')
def welcome():
    current_time = format_datetime(datetime.now())
    return render_template('index.html', current_time=current_time)

if __name__ == '__main__':
    app.run(debug=True)
