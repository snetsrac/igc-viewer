from datetime import time as Time, date as Date
from enum import Enum
from geojson import Feature, LineString
from glob import glob


class FixValidity(Enum):
    A = '3D fix'
    V = '2D fix (no GNSS altitude) or no GNSS data'

    def __str__(self):
        return self.name


def parse(line: str, start: int, size: int) -> str:
    return line[start:start + size]


def parse_time(s: str) -> Time:
    hours = int(parse(s, 0, 2))
    minutes = int(parse(s, 2, 2))
    seconds = int(parse(s, 4, 2))
    return Time(hours, minutes, seconds)


def parse_lat(s: str) -> float:
    degrees = int(parse(s, 0, 2))
    minutes = float(parse(s, 2, 2) + '.' + parse(s, 4, 3))
    sign = 1 if parse(s, 7, 1) == 'N' else -1
    return (degrees + minutes / 60) * sign


def parse_lon(s: str) -> float:
    degrees = int(parse(s, 0, 3))
    minutes = float(parse(s, 3, 2) + '.' + parse(s, 5, 3))
    sign = 1 if parse(s, 8, 1) == 'E' else -1
    return (degrees + minutes / 60) * sign


def parse_fix_validity(s: str) -> FixValidity:
    if s == 'A':
        return FixValidity.A
    if s == 'V':
        return FixValidity.V


class IgcRecordB:
    time: Time
    lat: float
    lon: float
    fix_validity: FixValidity
    pressure_altitude: float
    gnss_altitude: float

    def __init__(self, line: str):
        self.time = parse_time(line[1:7])
        self.lat = parse_lat(line[7:15])
        self.lon = parse_lon(line[15:24])
        self.fix_validity = parse_fix_validity(line[24])
        self.pressure_altitude = float(line[25:30])
        self.gnss_altitude = float(line[30:35])

    def __str__(self):
        return str(self.time) + ', (' + str(self.lat) + ', ' + str(self.lon) + '), ' + \
            str(self.fix_validity) + ', ' + str(self.pressure_altitude) + \
            ', ' + str(self.gnss_altitude)


flight_tracks: list[Feature] = []
id = 1

for filepath in glob('data/*.igc'):
    b_records: list[IgcRecordB] = []
    properties: dict = {}

    with open(filepath, 'r') as file:
        filename = file.name.split('/')[1]
        year = int(filename.split('-')[0])
        month = int(filename.split('-')[1])
        day = int(filename.split('-')[2])
        properties['date'] = Date(year, month, day)

        for line in file:
            if line[0] == 'B':
                b_records.append(IgcRecordB(line))
            elif line[0] == 'H':
                # if line[2:5] == 'DTE':
                #     properties['date'] = Date(
                #         int(line[9:11]) + 2000, int(line[7:9]), int(line[5:7])).isoformat()
                if line[2:5] == 'PLT':
                    properties['pilot'] = line.split(':')[1].rstrip()
                elif line[2:5] == 'GTY':
                    properties['glider'] = line.split(':')[1].rstrip()
                elif line[2:5] == 'CID':
                    properties['contest_number'] = line.split(':')[1].rstrip()
            elif line[0] == 'C':
                properties['airport'] = line[18:].rstrip()

    geometry = LineString(
        [(record.lon, record.lat, record.gnss_altitude) for record in b_records])

    flight_tracks.append(
        Feature(geometry=geometry, properties=properties, id=id))
    id += 1


def get_flight_tracks() -> list[Feature]:
    return sorted(flight_tracks, key=lambda flight_track: flight_track.properties['date'])


def get_flight_track_by_id(id: int) -> Feature:
    for flight_track in flight_tracks:
        if flight_track.id == id:
            return flight_track
