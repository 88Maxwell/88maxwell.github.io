const canHover = matchMedia("(hover: hover)").matches;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Spotlight follows the cursor; read by .app::before
addEventListener("pointermove", (e) => {
    document.body.style.setProperty("--x", `${e.clientX}px`);
    document.body.style.setProperty("--y", `${e.clientY}px`);
});

// Highlight the nav link of the section crossing the middle of the viewport
const links = document.querySelectorAll(".nav__link");
const spy = new IntersectionObserver(
    (entries) => {
        for (const { isIntersecting, target } of entries) {
            if (!isIntersecting) continue;
            links.forEach((a) => a.toggleAttribute("aria-current", a.hash === `#${target.id}`));
        }
    },
    { rootMargin: "-50% 0px -50% 0px" },
);
document.querySelectorAll("#top, main > section").forEach((s) => spy.observe(s));

// Copy email; the status text comes from data-copied so it stays translatable
const copy = document.querySelector(".contacts__copy");
const status = document.querySelector(".contacts__status");
copy.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(copy.dataset.email);
    } catch {
        // Clipboard denied: select the address so it can be copied by hand
        getSelection().selectAllChildren(document.querySelector(".contacts__email"));
        return;
    }
    status.textContent = copy.dataset.copied;
    clearTimeout(copy.timer);
    copy.timer = setTimeout(() => (status.textContent = ""), 2000);
});

if (canHover && !calm) {
    // Cards tilt slightly towards the cursor
    document.querySelectorAll(".job__card").forEach((card) => {
        card.addEventListener("pointermove", (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 4}deg`);
            card.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -4}deg`);
        });
        card.addEventListener("pointerleave", () => {
            card.style.removeProperty("--rx");
            card.style.removeProperty("--ry");
        });
    });

    // Pills are pulled a few pixels towards the cursor
    document.querySelectorAll(".pill").forEach((pill) => {
        pill.addEventListener("pointermove", (e) => {
            const r = pill.getBoundingClientRect();
            pill.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.2}px ${(e.clientY - r.top - r.height / 2) * 0.3}px`;
        });
        pill.addEventListener("pointerleave", () => (pill.style.translate = ""));
    });
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/pwabuilder-sw.js", { scope: "/" });
}
