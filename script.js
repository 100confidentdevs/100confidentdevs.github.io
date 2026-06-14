/* ============================================================
   100 Confident Devs — Discord widget + join button
   ------------------------------------------------------------
   SETUP (one-time):
   1. In your Discord server: Server Settings -> Widget -> enable
      "Enable Server Widget". Copy the Server ID shown there.
   2. Paste the Server ID into DISCORD_SERVER_ID below.
   3. Paste a permanent invite link into DISCORD_INVITE below
      (Discord will also auto-provide one once the widget is on).
   ============================================================ */

const DISCORD_SERVER_ID = "1515832989454569573"; // e.g. "123456789012345678"
const DISCORD_INVITE = "https://discord.gg/hMJRpqaJZD"; // fallback invite

(function () {
    const joinBtn = document.getElementById("join-btn");
    const elOnline = document.getElementById("dw-online");
    const elMembers = document.getElementById("dw-members");
    const elName = document.getElementById("dw-name");

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
            if (elName && data.name) elName.textContent = data.name;
            if (elOnline) elOnline.textContent = (data.presence_count ?? 0).toLocaleString();
            if (elMembers && Array.isArray(data.members)) {
                // widget.json lists online members; show that count as a floor.
                elMembers.textContent = data.members.length.toLocaleString();
            }
            if (joinBtn && data.instant_invite) joinBtn.href = data.instant_invite;
        })
        .catch(() => {
            // Keep the placeholder dashes; the join button still works.
        });
})();
