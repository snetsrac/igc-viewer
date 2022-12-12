from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
from igc_parser import get_features

app = Flask(__name__, static_folder='client/out', static_url_path='')
cors = CORS(app)


@app.route('/api')
@cross_origin()
def api_index():
    return {'text': 'Hello API!'}


@app.route('/api/features')
@cross_origin()
def api_feature():
    return get_features()


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')
