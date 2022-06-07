import os
from os import environ
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	SECRET_KEY = environ['SECRET_KEY']
	SQLALCHEMY_DATABASE_URI = environ['DATABASE_URI']
	APP_BASE_URL = environ['APP_BASE_URL']

class DevConfig(Config):
	FLASK_ENV = 'development'
	DEBUG = True
	TESTING = True

class StagingConfig(Config):
	FLASK_ENV = 'staging'
	DEBUG = False
	TESTING = False

class ProdConfig(Config):
	FLASK_ENV = 'production'
	DEBUG = False
	TESTING = False