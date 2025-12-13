#!/bin/bash

cd "$(dirname "$0")"

SERVER_PID=""

clear_cache() {
    gum style --foreground="#8888FF" "Clearing browser cache for localhost..."

    # Firefox cache
    for profile in ~/.mozilla/firefox/*.default*; do
        if [[ -d "$profile" ]]; then
            find "$profile/cache2" -type f -print0 2>/dev/null | xargs -0 grep -l "localhost" 2>/dev/null | xargs -r rm -f
        fi
    done

    # Chromium / Chrome cache
    if [[ -d ~/.cache/chromium/Default/Cache ]]; then
        find ~/.cache/chromium/Default/Cache -type f -print0 2>/dev/null | xargs -0 grep -l "localhost" 2>/dev/null | xargs -r rm -f
    fi
    if [[ -d ~/.cache/google-chrome/Default/Cache ]]; then
        find ~/.cache/google-chrome/Default/Cache -type f -print0 2>/dev/null | xargs -0 grep -l "localhost" 2>/dev/null | xargs -r rm -f
    fi

    gum style --foreground="#8888FF" "Cache cleared."
}

start_server() {
    clear_cache

    if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
        gum style --foreground="#FFD700" "Server already running (PID $SERVER_PID)"
        return
    fi

    gum style --foreground="#00FF00" "Starting development server on http://localhost:8080/"
    python3 -m http.server 8080 >/dev/null 2>&1 &
    SERVER_PID=$!
    gum style --foreground="#00FF00" "Server started (PID $SERVER_PID)"
}

stop_server() {
    if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
        gum style --foreground="#FF5555" "Stopping server..."
        kill "$SERVER_PID"
        SERVER_PID=""
        gum style --foreground="#FF5555" "Server stopped."
        clear_cache
    else
        gum style --foreground="#FF0000" "No server is running."
    fi
}

while true; do
    choice=$(gum choose \
        "Start Web Server" \
        "Stop Web Server" \
        "Open in Browser" \
        "Exit")

    case "$choice" in
        "Start Web Server")
            start_server
            ;;
        "Stop Web Server")
            stop_server
            ;;
        "Open in Browser")
            xdg-open "http://localhost:8080" >/dev/null 2>&1 &
            gum style --foreground="#00FFFF" "Opening browser..."
            ;;
        "Exit")
            stop_server
            gum style --foreground="#00FFFF" "Goodbye!"
            exit 0
            ;;
    esac
done
