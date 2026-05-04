import asyncio
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import maigret

app = Flask(__name__)
CORS(app)


async def run_maigret(username: str) -> dict:
    db = await maigret.MaigretDatabase().load_from_path(
        maigret.MaigretDatabase.get_db_file()
    )
    sites = db.sites

    results: dict = {}

    async def check_site(site_name, site):
        result = await maigret.self_check(username, site, results, db)
        return result

    tasks = [check_site(name, site) for name, site in list(sites.items())[:500]]
    await asyncio.gather(*tasks, return_exceptions=True)
    return results


@app.post("/api/search")
def search():
    body = request.get_json(silent=True) or {}
    username = (body.get("username") or "").strip()
    if not username:
        return jsonify({"error": "username is required"}), 400
    if len(username) > 60:
        return jsonify({"error": "username too long"}), 400

    start = time.time()
    try:
        loop = asyncio.new_event_loop()
        raw = loop.run_until_complete(run_maigret(username))
        loop.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    accounts = []
    for site_name, site_result in raw.items():
        status = "found" if site_result.get("status") == maigret.MaigretCheckStatus.CLAIMED else "not_found"
        accounts.append({
            "site": site_name,
            "url": site_result.get("url_user", ""),
            "status": status,
            "category": site_result.get("tags", [None])[0] if site_result.get("tags") else None,
        })

    found = [a for a in accounts if a["status"] == "found"]
    return jsonify({
        "username": username,
        "total_found": len(found),
        "elapsed_seconds": round(time.time() - start, 2),
        "accounts": accounts,
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)
