from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime
from ultralytics import YOLO
import cv2

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {"status": "ok", "message": "Smartflow backend is running"}

@app.route("/api")
def api():
    return "API working"

UPLOAD_FOLDER = os.path.join(app.root_path, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = YOLO("yolov8n.pt")

RESULTS_FILE = os.path.join(app.root_path, "traffic_counts.json")


# vehicle weights (more realistic congestion calculation)
vehicle_weights = {
    2: 1,    # car
    3: 0.5,  # motorcycle
    5: 2,    # bus
    7: 2     # truck
}


def classify_congestion(density):
    if density < 5:
        return "LOW"
    elif density < 15:
        return "MEDIUM"
    else:
        return "HIGH"


def process_video(file_path, filename):

    cap = cv2.VideoCapture(file_path)

    frame_id = 0
    data_log = []
    snapshots = []
    vehicle_counts = []

    # sliding window buffer for smoothing density
    density_window = []
    WINDOW_SIZE = 5

    while True:

        ret, frame = cap.read()
        if not ret:
            break

        if frame_id % 10 == 0:

            results = model(frame, verbose=False)
            count = 0

            for r in results:

                frame = r.plot()

                for box in r.boxes:

                    cls = int(box.cls[0])

                    if cls in vehicle_weights:
                        count += vehicle_weights[cls]

            vehicle_counts.append(count)

            density_window.append(count)

            if len(density_window) > WINDOW_SIZE:
                density_window.pop(0)

            smoothed_density = sum(density_window) / len(density_window)

            congestion_level = classify_congestion(smoothed_density)

            frame_time = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0
            now = datetime.now()

            log_entry = {
                "mode": "video",
                "video_name": filename,
                "timestamp_sec": round(frame_time, 2),
                "vehicles": round(count, 2),
                "density": round(smoothed_density, 2),
                "congestion_level": congestion_level,
                "date": now.strftime("%Y-%m-%d"),
                "time": now.strftime("%H:%M:%S")
            }

            data_log.append(log_entry)

            snapshot_name = f"snapshot_{frame_id}.jpg"
            snapshot_path = os.path.join(UPLOAD_FOLDER, snapshot_name)

            cv2.imwrite(snapshot_path, frame)

            snapshots.append(snapshot_name)

        frame_id += 1

    cap.release()

    avg_density = sum(vehicle_counts) / len(vehicle_counts) if vehicle_counts else 0
    final_congestion = classify_congestion(avg_density)

    result = {
        "video_name": filename,
        "average_density": round(avg_density, 2),
        "final_congestion_level": final_congestion,
        "frames_processed": len(vehicle_counts),
        "logs": data_log
    }

    with open(RESULTS_FILE, "w") as f:
        json.dump(result, f, indent=4)

    print(f"✅ Video processed, snapshots saved: {len(snapshots)}")

    return snapshots


@app.route("/upload", methods=["POST"])
def upload_video():

    file = request.files.get("video")

    if not file:
        return jsonify({"status": "error", "message": "No video file provided"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)

    file.save(filepath)

    snapshots = process_video(filepath, file.filename)

    return jsonify({
        "status": "success",
        "message": "Video processed (snapshots saved)",
        "file": file.filename,
        "snapshots": snapshots
    })


@app.route("/results", methods=["GET"])
def get_results():

    if os.path.exists(RESULTS_FILE):

        with open(RESULTS_FILE) as f:
            data = json.load(f)

        return jsonify(data)

    return jsonify([])


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)