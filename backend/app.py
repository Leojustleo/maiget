import asyncio
import logging
import os
import time

from flask import Flask, jsonify, request
from flask_cors import CORS
from maigret.checking import maigret as maigret_search
from maigret.result import MaigretCheckStatus
from maigret.sites import MaigretDatabase

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger("maigret-backend")

import maigret as _maigret_pkg
_DB_PATH = os.path.join(os.path.dirname(_maigret_pkg.__file__), "resources", "data.json")


def _load_db() -> dict:
    db = MaigretDatabase()
    db.load_from_path(_DB_PATH)
    return {s.name: s for s in db.sites_dict.values() if s.name}


async def _run_search(username: str, top: int) -> dict:
    site_dict = _load_db()
    site_dict = dict(list(site_dict.items())[:top])
    return await maigret_search(
        username,
        site_dict,
        logger=logger,
        timeout=10,
        max_connections=50,
        no_progressbar=True,
    )


@app.post("/api/search")
def search():
    body = request.get_json(silent=True) or {}
    username = (body.get("username") or "").strip()
    if not username:
        return jsonify({"error": "username is required"}), 400
    if len(username) > 60:
        return jsonify({"error": "username too long"}), 400

    top = min(int(body.get("top", 500)), 3000)
    start = time.time()

    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        raw = loop.run_until_complete(_run_search(username, top))
        loop.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    accounts = []
    for site_name, result in raw.items():
        status_obj = result.get("status")
        found = (
            status_obj is not None
            and status_obj.status == MaigretCheckStatus.CLAIMED
        )
        site = result.get("site")
        tags = getattr(site, "tags", []) or []
        accounts.append({
            "site": site_name,
            "url": result.get("url_user", ""),
            "status": "found" if found else "not_found",
            "category": tags[0].capitalize() if tags else None,
        })

    found_list = [a for a in accounts if a["status"] == "found"]
    return jsonify({
        "username": username,
        "total_found": len(found_list),
        "elapsed_seconds": round(time.time() - start, 2),
        "accounts": accounts,
    })


if __name__ == "__main__":
    app.run(port=5000, debug=False)
