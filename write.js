const fs = require("fs");
const path = require("path");
const data = require("./lookouts.json");

const linkPattern = /\[(.+)\]\(.+\)/;
const fileNameFrom = ({ lookoutName }) => {
  const match = linkPattern.exec(lookoutName);

  if (match) {
    const [, name] = match;
    return name;
  }

  return lookoutName;
};

const loPattern = /(.+) \(LO site\)/;
const nameAndLoStatusFrom = (name) => {
  const match = loPattern.exec(name);

  if (match) {
    const [, trimmed] = match;

    return { name: trimmed, loSite: true };
  }

  return { name, loSite: false };
};

const statusLookup = {
  A: "Structure in good condition, capable of being staffed.",
  AS: "Usually staffed by Forest Service or CDF.",
  AV: "Staffed by volunteers.",
  AR: "A rental Lookout.",
  B: "Dilapidated and needs work, but standing.",
  C: "Badly damaged or falling down.",
};

const statusTagsFor = (lo, loSite) => {
  if (loSite) return "destroyed";

  switch (lo) {
    case "A":
      return "good-condition";
    case "AS":
      return "good-condition, staffed";
    case "AV":
      return "good-condition, staffed, volunteer-staffed";
    case "AVR":
      return "good-condition, firewatch-rental";
    case "B":
      return "okay-condition";
    case "C":
      return "poor-condition";
  }

  return "unknown-condition";
};

const toDD = (val) => {
  const str = val.toString();

  if (str.length === 6) {
    const deg = parseFloat(str.slice(0, 2), 10);
    const min = parseFloat(str.slice(2, 4), 10);
    const sec = parseFloat(str.slice(4, 6), 10);

    return deg + min / 60 + sec / 3600;
  } else {
    const deg = parseFloat(str.slice(0, 3), 10);
    const min = parseFloat(str.slice(3, 5), 10);
    const sec = parseFloat(str.slice(5, 7), 10);

    return -(deg + min / 60 + sec / 3600);
  }
};

const markdownFrom = (
  {
    county,
    topoMap,
    year,
    lookoutName,
    elFt,
    latitude,
    longitude,
    forest,
    parkOrOtherUse,
    lo,
  },
  loSite
) => `---
location: [${toDD(latitude)}, ${toDD(longitude)}]
tags: [${statusTagsFor(lo && lo.trim(), loSite)}]
---

# Overview

${lookoutName} sits at ${elFt}', is located in [[${county} County]] and was constructed in ${year}. ${
  parkOrOtherUse ? `It is run and operated by ${parkOrOtherUse}. ` : ""
}${
  forest ? `It is located in the ${forest} national forest. ` : ""
}It can be found on the ${topoMap} USGS topo map.

${
  lo && lo.trim()
    ? `# Condition

${statusLookup[lo.trim()]}`
    : ""
}`;

(async () => {
  for (const firewatch of data) {
    const { name, loSite } = nameAndLoStatusFrom(fileNameFrom(firewatch));

    fs.writeFileSync(
      path.join(__dirname, "firewatches", `${name}.md`),
      markdownFrom(firewatch, loSite)
    );
  }
})();
