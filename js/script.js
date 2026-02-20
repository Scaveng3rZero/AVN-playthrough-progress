// ES5-safe (works on every page)

(function () {

  // ===== 1) Shared helpers =====
  function byId(id){ return document.getElementById(id); }

  function makeEl(tag, className, text){
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  }

  // Safe "last updated" + footer year (only runs if elements exist)
  (function setDates(){
    var updated = byId("updated");
    if (updated) updated.textContent = "Last updated: " + new Date().toLocaleString();

    var year = byId("year");
    if (year) year.textContent = new Date().getFullYear();
  })();

  // ===== 2) Progress Page (index.html) =====

  // Stages (0..5)
  var STAGES = [
    "Not Started",
    "Recorded",
    "Voice Over Complete",
    "Editing Done",
    "Published to Patreon",
    "Published to YouTube"
  ];

  // ✅ EDIT THESE
  var VNS = [
    { title: "Fresh Women Season 2", episode: 16, stage: 4 },
    { title: "Fresh Women Season 2", episode: 17, stage: 1 },
    { title: "Eternum", episode: 70, stage: 1 },
    { title: "Race of Life", episode: 11, stage: 2 },
    { title: "Ripples", episode: 14, stage: 5 },
    { title: "Chasing Sunsets: Chapter 10", episode: 2, stage: 5 },
    { title: "Being a DIK: Season 3", episode: 7, stage: 1 }
  ];

  function clampStage(stage){
    if (stage < 0) return 0;
    if (stage > STAGES.length - 1) return STAGES.length - 1;
    return stage;
  }

  function makeVNRow(vn, isLast){
    var wrapper = makeEl("div", "vn");

    var safeStage = clampStage(vn.stage);

    var top = makeEl("div", "top");
    var title = makeEl("div", "title", vn.title + " — Ep " + vn.episode);
    var stageText = makeEl("div", "stageText", "Current: " + STAGES[safeStage]);
    top.appendChild(title);
    top.appendChild(stageText);

    var labels = makeEl("div", "labels");
    for (var i=0; i<STAGES.length; i++){
      var label = makeEl("span", "", STAGES[i]);

      if (i < safeStage) {
        label.className = "done";
      } else if (i === safeStage) {
        label.className = "currentLabel";
      }

      labels.appendChild(label);
    }

    var bar = makeEl("div", "bar");
    for (var j=0; j<STAGES.length; j++){
      var seg = makeEl("div", "seg");
      if (j <= safeStage) seg.className += " filled";
      if (j === safeStage) seg.className += " current";
      bar.appendChild(seg);
    }

    wrapper.appendChild(top);
    wrapper.appendChild(labels);
    wrapper.appendChild(bar);

    if (!isLast){
      wrapper.appendChild(makeEl("div", "rule"));
    }
    return wrapper;
  }

  // Render VNs only if this page has #root
  (function renderProgress(){
    var root = byId("root");
    if (!root) return;

    root.innerHTML = "";

    for (var k=0; k<VNS.length; k++){
      root.appendChild(makeVNRow(VNS[k], k === VNS.length - 1));
    }
  })();

  // ===== 5) Recommend page: public "confirmed" list =====
(function receivedPublicRender(){
  var list = byId("receivedPublic");
  if (!list) return;

  if (typeof RECEIVED_RECS === "undefined" || !RECEIVED_RECS || !RECEIVED_RECS.length){
    // Optional empty state
    list.innerHTML = "<li style='opacity:.75;'>No confirmed recommendations posted yet.</li>";
    return;
  }

  // Newest first (you add to top), but we’ll still clean/sort by date if you want later.
  list.innerHTML = "";

  for (var i=0; i<RECEIVED_RECS.length; i++){
    var item = RECEIVED_RECS[i];
    if (!item || !item.title) continue;

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "javascript:void(0)";
    a.style.cursor = "default";

    var badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Confirmed";

    var text = document.createElement("span");
    text.className = "linkText";
    text.textContent = item.title + (item.when ? (" — " + item.when) : "");

    a.appendChild(badge);
    a.appendChild(text);
    li.appendChild(a);
    list.appendChild(li);
  }
})();

  
  // ===== 3) Game Links render (links.html) =====
  (function linksRender(){
  var list = byId("allLinks");
  if (!list) return;

  if (typeof GAME_LINKS === "undefined" || !GAME_LINKS || !GAME_LINKS.length) return;

  function badgeInfo(platform){
    if (platform === "steam") return { cls: "badge--steam", text: "Steam" };
    if (platform === "itch") return { cls: "badge--itch", text: "itch.io" };
    if (platform === "patreon") return { cls: "badge--patreon", text: "Dev Patreon" };
    if (platform === "dev") return { cls: "badge--dev", text: "Dev Site" };
    return { cls: "", text: "Link" };
  }

  // Sort A→Z by title
  var items = GAME_LINKS.slice().sort(function(a, b){
    var at = (a.title || "").toLowerCase();
    var bt = (b.title || "").toLowerCase();
    if (at < bt) return -1;
    if (at > bt) return 1;
    return 0;
  });

  list.innerHTML = "";

  for (var i=0; i<items.length; i++){
    var item = items[i];
    if (!item || !item.title || !item.url) continue;

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener";

    // Top row: platform badge + title
    var b = badgeInfo(item.platform);

    var badge = document.createElement("span");
    badge.className = "badge" + (b.cls ? " " + b.cls : "");
    badge.textContent = b.text;

    var title = document.createElement("span");
    title.className = "linkText";
    title.textContent = item.title;

    // Wrap title + tags so tags can sit underneath on their own line
    var meta = document.createElement("span");
    meta.className = "linkMeta";

    meta.appendChild(title);

    // Tags row
    if (item.tags && item.tags.length){
      var tagsWrap = document.createElement("span");
      tagsWrap.className = "tagRow";

      for (var t=0; t<item.tags.length; t++){
        var tag = (item.tags[t] || "").toString().trim();
        if (!tag) continue;

        var chip = document.createElement("span");
        chip.className = "tag";
        chip.textContent = tag;

        tagsWrap.appendChild(chip);
      }

      meta.appendChild(tagsWrap);
    }

    a.appendChild(badge);
    a.appendChild(meta);

    li.appendChild(a);
    list.appendChild(li);
  }
})();


  // ===== 4) Game Links page search (links.html) =====
  (function linksSearch(){
    var search = byId("linkSearch");
    var list = byId("allLinks");
    if (!search || !list) return;

    var items = list.getElementsByTagName("li");

    function filter(){
      var q = (search.value || "").toLowerCase();
      for (var i=0; i<items.length; i++){
        var txt = (items[i].textContent || "").toLowerCase();
        items[i].style.display = txt.indexOf(q) !== -1 ? "" : "none";
      }
    }

    search.addEventListener("input", filter);
  })();

})();
