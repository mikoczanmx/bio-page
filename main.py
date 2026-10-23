from flask import Flask, send_file



# static_folder='.' pozwala serwować również style.css, app.js, mp4, mp3 itp. z tego samego folderu

app = Flask(__name__, static_folder=".", static_url_path="")



@app.route("/")

def index():

    return send_file("index.html")



if __name__ == "__main__":

    print("Serwer uruchomiony: http://127.0.0.1:4448")

    app.run(debug=False, port=4448, host='0.0.0.0')