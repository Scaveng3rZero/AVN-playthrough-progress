// ES5-safe

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
  { title: "Fresh Women Season 2", episode: 15, stage: 4 },
  { title: "Fresh Women Season 2", episode: 16, stage: 2 },
  { title: "Eternum", episode: 70, stage: 1 },
  { title: "Race of Life", episode: 11, stage: 1 },
  { title: "Ripples", episode: 14, stage: 4 },
  { title: "Chasing Sunsets: Chapter 10", episode: 2, stage: 0 },
  { title: "Being a DIK: Season 3", episode: 6, stage: 5 }
];

// "Last updated" display
var updated = document.getElementById("updated");
updated.textContent = "Last updated: " + new Date().toLocaleString();

var root = document.getElementById("root");

function makeEl(tag, className, text){
  var el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = text;
  return el;
}

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

// Render
for (var k=0; k<VNS.length; k++){
  root.appendChild(makeVNRow(VNS[k], k === VNS.length - 1));
}

