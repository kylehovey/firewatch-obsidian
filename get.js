/**
 * Grabs data from http://www.peakbagging.com/Peak%20Lists/CA_Lookout1.html
 *
 * Copy and paste everything including the braces and paste into the browser console.
 */

{
  // Util
  const capitalize = ([fst, ...chars]) =>
    fst.toLocaleUpperCase() + chars.join("");
  const keyCase = (str) =>
    Promise.resolve(
      str
        .toLocaleLowerCase()
        .replaceAll(/[^a-z\d\s]/g, "")
        .split(" ")
    ).then(([fst, ...rest]) => fst + rest.map(capitalize).join(""));
  const zip = (xs, ys) => xs.map((x, i) => [x, ys[i]]);
  const parse = (val) =>
    Number.isNaN(Number.parseInt(val, 10))
      ? val.trim() === ""
        ? null
        : val
      : Number.parseInt(val, 10);

  // Element transformers
  const rowsOf = (table) => [...table.querySelectorAll("tr")];
  const content = (td) =>
    td.querySelector("a")
      ? `[${td.innerText}](${td.querySelector("a").href})`
      : td.innerText;
  const dataOf = ([_, ...data]) =>
    data.map((row) => [...row.querySelectorAll("td")]);
  const keysOf = ([fst]) =>
    Promise.all([...fst.querySelectorAll("td")].map(content).map(keyCase));
  const reduceData = (keys, dataRows) =>
    dataRows.reduce(
      (acc, dataRow) => [
        ...acc,
        zip(keys, dataRow.map(content).map(parse)).reduce(
          (bcc, [key, value]) => ({
            ...bcc,
            [key]: value,
          }),
          {}
        ),
      ],
      []
    );

  // Selectors
  const mainTable = async () => document.querySelectorAll("table")[1];

  // Main
  mainTable()
    .then(rowsOf)
    .then((rows) => Promise.all([keysOf(rows), dataOf(rows)]))
    .then(([keys, dataRows]) => reduceData(keys, dataRows))
    .then(JSON.stringify)
    .then(console.log);
}
