// js/links-data.js
// Central source of truth for game/store/channel links.

var GAME_LINKS = [
  {
    title: "Acting Lessons",
    platform: "steam",
    url: "https://store.steampowered.com/app/1045520/Acting_Lessons/",
    tags: ["visual novel"]
  },
  {
    title: "After the Inferno",
    platform: "steam",
    url: "https://store.steampowered.com/app/2027360/After_the_Inferno/",
    tags: ["visual novel"]
  },
  {
    title: "Ark Re:Code",
    platform: "steam",
    url: "https://store.steampowered.com/app/3587140/Ark_ReCode/",
    tags: ["visual novel", "rpg"]
  },
  {
    title: "Being a DIK",
    platform: "steam",
    url: "https://store.steampowered.com/app/1126320/Being_a_DIK__Season_1/",
    tags: ["visual novel"]
  },
  {
    title: "B.E.S.T.",
    platform: "steam",
    url: "https://store.steampowered.com/app/2404390/BEST/",
    tags: ["visual novel"]
  },
  {
    title: "Breeders of the Nephelym",
    platform: "steam",
    url: "https://store.steampowered.com/app/1161770/Breeders_of_the_Nephelym/",
    tags: ["rpg", "3D"]
  },
  {
    title: "Catmorphosis",
    platform: "itch",
    url: "https://katwhorm.itch.io/catmorphosis",
    tags: ["visual novel"]
  },
  {
    title: "Chasing Sunsets",
    platform: "steam",
    url: "https://store.steampowered.com/app/1783110/Chasing_Sunsets/",
    tags: ["visual novel"]
  },
  {
    title: "City of Broken Dreamers",
    platform: "steam",
    url: "https://store.steampowered.com/app/1358250/City_of_Broken_Dreamers_Book_One/",
    tags: ["visual novel"]
  },
  {
    title: "Cozy Cafe",
    platform: "itch",
    url: "https://cosy-creator.itch.io/cosy-cafe",
    tags: ["visual novel"]
  },
  {
    title: "Chasing Tails",
    platform: "steam",
    url: "https://store.steampowered.com/app/1555110/Chasing_Tails_A_Promise_in_the_Snow/",
    tags: ["visual novel"]
  },
  {
    title: "Cockwork Industries Complete",
    platform: "steam",
    url: "https://store.steampowered.com/app/1172940/Cockwork_Industries_Complete/",
    tags: ["adventure"]
  },
  {
    title: "College Kings",
    platform: "steam",
    url: "https://store.steampowered.com/app/1463120/College_Kings__The_Complete_Season/",
    tags: ["visual novel"]
  },
  {
    title: "College Kings 2",
    platform: "steam",
    url: "https://store.steampowered.com/app/1924480/College_Kings_2__Episode_1/",
    tags: ["visual novel"]
  },
  {
    title: "Cryptid Park",
    platform: "itch",
    url: "https://hotpink.itch.io/cryptid-park",
    tags: ["pixel graphics"]
  },
  {
    title: "Deluded",
    platform: "itch",
    url: "https://deludedgame.itch.io/deluded",
    tags: ["adventure", "open world", "rpg"]
  },
  {
    title: "Devious Demigods",
    platform: "itch",
    url: "https://kraytstudios.itch.io/devious-demigods",
    tags: ["visual novel"]
  },
  {
    title: "Dreamland",
    platform: "steam",
    url: "https://store.steampowered.com/app/2176560/Dreamland/",
    tags: ["visual novel"]
  },
  {
    title: "Eternum",
    platform: "itch",
    url: "https://caribdis.itch.io/eternum",
    tags: ["visual novel"],
    featured: true,
    priority: 3,
    description: "Fan-favorite visual novel with memorable characters and strong channel demand.",
    watchUrl: "https://www.youtube.com/results?search_query=scaveng3r+eternum"
  },
  {
    title: "Femboy Futa House",
    platform: "steam",
    url: "https://store.steampowered.com/app/3602290/FEMBOY_FUTA_HOUSE/",
    tags: ["visual novel", "rpg"]
  },
  {
    title: "Fetish Locator",
    platform: "steam",
    url: "https://store.steampowered.com/app/1360980/Fetish_Locator_Week_One/",
    tags: ["visual novel"]
  },
  {
    title: "Find Love or Die Trying",
    platform: "steam",
    url: "https://store.steampowered.com/app/1714320/Find_Love_or_Die_Trying/",
    tags: ["visual novel"]
  },
  {
    title: "Fresh Women",
    platform: "steam",
    url: "https://store.steampowered.com/app/1350650/FreshWomen__Season_1/",
    tags: ["visual novel"]
  },
  {
    title: "Fresh Women Season 2",
    platform: "steam",
    url: "https://store.steampowered.com/app/3478650/FreshWomen__Season_2/",
    tags: ["visual novel"],
    featured: true,
    priority: 1,
    description: "Story-heavy campus visual novel and one of the main ongoing channel series.",
    watchUrl: "https://www.youtube.com/results?search_query=scaveng3r+fresh+women+season+2"
  },
  {
    title: "Futanari di Funghi",
    platform: "steam",
    url: "https://store.steampowered.com/app/2496640/Futanari_di_Funghi/",
    tags: ["pixel graphics"]
  },
  {
    title: "Goodbye Eternity",
    platform: "itch",
    url: "https://the-end-of-time.itch.io/goodbye-eternity-demo",
    tags: ["visual novel"]
  },
  {
    title: "Gray",
    platform: "steam",
    url: "https://store.steampowered.com/app/1034700/GRAY/",
    tags: ["visual novel", "adventure"]
  },
  {
    title: "Handyman Legend",
    platform: "steam",
    url: "https://store.steampowered.com/app/2127010/Handyman_Legend/",
    tags: ["pixel graphics"]
  },
  {
    title: "Hentai Hack-Her",
    platform: "steam",
    url: "https://store.steampowered.com/app/1596980/Hentai_HackHer/",
    tags: ["shooter"]
  },
  {
    title: "Hero by Chance",
    platform: "steam",
    url: "https://store.steampowered.com/app/1433420/Love_n_War_Hero_by_Chance/",
    tags: ["rpg"]
  },
  {
    title: "Her New Memory",
    platform: "steam",
    url: "https://store.steampowered.com/app/1296770/Her_New_Memory__Hentai_Simulator/",
    tags: ["simulation"]
  },
  {
    title: "HunieCam Studio",
    platform: "steam",
    url: "https://store.steampowered.com/app/426000/HunieCam_Studio/",
    tags: ["management", "simulation"]
  },
  {
    title: "Innocence or Money",
    platform: "steam",
    url: "https://store.steampowered.com/app/1722270/Innocence_Or_Money__Prelude/",
    tags: ["visual novel"]
  },
  {
    title: "Kiara and My Ara Ara Adventure",
    platform: "steam",
    url: "https://store.steampowered.com/app/1343090/Kiara_And_My_Ara_Ara_Adventure/",
    tags: ["visual novel"]
  },
  {
    title: "Kidnapped Girl",
    platform: "steam",
    url: "https://store.steampowered.com/app/1274290/Kidnapped_Girl/",
    tags: ["visual novel"]
  },
  {
    title: "Last Evil",
    platform: "steam",
    url: "https://store.steampowered.com/app/823910/Last_Evil/",
    tags: ["deck building"]
  },
  {
    title: "Leap of Faith",
    platform: "steam",
    url: "https://store.steampowered.com/app/1768640/Leap_of_Faith/",
    tags: ["visual novel"]
  },
  {
    title: "Lollipop!",
    platform: "steam",
    url: "https://store.steampowered.com/app/1515230/LOLLIPOP/",
    tags: ["puzzle"]
  },
  {
    title: "Lovely Craft Piston Trap",
    platform: "itch",
    url: "https://hellocrime.itch.io/lovelycraft",
    tags: ["simulator"],
    featured: true,
    priority: 5,
    description: "Adult Minecraft parody with a weird, memorable hook and strong novelty factor.",
    watchUrl: "https://www.youtube.com/results?search_query=scaveng3r+lovely+craft+piston+trap"
  },
  {
    title: "Love Sucks: Night One",
    platform: "steam",
    url: "https://store.steampowered.com/app/1577420/Love_Sucks_Night_One/",
    tags: ["visual novel"]
  },
  {
    title: "LoveKami -Useless Goddess-",
    platform: "steam",
    url: "https://store.steampowered.com/app/626510/LoveKami_Useless_Goddess/",
    tags: ["visual novel"]
  },
  {
    title: "Lucy Got Problems",
    platform: "steam",
    url: "https://store.steampowered.com/app/879510/Lucy_Got_Problems/",
    tags: ["visual novel"]
  },
  {
    title: "Lunar's Chosen: Episode 1",
    platform: "steam",
    url: "https://store.steampowered.com/app/1695680/Lunars_Chosen__Episode_1/",
    tags: ["visual novel"]
  },
  {
    title: "Lust Academy",
    platform: "steam",
    url: "https://store.steampowered.com/app/1846920/Lust_Academy__Season_1/",
    tags: ["visual novel"]
  },
  {
    title: "Lust Epidemic",
    platform: "steam",
    url: "https://store.steampowered.com/app/1008020/Lust_Epidemic/",
    tags: ["adventure"]
  },
  {
    title: "Lust Goddess",
    platform: "steam",
    url: "https://store.steampowered.com/app/2808930/Lust_Goddess/",
    tags: ["card collection"]
  },
  {
    title: "Lusty Buccaneers",
    platform: "itch",
    url: "https://nika-dev.itch.io/lusty-buccaneers",
    tags: ["visual novel"]
  },
  {
    title: "Midnight Ride",
    platform: "steam",
    url: "https://store.steampowered.com/app/1210110/Midnight_Ride/",
    tags: ["visual novel"]
  },
  {
    title: "MILF's Plaza",
    platform: "steam",
    url: "https://store.steampowered.com/app/2706300/MILFs_Plaza/",
    tags: ["visual novel"]
  },
  {
    title: "Milfy City",
    platform: "steam",
    url: "https://store.steampowered.com/app/2544090/Milfy_City__Final_Edition/",
    tags: ["visual novel"]
  },
  {
    title: "Mist",
    platform: "itch",
    url: "https://395games.itch.io/mist-free",
    tags: ["horror", "survival", "mystery"]
  },
  {
    title: "My Pig Princess",
    platform: "itch",
    url: "https://cyancapsule.itch.io/my-pig-princess",
    tags: ["visual novel"]
  },
  {
    title: "Overlewd",
    platform: "steam",
    url: "https://store.steampowered.com/app/2308870/Overlewd/",
    tags: ["visual novel"]
  },
  {
    title: "Parasite Echo",
    platform: "itch",
    url: "https://theaesthetik.itch.io/parasite-echo",
    tags: ["survival horror"],
    featured: true,
    priority: 4,
    description: "Stylish survival horror project with a darker tone than the usual channel lineup.",
    watchUrl: "https://www.youtube.com/results?search_query=scaveng3r+parasite+echo"
  },
  {
    title: "Phantom Thief Effie",
    platform: "steam",
    url: "https://store.steampowered.com/app/2407550/Phantom_Thief_Effie/",
    tags: ["rpg"]
  },
  {
    title: "Private Dorm Manager",
    platform: "steam",
    url: "https://store.steampowered.com/app/2273420/Private_Dorm_Manager/",
    tags: ["pixel graphics"]
  },
  {
    title: "Queen's Brothel",
    platform: "steam",
    url: "https://store.steampowered.com/app/1350250/Queens_Brothel/",
    tags: ["rpg"]
  },
  {
    title: "Quickie: Fantasy Adventure",
    platform: "itch",
    url: "https://oppaigames.itch.io/quickie-fantasy-adventure",
    tags: ["visual novel"]
  },
  {
    title: "Race of Life",
    platform: "steam",
    url: "https://store.steampowered.com/app/2454570/Race_of_Life__Act_1/",
    tags: ["visual novel"],
    featured: true,
    priority: 2,
    description: "High-stakes visual novel featured on the channel with strong story momentum.",
    watchUrl: "https://www.youtube.com/results?search_query=scaveng3r+race+of+life"
  },
  {
    title: "Ripples",
    platform: "itch",
    url: "https://jestur.itch.io/ripples",
    tags: ["visual novel"]
  },
  {
    title: "Space Rescue",
    platform: "steam",
    url: "https://store.steampowered.com/app/1407210/Space_Rescue_Code_Pink/",
    tags: ["visual novel"]
  },
  {
    title: "Succum Brewery",
    platform: "itch",
    url: "https://succumdev.itch.io/succum-brewery",
    tags: ["pixel graphics"]
  },
  {
    title: "Subverse",
    platform: "steam",
    url: "https://store.steampowered.com/app/1034140/Subverse/",
    tags: ["rpg"]
  },
  {
    title: "Succubus Waifu",
    platform: "steam",
    url: "https://store.steampowered.com/app/1184400/Succubus_Waifu/",
    tags: ["rpg"]
  },
  {
    title: "Summertime Saga",
    platform: "dev",
    url: "https://summertimesaga.com/download",
    tags: ["visual novel"],
    featured: true,
    priority: 6,
    description: "Long-running visual novel project with its own standalone download site.",
    watchUrl: "https://www.youtube.com/results?search_query=scaveng3r+summertime+saga"
  },
  {
    title: "Treasure of Nadia",
    platform: "steam",
    url: "https://store.steampowered.com/app/1737100/Treasure_of_Nadia/",
    tags: ["adventure"]
  },
  {
    title: "U4iA",
    platform: "steam",
    url: "https://store.steampowered.com/app/2890150/U4iA__Season_1/",
    tags: ["visual novel"]
  },
  {
    title: "Village Rhapsody",
    platform: "steam",
    url: "https://store.steampowered.com/app/2109460/VillageRhapsody/",
    tags: ["farming sim", "rpg"]
  },
  {
    title: "Welcum to the City",
    platform: "itch",
    url: "https://quiquersson.itch.io/w2c-free",
    tags: ["visual novel"]
  },
  {
    title: "Wicked Island",
    platform: "steam",
    url: "https://store.steampowered.com/app/1943730/Wicked_Island/",
    tags: ["visual novel"]
  },
  {
    title: "Women's Prison",
    platform: "steam",
    url: "https://store.steampowered.com/app/1527980/Womans_Prison/",
    tags: ["visual novel"]
  },
  {
    title: "Yes, Master!",
    platform: "steam",
    url: "https://store.steampowered.com/app/1090900/Yes_Master/",
    tags: ["visual novel"]
  }
];

