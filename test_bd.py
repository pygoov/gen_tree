
from datetime import datetime
from logic.sql_manager import SQLManager


sm = SQLManager('./data/template.db')
# sm.prepare_query('q', 'select * from t_users')
# sm.prepare_query('a', 'insert into t_users(name, pass_hash) values(?,?)')

t = datetime.now()
# print(sm.send_query('q'))
# print(sm.send_query('a', ('uta3','asdhash')))
# print(sm.send_query('q'))
# print('time:',(datetime.now() - t).microseconds/1000)
sm.close()
