// src/libs/bible.js

export async function getBible(lang) {
    const file_path = lang === "eng" ? "/en_bbe.json" : "/ko_ko.json";
    const response = await fetch(file_path);
    if (!response.ok) throw new Error("Failed to load Bible data");

    const data = await response.json();

    // Collect all abbrev values and output
    const abbrevs = data.map((book) => book.abbrev);
    console.log("All abbrevs:", abbrevs);

    return data;
}