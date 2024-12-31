// SteamLike HUD : by KfH-- and Henri (hen.fs), parts of code by nosferati (author of PLAY-CS)
// Last updated: 31/12/2024

// TO DO: de-jQuerify the living hell out of this codebase

// options

var net_graph = 1;      // Enables net_graph. NOTICE: the "in", "out", "loss" and "choke" values are purely cosmetic, They don't mean anything. The only real values are the FPS and ping.
var net_graphpos = 2;   // Sets the position of the net graph. 1 = Right, 2 = Center, 3 = Left

// password screen
const pWordScreen = document.querySelector('#server_full'); // AFAIK #server_full2 are the ACTUAL server full/kick screens
const pWordField = document.querySelector("#f-code");    // self explanatory. Password input field
if(pWordScreen && pWordField){    // need to check otherwise the script bombs later on...
    pWordField.type = 'password';    // this is normally hidden, and the game uses the 4 block style input field. This unhides it.
    const pwLabel = document.createElement('label'); pwLabel.classList.add('password-label'); pwLabel.innerText = 'Password';   // "Password" label next to password field
    pWordScreen.appendChild(pwLabel);
}

const buttonHost = document.createElement('div'); buttonHost.classList.add('loading-buttons'); pWordScreen.appendChild(buttonHost);
    const exitButton = document.createElement('a'); exitButton.classList.add('lobby-button'); buttonHost.appendChild(exitButton); exitButton.innerText = 'Cancel'; // i already did cancelButton... oops !
        exitButton.setAttribute('href', '//play-cs.com');   // back to server list
    const connectButton = document.createElement('a'); connectButton.classList.add('connect-button'); buttonHost.appendChild(connectButton); connectButton.innerText = 'Connect';
        connectButton.setAttribute('href', 'javascript:void(0);');
        connectButton.setAttribute('onclick', 'if (!window.__cfRLUnblockHandlers) return false; document.getElementById(\'form-code\').submit(); return false;');   // pretty much entirely copied from the original button, just submits the form

// win text

document.querySelector(".hud-win-image-tr").remove();   // remove existing tr/ct win images...
document.querySelector(".hud-win-image-ct").remove();

const hudWin = document.querySelector(".hud-win-image");    // element used to host the above images

const trElement = document.createElement("div");    // ... so we can then create our own elements using the same class names!
trElement.classList.add("hud-win-image-tr");
trElement.innerText = "Terrorists Win!";
trElement.style.display = "none";
hudWin.appendChild(trElement);

const ctElement = document.createElement("div");
ctElement.classList.add("hud-win-image-ct");
ctElement.innerText = "Counter-Terrorists Win!";
ctElement.style.display = "none";
hudWin.appendChild(ctElement);


// tab -- i wish to redo the game tab entirely in JS so i don't have to rely in the stupid and ugly hacks following:
// 30/12 -- REJOICE! game tab is entirely redone. TO DO: remove this crap

const ctScore = document.querySelector(".hud-scoreboard .scoreboard-hud-ct-head tr th:first-child");
ctScore.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace('CT', '');  // cuts off the "CT " part of the score text, so it's just the score number.
    }
});

const trScore = document.querySelector(".hud-scoreboard .scoreboard-hud-tr-head tr th:first-child");
trScore.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace('TR', '');  // cuts off the "TR " part of the score text, so it's just the score number.
    }
});

ctScore.colSpan = 1; // make the real CT score colspan 1 instead of 3
trScore.colSpan = 1; // same as above, for TR

// ugly, terrible. Sadly as of today (19/12), i have no idea how to properly check for team scores in game time.

setInterval(() => {
    document.querySelector(".hud-scoreboard .scoreboard-hud-tr-head tr th:nth-child(2)").innerText = document.querySelector(".hud-scoreboard .scoreboard-hud-tr-head tr th:first-child").innerText;
    document.querySelector(".hud-scoreboard .scoreboard-hud-ct-head tr th:nth-child(2)").innerText = document.querySelector(".hud-scoreboard .scoreboard-hud-ct-head tr th:first-child").innerText;
}, 500);


// server name instead of player header

const servernameFake = document.querySelector(".scoreboard-hud-common-head tr th:nth-child(2)"); // lvl
const serverNameOriginal = document.querySelector(".server_name");

servernameFake.innerText = serverNameOriginal.innerText;


// loading screen cancel button

const cancelButton = document.createElement("a");
cancelButton.href = "https://play-cs.com/";
cancelButton.classList.add("loading-cancel-button");
cancelButton.innerText = "Cancel";
document.querySelector(".loading-main").insertBefore(cancelButton, document.querySelector(".loading_control_block"));




// variables used later on in game functionality.

// timer stuff, do not touch this
let timerColorTimeout = null;
let timerColorInterval = null;
let timer_secCopy = 0;

// spritesheet maps - basically map a value to a position in the spritesheet

// number positions
const mapNumbersPosition = {
    val0: '-0px 0px',
    val1: '-24px 0px',
    val2: '-46px  0px',
    val3: '-69px 0px',
    val4: '-94px 0px',
    val5: '-118px 0px',
    val6: '-143px 0px',
    val7: '-168px 0px',
    val8: '-191px 0px',
    val9: '-215px 0px',
};

// Used to determine ammo type. Uses weapon IDs matched to caliber, to then set the spritesheet positions accordingly. 

const mapAmmo = {
    ammo9mm: {
        backgroundPosition: "-48px -72px",
        ids: [10, 17, 19, 23]
    },
    ammo45: {
        backgroundPosition: "-96px -72px",
        ids: [7, 12, 16]
    },
    ammo50: {
        backgroundPosition: "-24px -72px",
        ids: [26]
    },
    ammo12g: {
        backgroundPosition: "0px -72px",
        ids: [5, 21]
    },
    ammo556: {
        backgroundPosition: "0px -96px",
        ids: [8, 13, 14, 15, 20, 22, 27]
    },
    ammo762: {
        backgroundPosition: "-72px -72px",
        ids: [3, 24, 28]
    },
    ammo57: {
        backgroundPosition: "-120px -96px",
        ids: [11, 30]
    },
    ammo338: {
        backgroundPosition: "-24px -96px",
        ids: [18]
    },
    ammo357: {
        backgroundPosition: "-120px -72px",
        ids: [1]
    },
    
    ammosmoke: {
        backgroundPosition: "-144px -96px",
        ids: [9]
    },
    
    ammoflashbang: {
        backgroundPosition: "-48px -96px",
        ids: [25]
    },
    ammohe: {
        backgroundPosition: "-72px -96px",
        ids: [4]
    },
    ammoc4: {
        backgroundPosition: "-96px -96px",
        ids: [6]
    }
    
};

// creation of new elements

// spectator elements n such

