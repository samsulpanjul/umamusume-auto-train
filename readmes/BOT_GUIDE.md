[Back to main readme](../README.md)

## Please read the guide thoroughly before starting the steps. Skipping any step will cause the bot to not work.

# Install Guide For Complete Beginners

Go to the [repo link](https://github.com/samsulpanjul/umamusume-auto-train/tree/unity_cup_beta)), click on green "<> Code" button, click on download zip. Extract zip wherever you want (preferably on your desktop if you want to follow this guide).

For easier updates, use [Github Desktop](https://desktop.github.com/download/) to clone the repo. In this case, instead of downloading as zip, copy the repo link `https://github.com/samsulpanjul/umamusume-auto-train.git` open up Github Desktop, File -> Clone Repository (or ctrl+shift+o), paste the link (take note of local path, that's where the repo will be) and press ok.

Install [Python](https://www.python.org/downloads/) version between 3.10 and 3.13 (scroll down).

## Important! When installing python click on "Add python to the PATH variable"

Open Windows Powershell (press windows button, write powershell) or a terminal (ctrl+alt+t on linux, don't know about mac) if you're on linux / mac, navigate to the folder you extracted the repo to (on Windows, the powershell is probably on your home folder, so you could do `cd Desktop` then `cd umamusume-auto-train-main`). If you put the repo on anywhere else, just open the folder on explorer and copy the path from the address bar, then paste it after the cd command (right click pastes into powershell). So something like `cd C:\Users\xxxx\Desktop\umamusume-auto-train` specifically, if you cloned the repo using Github Desktop into your Desktop folder.

Install requirements of the bot using `py -m pip install -r requirements.txt`, if everything was done correctly, it should install the packages.

Alternative commands: `python -m pip install -r requirements.txt`, `python.exe -m pip install -r requirements.txt`

Then in the same folder, type `py main.py` and the bot should start the server. Read the output of the bot. It should print out version, hotkey for starting stopping and the http address for web UI.

If you don't understand any part of this, a bit of googling might help (like how to use powershell in windows or the terminal in linux / mac), the rest should be easy to do.

If you want to change configs etc, go to your browser and type "http://127.0.0.1:8000" then press enter and it should open the configuration web page if the bot is running.

For anything that's giving you trouble, ask on Discord, I'm usually active there.

If you like what I do, consider supporting me :)

<a href="https://www.buymeacoffee.com/CrazyIvanTR" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

PS: Haru would be proud.