/* ===== Image overrides ===== */

var GAME_IMAGE_OVERRIDES = {
  "Ark Re:Code": "img/games/ark.jpg",
  "Catmorphosis": "img/games/catmorph.png",
  "Cozy Cafe": "img/games/cozy.jpg",
  "Cryptid Park": "img/games/crypid.gif",
  "Deluded": "img/games/deluded.jpg",
  "Eternum": "img/games/eternum.png",
  "Femboy Futa House": "img/games/femboy-futa.jpg",
  "Lovely Craft Piston Trap": "img/games/lovely-craft.jpg",
  "Parasite Echo": "img/games/parasite-echo.png",
  "Ripples": "img/games/ripples.jpg",
  "Summertime Saga": "img/games/summertime-saga.jpg"
};

/* ===== Helpers ===== */

function getSteamAppId(url) {
  var match = url && url.match(/\/app\/(\d+)\//i);
  return match ? match[1] : null;
}

function getDefaultImage() {
  return "img/default.jpg";
}

function getAutoImage(item) {
  if (!item) return getDefaultImage();

  if (GAME_IMAGE_OVERRIDES[item.title]) {
    return GAME_IMAGE_OVERRIDES[item.title];
  }

  if (item.platform === "steam") {
    var appId = getSteamAppId(item.url);
    if (appId) {
      return "https://cdn.cloudflare.steamstatic.com/steam/apps/" + appId + "/header.jpg";
    }
  }

  return getDefaultImage();
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];

  return tags
    .flatMap(function(tag) {
      return String(tag).split(",");
    })
    .map(function(tag) {
      return tag.trim();
    })
    .filter(Boolean);
}

GAME_LINKS = GAME_LINKS.map(function(item) {
  return {
    title: item.title,
    platform: item.platform,
    url: item.url,
    tags: normalizeTags(item.tags),
    image: item.image || getAutoImage(item),
    description: item.description || "",
    watchUrl: item.watchUrl || "",
    featured: Boolean(item.featured),
    priority: Number.isFinite(item.priority) ? item.priority : 999
  };
});