const classicSpectatorTopBar = document.createElement('div'); classicSpectatorTopBar.classList.add('hud-spec-top-bar');
    const specOrangeBox = document.createElement('div'); specOrangeBox.classList.add('hud-spec-orangebox-banner');
    const bannerImg = document.createElement('img'); bannerImg.classList.add('hud-spec-banner-image'); specOrangeBox.appendChild(bannerImg);
    classicSpectatorTopBar.appendChild(specOrangeBox);
    
    bannerImg.src = "https://github.com/kfh83/SteamLike-HUD/blob/main/Assets/orangebox-banner.png?raw=true"
    
    const specDetails = document.createElement('div'); specDetails.classList.add('hud-spec-details'); classicSpectatorTopBar.appendChild(specDetails);
        const specLeftSide = document.createElement('div'); specLeftSide.classList.add('hud-spec-left-side'); specDetails.appendChild(specLeftSide);
            const specTeamVictories = document.createElement('div'); specTeamVictories.classList.add('hud-spec-team-wins');  specLeftSide.appendChild(specTeamVictories);
                const specCtWin = document.createElement('div'); specCtWin.classList.add('hud-spec-ct-win'); specTeamVictories.appendChild(specCtWin);
                const specTWin = document.createElement('div'); specTWin.classList.add('hud-spec-t-win'); specTeamVictories.appendChild(specTWin);
            
        const specDetailsSeparator = document.createElement('div'); specDetailsSeparator.classList.add('hud-spec-separator'); specDetails.appendChild(specDetailsSeparator);
        
        const specRightSide = document.createElement('div'); specRightSide.classList.add('hud-spec-right-side'); specDetails.appendChild(specRightSide);
            const specMapName = document.createElement('div'); specMapName.classList.add('hud-spec-map-name'); specRightSide.appendChild(specMapName);
            const specTimeHost = document.createElement('div'); specTimeHost.classList.add('hud-spec-time-host'); specRightSide.appendChild(specTimeHost);
                const specTimeIcon = document.createElement('div'); specTimeIcon.classList.add('hud-spec-time-icon'); specTimeHost.appendChild(specTimeIcon);
                const specTime = document.createElement('div'); specTime.classList.add('hud-spec-time'); specTimeHost.appendChild(specTime);  
                
        specCtWin.innerText = 'Counter-Terrorists : ' + ctScore;
        specTWin.innerText = 'Terrorists : ' + trScore;
        
        setInterval(() => {
            specCtWin.innerText = 'Counter-Terrorists : ' + ctScore.innerText;
            specTWin.innerText = 'Terrorists : ' + trScore.innerText;
        }, 500);
    
const classicSpectatorBottomBar = document.createElement('div'); classicSpectatorBottomBar.classList.add('hud-spec-bottom-bar');
    const specName = document.createElement('div'); specName.classList.add('hud-spec-nickname'); classicSpectatorBottomBar.appendChild(specName); 
    
document.querySelector(".hud-container").appendChild(classicSpectatorTopBar);
document.querySelector(".hud-container").appendChild(classicSpectatorBottomBar);

// health indicator - elements

const classicHealthIndicatorHost = document.createElement("div"); classicHealthIndicatorHost.classList.add("classic-health-indicator"); document.querySelector(".hud-container").appendChild(classicHealthIndicatorHost);
    const hudHealthIcon = document.createElement("div"); hudHealthIcon.classList.add("hud-health-icon"); classicHealthIndicatorHost.appendChild(hudHealthIcon);
    const hudHealth1 = document.createElement("div"); hudHealth1.classList.add("hud-health1"); classicHealthIndicatorHost.appendChild(hudHealth1);
    const hudHealth2 = document.createElement("div"); hudHealth2.classList.add("hud-health2"); classicHealthIndicatorHost.appendChild(hudHealth2);
    const hudHealth3 = document.createElement("div"); hudHealth3.classList.add("hud-health3"); classicHealthIndicatorHost.appendChild(hudHealth3);
    
    const healthElements = [hudHealth1, hudHealth2, hudHealth3]; 
    
// armor indicator - elements

const classicArmorIndicatorHost = document.createElement("div"); classicArmorIndicatorHost.classList.add("classic-armor-indicator"); document.querySelector(".hud-container").appendChild(classicArmorIndicatorHost);
    const hudArmorIcon = document.createElement("div"); hudArmorIcon.classList.add("hud-armor-icon"); classicArmorIndicatorHost.appendChild(hudArmorIcon);
    const hudArmor1 = document.createElement("div"); hudArmor1.classList.add("hud-armor1"); classicArmorIndicatorHost.appendChild(hudArmor1);
    const hudArmor2 = document.createElement("div"); hudArmor2.classList.add("hud-armor2"); classicArmorIndicatorHost.appendChild(hudArmor2);
    const hudArmor3 = document.createElement("div"); hudArmor3.classList.add("hud-armor3"); classicArmorIndicatorHost.appendChild(hudArmor3);
    
    const armorElements = [hudArmor1, hudArmor2, hudArmor3]; 

// money indicator - elements

const classicMoneyIndicatorHost = document.createElement("div"); classicMoneyIndicatorHost.classList.add("classic-money-indicator"); document.querySelector(".hud-container").appendChild(classicMoneyIndicatorHost);
    const hudMoneyIcon = document.createElement("div"); hudMoneyIcon.classList.add("hud-money-icon"); classicMoneyIndicatorHost.appendChild(hudMoneyIcon);
    const hudMoney1 = document.createElement("div"); hudMoney1.classList.add("hud-money1"); classicMoneyIndicatorHost.appendChild(hudMoney1);
    const hudMoney2 = document.createElement("div"); hudMoney2.classList.add("hud-money2"); classicMoneyIndicatorHost.appendChild(hudMoney2);
    const hudMoney3 = document.createElement("div"); hudMoney3.classList.add("hud-money3"); classicMoneyIndicatorHost.appendChild(hudMoney3);
    const hudMoney4 = document.createElement("div"); hudMoney4.classList.add("hud-money4"); classicMoneyIndicatorHost.appendChild(hudMoney4);
    const hudMoney5 = document.createElement("div"); hudMoney5.classList.add("hud-money5"); classicMoneyIndicatorHost.appendChild(hudMoney5);
    
    const moneyElements = [hudMoney1, hudMoney2, hudMoney3, hudMoney4, hudMoney5];   

// time indicator - elements

const classicTimeIndicatorHost = document.createElement("div"); classicTimeIndicatorHost.classList.add("classic-time-indicator"); document.querySelector(".hud-container").appendChild(classicTimeIndicatorHost);
    const hudTimeIcon = document.createElement("div"); hudTimeIcon.classList.add("hud-time-icon"); classicTimeIndicatorHost.appendChild(hudTimeIcon);
    const hudTime1 = document.createElement("div"); hudTime1.classList.add("hud-time1"); classicTimeIndicatorHost.appendChild(hudTime1);
    const hudTime2 = document.createElement("div"); hudTime2.classList.add("hud-time2"); classicTimeIndicatorHost.appendChild(hudTime2);    
    const hudTimeSeparator = document.createElement("div"); hudTimeSeparator.classList.add("hud-time-separator"); classicTimeIndicatorHost.appendChild(hudTimeSeparator);
    const hudTime3 = document.createElement("div"); hudTime3.classList.add("hud-time3"); classicTimeIndicatorHost.appendChild(hudTime3); 
    const hudTime4 = document.createElement("div"); hudTime4.classList.add("hud-time4"); classicTimeIndicatorHost.appendChild(hudTime4);
    
    // this is kinda stupid but it's the ":" between minutes and seconds
    const TimeSeparatorTick1 = document.createElement("div"); TimeSeparatorTick1.classList.add("hud-time-separator-tick1"); hudTimeSeparator.appendChild(TimeSeparatorTick1); 
    const TimeSeparatorTick2 = document.createElement("div"); TimeSeparatorTick2.classList.add("hud-time-separator-tick2"); hudTimeSeparator.appendChild(TimeSeparatorTick2);   

    const secondElements = [hudTime3, hudTime4];
    const minuteElements = [hudTime1, hudTime2];

