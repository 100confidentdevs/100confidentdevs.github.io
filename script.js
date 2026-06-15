/* ============================================================
   100 Confident Devs — Discord widget + join button
   ------------------------------------------------------------
   SETUP (one-time):
   1. In your Discord server: Server Settings -> Widget -> turn ON
      "Enable Server Widget". (Without this, the API returns
      "Widget Disabled" and the live count can't load.)
   2. Confirm DISCORD_SERVER_ID below matches that server.
   3. Paste a permanent invite into DISCORD_INVITE below
      (Discord also auto-provides one once the widget is on).
   4. The Discord widget API only reports ONLINE members, never the
      total. Set DISCORD_MEMBER_COUNT manually to show a "Members"
      number, or leave it null to hide that stat.
   ============================================================ */

const DISCORD_SERVER_ID = "1515832989454569573"; // e.g. "123456789012345678"
const DISCORD_INVITE = "https://discord.gg/hMJRpqaJZD"; // fallback invite
const DISCORD_MEMBER_COUNT = null; // e.g. 100 — total members (API can't auto-fetch this)

(function () {
    const joinBtn = document.getElementById("join-btn");
    const elOnline = document.getElementById("dw-online");

    // Always have a working join link from the fallback.
    if (joinBtn) joinBtn.href = DISCORD_INVITE;

    if (!DISCORD_SERVER_ID) {
        // No server configured yet — leave placeholder dashes in the widget.
        return;
    }

    fetch(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`)
        .then((res) => {
            if (!res.ok) throw new Error("Widget not available");
            return res.json();
        })
        .then((data) => {
            // Live: number of members currently online.
            if (elOnline) elOnline.textContent = (data.presence_count ?? 0).toLocaleString();
            if (joinBtn && data.instant_invite) joinBtn.href = data.instant_invite;
        })
        .catch(() => {
            // Widget disabled or unreachable — keep the dash; join button still works.
        });
})();

/* ------------------------------------------------------------
   Home logo: pop animation + oof sound on click
   (drop an audio file at assets/oof.mp3)
   ------------------------------------------------------------ */
(function () {
    const logo = document.getElementById("hero-logo");
    if (!logo) return;

    const oof = new Audio("assets/oof.mp3");
    oof.preload = "auto";

    function bonk() {
        // Replay sound from the start, even on rapid clicks.
        try {
            oof.currentTime = 0;
            oof.play();
        } catch (e) {
            /* autoplay/file issues — ignore */
        }
        // Restart the pop animation by forcing a reflow.
        logo.classList.remove("pop");
        void logo.offsetWidth;
        logo.classList.add("pop");
    }

    logo.addEventListener("click", bonk);
    logo.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            bonk();
        }
    });
    logo.addEventListener("animationend", function () {
        logo.classList.remove("pop");
    });
})();
