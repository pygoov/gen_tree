import config
import os

from flask import Flask, render_template, jsonify, request


app = Flask(__name__)


@app.errorhandler(404)
def resource_not_found(e):
    if request.method == "GET":
        return render_template('/404.html'), 404
    return jsonify(error=str(e)), 404


@app.route('/')
def page():
    return render_template('index.html')


if __name__ == '__main__':
    app.config['SECRET_KEY'] = os.urandom(32).hex()
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(
        host='0.0.0.0',
        port=config.PORT,
        threaded=True
    )
