## Overview

I found this [wonderful database](http://www.peakbagging.com/Peak%20Lists/CA_Lookout1.html) of Firewatch locations in California. I really wanted an interactive map view of these locations, but couldn't find one. I've been using [Obsidian](https://obsidian.md/) for knowledge gathering recently, and have been using the [Map View](https://github.com/esm7/obsidian-map-view) plugin to keep track of locations. This repo has some hacked together JS to turn the table of CA firewatch locations into JSON, then another script to turn that JSON into an Obsidian vault.

|Map View|Includes Rentable Firewatches|
|-|-|
|<img width="947" alt="image" src="https://github.com/kylehovey/firewatch-obsidian/assets/7339800/911bb6d8-eb42-4371-ba20-54caf9ef13d1">|![image](https://github.com/kylehovey/firewatch-obsidian/assets/7339800/b1b52736-0d1b-48c7-8908-8ab4baebf6fd)|


## Caveats

I also edited the vault a little bit to include which firewatch towers are ones you can rent. If you re-run the generation script, it will overwrite these additional edits. Granted, I think there is only around 8 of the firewatches that this applies to. You can see them with the `#firewatch-rentable` tag (which is different from the default `#firewatch` tag).

## Setup

First download Obsidian, clone this repo, then choose "open folder as Vault" and select the `firewatches` directory.
