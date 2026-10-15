YOUR OWN WISP SERVER (free, ~5 minutes)

1. Make a free GitHub repo and upload these files: server.js and package.json.
2. Go to render.com -> New -> Web Service -> pick that repo.
   Build command: npm install
   Start command: npm start
   Plan: Free.
3. When it's live, open https://YOUR-APP.onrender.com/ - it should say "Wisp server is running."
4. On your site: Settings -> Advanced -> Wisp Config, paste:
   wss://YOUR-APP.onrender.com/wisp/
   (keep the trailing slash)
5. To go back to the built-in servers, press "Reset to default".

Notes: Render's free tier sleeps after idle; the first page load after a nap can take ~30s.
Tested here: server starts, answers HTTP, accepts Wisp connections. I could not test real
internet forwarding from my sandbox.
