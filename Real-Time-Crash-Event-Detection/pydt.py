import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget
import numpy as np
import pyaudio
from matplotlib import pyplot as plt
import pandas as pd
import sounddevice as sd

from keras_yamnet import params
from keras_yamnet.yamnet import YAMNet, class_names
from keras_yamnet.preprocessing import preprocess_input

from plot import Plotter


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("YAMNet Demo")

        # Create Start button
        self.start_button = QPushButton("Start")
        self.start_button.clicked.connect(self.start_recording)

        # Create Stop button
        self.stop_button = QPushButton("Stop")
        self.stop_button.setEnabled(False)
        self.stop_button.clicked.connect(self.stop_recording)

        # Add buttons to layout
        vbox = QVBoxLayout()
        vbox.addWidget(self.start_button)
        vbox.addWidget(self.stop_button)

        # Create widget to hold layout
        widget = QWidget()
        widget.setLayout(vbox)
        self.setCentralWidget(widget)

        # Initialize audio settings
        self.plt_classes = [0, 132, 463]
        self.FORMAT = pyaudio.paFloat32
        self.CHANNELS = 1
        self.RATE = params.SAMPLE_RATE
        self.WIN_SIZE_SEC = 0.975
        self.CHUNK = int(self.WIN_SIZE_SEC * self.RATE)
        self.RECORD_SECONDS = 500
        self.MIC = None

        # Initialize YAMNet model
        self.model = YAMNet(weights='keras_yamnet/yamnet.h5')
        self.yamnet_classes = class_names('keras_yamnet/yamnet_class_map.csv')

        # Initialize plotter
        self.monitor = Plotter(n_classes=len(self.yamnet_classes), FIG_SIZE=(
            12, 6), msd_labels=self.yamnet_classes[self.plt_classes])

    def start_recording(self):
        # Initialize PyAudio stream
        self.audio = pyaudio.PyAudio()
        self.stream = self.audio.open(format=self.FORMAT,
                                      input_device_index=self.MIC,
                                      channels=self.CHANNELS,
                                      rate=self.RATE,
                                      input=True,
                                      frames_per_buffer=self.CHUNK)

        # Enable Stop button and disable Start button
        self.stop_button.setEnabled(True)
        self.start_button.setEnabled(False)

        # Start recording loop
        self.recording = True
        while self.recording:
            # Waveform
            data = preprocess_input(np.fromstring(
                self.stream.read(self.CHUNK), dtype=np.float32), self.RATE)
            prediction = self.model.predict(np.expand_dims(data, 0))[0]

            self.monitor(data.transpose(), np.expand_dims(prediction, -1))

    def stop_recording(self):
        # Disable Stop button and enable Start button
        self.stop_button.setEnabled(False)
        self.start_button.setEnabled(True)

        # Stop recording loop
        self.recording = False

        # Stop PyAudio stream and terminate audio
        self.stream.stop_stream()
        self.stream.close()
        self.audio.terminate()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
