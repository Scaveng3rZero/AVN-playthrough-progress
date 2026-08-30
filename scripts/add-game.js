const fs = require("fs");
const path = require("path");
const vm = require("vm");

const file = path.join(process.cwd(), "js", "links-data.js");

const gameUrl =
  String(process.env.GAME_URL || "").trim();

const manualGenres =
  splitCsv(process.env.GAME_GENRES);

const manualTags =
  splitCsv(process.env.GAME_TAGS);

const featured =
  String(process.env.GAME_FEATURED || "false")
    .toLowerCase() === "true";


if (!gameUrl) {
  stop("GAME_URL is required.");
}


let input;

try {
  input = new URL(gameUrl);
} catch {
  stop("GAME_URL must be a valid URL.");
}


main().catch((error) => {
  console.error(
    error.stack ||
    error.message ||
    error
  );

  process.exit(1);
});


async function main() {

  const source =
    fs.readFileSync(file, "utf8");

  const existing =
    readGames(source);

  const host =
    input.hostname.toLowerCase();


  let game;


  if (
    host === "store.steampowered.com" ||
    host === "www.store.steampowered.com"
  ) {

    game =
      await fromSteam(input);

  } else if (
    host.endsWith(".itch.io")
  ) {

    game =
      await fromItch(input);

  } else {

    stop(
      "Use a Steam store URL or an itch.io game URL."
    );

  }


  /*
   * Add anything you entered manually
   * to the metadata we found automatically.
   */

  game.genres =
    unique([
      ...(game.genres || []),
      ...manualGenres
    ]);


  game.tags =
    unique([
      ...manualTags,
      ...(game.tags || [])
    ])
    .filter(function (tag) {

      return !game.genres.some(
        function (genre) {

          return (
            key(genre) ===
            key(tag)
          );

        }
      );

    });


  game.featured =
    featured;


  if (!game.title) {

    stop(
      "Could not determine the game title."
    );

  }


 const existingIndex =
  findExistingIndex(
    existing,
    game
  );

let action =
  "Added";

let updated;


if (existingIndex >= 0) {

  game =
    mergeExistingGame(
      existing[existingIndex],
      game
    );

  updated =
    replaceEntry(
      source,
      existingIndex,
      game
    );

  action =
    "Updated";

} else {

  updated =
    insertEntry(
      source,
      game
    );

}


  /*
   * Safety check.
   *
   * If our edited links-data.js
   * would break JavaScript,
   * don't write it.
   */

  readGames(updated);


  fs.writeFileSync(
    file,
    updated,
    "utf8"
  );


  console.log(
  action + ": " +
  game.title
);

  console.log(
    "Developer: " +
    (
      game.developer ||
      "Unknown"
    )
  );

  console.log(
    "Genres: " +
    (
      game.genres.join(", ") ||
      "None"
    )
  );

  console.log(
    "Tags: " +
    (
      game.tags.join(", ") ||
      "None"
    )
  );

  console.log(
    "Links: " +
    Object.keys(
      game.links
    ).join(", ")
  );

}


/* =========================
   STEAM
========================== */

