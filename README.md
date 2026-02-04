# Umamusume Auto Train

Like the title says, this is a simple auto training for Umamusume.

To support the creator and the current contributors, use these links:
  - Give thanks to the creator of project [Samsul Panjul](https://ko-fi.com/samsulpanjul)
  - Give thanks to the current maintainer and developer [CrazyIvanTR](https://buymeacoffee.com/crazyivantr)

We do not expect compensation but it helps motivate the development to see people join the Discord, present new ideas, give thanks and support monetarily.

This project is inspired by [shiokaze/UmamusumeAutoTrainer](https://github.com/shiokaze/UmamusumeAutoTrainer)

Join our [discord server](https://discord.gg/vKKmYUNZuk)

[Demo video](https://youtu.be/CXSYVD-iMJk)

![Screenshot](screenshot.png)

# ⚠️ USE IT AT YOUR OWN RISK ⚠️

We are not responsible for any issues, account bans, or losses that may occur from using it.
Use responsibly and at your own discretion.
- [License and disclaimer.](./LICENSE_AND_DISCLAIMER.md)

### If you are a new player, it is recommended to learn the game's systems before using the bot.
- For game guides visit [this link](./readmes/GUIDES.md).

## Features

- Automatically trains Uma
- Keeps racing until fan count meets the goal, and always picks races with matching aptitude
- Checks mood
- Handle debuffs
- Rest
- Selectable G1 races in the race schedule
- Stat target feature, if a stat already hits the target, skip training that one
- Auto-purchase skill (should soon be ported)
- Web Interface for easier configuration
- Select running style position
- Select events you want to select
- Hunt for hints (per card type like speed power etc not per specific card)
- Play claw machine

## Getting Started

### Requirements

- [Python Versions 3.10 to 3.13](https://www.python.org/downloads/)
- [Windows Installer 64-bit direct link](https://www.python.org/ftp/python/3.13.11/python-3.13.11-amd64.exe)
<img width="445" height="141" alt="image" src="https://github.com/user-attachments/assets/36f7f078-9fce-4bd8-b92c-7ff5c5a5eb8d" />

### Setup

#### Clone repository

```
git clone https://github.com/samsulpanjul/umamusume-auto-train.git
cd umamusume-auto-train
```

#### Install dependencies

```
pip install -r requirements.txt
```

### BEFORE YOU START

Make sure these requirements are met.
- Turn off all confirmation pop-ups in game settings
- The game must be in the career lobby screen (the one with the Tazuna hint icon)
- Game's graphics must be set to standard

For steam version:
- Monitor resolution must be 1920x1080
- The game should be in fullscreen and on your primary monitor

Emulator without ADB:
- Monitor resolution must be 1920x1080
- The emulator should be on your primary monitor (will auto full-screen)
- Set custom display size of 800x1080 and DPI to 160.
- Make sure to set the window name in the config to match your emulator’s window title exactly. (case-sensitive)

Emulator with ADB:
- Set custom display size of 800x1080.
- Minimum DPI is 160, recommended is 240.
- Check your ADB address and port in the emulator.
- Apply settings in web UI after running the bot (use adb enabled and address:port entered)

### Start
For a step by step guide go to [bot guide](./readmes/BOT_GUIDE.md)

Run:
```
python main.py
```

Start:
press `f1` to start/stop the bot.

### Configuration

Open your browser and go to: `http://127.0.0.1:8000/` to easily edit the bot's configuration.

Note: multiple bots can work on one machine, they will have the same config templates but they will hook to different function keys for start / stop and ports for web UI. Though they will share the config.json used in the bot folder, so they will all be using the same logic.

### Check FAQ for common problems and problem reporting

[FAQ](./readmes/FAQ.md)

### Training Logic

Training logics are explained in detail in [training explanation document](./readmes/LOGIC.md)

Basically, if you change nothing in the config, bot will go for max friendships first then go for most rainbows.

### Additional Tools

#### Auto Misc
This should work from the main menu or at almost any point in the CM or TT screens 
Notes: this doesn't work if you have an in progress CM from the main menu, like done 1/5 etc. In that case just go into the screen with the match button and start there. It will also skip the shops, not going to implement that since it's a bigger hassle than just putting some buttons in a list.
`py auto_misc.py --cm` for automatically doing ALL of CM races (will use 30 carat for last race).
`py auto_misc.py --tt` for automatically doing all TT races. You can do `py auto_misc.py --tt hard/medium/easy` to pick difficulty.

### How to change branches / install bot / use github desktop video guide
- Watch video https://www.youtube.com/watch?v=iOuoJI1q1hk
- Do not install latest python version. Supported versions are above (3.10 to 3.13)
  - If you need later versions for something, install lower version and use `py -3.13 <rest of the command>` to specify version
- On the step where emulator branch is chosen, choose any other branch you want to use.

### Known Issues

- OCR might misread some values and do trainings otherwise it shouldn't do.

### Contribute

If you run into any issues or something doesn’t work as expected, feel free to open an issue or join the Discord to ask.
Contributions are very welcome! If you want to contribute, please check out the [dev](https://github.com/samsulpanjul/umamusume-auto-train/tree/dev) branch, which is used for testing new features. We truly appreciate any support to help improve this project further.
