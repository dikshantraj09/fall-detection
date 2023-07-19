import numpy as np
import pyaudio
from matplotlib import pyplot as plt
import pandas as pd
import sounddevice as sd
import requests
import json
from urllib.request import urlopen
from keras_yamnet import params
from keras_yamnet.yamnet import YAMNet, class_names
from keras_yamnet.preprocessing import preprocess_input


from plot import Plotter

if __name__ == "__main__":

    ################### SETTINGS ###################
    plt_classes = [0, 494, 463]  # Speech, Music, Explosion, Silence
    class_labels = True
    FORMAT = pyaudio.paFloat32
    CHANNELS = 1
    RATE = params.SAMPLE_RATE
    WIN_SIZE_SEC = 0.975
    CHUNK = int(WIN_SIZE_SEC * RATE)
    RECORD_SECONDS = 500

    print(sd.query_devices())
    MIC = None

    #################### MODEL #####################

    model = YAMNet(weights='keras_yamnet/yamnet.h5')
    yamnet_classes = class_names('keras_yamnet/yamnet_class_map.csv')

    #################### STREAM ####################
    audio = pyaudio.PyAudio()

    # start Recording
    stream = audio.open(format=FORMAT,
                        input_device_index=MIC,
                        channels=CHANNELS,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK)
    print("recording...")

    if plt_classes is not None:
        plt_classes_lab = yamnet_classes[plt_classes]
        n_classes = len(plt_classes)
    else:
        plt_classes = [k for k in range(len(yamnet_classes))]
        plt_classes_lab = yamnet_classes if class_labels else None
        n_classes = len(yamnet_classes)

    monitor = Plotter(n_classes=n_classes, FIG_SIZE=(
        12, 6), msd_labels=plt_classes_lab)

    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        # Waveform
        data = preprocess_input(np.fromstring(
            stream.read(CHUNK), dtype=np.float32), RATE)
        prediction = model.predict(np.expand_dims(data, 0))[0]
        #print("Speech:", prediction[0])
        crash = prediction[463]
        print("Crash:", prediction[463])
        # print("Size:", len(prediction))
        monitor(data.transpose(), np.expand_dims(prediction[plt_classes], -1))
        if (crash >= 0.006):
            break
    print("finished recording crash detected")
    urlopen("http://ipinfo.io/json")

    # load data into array
    data = json.load(urlopen("http://ipinfo.io/json"))

    # extract lattitude
    lon = data['loc'].split(',')[0]

    # extract longitude
    lat = data['loc'].split(',')[1]

    print(lat, lon)
    # r = requests.get(url="http://localhost:1230/hospitals/all")
    # print(r.json())
    loc = {
        "longitude": float(lat),  # 77.178787,
        "latitude": float(lon),  # 28.6516034,
        "name": "ABC",
        "age": "19",
        "mobile": "9818888888",
        "bloodGroup": "B+",
        "gender": "Male"
    }
    x = requests.post(url="http://localhost:1234/hospitals/nearby", json=loc)
   # print("\n\nNearby:", x.text)
    y = requests.post(url="http://localhost:1234/hospitals/invoke", json=loc)
    print("\n Mail & Message sent")
    # stop Recording
    stream.stop_stream()
    stream.close()
    audio.terminate()
