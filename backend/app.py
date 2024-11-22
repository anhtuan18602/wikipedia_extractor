from flask import Flask, request, jsonify
from flask_cors import CORS  # To allow React frontend to communicate
from utils.extract import get_info
app = Flask(__name__)
CORS(app)  # Enable cross-origin requests


@app.route('/api/query', methods=['POST'])
def handle_query():
    data = request.json
    user_query = data.get('query', '')
    result = get_info(user_query)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
