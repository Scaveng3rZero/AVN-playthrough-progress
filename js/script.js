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

  // ===== 2) Progress Page render =====

  var STAGES = [
    "Not Started",
    "Recorded",
    "Voice Over Complete",
    "Editing Done",
    "Published to Patreon",
    "Published to YouTube"
  ];

  // Edit these
  var VNS = [
    { title: "Fresh Women Season 2", episode: 20, stage: 4 },
    { title: "Eternum", episode: 70, stage: 1 },
    { title: "Race of Life", episode: 13, stage: 0 },
    { title: "Ripples", episode: 15, stage: 1 },
    { title: "Chasing Sunsets: Chapter 10", episode: 3, stage: 0 },
    { title: "Being a DIK: Season 3", episode: 8, stage: 0 }
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
    for (var i = 0; i < STAGES.length; i++){
      var label = makeEl("span", "", STAGES[i]);

      if (i < safeStage) {
        label.className = "done";
      } else if (i === safeStage) {
        label.className = "currentLabel";
      }

      labels.appendChild(label);
    }

    var bar = makeEl("div", "bar");
    for (var j = 0; j < STAGES.length; j++){
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

  (function renderProgress(){
    var root = byId("root");
    if (!root) return;

    root.innerHTML = "";

    for (var k = 0; k < VNS.length; k++){
      root.appendChild(makeVNRow(VNS[k], k === VNS.length - 1));
    }
  })();

  // ===== 3) Recommend page: public confirmed list =====
  (function receivedPublicRender(){
    var list = byId("receivedPublic");
    if (!list) return;

    if (typeof RECEIVED_RECS === "undefined" || !RECEIVED_RECS || !RECEIVED_RECS.length){
      list.innerHTML = "<li style='opacity:.75;'>No confirmed recommendations posted yet.</li>";
      return;
    }

    list.innerHTML = "";

    for (var i = 0; i < RECEIVED_RECS.length; i++){
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

  // ===== 4) Game Links render (links.html) =====
  (function linksRender(){
    var grid = byId("allLinks");
    if (!grid) return;

    if (typeof GAME_LINKS === "undefined" || !GAME_LINKS.length) return;

    function badgeInfo(platform){
      if (platform === "steam") return { cls: "badge--steam", text: "Steam" };
      if (platform === "itch") return { cls: "badge--itch", text: "itch.io" };
      if (platform === "patreon") return { cls: "badge--patreon", text: "Dev Patreon" };
      if (platform === "dev") return { cls: "badge--dev", text: "Dev Site" };
      return { cls: "", text: "Link" };
    }

    var items = GAME_LINKS.slice().sort(function(a, b){
      return (a.title || "").localeCompare(b.title || "");
    });

    grid.innerHTML = "";

    for (var i = 0; i < items.length; i++){
      var item = items[i];
      if (!item.title || !item.url) continue;

      var card = document.createElement("a");
      card.className = "linkCard";
      card.href = item.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      var img = document.createElement("img");
      img.className = "linkCard__image";
      img.src = item.image || "img/default.jpg";
      img.alt = item.title;
      img.onerror = function () {
        this.onerror = null;
        this.src = "img/default.jpg";
      };

      var body = document.createElement("div");
      body.className = "linkCard__body";

      var top = document.createElement("div");
      top.className = "linkCard__top";

      var b = badgeInfo(item.platform);

      var badge = document.createElement("span");
      badge.className = "badge" + (b.cls ? " " + b.cls : "");
      badge.textContent = b.text;

      var title = document.createElement("div");
      title.className = "linkCard__title";
      title.textContent = item.title;

      top.appendChild(badge);
      top.appendChild(title);

      body.appendChild(top);

      if (item.tags && item.tags.length){
        var tagsWrap = document.createElement("div");
        tagsWrap.className = "tagRow";

        for (var t = 0; t < item.tags.length; t++){
          var chip = document.createElement("span");
          chip.className = "tag";
          chip.textContent = item.tags[t];
          tagsWrap.appendChild(chip);
        }

        body.appendChild(tagsWrap);
      }

      card.appendChild(img);
      card.appendChild(body);
      grid.appendChild(card);
    }
  })();

  // ===== 5) Game Links page search (links.html) =====
  (function linksSearch(){
    var search = byId("linkSearch");
    var list = byId("allLinks");
    if (!search || !list) return;

    function filter(){
      var q = (search.value || "").toLowerCase();
      var items = list.getElementsByClassName("linkCard");

      for (var i = 0; i < items.length; i++){
        var txt = (items[i].textContent || "").toLowerCase();
        items[i].style.display = txt.indexOf(q) !== -1 ? "" : "none";
      }
    }

    search.addEventListener("input", filter);
  })();

  // ===== 6) Nav Active State =====
  (function setActiveNav(){
    var current = window.location.pathname.split("/").pop();

    if (!current) current = "index.html";

    var links = document.querySelectorAll(".siteNav__link");

    for (var i = 0; i < links.length; i++){
      var href = links[i].getAttribute("href");
      if (!href) continue;

      var linkPage = href.split("/").pop();

      if (linkPage === current){
        links[i].classList.add("is-active");
      } else {
        links[i].classList.remove("is-active");
      }
    }
  })();

})();
