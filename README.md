# CPBL Live CMD 中華職棒小黑框文字直播
## 讓工程師在全版的 command line 中能夠保有一絲絲的空間看棒球
> 本專案主要是利用爬蟲的方式將賽程表及Play By Play爬下來，在藉由資料的轉換輸出盡量以最方便的方式讓大家能方便的看到文字直播

### Requirement
我最多就是用到 ES2015 的 Template literals，普通的環境應該就能正常運作了

### Installation
1. Give me a star if you like it!
2. `git clone https://github.com/KJ-Chiu/cpbl-live-cmd.git`

### Usage
1. 選擇 (1) 觀看賽程表 或 (2) 觀看比賽直播，如果已經開打也可以直接輸入 (today)

`Start with game id(1) or Search by date(2) or (today) to see live game? (1 or 2 or today)`

2. (1) 觀看賽程

`Please enter target date like following format (2018-09-20):`

3. (2) 輸入比賽編號與時間

`Please enter game Id and game date like following format (123 2018-09-20):`

4. (today)) 直接進入文字職播，如果當下有兩場比賽會進入 CPBL 賽程表上面那場

5. 文字直播途中，隨時都可以輸入 (S) 或 (Q) 來觀看記分板或退出直播

`Command: (S) to see score board, (Q) to quit game:`

6. 任何可以輸入的時候，輸入 `exit` 都能夠退回上一步或退出APP

`Type "exit" anytime if try to leave`

### Notes
1. 目前有時候抓取賽程表或抓取比賽資訊會卡一陣子或卡住不動。 `Now connecting to cpbl schedule...` 像遇到這個很久的話可能要麻煩直接 `Ctr + c` 退出。有時候中職自己的網站會 load 很慢...
2. 程式碼很簡單，如果覺得長得太醜或想要增加內容歡迎自行修改
3. 希望大家不小心加班的時候還能夠替自己喜歡的球隊加油
4. 因為是爬蟲，如果官網改版可能會需要重做，再麻煩告知，謝謝。

*By kjchiu 2018/09/20*