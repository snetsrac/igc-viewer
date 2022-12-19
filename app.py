from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
from igc_parser import get_flight_tracks, get_flight_track_by_id

app = Flask(__name__, static_folder='client/out', static_url_path='')
cors = CORS(app)


@ app.route('/api')
@ cross_origin()
def api_index():
    return {'text': 'Hello API!'}


@ app.route('/api/flight-tracks')
@ cross_origin()
def api_flight_tracks():
    return get_flight_tracks()


@ app.route('/api/flight-tracks/<int:id>')
@ cross_origin()
def api_flight_track_by_id(id: int):
    return get_flight_track_by_id(id)


@ app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')