// ammo indicator - elements

const classicAmmoIndicatorHost = document.createElement("div"); classicAmmoIndicatorHost.classList.add("classic-ammo-indicator"); document.querySelector(".hud-container").appendChild(classicAmmoIndicatorHost);
    const hudAmmo1 = document.createElement("div"); hudAmmo1.classList.add("hud-ammo1"); classicAmmoIndicatorHost.appendChild(hudAmmo1);
    const hudAmmo2 = document.createElement("div"); hudAmmo2.classList.add("hud-ammo2"); classicAmmoIndicatorHost.appendChild(hudAmmo2);
    const hudAmmo3 = document.createElement("div"); hudAmmo3.classList.add("hud-ammo3"); classicAmmoIndicatorHost.appendChild(hudAmmo3); 
    const hudAmmoSeparator = document.createElement("div"); hudAmmoSeparator.classList.add("hud-ammo-separator"); classicAmmoIndicatorHost.appendChild(hudAmmoSeparator); // "|"
    const hudAmmo4 = document.createElement("div"); hudAmmo4.classList.add("hud-ammo4"); classicAmmoIndicatorHost.appendChild(hudAmmo4);
    const hudAmmo5 = document.createElement("div"); hudAmmo5.classList.add("hud-ammo5"); classicAmmoIndicatorHost.appendChild(hudAmmo5);
    const hudAmmo6 = document.createElement("div"); hudAmmo6.classList.add("hud-ammo6"); classicAmmoIndicatorHost.appendChild(hudAmmo6);
    const hudAmmoIcon = document.createElement("div"); hudAmmoIcon.classList.add("hud-ammo-icon"); classicAmmoIndicatorHost.appendChild(hudAmmoIcon);
    
    const clipElements = [hudAmmo1, hudAmmo2, hudAmmo3];
    const reserveElements = [hudAmmo4, hudAmmo5, hudAmmo6];

// money diff - elements

const moneyDiffHost = document.createElement('div'); moneyDiffHost.classList.add('money-diff'); document.querySelector(".hud-container").appendChild(moneyDiffHost); 
        
const moneyPlusHost = document.createElement('div'); moneyPlusHost.classList.add('money_plus'); moneyPlusHost.classList.add('hud-fadeout');
    const moneyPlusIcon = document.createElement('div'); moneyPlusIcon.classList.add('hud-money-plus-icon'); moneyPlusHost.appendChild(moneyPlusIcon);
    const moneyPlus1 = document.createElement('div'); moneyPlus1.classList.add('hud-money-plus-1'); moneyPlusHost.appendChild(moneyPlus1);
    const moneyPlus2 = document.createElement('div'); moneyPlus2.classList.add('hud-money-plus-2'); moneyPlusHost.appendChild(moneyPlus2);
    const moneyPlus3 = document.createElement('div'); moneyPlus3.classList.add('hud-money-plus-3'); moneyPlusHost.appendChild(moneyPlus3);
    const moneyPlus4 = document.createElement('div'); moneyPlus4.classList.add('hud-money-plus-4'); moneyPlusHost.appendChild(moneyPlus4);
    const moneyPlus5 = document.createElement('div'); moneyPlus5.classList.add('hud-money-plus-5'); moneyPlusHost.appendChild(moneyPlus5);
    
    const plusElements = [moneyPlus1, moneyPlus2, moneyPlus3, moneyPlus4, moneyPlus5];
            
const moneyMinusHost = document.createElement('div'); moneyMinusHost.classList.add('money_minus'); moneyMinusHost.classList.add('hud-fadeout');
    const moneyMinusIcon = document.createElement('div'); moneyMinusIcon.classList.add('hud-money-minus-icon'); moneyMinusHost.appendChild(moneyMinusIcon);
    const moneyMinus1 = document.createElement('div'); moneyMinus1.classList.add('hud-money-minus-1'); moneyMinusHost.appendChild(moneyMinus1);
    const moneyMinus2 = document.createElement('div'); moneyMinus2.classList.add('hud-money-minus-2'); moneyMinusHost.appendChild(moneyMinus2);
    const moneyMinus3 = document.createElement('div'); moneyMinus3.classList.add('hud-money-minus-3'); moneyMinusHost.appendChild(moneyMinus3);
    const moneyMinus4 = document.createElement('div'); moneyMinus4.classList.add('hud-money-minus-4'); moneyMinusHost.appendChild(moneyMinus4);
    const moneyMinus5 = document.createElement('div'); moneyMinus5.classList.add('hud-money-minus-5'); moneyMinusHost.appendChild(moneyMinus5);
    
    const minusElements = [moneyMinus1, moneyMinus2, moneyMinus3, moneyMinus4, moneyMinus5];
    
// net graph - elements    
    
const netGraphHost = document.createElement('div'); netGraphHost.classList.add('hud-net-graph'); document.querySelector("body").appendChild(netGraphHost);
    const netGraphFPS = document.createElement('div'); netGraphFPS.classList.add('hud-net-graph-fps'); netGraphHost.appendChild(netGraphFPS);
    const netGraphPing = document.createElement('div'); netGraphPing.classList.add('hud-net-graph-ping'); netGraphHost.appendChild(netGraphPing);
    const netGraphIn = document.createElement('div'); netGraphIn.classList.add('hud-net-graph-in'); netGraphHost.appendChild(netGraphIn);
    const netGraphOut = document.createElement('div'); netGraphOut.classList.add('hud-net-graph-out'); netGraphHost.appendChild(netGraphOut);
    const netGraphLossChoke = document.createElement('div'); netGraphLossChoke.classList.add('hud-net-graph-choke'); netGraphHost.appendChild(netGraphLossChoke);
    

    function netGraphUpdate(){      // to do: check chat message for ;net_graph or ;net_graphpos
        if (net_graph == 1){    // net_graph enabled
            netGraphHost.style.display = 'flex';
            switch(net_graphpos) {
                case 1:     // right-aligned
                    netGraphHost.style.marginLeft = 'auto';
                    netGraphHost.style.marginRight = '5px';
                    break;
                case 2:     // center-aligned
                    netGraphHost.style.marginLeft = 'auto';
                    netGraphHost.style.marginRight = 'auto';
                    break;
                case 3:     // left-aligned
                    netGraphHost.style.marginLeft = '5px';
                    netGraphHost.style.marginRight = 'auto';
                    break;
                default:    // default: right-aligned
                    netGraphHost.style.marginLeft = 'auto';
                    netGraphHost.style.marginRight = '5px';
                    break;
            }
            
        } else {
            netGraphHost.style.display = 'none';
        }
    }
    
    netGraphUpdate();   // check to do on netGraphUpdate.
    
    netGraphLossChoke.innerText = 'loss: 0 choke: 0';   // Might aswell keep them at 0... no way to check for this.
    
const hudMessageInput = document.querySelector('.hud-message-input');
const hudMessages = document.querySelector('.hud-chat-messages');
const hudDeath = document.querySelector('.hud-deaths');
const hudServerMessage = document.querySelector('.hud-server-message');
const hudStatusBar = document.querySelector('.hud-statusbar');
const hudC4Message = document.querySelector('.hud-message');

