// Runs before first paint so the page never flashes the wrong theme.
// Light (white + light blue) is the default; dark only if the visitor chose it.
(function () {
  var t = null;
  try {
    t = localStorage.getItem("theme");
  } catch (e) {}
  if (t === "dark") document.documentElement.classList.add("dark");
})();
