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

const markdownFrom = ({
  county,
  topoMap,
  year,
  lookoutName,
  elFt,
  latitude,
  longitude,
  forest,
  parkOrOtherUse,
}) => `
---
location: [${toDD(latitude)}, ${toDD(longitude)}]
tag: firewatch
---

${lookoutName} sits at ${elFt}', is located in [[${county} County]] and was constructed in ${year}. ${
  parkOrOtherUse ? `It is run and operated by ${parkOrOtherUse}. ` : ""
}${
  forest ? `It is located in the ${forest} national forest. ` : ""
}It can be found on the ${topoMap} USGS topo map.
`;

(async () => {
  for (const firewatch of data) {
    fs.writeFileSync(
      path.join(__dirname, "firewatches", `${fileNameFrom(firewatch)}.md`),
      markdownFrom(firewatch)
    );
  }
})();