// SCOREBOARD - 30/12
// TO DO: profile pictures

const hudContainer = document.querySelector(".hud-container");  // HUD elements container

const scoreboardHost = document.createElement('div'); scoreboardHost.classList.add('hud-classic-scoreboard'); hudContainer.appendChild(scoreboardHost);                 // actual tab container
    const topHeader = document.createElement('div'); topHeader.classList.add('hud-scoreboard-top-header'); scoreboardHost.appendChild(topHeader);                       // generic headers container
        const serverName = document.createElement('div'); serverName.classList.add('hud-scoreboard-server-name'); topHeader.appendChild(serverName);                    // server name (left bound)
            serverName.innerText = serverNameOriginal.innerText;    // defined in main JS
        const scoreHeader = document.createElement('div'); scoreHeader.classList.add('hud-scoreboard-scores'); topHeader.appendChild(scoreHeader);                      // "score" header (right bound)
            scoreHeader.innerText = 'Score';
        const deathHeader = document.createElement('div'); deathHeader.classList.add('hud-scoreboard-deaths'); topHeader.appendChild(deathHeader);                      // "deaths" header (right bound)
            deathHeader.innerText = 'Deaths';
        const latencyHeader = document.createElement('div'); latencyHeader.classList.add('hud-scoreboard-latency'); topHeader.appendChild(latencyHeader);               // "latency" header (right bound)
            latencyHeader.innerText = 'Latency';
    const counterHeader = document.createElement('div'); counterHeader.classList.add('hud-scoreboard-ct-header'); scoreboardHost.appendChild(counterHeader);            // Counter-Terrorists header container
        const ctPlayerCount = document.createElement('div'); ctPlayerCount.classList.add('hud-scoreboard-ct-count'); counterHeader.appendChild(ctPlayerCount);          // "Counter-Terrorists  -   X players"
            ctPlayerCount.textContent = 'Counter-Terrorists\u00A0\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0\u00A0';      // gets switched out later, this is just a placeholder
        const ctRoundScore = document.createElement('div'); ctRoundScore.classList.add('hud-scoreboard-ct-score'); counterHeader.appendChild(ctRoundScore);             // Counter-Terrorists win count
            ctRoundScore.innerText = '-';                                                                           // gets switched out later, this is just a placeholder
        const ctLatencies = document.createElement('div'); ctLatencies.classList.add('hud-scoreboard-ct-latency'); counterHeader.appendChild(ctLatencies);              // latency average on Counter-Terrorist team
            ctLatencies.innerText = '-';                                                                            // gets switched out later, this is just a placeholder
    
    const counterPlayers = document.createElement('div'); counterPlayers.classList.add('hud-scoreboard-ct-players'); scoreboardHost.appendChild(counterPlayers);        // Counter-Terrorists player container

    const terroristHeader = document.createElement('div'); terroristHeader.classList.add('hud-scoreboard-tr-header'); scoreboardHost.appendChild(terroristHeader);      // Terrorists header container
        const trPlayerCount = document.createElement('div'); trPlayerCount.classList.add('hud-scoreboard-tr-count'); terroristHeader.appendChild(trPlayerCount);        // "Terrorists  -   X players"
            trPlayerCount.textContent = 'Terrorists\u00A0\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0\u00A0';              // gets switched out later, this is just a placeholder
        const trRoundScore = document.createElement('div'); trRoundScore.classList.add('hud-scoreboard-tr-score'); terroristHeader.appendChild(trRoundScore);           // Terrorists win count
            trRoundScore.innerText = '-';                                                                           // gets switched out later, this is just a placeholder
        const trLatencies = document.createElement('div'); trLatencies.classList.add('hud-scoreboard-tr-latency'); terroristHeader.appendChild(trLatencies);            // latency average on Terrorists team
            trLatencies.innerText = '-';                                                                            // gets switched out later, this is just a placeholder
    
    const terroristPlayers = document.createElement('div'); terroristPlayers.classList.add('hud-scoreboard-tr-players'); scoreboardHost.appendChild(terroristPlayers);  // Terrorists player container
    

// partial rewrite of updateScoreBoard

