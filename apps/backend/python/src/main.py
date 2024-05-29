def check_connection():
    status = "Success: Connection to FastAPI Server"
    ip = "127.0.0.1"
    port = 4040
    path = "api/"

    return {"status": status, "ip": ip, "port": port, "path": path}
