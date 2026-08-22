# Birthday Surprise Site

A 4-stage birthday surprise page: countdown → vintage letter → cake → 3D surprise.

## Run it in VS Code
1. Open this folder in VS Code.
2. Install the **Live Server** extension (if you don't have it).
3. Right-click `index.html` → **Open with Live Server**.
   (Opening the file directly in a browser also works, but Live Server auto-refreshes as you edit.)

## What to customize before sharing the link

| What | Where | File |
|---|---|---|
| Birthday date/time | `TARGET_DATE` constant at the top | `script.js` |
| Spotify song | `href` on `#spotify-link` | `index.html` |
| Letter message | text inside `#letter-text` | `index.html` |
| Surprise background | `freefire-bg-mobile.jpg` (phones) / `freefire-bg.jpg` (desktop), set via CSS `.surprise-bg` | `style.css` / image files |
| Free Fire link | `href` on both surprise-page links (currently `https://ff.garena.com/en`, the official site) | `index.html` |

## Flow
1. **Countdown page** — dark blue/black sparkling night sky, live countdown to the date you set. While waiting, there's a Spotify link and a Google Doodle games link. The "enter" button stays locked until the countdown hits zero.
2. **Letter page** — vintage parchment styling, your personal message.
3. **Cake page** — tap once to blow out the candle, tap again to cut the cake.
4. **Surprise page** — `freefire-bg.jpg` as a full-bleed animated "live wallpaper" background (slow CSS zoom/pan), with a title, an "Enter the Battlefield" button, and a text link, both pointing to the official Free Fire site.

## Hosting it on a real domain
Once you're happy with it:
1. Buy a domain (Namecheap, Google Domains successor Squarespace Domains, etc.) or use a free option like a `.pages.dev` / `.vercel.app` subdomain.
2. Deploy for free with **Cloudflare Pages**, **Vercel**, **Netlify**, or **GitHub Pages** — just drag-and-drop this folder in, or connect a GitHub repo.
3. Point your custom domain at it via the host's DNS instructions.

No backend or build step needed — it's plain HTML/CSS/JS.