function refreshScoreboard(){
    
    counterPlayers.innerHTML = '';      // done in similar fashion to the original function, except with pure JS
    terroristPlayers.innerHTML = '';    // this clears out the terrorist/counter-terrorist player list prior to anything. This is kinda hacky
    
    var players = [];   // presumably gets filled up later with the each statement
    
    var skill_total = {     // this is the actual sum of the skill in each team
        1: 0,   // tr skill total
        2: 0    // ct skill total
    };
    
    const players_total = {   // number of players in each team
        1: 0,   // tr count
        2: 0    // ct count
    };
    
    var latency_total = {   // latency total in each team
        1: 0,   // tr latencies
        2: 0    // ct latencies
    };
    
    
    Object.entries(g_PlayerExtraInfo).forEach(([id, player]) => {
        if (typeof(g_TeamInfo[player.id]) !== 'undefined') { 
            players.push({
                id: id,
                frags: player.frags * 1         // why is it being multiplied by 1
            });
        }
    });
    
    players.sort( function compare( a, b ) {    // sorting the array by frags. Formerly "rank" but that name coincides with actual player rank.
        if ( a.frags > b.frags ){               // btw this function is horrible but i didn't make it LOL!
            return -1;
        }
        if ( a.frags < b.frags ){
            return 1;
        }
        return 0;
    });
    
    const clanTags = [
        {tag: '[inf]', image: 'https://github.com/kfh83/SteamLike-HUD/blob/main/UserPictures/iNF.png?raw=true'},
        {tag: '[air]', image: 'https://github.com/kfh83/SteamLike-HUD/blob/main/UserPictures/AIR.png?raw=true'},
        {tag: '[phx]', image: 'https://github.com/kfh83/SteamLike-HUD/blob/main/UserPictures/PhX.png?raw=true'},
        {tag: '[lag]', image: 'https://github.com/kfh83/SteamLike-HUD/blob/main/UserPictures/LAG.png?raw=true'},
        {tag: '[afk]', image: 'https://github.com/kfh83/SteamLike-HUD/blob/main/UserPictures/AFK.png?raw=true'},
        {tag: 'ob$cur0', image: 'https://github.com/kfh83/SteamLike-HUD/blob/main/UserPictures/OB$.png?raw=true'},
    ]

    
    // memberInfo.name = player name
    // memberInfo.status = dead/bomb/vip?
    // memberInfo.frags = player score
    // memberInfo.deaths = player deaths
    // memberInfo.ping = player latency
    
    const regex = /^Player \d+$/; // this is needed so we can label players as nosteam (no profile image whatsoever)

    
    players.forEach(function(player, index){   // original had a "dummy" argument, which is the index
        var style="background: none;";   // sets inline styles on the td of the player, however we aren't using tables. Will see what to do about this
        var id = player.id; // the id of the player passed through the function
        var memberInfo = g_PlayerExtraInfo[id]; // see comments before this statement
        const lowercasedName = memberInfo.name.toLowerCase();
        
        if (memberInfo.teamnumber !== "undefined" && memberInfo.skill != '-') {     // if member is in a team and their skill is properly defined (takes a while for this to be defined)
            skill_total[memberInfo.teamnumber] += memberInfo.skill;     // adds this member's skill to the skill_total of their team
            players_total[memberInfo.teamnumber]++;     // ups the counts of players in member's team
            latency_total[memberInfo.teamnumber] += Number(memberInfo.ping);    // adds this member's latency to the latency_total of their team. Needs to be converted to a number in this case because its a string in nature
        }
        
        if(!memberInfo.name){   // if the member has no name
            return;     // ... goodbye?
        }
        
        if (id == CS_ENV.myXashId) { // if the id matches with your own id...
            style = 'background: rgba(255, 255, 255, 0.1);';
        }
        
        // for each, we are going to append a player...
        
        const playerHost = document.createElement('div'); playerHost.classList.add('hud-scoreboard-player');    // this is done here because of interference when done outside w/ a cloned node
            const playerPictureHost = document.createElement('div'); playerPictureHost.classList.add('hud-scoreboard-player-pfpcontainer'); playerHost.appendChild(playerPictureHost);
                const playerPicture = document.createElement('img'); playerPicture.classList.add('hud-scoreboard-player-pfp'); playerPictureHost.appendChild(playerPicture);
            const playerName = document.createElement('div'); playerName.classList.add('hud-scoreboard-player-playername'); playerHost.appendChild(playerName);
            const playerIndicator = document.createElement('div'); playerIndicator.classList.add('hud-scoreboard-player-status'); playerHost.appendChild(playerIndicator);
            const playerScore = document.createElement('div'); playerScore.classList.add('hud-scoreboard-player-score'); playerHost.appendChild(playerScore);
            const playerDeath = document.createElement('div'); playerDeath.classList.add('hud-scoreboard-player-deaths'); playerHost.appendChild(playerDeath);
            const playerLatency = document.createElement('div'); playerLatency.classList.add('hud-scoreboard-player-latency'); playerHost.appendChild(playerLatency);
            
        
        // to do: comment this part
        
        if (window.innerWidth <= 640) {
            playerPictureHost.style.width = '21px';
            playerPictureHost.style.height = '20px';
        } else if (window.innerWidth <= 800) {
            playerPictureHost.style.width = '24px';
            playerPictureHost.style.height = '23px';
        } else if (window.innerWidth >= 1024) {
            playerPictureHost.style.width = '32px';
            playerPictureHost.style.height = '32px';
        }
        
        if (players.length > 10) {
            let excessPlayers = players.length - 10;
        
            let currentWidth = parseFloat(playerPictureHost.style.width);
            let currentHeight = parseFloat(playerPictureHost.style.height);
        
            for (let i = 0; i < excessPlayers; i++) {
                if (currentWidth > 15 && currentHeight > 14) {
                    currentWidth -= 1;
                    currentHeight -= 1;
                }
            }
            
            console.log(currentWidth);
        
            playerPictureHost.style.width = currentWidth + 'px';
            playerPictureHost.style.height = currentHeight + 'px';
        }
        
            
        playerPicture.src = 'https://github.com/kfh83/SteamLike-HUD/blob/main/UserPictures/noclan.png?raw=true';
        
        
        if (regex.test(memberInfo.name)) {
            playerPictureHost.removeChild(playerPicture);
        } else {
            for (const item of clanTags) {
                if (lowercasedName.includes(item.tag)) {
                    playerPicture.src = item.image;
                    break;
                }
            }
        }

        playerName.innerText = memberInfo.name;
        if(typeof memberInfo.status !== 'undefined'){
            playerIndicator.innerText = memberInfo.status;  // somehow you can get stuck between heaven and hell in counter strike and be undefined
        }
        playerScore.innerText = memberInfo.frags;
        playerDeath.innerText = memberInfo.deaths;
        playerLatency.innerText = memberInfo.ping;
        
        playerHost.setAttribute('style', style);    // could definitely be done better, i'm just following kinda what the original code did here
        
        if(memberInfo.teamnumber == 1){
            playerHost.classList.add('tr-color');   // might aswell just use the classes provided by existing code
            terroristPlayers.appendChild(playerHost);
        } else if(memberInfo.teamnumber == 2){
            playerHost.classList.add('ct-color');
            counterPlayers.appendChild(playerHost);
        }
        
        
        let totalMargin = playerPictureHost.offsetWidth + 16;   // playerpicturehost + 14px margin on the player + 2px of margin on the player name from the user picture
        
        if(totalMargin != 16){  // mitigate it being weird everytime you press tab
            ctPlayerCount.style.marginLeft = `${totalMargin}px`;
            trPlayerCount.style.marginLeft = `${totalMargin}px`;
        }
    });
    
    trPlayerCount.textContent = 'Terrorists\u00A0\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0\u00A0' + players_total[1] + ' players';
    ctPlayerCount.textContent = 'Counter-Terrorists\u00A0\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0\u00A0' + players_total[2] + ' players';
    
    ctRoundScore.innerText = ctScore.innerText;     // defined in main JS
    trRoundScore.innerText = trScore.innerText;     // defined in main JS
    
    let ctLatencyAverage = Math.round(latency_total[2] / players_total[2]);
    let trLatencyAverage = Math.round(latency_total[1] / players_total[1]);
    
    if(!Number.isNaN(ctLatencyAverage)){
        ctLatencies.innerText = ctLatencyAverage;
    }
    
    if(!Number.isNaN(trLatencyAverage)){
        trLatencies.innerText = trLatencyAverage;
    }

    

}


let intervalId = null;
intervalId = setInterval(() => {    // until i find a game func thats suitable to replace this we are going to update every 350ms (very bad for performance)
    refreshScoreboard();
}, 350); 

function toggleDisplayOnTab(event) {
    if (event.key === "Tab") {
        if (event.type === 'keydown') {
            scoreboardHost.style.display = 'flex';
        } else if (event.type === 'keyup') {
            scoreboardHost.style.display = 'none';
        }
    }
}

document.addEventListener('keydown', toggleDisplayOnTab);
document.addEventListener('keyup', toggleDisplayOnTab);


// elements that use the same font style, queued up to have their styles changed
const fontUpdateElements = [
    netGraphHost,
    scoreboardHost,
    ctElement,
    trElement,
    classicSpectatorTopBar,
    classicSpectatorBottomBar,
    hudMessageInput,
    hudMessages,
    hudDeath,
    hudServerMessage,
    hudStatusBar,
    hudC4Message
];


// function overrides and game functionality

