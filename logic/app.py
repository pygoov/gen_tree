import types
import os
import stat
import asyncio
import time
import socket

from flask import Flask, render_template
from functools import wraps, partial
from threading import Thread


class App(Flask):
    def __init__(self, *args, **kwargs):
        print('Run inited App')
        super().__init__(*args, **kwargs)
        self.list_decorers = []

    def build_configs(self, debug=False):
        self.config['PREFERRED_URL_SCHEME'] = 'https'
        self.config['TEMPLATES_AUTO_RELOAD'] = debug
        self.config['SECRET_KEY'] = os.urandom(32).hex()        

    def route(self, rule, **options):
        if options.get('endpoint', None) is None:
            options['endpoint'] = '__{}__'.format(rule)

        flask_route = Flask.route(self, rule, **options)
        wrapper = self.decorate_rout(flask_route)
        print('Rule "{}" is route'.format(rule))
        return wrapper

    def decorate_rout(self, flask_route):        
        def wrap_func(func):
            for dec in self.list_decorers:
                func = dec(func)
            func = flask_route(func)
            return func
        return wrap_func
    
    def append_decorer(self, dec):
        self.list_decorers.append(dec)
