# Web3 Club
简单介绍：
> 
> 去中心化学生社团组织治理应用 
> 
> - 每个学生初始可以拥有或领取一些通证积分（ERC20）。 
> - 每个学生可以在应用中可以： 
>    1. 使用一定数量通证积分，发起关于该社团进行活动或制定规则的提案（Proposal）。 
>    2. 提案发起后一定支出时间内，使用一定数量通证积分可以对提案进行投票（赞成或反对，限制投票次数），投票行为被记录到区块链上。 **每人对每个提案只能投一票，且不能反悔**。
>    3. 提案投票时间截止后，赞成数大于反对数的提案通过，提案发起者作为贡献者可以领取一定的积分奖励。 
> 
>    4. 发起提案并通过3次的学生，可以领取社团颁发的纪念品（ERC721）


## 如何运行

1. 在本地启动ganache应用。
2. 修改hardhat config文件的设置，从ganache拷贝一些私钥，并将这些私钥导入小狐狸。
2. 在 `./contracts` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```
3. 在 `./contracts` 中编译合约，运行如下的命令：
    ```bash
    npx hardhat compile
    ```
4. 部署合约
   ```bash
   npx hardhat run ./scripts/deploy.ts --network ganache
   ```
5. 把部署的地址拷贝到`frontend\src\utils\contract-addresses.json`文件中。
6. 在 `./frontend` 中启动前端程序，运行如下的命令：
    ```bash
    npm run start
    ```

## 功能实现分析

简单描述：
* 首先是发行代币，每个用户可以领取一次空投获得10000代币，代币可以用来发起提案或者进行投票。这个主要参考了彩票demo中的实现。
* 发起提案。用户可以发起提案，提案被记录在区块链上。提案包括名称、内容、持续时间等。发起提案时，智能合约会把提案写入区块链，并保存发起者的地址，便于后面查看自己发起的提案。发起提案会消耗代币。
* 投票。本项目采取不完全记名投票，智能合约会记录某一项提案有几张赞成票，几张反对票，并且记录某个用户是否为某个提案投过票，但不会记录这位用户是赞成还是反对，一定程度上保留了匿名性。投票也会消耗代币。
* 提案通过：每次加载页面，前端会生成一个提交任务队列，每隔一段时间检查一次是否有提案到期，如果到期，则调用智能合约，将提案状态修改为commited，之后这个提案就不能再投票了。智能合约也会记录每个用户发起的提案的列表和通过的提案数，当通过的提案数量等于3时，将为这个用户生成一个NFT图片。
* 查看提案、NFT：分为两种模式，一种是查看全部提案，另一种是只查看自己的提案。查看自己的提案时，可以看到自己是否获得过NFT。进行中的提案可以投票，结束的提案可以看到结果和正反票数。

## 项目运行截图

放一些项目运行截图。
![image](https://user-images.githubusercontent.com/72912470/200169724-1071ab98-abeb-4bda-9cba-efc13c6b483b.png)
![image](https://user-images.githubusercontent.com/72912470/200169764-b2119cc0-6abc-445b-ad48-28913bdd12d7.png)
![image](https://user-images.githubusercontent.com/72912470/200169781-32ea4444-715e-4d8a-8ba1-4cce582554a2.png)
![image](https://user-images.githubusercontent.com/72912470/200169829-ea79d421-10a0-4b95-bcc7-8282a74d2137.png)
![image](https://user-images.githubusercontent.com/72912470/200169875-d655eb43-a291-4d8b-9126-5499b50f1650.png)
![image](https://user-images.githubusercontent.com/72912470/200170018-cc2bdb40-e976-422f-9a34-6a6ede0b965a.png)
![image](https://user-images.githubusercontent.com/72912470/200170222-5135ea42-c3e8-450c-a1ee-4ca2e6cfbb22.png)



## 参考内容

课程的参考Demo见：[DEMOs](https://github.com/LBruyne/blockchain-course-demos)。

如果有其它参考的内容，也请在这里陈列。