const checkClientModule = setInterval(() => {   // we are checking every second...
    if (Module) {   // ... if Module exists otherwise this is not gonna work at all.
        

        function updateNumberBackground(hudElements, clearZeros, splitNumber) {     // element list, whether to clear zeros or not (used in the seconds indicator), split string to be parsed
            hudElements.forEach((el, index) => {
                if(clearZeros){
                  el.style.background = "none";  // in-lined styles attribute overrides the one used in the CSS...
                }
                el.style.backgroundPosition = mapNumbersPosition['val0'];   // shitty fix to seconds not going down into the units (i.e if it was 5 seconds it would actually show as 15 seconds. Weird issue.)
            });

            splitNumber.forEach((value, index) => {
                const targetIndex = index + (hudElements.length - splitNumber.length); 
                if (hudElements[targetIndex]) {
                    hudElements[targetIndex].style.removeProperty("background");    // ... and then we gradually remove the inlined attribute set earlier. Background is set in the css so this has no effect unless clearZero is set to true.
                    hudElements[targetIndex].style.backgroundPosition = mapNumbersPosition['val' + value];  // self explanatory. Picks out X hudElement from the list, sets the background position according to the value passed + val
                }
            });
        }


        // Health value handling
        
        Module._MsgFunc_HealthJS = function(health) {
            var splitHealth = health.toString().split('');
            
            updateNumberBackground(healthElements, true, splitHealth);
            
            var currHealth = $(".hud-val", ".hud-health").text() * 1;
            //console.log(currHealth );
            if (currHealth === 0) {
                Module.setSpecMode(true);   // seems like the same thing a few lines down. I don't remember it having much effect...
            }
            
            var health_color;
            if (health <= 25){
                classicHealthIndicatorHost.classList.remove('hud-number-activity');         // hud-number-activity is the genering 'blinking' effect when a number changes. When you take damage, it'll appear.
                classicHealthIndicatorHost.style.filter = 'hue-rotate(310deg) saturate(2)'; // Turns the numbers from orange to red. This'll appear in a lot of other places.
            } else {
                classicHealthIndicatorHost.style.removeProperty('filter');
                classicHealthIndicatorHost.classList.remove('hud-number-activity');     // clear out previously added number activity...
                setTimeout(function(){
                        classicHealthIndicatorHost.classList.add('hud-number-activity');    // ... welcome back! This is so it can keep blinking everytime activity happens
                },0)
            }
            
            $(".hud-val", ".hud-health").text(health).css({
                color: health_color
            });
            if (health == 0) {
                Module.setSpecMode(true);   // weird game code. Does nothing.
            }
            
            clearInterval(checkClientModule);   // clears the interval in the "Module" check so we don't constantly do this forever and break things.
        }
        
        
        
        // roundtime handling   -   thanks a lot to Henri. No clue what the fuck is going on here.
        // A lot of game code here too so preferably don't touch this.
        
        Module._MsgFunc_RoundTimeJS = function (m_iTime, m_fStartTime, m_flTime) {
            //console.log("_MsgFunc_RoundTimeJS foi chamado");
            timer_sec = m_iTime + m_fStartTime - m_flTime;
            var seconds = timer_sec % 60;
            var minutes = Math.round(timer_sec - seconds) / 60;
            $(".hud-timer-text").text(minutes + ":" + (seconds > 9 ? "" : "0") + seconds);
            if(RoundTimeInter) clearInterval(RoundTimeInter);
            RoundTimeInter = setInterval(
                function() {
                    timer_sec--;
                    if(timer_sec < 0){
                        timer_sec = 0;
                    }
                    var seconds = timer_sec % 60;
                    var minutes = Math.round(timer_sec - seconds) / 60;
                    
                    var splitMinutes = minutes.toString().split('');
            
                    updateNumberBackground(minuteElements, true, splitMinutes);
                    
                    var splitSeconds = seconds.toString().split('');
                    
                    updateNumberBackground(secondElements, false, splitSeconds);
                    
                    specTime.innerText = minutes + ":" + (seconds > 9 ? "" : "0") + seconds;    // copied from above !!! LOL !!!
            
                },
                1000
            );
            
            timer_secCopy = timer_sec;
            
            if(timerColorInterval) clearInterval(timerColorInterval);
            
            timerColorInterval = setInterval(function(){timer_secCopy--;}, 1000);
            
            clearTimeout(timerColorTimeout);
            
            function timerColor(){
                if(timer_secCopy <= 30){
                    if(timer_secCopy > 0){
                        if (classicTimeIndicatorHost.style.filter){
                            classicTimeIndicatorHost.style.removeProperty("filter");
                        } else {
                            classicTimeIndicatorHost.style.filter = 'hue-rotate(310deg) saturate(2)';   
                        }
                        
                        timerColorTimeout = setTimeout(timerColor, checkTime());
                    } else {
                        classicTimeIndicatorHost.style.filter = 'hue-rotate(310deg) saturate(2)';
                    }
                } else {
                    classicTimeIndicatorHost.style.removeProperty("filter");
                    timerColorTimeout = setTimeout(timerColor, checkTime());
                }


            }
            
            // intervals for the blinking
            function checkTime(){
                if(timer_secCopy <= 2){
                    return 60;
                } else if(timer_secCopy <= 10){
                    return 200;
                } else if (timer_secCopy <= 20){
                    return 500;
                } else {
                    return 1000;
                }
            }
            
            timerColorTimeout = setTimeout(timerColor, checkTime());
            
            $(".hud-bomb-planted").hide();
            clearInterval(C4timer);
            Module.setSpecMode(false);
            var armor_type = $(".hud-armor .hud-val").text();
            if (armor_type == 0) {
                $(".hud-armor .hud-icon").text("a");    // why would this be in the timer func?
            }
            

        }
        
        // function handles differences in the money per round (when you buy/win).
        // This can probably be moved back into the main money func. TO DO.
            
        function moneyDiffHandler(diff){
            var splitDiff = diff.toString().split('');
            if (splitDiff[0] === '-') {     // if we get sent a - this interfers with string length and breaks number background setting
                splitDiff.shift();          // BOMBARD the minus signal.
            }

            if(diff != 0){  // this is redundant. So is this function... as you can see the logic is pretty much the same as the one below. 
                if(diff < 0 ){  // if the diff is negative (purchase)...
                        
                    updateNumberBackground(minusElements, true, splitDiff);
                    
                    // create a clone so we can stack costs/wins
                    const clonedMinusHost = moneyMinusHost.cloneNode(true);
                    moneyDiffHost.appendChild(clonedMinusHost);
                    setTimeout(function(){
                        clonedMinusHost.remove();
                    }, 5250) // after 5 n a quarter seconds, remove
                    
                } else {    // if the diff is positive (after round)...
                    updateNumberBackground(plusElements, true, splitDiff);
                    
                    // create a clone so we can stack costs/wins
                    const clonedPlusHost = moneyPlusHost.cloneNode(true);
                    moneyDiffHost.appendChild(clonedPlusHost);
                    setTimeout(function(){
                        clonedPlusHost.remove();
                    }, 5250) // after 5 n a quarter seconds, remove
                }
            } else {
                return; // adios if the diff is none
            }
        }
        
        // money values handling
        
        Module._MsgFunc_MoneyJS = function (m_iMoneyCount, m_iDelta) {
            $(".hud-money .hud-value").text(m_iMoneyCount);
            var diff = m_iMoneyCount - currentMoney;
            if (diff != 0) {        // diff needs to exist in order for things to happen
                if (diff > 0) {     // great, it exists! if money is gained...
                    moneyDiffHandler(diff);     // might move this back into this func sometime in the future.
                    classicMoneyIndicatorHost.classList.remove('hud-money-fadecolor-plus');         // remove any existing classes so the effect can continuously happen
                    classicMoneyIndicatorHost.classList.remove('hud-money-fadecolor-minus');
                    setTimeout(function(){
                        classicMoneyIndicatorHost.classList.add('hud-money-fadecolor-plus');        // quickly adds (and then removes) this class so the money indicator can turn GREEN after a round.
                    },0)
                }
                if (diff < 0) {     // if money is lost...
                    moneyDiffHandler(diff);     // might move this back into this func sometime in the future.
                    classicMoneyIndicatorHost.classList.remove('hud-money-fadecolor-minus')         // remove any existing classes so the effect can continuously happen
                    classicMoneyIndicatorHost.classList.remove('hud-money-fadecolor-plus');
                    setTimeout(function(){
                        classicMoneyIndicatorHost.classList.add('hud-money-fadecolor-minus');       // quickly adds (and then removes) this class so the money indicator can turn RED when a purchase happens.
                    },0)
                }

            }   
        
            currentMoney = m_iMoneyCount;
            var splitMoney = currentMoney.toString().split('');
                
            updateNumberBackground(moneyElements, true, splitMoney);
        }
        
        // armor % handling
                
        Module._MsgFunc_BatteryJS = function(val){
            var splitArmor = val.toString().split('');
            //console.log(splitMoney);
                
            updateNumberBackground(armorElements, true, splitArmor);
                
            classicArmorIndicatorHost.classList.remove('hud-number-activity');
            setTimeout(function(){
                    classicArmorIndicatorHost.classList.add('hud-number-activity');
            },0)
                
            if(val === 0){      // apparently there isn't an armor type for no armor... so it's safe to assume if armor is 0 we don't have armor
                hudArmorIcon.style.removeProperty("filter");    // in 1.6 the armor icon is brighter when there is armor. Remove this filter so it can be dim again.
                hudArmorIcon.style.removeProperty("background-position"); // we are out of armor !
            }
        }
        
        // armor type handling - for the armor icon
        
        Module._MsgFunc_ArmorTypeJS = function(val){
            if (val == 0) {             // armor, no helmet
                hudArmorIcon.style.backgroundPosition = '0px -25px';    // setting bg position... same deal as usual
                hudArmorIcon.style.filter = 'brightness(2)'             // in 1.6 the armor icon is brighter when there is armor.
            } else if (val == 1) {      // armor + helmet
                hudArmorIcon.style.backgroundPosition = '0px -124px';   // setting bg position... same deal as usual
                hudArmorIcon.style.filter = 'brightness(2)'             // in 1.6 the armor icon is brighter when there is armor.
            } 
        }
        
        // hide ui elements when in spec mode
        // this looks kinda ugly
        
        Module.setSpecMode = function(spec){
            $(".hud-statusbar").text('');
            if(spec){
                spectator = true;
                $(".hud-container").addClass("hud-spectator");
                classicHealthIndicatorHost.style.display = 'none';
                classicArmorIndicatorHost.style.display = 'none';
                classicTimeIndicatorHost.style.display = 'none';
                classicMoneyIndicatorHost.style.display = 'none';
                classicAmmoIndicatorHost.style.display = 'none';
                classicSpectatorTopBar.style.display = 'flex';
                classicSpectatorBottomBar.style.display = 'flex';
                moneyDiffHost.style.display = 'none';
            }else{
                spectator = false;
                $(".hud-container").removeClass("hud-spectator");
                classicHealthIndicatorHost.style.display = 'flex';
                classicArmorIndicatorHost.style.display = 'flex';
                classicTimeIndicatorHost.style.display = 'flex';
                classicMoneyIndicatorHost.style.display = 'flex';
                classicAmmoIndicatorHost.style.display = 'flex';
                classicSpectatorTopBar.style.display = 'none';
                classicSpectatorBottomBar.style.display = 'none';
                moneyDiffHost.style.display = 'flex';
            }
        
        }
        // weapon/ammo handling
        
        Module._MsgFunc_CurWeaponJS = function(iState, iId, iClip, iCount){
            // Not sure what iState is, however iId is the weapon id, iClip is the magazine ammo count and iCount is the reserve ammunition counter.
            // to do: investigate why scoping in calls this
            
            if(iState == 0){
                return;
            }
            
            // do not touch, it might break grenade selection
            currWeaponId = iId;
            if([3, 13, 18, 24].indexOf(iId) === -1){
                $(".hud-crosshair").show();
            }else{
                $(".hud-crosshair").hide();
            }
            if([8, 27].indexOf(iId) !== -1){
                $(".hud-zoom-overlay").hide();
            }
            drawWeapons();
            if(weaponBlockedFlag){
                Module.pfnClientCmd("slot" + (currSlotNum +1));
                weaponBlockedFlag = false;
            }
            
            // ammo in the magazine
            
            
            if(iId === 29){ // if the knife is being held
                classicAmmoIndicatorHost.style.opacity = '0'; // i would do display: none but we're conflicting with spec mode stuff in that case
            } else {
                classicAmmoIndicatorHost.style.opacity = '1';
                
                var splitClip = iClip.toString().split('');
                
                if(iId != 4 && iId != 6 && iId != 9 && iId != 25){  // grenade and C4 IDs
                    
                    // if we switch back from the grenades/C4 ...
                    hudAmmoSeparator.style.removeProperty("background");
                    hudAmmo1.style.removeProperty("background");
                    hudAmmo2.style.removeProperty("background");
                    hudAmmo3.style.removeProperty("background");
                    
                    updateNumberBackground(clipElements, true, splitClip);
                } else { // this might've been removed in a later update, but 1.6 indicated how many grenades (and C4) you had in the reserve UI, so we don't need the magazine ammo indicator.
                    hudAmmoSeparator.style.background = 'none';
                    hudAmmo1.style.background = "none";
                    hudAmmo2.style.background = "none";
                    hudAmmo3.style.background = "none";
                }

                
                var splitReserve = iCount.toString().split('');
                updateNumberBackground(reserveElements, true, splitReserve);
                
                classicAmmoIndicatorHost.classList.remove('hud-number-activity');
                setTimeout(function(){
                        classicAmmoIndicatorHost.classList.add('hud-number-activity');
                },0)
            }
            
            
            let backgroundPosition = null;
            for (const ammo in mapAmmo) {
                if (mapAmmo[ammo].ids.includes(iId)) {
                    backgroundPosition = mapAmmo[ammo].backgroundPosition;
                    break;
                }
            }
            
            if (backgroundPosition) {
                hudAmmoIcon.style.backgroundPosition = backgroundPosition;
            } else {
                //console.log('No ammo category found for this weapon');
            }
            
        }   
            
        
        
        
        // this is needed to update the reserve ammunition indicator
    
        Module._MsgFunc_CurWeaponAmmoJS = function(iCount){
            var splitReserve = iCount.toString().split('');
            updateNumberBackground(reserveElements, true, splitReserve);
        }
        
        // no real point in keeping this entire func here. This handles the chat messages, however i'm only overriding it to change the
        // timeout of messages going to the (display:none'd) old messages hud element. Formerly 7 seconds, now 12.
        
        Module._SayTextPrintJS = function(buf, bufSize, clientId){
            if (CS_ENV.my_cvars['chat_enable'] === '1') {
                var str = Pointer_stringify(buf);
                str = str.substr(1);
    
                try {
                    var teamnumber = g_TeamInfo[clientId].teamnumber;
                    var colorClass = "";
                    if(teamnumber == TEAM_CT){
                        colorClass = "ct-color";
                    }
                    if(teamnumber == TEAM_TERRORIST){
                        colorClass = "tr-color";
                    }
    
                    var name = g_TeamInfo[clientId].name;
                    var msgArr = str.split(name, 2);
                    var text = msgArr[1];
                    name = msgArr[0] + name;
    
                    var msgBlock = $("<div class='hud-chat-message'><span class='hud-chat-message-nick'></span> <span class='hud-chat-message-text'></span></div>");
                    $(".hud-chat-message-nick", msgBlock).addClass(colorClass).text(name);
                    $(".hud-chat-message-text", msgBlock).text(text);
    
                    $(".hud-chat-messages").append(msgBlock);
                    setTimeout(function(){
                        msgBlock.addClass('hud-chat-message-old');
                        $(".hud-chat-message-old").slice(0, -7).remove();
                    }, 12000);  // chat timeout - 12 seconds
                }catch (e) {
                    console.error(e);
                }
            }
        }
        
        // possible new weapon shit -- investigate in the future
        
        Module._PickupWeaponJS = function(iId, iSlot, iSlotPos){
            //console.log("_PickupWeaponJS", iId, iSlot, iSlotPos);
            currWeaponList[iSlot][iSlotPos] = iId;
            drawWeapons();
            if(iId == 29){
                return;
            } else {
                //console.log("%c_PickupWeaponJS hit with: " + iId, "font-size: 20px");
            }
            
            // The current issue with this func is, while it does show the weapon i've bought/picked up from the floor, it tends to show a pickup of the knife and grenades everytime it does get hit
            // so i'd have to workout some sort of filter. For now, this is a to do.
        }
        
        
        // netgraph 
        
        // generates random values for the other (kind of) irrelevant netgraph values
        function randomFloat(min, max, precision) {   // min value, max value, precision
            const scale = Math.pow(10, precision); // precision used
            const randomValue = Math.random() * (max - min) + min; // calculate the values
            return Math.round(randomValue * scale) / scale; // round it so we don't get some massive ass numbers
        }
        
        if(net_graph == 1){ // don't want to unnecessarily calculate fps
            let then = 0;           // this code was directly taken from stack overflow
            function render(now) {
              now *= 0.001;                          
              const deltaTime = now - then;          
              then = now;                            
              const fps = 1 / deltaTime;             
              netGraphFPS.innerText = fps.toFixed(1) + ' fps';
              
              requestAnimationFrame(render);
            }
            
            requestAnimationFrame(render);
            
            // fake in/out nums , handle ping (real)
            setInterval(() => {
                netGraphIn.innerText = 'in : ' + randomFloat(25, 60, 0).toString() + ' ' + randomFloat(1, 3, 2).toString() + ' k/s';
                netGraphOut.innerText = 'out : ' + randomFloat(25, 50, 0).toString() + ' ' + randomFloat(1, 3, 2).toString() + ' k/s';
                
                netGraphPing.innerText = g_PlayerExtraInfo[CS_ENV.myXashId]?.ping + ' ms';   // this value updates VERY slowly, but still faster than the scoreboard
            }, 500)
        }


        // spectator stuff that requires Module
        specMapName.innerText = 'Map: ' + CS_ENV.request_map;   // request_map is actually the current map, so there you go: current map name in spectator
        
        Module._MsgFunc_SpecHealth2JS = function (health, client, g_iUser2) {       // this func is literal jQuery hell
            try{
                var text = health > 0 ? g_TeamInfo[client].name + "(" + health + ")" : "";
                var team = g_TeamInfo[client].teamnumber;
                var nameblock = specName;
                nameblock.classList.remove("ct-color");
                nameblock.classList.remove("tr-color")
                if(team == TEAM_CT){
                    nameblock.classList.add('ct-color');
                }else{
                    nameblock.classList.add('tr-color');
                }
                nameblock.innerText = text;
                // logHookMsg2("_MsgFunc_SpecHealth2JS")(arguments);
                Module.setSpecMode(true);
            } catch (e) {
                console.error(e);
            }
        }
        
    }
}, 1000)






