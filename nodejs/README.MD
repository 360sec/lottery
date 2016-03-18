start

npm start


运行前需要先导入用户信息 users.json

mongoimport -h 127.0.0.1 -d am -c user --jsonArray users.json

抽奖玩法:

p  开始摇奖

3  停止并出现三等奖

2  停止并出现二等奖

1  停止并出现一等奖

5  停止并出现特等奖

s  停止并出现其他奖

space 抽奖结束