async function fromSteam(url) {

  const match =
    url.pathname.match(
      /\/app\/(\d+)/i
    );


  if (!match) {

    stop(
      "Could not find a Steam App ID in that URL."
    );

  }


  const appId =
    match[1];


  const canonical =
    "https://store.steampowered.com/app/" +
    appId +
    "/";


  const api =
    "https://store.steampowered.com/" +
    "api/appdetails" +
    "?appids=" +
    appId +
    "&l=english&cc=us";


  let data = null;


  /*
   * Main Steam metadata
   */

  try {

    const response =
      await fetch(
        api,
        {
          headers: headers()
        }
      );


    if (response.ok) {

      const json =
        await response.json();


      if (
        json &&
        json[appId] &&
        json[appId].success
      ) {

        data =
          json[appId].data;

      }

    }

  } catch (error) {

    console.warn(
      "Steam metadata warning:",
      error.message
    );

  }


  /*
   * Also read the store page so
   * we can grab Steam tags.
   */

  let html = "";


  try {

    html =
      await getHtml(
        canonical,
        {
          Cookie:
            "birthtime=0; " +
            "mature_content=1; " +
            "wants_mature_content=1"
        }
      );

  } catch (error) {

    console.warn(
      "Steam page warning:",
      error.message
    );

  }


  const links = {
    steam: canonical
  };


  /*
   * Steam sometimes provides the
   * developer's official website.
   */

  if (
    data &&
    data.website
  ) {

    links.website =
      data.website.trim();

  }


  return compact({

    title:
      (
        data &&
        data.name
      ) ||
      meta(
        html,
        "property",
        "og:title"
      ),


    developer:
      (
        data &&
        Array.isArray(
          data.developers
        )
      )
        ? data.developers.join(", ")
        : "",


    genres:
      (
        data &&
        Array.isArray(
          data.genres
        )
      )
        ? data.genres.map(
            function (genre) {
              return genre.description;
            }
          )
        : [],


    tags:
      anchorText(
        html,

        /<a[^>]*class=["'][^"']*\bapp_tag\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi

      ).slice(0, 8),


    links: links,

image:
  (
    data &&
    data.header_image
  )
    ? data.header_image
    : ""

  });

}


/* =========================
   ITCH.IO
========================== */

async function fromItch(url) {

  const cleanUrl =
    new URL(
      url.toString()
    );


  cleanUrl.search = "";
  cleanUrl.hash = "";


  const html =
    await getHtml(
      cleanUrl.toString()
    );


  let title =
    meta(
      html,
      "property",
      "og:title"
    );


  /*
   * Fallback if itch doesn't
   * provide og:title.
   */

  if (!title) {

    title =
      clean(
        match(
          html,

          /<title[^>]*>([\s\S]*?)<\/title>/i
        )
      );


    title =
      title.replace(
        /\s+-\s+itch\.io\s*$/i,
        ""
      );


    title =
      title.replace(
        /\s+by\s+.+$/i,
        ""
      );

  }


  /*
   * Developer name.
   */

  const userLink =
    match(

      html,

      /<a[^>]*class=["'][^"']*\buser_link\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/i

    );


  return compact({

    title: title,


    developer:
      clean(userLink) ||
      meta(
        html,
        "name",
        "author"
      ),


    /*
     * itch genres
     */

    genres:
      anchorText(

        html,

        /<a[^>]*href=["'][^"']*\/games\/genre-[^"']+["'][^>]*>([\s\S]*?)<\/a>/gi

      ).slice(0, 4),


    /*
     * itch tags
     */

    tags:
      anchorText(

        html,

        /<a[^>]*href=["'][^"']*\/games\/tag-[^"']+["'][^>]*>([\s\S]*?)<\/a>/gi

      ).slice(0, 8),


    /*
     * itch itself plus any useful
     * supporter/community links
     * found on the page.
     */

    links: {

      itch:
        cleanUrl.toString(),

      ...knownLinks(html)

    },


    image:
      meta(
        html,
        "property",
        "og:image"
      )

  });

}


/* =========================
   CLEAN GAME OBJECT
========================== */

function compact(game) {

  const result = {

    title:
      clean(game.title),

    developer:
      clean(game.developer),

    genres:
      unique(
        game.genres || []
      ),

    tags:
      unique(
        game.tags || []
      ),

    links:
      game.links || {}

  };


  /*
   * Steam artwork is already
   * handled automatically by
   * links-data.js.
   *
   * itch artwork gets stored here.
   */

  if (game.image) {

    result.image =
      String(
        game.image
      ).trim();

  }


  return result;

}


/* =========================
   READ CURRENT DATABASE
========================== */

function readGames(source) {

  const sandbox = {};


  try {

    vm.runInNewContext(

      source,

      sandbox,

      {
        timeout: 2000,
        filename:
          "links-data.js"
      }

    );

  } catch (error) {

    stop(
      "links-data.js could not be parsed: " +
      error.message
    );

  }


  if (
    !Array.isArray(
      sandbox.GAME_LINKS
    )
  ) {

    stop(
      "GAME_LINKS was not found."
    );

  }


  return sandbox.GAME_LINKS;

}


/* =========================
   FIND EXISTING GAME
========================== */

function findExistingIndex(
  existing,
  game
) {

  const newUrls =
    Object.values(
      game.links || {}
    )
    .map(urlKey)
    .filter(Boolean);


  return existing.findIndex(
    function (old) {

      const oldUrls = [];


      /*
       * New-format links
       */
      if (
        old.links &&
        typeof old.links === "object"
      ) {

        Object.values(
          old.links
        )
        .forEach(function (url) {

          if (url) {
            oldUrls.push(url);
          }

        });

      }


      /*
       * Old-format link
       */
      if (old.url) {

        oldUrls.push(
          old.url
        );

      }


      const normalizedOldUrls =
        oldUrls
          .map(urlKey)
          .filter(Boolean);


      const sameUrl =
        newUrls.some(
          function (url) {

            return (
              normalizedOldUrls
                .indexOf(url) !== -1
            );

          }
        );


      const sameTitle =
        key(old.title) ===
        key(game.title);


      return (
        sameUrl ||
        sameTitle
      );

    }
  );

}


/* =========================
   MERGE EXISTING + FRESH DATA
========================== */

function mergeExistingGame(
  old,
  fresh
) {

  /*
   * Preserve all existing destination
   * links, including old-format entries.
   */

  const oldLinks = {
    ...(old.links || {})
  };


  if (
    old.platform &&
    old.url &&
    !oldLinks[old.platform]
  ) {

    oldLinks[old.platform] =
      old.url;

  }


  /*
   * New metadata goes first.
   * Existing values are retained so
   * manually-added genres/tags survive.
   */

  const genres =
    unique([
      ...(fresh.genres || []),
      ...(old.genres || [])
    ]);


  const tags =
    unique([
      ...(fresh.tags || []),
      ...(old.tags || [])
    ])
    .filter(function (tag) {

      return !genres.some(
        function (genre) {

          return (
            key(genre) ===
            key(tag)
          );

        }
      );

    });


  const merged =
    compact({

      title:
        fresh.title ||
        old.title,

      developer:
        fresh.developer ||
        old.developer,

      genres:
        genres,

      tags:
        tags,

      links: {
        ...oldLinks,
        ...(fresh.links || {})
      },

      /*
       * Prefer newly retrieved artwork,
       * but never throw away a working
       * existing image.
       */
      image:
  (
    old.image &&
    old.image.startsWith("img/") &&
    old.image !== "img/default.jpg"
  )
    ? old.image
    : (
        fresh.image ||
        old.image ||
        ""
      )

    });


  /*
   * Don't accidentally remove a game's
   * featured status during a refresh.
   */

  merged.featured =
    Boolean(
      fresh.featured ||
      old.featured
    );


  /*
   * Preserve hand-written Scaveng3r data.
   */

  if (old.description) {

    merged.description =
      old.description;

  }


  if (old.watchUrl) {

    merged.watchUrl =
      old.watchUrl;

  }


  if (
    Number.isFinite(
      old.priority
    ) &&
    old.priority !== 999
  ) {

    merged.priority =
      old.priority;

  }


  return merged;

}


/* =========================
   REPLACE EXISTING ENTRY
========================== */

function replaceEntry(
  source,
  index,
  game
) {

  const ranges =
    getGameObjectRanges(
      source
    );


  if (!ranges[index]) {

    stop(
      "Could not locate the existing game " +
      "inside GAME_LINKS."
    );

  }


  const range =
    ranges[index];


  const object =
    JSON.stringify(
      game,
      null,
      2
    )
    .split("\n")
    .map(function (line) {

      return "  " + line;

    })
    .join("\n");


  return (
    source.slice(
      0,
      range.start
    )
    +
    object
    +
    source.slice(
      range.end
    )
  );

}


/* =========================
   LOCATE GAME OBJECTS
========================== */

function getGameObjectRanges(
  source
) {

  const declaration =
    source.indexOf(
      "var GAME_LINKS"
    );


  if (declaration < 0) {

    stop(
      "GAME_LINKS declaration not found."
    );

  }


  const arrayStart =
    source.indexOf(
      "[",
      declaration
    );


  const marker =
    "/* ===== Image overrides ===== */";


  const markerPos =
    source.indexOf(
      marker
    );


  if (
    arrayStart < 0 ||
    markerPos < 0
  ) {

    stop(
      "Could not locate the GAME_LINKS array."
    );

  }


  const arrayEnd =
    source
      .slice(
        0,
        markerPos
      )
      .lastIndexOf("];");


  if (arrayEnd < 0) {

    stop(
      "Could not locate the end of GAME_LINKS."
    );

  }


  const ranges = [];

  let depth = 0;
  let objectStart = -1;

  let stringChar = null;
  let escaped = false;

  let lineComment = false;
  let blockComment = false;


  for (
    let i = arrayStart + 1;
    i < arrayEnd;
    i++
  ) {

    const char =
      source[i];

    const next =
      source[i + 1];


    /*
     * Line comments
     */
    if (lineComment) {

      if (char === "\n") {
        lineComment = false;
      }

      continue;

    }


    /*
     * Block comments
     */
    if (blockComment) {

      if (
        char === "*" &&
        next === "/"
      ) {

        blockComment = false;
        i++;

      }

      continue;

    }


    /*
     * Quoted strings
     */
    if (stringChar) {

      if (escaped) {

        escaped = false;
        continue;

      }


      if (char === "\\") {

        escaped = true;
        continue;

      }


      if (char === stringChar) {

        stringChar = null;

      }


      continue;

    }


    /*
     * Start comments
     */
    if (
      char === "/" &&
      next === "/"
    ) {

      lineComment = true;
      i++;

      continue;

    }


    if (
      char === "/" &&
      next === "*"
    ) {

      blockComment = true;
      i++;

      continue;

    }


    /*
     * Start strings
     */
    if (
      char === "\"" ||
      char === "'" ||
      char === "`"
    ) {

      stringChar =
        char;

      continue;

    }


    /*
     * Track top-level game objects.
     *
     * Nested objects such as links: {}
     * simply increase the depth.
     */
    if (char === "{") {

      if (depth === 0) {

        objectStart =
          i;

      }


      depth++;

      continue;

    }


    if (char === "}") {

      depth--;


      if (
        depth === 0 &&
        objectStart >= 0
      ) {

        ranges.push({

          start:
            objectStart,

          end:
            i + 1

        });


        objectStart =
          -1;

      }


      if (depth < 0) {

        stop(
          "Unexpected object structure " +
          "inside GAME_LINKS."
        );

      }

    }

  }


  return ranges;

}

/* =========================
   INSERT INTO links-data.js
========================== */

function insertEntry(
  source,
  game
) {

  const marker =
    "/* ===== Image overrides ===== */";


  const markerPos =
    source.indexOf(
      marker
    );


  if (markerPos < 0) {

    stop(
      "Image overrides marker not found."
    );

  }


  /*
   * Find the ]; immediately
   * before Image Overrides.
   */

  const close =
    source
      .slice(
        0,
        markerPos
      )
      .lastIndexOf("];");


  if (close < 0) {

    stop(
      "End of GAME_LINKS array not found."
    );

  }


  const before =
    source.slice(
      0,
      close
    );


  const after =
    source.slice(
      close
    );


  const trimmed =
    before.replace(
      /\s+$/,
      ""
    );


  const whitespace =
    before.slice(
      trimmed.length
    );


  const separator =
    trimmed.endsWith(",")
      ? "\n"
      : ",\n";


  /*
   * JSON objects are also valid
   * JavaScript objects.
   */

  const object =
    JSON.stringify(
      game,
      null,
      2
    )
    .split("\n")
    .map(
      function (line) {
        return "  " + line;
      }
    )
    .join("\n");


  return (
    trimmed +
    separator +
    object +
    "\n" +
    whitespace +
    after
  );

}


/* =========================
   WEB HELPERS
========================== */

async function getHtml(
  url,
  extra
) {

  const response =
    await fetch(
      url,
      {
        redirect: "follow",

        headers: {
          ...headers(),
          ...(extra || {})
        }
      }
    );


  if (!response.ok) {

    throw new Error(
      response.status +
      " " +
      response.statusText
    );

  }


  return response.text();

}


function headers() {

  return {

    "User-Agent":
      "Mozilla/5.0 " +
      "(compatible; " +
      "Scaveng3rGameLibrary/1.0)",

    "Accept-Language":
      "en-US,en;q=0.9"

  };

}


/* =========================
   EXTERNAL LINKS
========================== */

function knownLinks(html) {

  const found = {};

  const regex =
    /href=["']([^"']+)["']/gi;


  let match;


  while (
    (
      match =
        regex.exec(html)
    )
  ) {

    const href =
      decode(
        match[1]
      ).trim();


    if (
      !/^https?:\/\//i.test(
        href
      )
    ) {
      continue;
    }


    try {

      const host =
        new URL(href)
          .hostname
          .toLowerCase()
          .replace(
            /^www\./,
            ""
          );


      if (
        !found.patreon &&
        host ===
          "patreon.com"
      ) {

        found.patreon =
          href;

      }


      if (
        !found.subscribestar &&
        (
          host ===
            "subscribestar.adult" ||
          host ===
            "subscribestar.com"
        )
      ) {

        found.subscribestar =
          href;

      }


      if (
        !found.discord &&
        (
          host ===
            "discord.gg" ||
          host ===
            "discord.com"
        )
      ) {

        found.discord =
          href;

      }

    } catch {

      /*
       * Ignore malformed links.
       */

    }

  }


  return found;

}


/* =========================
   HTML PARSING
========================== */

function meta(
  html,
  attrName,
  attrValue
) {

  const tags =
    String(html || "")
      .match(
        /<meta\b[^>]*>/gi
      ) || [];


  for (
    const tag of tags
  ) {

    const attrs = {};

    const regex =
      /([:\w-]+)\s*=\s*(["'])([\s\S]*?)\2/g;


    let match;


    while (
      (
        match =
          regex.exec(tag)
      )
    ) {

      attrs[
        match[1]
          .toLowerCase()
      ] =
        match[3];

    }


    if (
      String(
        attrs[attrName] || ""
      ).toLowerCase()
      ===
      attrValue.toLowerCase()
    ) {

      return clean(
        attrs.content || ""
      );

    }

  }


  return "";

}


function anchorText(
  html,
  regex
) {

  const items = [];

  let match;


  while (
    (
      match =
        regex.exec(
          String(html || "")
        )
    )
  ) {

    items.push(
      clean(
        match[1]
      )
    );

  }


  return unique(items);

}


/* =========================
   GENERAL HELPERS
========================== */

function splitCsv(value) {

  return unique(

    String(value || "")
      .split(",")
      .map(
        function (item) {
          return item.trim();
        }
      )

  );

}


function unique(items) {

  const result = [];

  const seen =
    new Set();


  (items || [])
    .forEach(
      function (item) {

        const value =
          clean(item);

        const normalized =
          key(value);


        if (
          !value ||
          seen.has(
            normalized
          )
        ) {
          return;
        }


        seen.add(
          normalized
        );

        result.push(
          value
        );

      }
    );


  return result;

}


function clean(value) {

  return decode(

    String(value || "")
      .replace(
        /<[^>]+>/g,
        " "
      )

  )
  .replace(
    /\s+/g,
    " "
  )
  .trim();

}


function decode(value) {

  return String(value || "")

    .replace(
      /&amp;/gi,
      "&"
    )

    .replace(
      /&quot;/gi,
      "\""
    )

    .replace(
      /&#39;|&apos;/gi,
      "'"
    )

    .replace(
      /&lt;/gi,
      "<"
    )

    .replace(
      /&gt;/gi,
      ">"
    )

    .replace(
      /&#(\d+);/g,
      function (_, number) {

        return String.fromCodePoint(
          Number(number)
        );

      }
    )

    .replace(
      /&#x([0-9a-f]+);/gi,
      function (_, number) {

        return String.fromCodePoint(
          parseInt(
            number,
            16
          )
        );

      }
    );

}


function match(
  text,
  regex
) {

  const result =
    String(text || "")
      .match(regex);


  return result
    ? result[1]
    : "";

}


function key(value) {

  return clean(value)
    .toLowerCase();

}


function urlKey(value) {

  try {

    const url =
      new URL(value);


    const host =
      url.hostname
        .toLowerCase()
        .replace(
          /^www\./,
          ""
        );


    /*
     * Steam URLs are identified by App ID.
     * Ignore whatever title Steam puts
     * after the App ID.
     */

    if (
      host ===
      "store.steampowered.com"
    ) {

      const steamMatch =
        url.pathname.match(
          /\/app\/(\d+)/i
        );


      if (steamMatch) {

        return (
          "store.steampowered.com/app/" +
          steamMatch[1]
        );

      }

    }


    return (
      host +
      url.pathname
        .replace(
          /\/+$/,
          ""
        )
        .toLowerCase()
    );


  } catch {

    return String(
      value || ""
    )
    .trim()
    .toLowerCase()
    .replace(
      /\/+$/,
      ""
    );

  }

}


function stop(message) {

  console.error(
    message
  );

  process.exit(1);

}