// disable home button when pointer locked -- mostly copied from pointerlock.js
// since i can't (for some unknown reason) completely override pointerlock, i can use this to my advantage and only do what i need

// IDEA: cs 1.6 pause menu

var canvas_elem = ge('canvas');
var pointerlock_overlay = ge('pointerlock_overlay');

// this is kinda fancy i should do this
function ge(id) {
    return document.getElementById(id);
}

var pointerlockchange = function () {
    document.querySelector(".exit-button").style.removeProperty('display');
    if (document.pointerLockElement === canvas_elem) {
        document.querySelector(".exit-button").style.display = 'none';
        document.querySelector("#amxmodmenu").style.display = 'none';
    } else {
        pointerLockActive = false;
        document.querySelector(".exit-button").style.display = 'block';
        document.querySelector("#amxmodmenu").style.display = 'block';  // its inline-block by default for some reason.. 
    }
};

document.addEventListener('pointerlockchange', pointerlockchange, false);


function updateFontStyle(elementRef) {
    const width = window.innerWidth;    // viewport width
    const height = window.innerHeight;  // viewport height

    let fontFamily = '';
    let fontSize = '';
    let fontWeight = '';
    let letterSpacing = '';

    if (width >= 1024 && height >= 768) {
        // For 1024x768 and above
        fontFamily = 'Verdana';
        fontSize = '9pt';
        fontWeight = '600';

    } else if (width >= 800 && height >= 600) {
        // For 800x600
        fontFamily = 'Tahoma';
        fontSize = '8pt';
        fontWeight = '600';
        letterSpacing = '1px';
    } else if (width >= 640 && height >= 480) {
        // For 640x480
        fontFamily = 'Tahoma';
        fontSize = '7pt';
        fontWeight = '600';
        letterSpacing = '1px';
    }

    // apply styles
    elementRef.style.fontFamily = fontFamily;
    elementRef.style.fontSize = fontSize;
    elementRef.style.fontWeight = fontWeight;
    elementRef.style.letterSpacing = letterSpacing;
}



