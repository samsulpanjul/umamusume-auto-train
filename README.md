# Umamusume Auto Train

This is a fork of https://github.com/samsulpanjul/umamusume-auto-train. Many thanks to those who made that repository for creating the base code. This fork offers several improvements to runtime, for example caching the positions of located templates so the bot does not perform template matching on the whole screen every iteration. 

## Features

- In addition to the features in the parent repository:
- Training hints for spark farming: simply screenshot the support card hint icon into assets/hint_icons, and add the hints you want into logic.py and path to the icon in state.py

## To do:

- Soft thresholding for training logic instead of hard cutoffs based on hints, stat totals, etc.
- JSON config for the style of training you want to do (fans, hints, etc.)
