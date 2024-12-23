## SteamLike HUD - a HUD modification for PLAY-CS

**WARNING: This project is currently a work in progress. Expect issues.**

<details>
  <summary>Screenshots</summary>

![image](https://github.com/user-attachments/assets/a6a101c4-fd0d-4569-86bf-7d5cdefad3f2)
*Loading screen*

![image](https://github.com/user-attachments/assets/9cc9c2a3-c2cf-4fc5-883f-1e27a49cdd39)
*In-game*

![image](https://github.com/user-attachments/assets/7d2f9586-70ed-4d95-a0c8-3463ec84e0a2)
*Spectator UI*

</details>



## Install Instructions
*These are temporary while this isn't turned into a standalone extension*
1. Get the Resource Override extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/resource-override/pkoacgokdfckfpndoffpifphamojphii?hl=en)
2. Click in any of the places marked below to get to the Resource Override options:
   ![image](https://github.com/user-attachments/assets/6486de51-bd86-49dd-a980-006eab35fefd)
   
   *This should redirect you to a new tab with the main page for Resource Override*
3. Click the "Add tab group" button. This step and the following one are optional if you already use this extension with PLAY-CS.
4. In the "Tab URL" textbox, paste the following:  https://game.play-cs.com/*
5. Now that you have a tab group, click "Add Rule" next to the textbox, and click Inject File. Do this twice for the 2 files you are going to copy in the next steps.
6. Change the dropdown that says "Inject into" to **Body**, and change one of the "File Type" dropdowns to CSS (by default, they'll be JS).
7. Give a name for each for easy recognition. I'd do "SteamLike-HUD JS" and "SteamLike-HUD CSS" for each file type.
8. Hit edit file on one of them. Take note of the File Type that is being used.
9. Copy all of the contents from the following pages according to the file type you selected earlier: [CSS](https://raw.githubusercontent.com/kfh83/SteamLike-HUD/refs/heads/main/CSS/SteamLike-HUD.css) [JS](https://raw.githubusercontent.com/kfh83/SteamLike-HUD/refs/heads/main/JS/SteamLike-HUD.js)
10. After you're done with one file, hit "Save & Close" at the bottom right corner of the editor, and move onto the next file
11. Once you're done, you can try out the changes in-game!

![image](https://github.com/user-attachments/assets/5a638887-98c4-4bc9-983d-b8c687b6fb59)

*Resulting tab rules*




## Q & A
**What is this?**

These are JS/CSS files that allow for a more vanilla-like interface in PLAY-CS.

**Does this provide any competitive advantages?**

Not at all. If anything, this may have disadvantages (missing top-bound player count, etc), so this is pretty much up to you to use.

**Am i going to get banned if i get caught using this?**

Nope. In fact, the game creator nosferati has actually approved the use of such modifications, as long as they don't provide an advantage:
![image](https://github.com/user-attachments/assets/ca40a836-1247-4d65-878d-7ee5c8e60612)

**X HUD element is a few pixels off/doesn't look accurate!**

Again, this project is still very much a work in progress, and many things might be unfinished/unthemed. As for certain elements being a bit off, there is a certain amount personal takes and artistic liberties at play here so do keep that in mind, however if you can contribute with more accurate renditions, i'll be glad to review and accept.

**Where is my C4 timer???**

Disabled in the meantime that i don't figure out a way to style it faithfully to the rest of the UI. You can reenable it by removing the following bit of code from the CSS:
```css
	/* remove */
	.hud-bomb-planted{
		display: none !important;
	}
```

**Why is the code so ugly?**

Firstly, this is my first project with CSS/JS and my experience is at most of a few weeks in each. I'm also working on a cleanup of both files (JS is mostly cleaned up). Again, if you wish to contribute in the cause, PRs are open!

## Credits
@kfh83 - Project creator

@Azametzin - MAJOR help (especially with the JS side of things)

nosferati (no GitHub) - Base game functions, letting this whole project happen

Valve - Original assets used in Counter-Strike