window.addEventListener("load", function() {
    fontUpdateElements.forEach(updateFontStyle);
});

window.addEventListener("resize", function() {
    fontUpdateElements.forEach(updateFontStyle);
});





// hacky ass mitigations for slow image loading, don't ask why its done this way
// open to suggestions btw!

const spritesheet = document.createElement("div"); spritesheet.classList.add("spritesheet");
document.querySelector("#loading_blocker").appendChild(spritesheet);
spritesheet.style.background = "url('https://github.com/kfh83/SteamLike-HUD/blob/main/Assets/hud-spritesheet.png?raw=true')";
spritesheet.style.width = '0px';
spritesheet.style.height = '0px';
spritesheet.style.padding = '0';

const radar = document.createElement("div"); radar.classList.add("radar");
document.querySelector("#loading_blocker").appendChild(radar);
radar.style.background = "url('https://github.com/kfh83/SteamLike-HUD/blob/main/Assets/radar.png?raw=true')";
radar.style.width = '0px';
radar.style.height = '0px';
radar.style.padding = '0';

const scope = document.createElement("div"); scope.classList.add("scope");
document.querySelector("#loading_blocker").appendChild(scope);
scope.style.background = "url('https://github.com/kfh83/SteamLike-HUD/blob/main/Assets/scope.png?raw=true')";
scope.style.width = '0px';
scope.style.height = '0px';
scope.style.padding = '0';