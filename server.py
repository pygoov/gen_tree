
import config
import linecache
import traceback
import sys
import logic.errors as err

from flask import render_template, jsonify, request, Response, redirect
from functools import wraps
from logic.app import App
from logic.file_manager import FileManager
from io import StringIO


app = App(__name__)
fm = FileManager()


def is_auth():
    password = request.cookies.get('gt_pass')
    return password is not None and \
        password == config.password


@app.errorhandler(404)
def resource_not_found(e):
    if request.method == "GET":
        return render_template('/404.html'), 404
    return jsonify(error=str(e)), 404


@app.errorhandler(err.BadRequest)
def rout_bad_request(e):
    return Response(str(e), status=e.response_code, mimetype='text/plain')


@app.errorhandler(Exception)
def rout_exception(e):
    _, _, first_tb = sys.exc_info()

    def get_tb_next(_tb):
        if _tb.tb_next is None:
            return _tb
        else:
            return get_tb_next(_tb.tb_next)

    tb = get_tb_next(first_tb)
    f = tb.tb_frame
    lineno = tb.tb_lineno
    filename = f.f_code.co_filename
    linecache.checkcache(filename)
    line = linecache.getline(filename, lineno, f.f_globals)

    tb = StringIO()
    traceback.print_tb(first_tb, file=tb)
    msg_ex = '''
==========Exception===========
Message: {e}
Line: {ln}
Traceback:
{tb}=============================='''.format(
        e=e,
        ln=line.replace('\r', '').replace('\n', ''),
        tb=tb.getvalue()
    )
    print(msg_ex)
    return Response('Sorry, an error occurred on the server!', status=500)


def auth_func(func):
    @wraps(func)
    def _wrap(*args, **kwargs):
        if request.method == 'POST' and not is_auth():
            raise err.UnauthorizedError()
        return func(*args, **kwargs)
    return _wrap

app.append_decorer(auth_func)

@app.route('/get_list_files', methods=["POST"])
def get_list_files():    
    list_files = fm.get_list_files()    
    return jsonify(list_files)


@app.route('/open_file', methods=["POST"])
def open_file():
    data = request.get_json(silent=True)
    if data is None:
        raise err.BadRequest('Data is not valid')

    try:
        file_name = str(data['file_name'])
    except (KeyError, ValueError):
        raise err.BadRequest('Data is not valid')

    data = fm.open_file(file_name)
    return jsonify(data)

@app.route('/save_file', methods=["POST"])
def save_file():
    data = request.get_json(silent=True)
    if data is None:
        raise err.BadRequest('Data is not valid')

    try:
        file_name = str(data['file_name'])
        file_data = dict(data['data'])
    except (KeyError, ValueError):
        raise err.BadRequest('Data is not valid')

    fm.save_file(file_name, file_data)

    return Response("OK", status=200)


@app.route('/')
def page():
    if is_auth():
        return render_template('index.html')
    else:
        return render_template('auth.html')


if __name__ == '__main__':
    print("DEBUG:", config.debug)
    app.build_configs(config.debug)
    app.run(
        host='0.0.0.0',
        port=config.port,
        threaded=True
    )
