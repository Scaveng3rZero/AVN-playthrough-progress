const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");

const dataFile = path.join(
  process.cwd(),
  "js",
  "links-data.js"
);

const addGameScript = path.join(
  process.cwd(),
  "scripts",
  "add-game.js"
);

main().catch(function (error) {
  console.error(error);
  process.exit(1);
});


async function main() {

  const source =
    fs.readFileSync(
      dataFile,
      "utf8"
    );

  const games =
    readGames(source);

  const queue = [];
  const skipped = [];
  const failures = [];


  /*
   * Build the refresh queue from the
   * database as it existed when we started.
   */

  games.forEach(function (game) {

    const url =
      getRefreshUrl(game);


    if (url) {

      queue.push({
        title: game.title,
        url: url
      });

    } else {

      skipped.push(
        game.title
      );

    }

  });


  console.log(
    "Games found: " +
    games.length
  );

  console.log(
    "Automatic refresh: " +
    queue.length
  );

  console.log(
    "Manual review: " +
    skipped.length
  );

  console.log("");


  /*
   * Refresh each game using the exact
   * same importer used by Add / Update Game.
   */

  for (
    let i = 0;
    i < queue.length;
    i++
  ) {

    const item =
      queue[i];


    console.log(
      "===================================="
    );

    console.log(
      "[" +
      (i + 1) +
      "/" +
      queue.length +
      "] " +
      item.title
    );

    console.log(
      item.url
    );


    const result =
      spawnSync(
        process.execPath,
        [
          addGameScript
        ],
        {
          cwd:
            process.cwd(),

          env: {
            ...process.env,

            GAME_URL:
              item.url,

            GAME_GENRES:
              "",

            GAME_TAGS:
              "",

            GAME_FEATURED:
              "false"
          },

          encoding:
            "utf8"
        }
      );


    if (result.stdout) {
      console.log(
        result.stdout.trim()
      );
    }


    if (
      result.status !== 0
    ) {

      console.error(
        "FAILED: " +
        item.title
      );


      if (result.stderr) {

        console.error(
          result.stderr.trim()
        );

      }


      failures.push({
        title:
          item.title,

        url:
          item.url
      });

    }


    /*
     * Be polite to Steam / itch and reduce
     * the chance of rate limiting.
     */

    await sleep(1500);

  }


  console.log("");
  console.log(
    "===================================="
  );

  console.log(
    "LIBRARY REFRESH COMPLETE"
  );

  console.log(
    "===================================="
  );

  console.log(
    "Attempted: " +
    queue.length
  );

  console.log(
    "Successful: " +
    (
      queue.length -
      failures.length
    )
  );

  console.log(
    "Failed: " +
    failures.length
  );

  console.log(
    "Manual review: " +
    skipped.length
  );


  if (failures.length) {

    console.log("");
    console.log(
      "FAILED GAMES:"
    );


    failures.forEach(
      function (item) {

        console.log(
          "- " +
          item.title +
          " | " +
          item.url
        );

      }
    );

  }


  if (skipped.length) {

    console.log("");
    console.log(
      "NEEDS MANUAL REVIEW:"
    );


    skipped.forEach(
      function (title) {

        console.log(
          "- " +
          title
        );

      }
    );

  }

}


/* =========================
   CHOOSE REFRESH SOURCE
========================== */

function getRefreshUrl(game) {

  /*
   * New-format entries:
   * Steam is our preferred metadata source.
   */

  if (
    game.links &&
    game.links.steam
  ) {

    return game.links.steam;

  }


  if (
    game.links &&
    game.links.itch
  ) {

    return game.links.itch;

  }


  /*
   * Old-format entries.
   */

  if (
    game.platform === "steam" &&
    game.url
  ) {

    return game.url;

  }


  if (
    game.platform === "itch" &&
    game.url
  ) {

    return game.url;

  }


  return null;

}


/* =========================
   READ DATABASE
========================== */

function readGames(source) {

  const sandbox = {};


  vm.runInNewContext(
    source,
    sandbox,
    {
      timeout: 3000,
      filename:
        "links-data.js"
    }
  );


  if (
    !Array.isArray(
      sandbox.GAME_LINKS
    )
  ) {

    throw new Error(
      "GAME_LINKS was not found."
    );

  }


  return sandbox.GAME_LINKS;

}


/* =========================
   DELAY
========================== */

function sleep(ms) {

  return new Promise(
    function (resolve) {

      setTimeout(
        resolve,
        ms
      );

    }
  );

}
