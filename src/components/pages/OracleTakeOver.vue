<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item style="float: right;">
        <el-button type="info"
                   @click="$router.push({name: 'oracleList'})">数据库列表</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary"
                   @click="console.log()">添加</el-button>
      </el-form-item>
    </el-form>
    <section style="clear: both;">
      <el-row>
        <el-col :span="10">
          <div :class="$style.envHeader">
            <h2>
              <i-icon name="production-env"
                      :class="$style.envIcon"></i-icon>
              <span>生产环境</span>
            </h2>
          </div>

        </el-col>
        <el-col :span="10"
                :offset="4">
          <div :class="$style.envHeader">
            <h2>
              <i-icon name="ebackup-env"
                      :class="$style.envIcon"></i-icon>
              <span>易备环境</span>
            </h2>
          </div>

        </el-col>
      </el-row>
      <div :class="$style.hostLinkContainer"
           v-for="hostLink in xlinks"
           :key="hostLink.id">
        <el-row type="flex"
                justify="space-around">
          <el-col :span="10">
            <div :class="$style.hostInfo">
              <i-icon name="host-production"
                      :class="$style.hostIcon"></i-icon>
              <span>{{ hostLink.primaryHost.name }}</span>
              <el-tag size="small">{{ hostLink.primaryHost.hostIp }}</el-tag>
            </div>
          </el-col>
          <el-col :span="4">
            <div :class="$style.hostSwitch">
              <div>
                <i-icon name="link"
                        :class="$style.hostSwitchIcon"></i-icon>
              </div>
              <el-button type="text">切主</el-button>
              <el-button type="text">切IP</el-button>
              <el-button type="text">切备</el-button>
            </div>
          </el-col>
          <el-col :span="10">
            <div :class="$style.hostInfo">
              <i-icon name="host-ebackup"
                      :class="$style.hostIcon"></i-icon>
              <span>{{ hostLink.viceHost.name }}</span>
              <el-tag size="small">{{ hostLink.viceHost.hostIp }}</el-tag>
            </div>
          </el-col>
        </el-row>
        <el-row v-for="dbLink in hostLink.databaseLinks"
                :key="dbLink.id">
          <el-col :span="10">
            <div :class="dbLink.primaryDatabase.role === 1 ? $style.primaryDatabaseInfo : $style.viceDatabaseInfo">
              <el-row type="flex"
                      align="middle">
                <el-col :span="8">
                  <h4>
                    {{ dbLink.primaryDatabase.name }}
                  </h4>
                </el-col>
                <el-col :span="5"
                        :class="$style.dbInfoCol">
                  <h5>实例名</h5>
                  <p>{{ dbLink.primaryDatabase.instanceName }}</p>
                </el-col>
                <el-col :span="5"
                        :class="$style.dbInfoCol">
                  <h5>登录名</h5>
                  <p>{{ dbLink.primaryDatabase.loginName }}</p>
                </el-col>
                <el-col :span="3"
                        :class="$style.dbInfoCol">
                  <h5>状态</h5>
                  <p>
                    <el-tag :type="dbLink.primaryDatabase.state === 1 ? 'success' : 'danger'"
                            size="mini">{{ dbLink.primaryDatabase.state | databaseStateFilter }}</el-tag>
                  </p>
                </el-col>
                <el-col :span="3">
                  <div :class="dbLink.primaryDatabase.role === 1 ? $style.primaryRole : $style.viceRole">{{ dbLink.primaryDatabase.role | databaseRoleFilter}}</div>
                </el-col>
              </el-row>

            </div>
          </el-col>
          <el-col :span="4">
            <div :class="$style.databaseSwitch">
              <el-tooltip effect="light"
                          content="切换实例"
                          :open-delay="200"
                          placement="right">
                <i-icon name="switch"
                        :class="$style.switchIcon"></i-icon>
              </el-tooltip>

              <div>
                <el-tag :type="databaseLinkStateStyle(dbLink.state)"
                        size="mini">{{ dbLink.state | linkStateFilter }}</el-tag>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div :class="dbLink.viceDatabase.role === 1 ? $style.primaryDatabaseInfo : $style.viceDatabaseInfo">
              <el-row type="flex"
                      align="middle">
                <el-col :span="8">
                  <h4>
                    {{ dbLink.viceDatabase.name }}
                  </h4>
                </el-col>
                <el-col :span="5"
                        :class="$style.dbInfoCol">
                  <h5>实例名</h5>
                  <p>{{ dbLink.viceDatabase.instanceName }}</p>
                </el-col>
                <el-col :span="5"
                        :class="$style.dbInfoCol">
                  <h5>登录名</h5>
                  <p>{{ dbLink.viceDatabase.loginName }}</p>
                </el-col>
                <el-col :span="3"
                        :class="$style.dbInfoCol">
                  <h5>状态</h5>
                  <p>
                    <el-tag :type="dbLink.viceDatabase.state === 1 ? 'success' : 'danger'"
                            size="mini">{{ dbLink.viceDatabase.state | databaseStateFilter }}</el-tag>
                  </p>
                </el-col>
                <el-col :span="3">
                  <div :class="dbLink.viceDatabase.role === 1 ? $style.primaryRole : $style.viceRole">{{ dbLink.viceDatabase.role | databaseRoleFilter}}</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>

  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import {
  fetchAll,
  fetchLinks,
  createLinks,
  createSwtiches,
} from '../../api/oracle';
import {
  databaseStateMapping,
  databaseRoleMapping,
  linkStateMapping,
} from '../../utils/constant';
export default {
  name: 'OracleTakeOver',
  data() {
    return {
      items: [
        {
          id: 20000,
          instanceName: 'isho',
          name: '车部支数据库',
          dbVersion: '11.0.2.0',
          application: '元青系统',
          loginName: 'Brenda',
          password: 'CDBl]8FZ',
          createTime: '1993-04-27 13:34:17',
          role: 1,
          state: 1,
          host: {
            id: 10000,
            name: 'QbhYBBaEQJ',
            hostIp: '7.196.205.236',
            osName: 'Linux',
            loginName: 'Larry',
            password: 'F3dffgzjOk',
            hostType: 1,
            databaseType: 1,
            createdTime: '1991-06-28 03:46:19',
          },
        },
        {
          id: 20001,
          instanceName: 'sff',
          name: '问状你解研数据库',
          dbVersion: '11.0.2.0',
          application: '明专系统',
          loginName: 'Melissa',
          password: 'v294Z*',
          createTime: '2005-10-15 07:36:33',
          role: 1,
          state: 2,
          host: {
            id: 10000,
            name: 'QbhYBBaEQJ',
            hostIp: '7.196.205.236',
            osName: 'Linux',
            loginName: 'Larry',
            password: 'F3dffgzjOk',
            hostType: 1,
            databaseType: 1,
            createdTime: '1991-06-28 03:46:19',
          },
        },
        {
          id: 20002,
          instanceName: 'zevf',
          name: '权中这关连数据库',
          dbVersion: '11.0.2.0',
          application: '满形地系统',
          loginName: 'Shirley',
          password: 'oJNsvb6kfg',
          createTime: '2013-08-16 20:52:49',
          role: 1,
          state: 2,
          host: {
            id: 10000,
            name: 'QbhYBBaEQJ',
            hostIp: '7.196.205.236',
            osName: 'Linux',
            loginName: 'Larry',
            password: 'F3dffgzjOk',
            hostType: 1,
            databaseType: 1,
            createdTime: '1991-06-28 03:46:19',
          },
        },
        {
          id: 20003,
          instanceName: 'yqmtb',
          name: '她院权由上数据库',
          dbVersion: '11.0.2.0',
          application: '应收利点关系统',
          loginName: 'Helen',
          password: '@75rJO',
          createTime: '2002-05-24 02:27:57',
          role: 2,
          state: 2,
          host: {
            id: 10002,
            name: 'UfCMzn3hdj',
            hostIp: '77.98.180.43',
            osName: 'Windows',
            loginName: 'Daniel',
            password: 'hWYpgKJBKT',
            hostType: 2,
            databaseType: 1,
            createdTime: '2016-08-28 09:27:57',
          },
        },
        {
          id: 20004,
          instanceName: 'fbuo',
          name: '类百按然数据库',
          dbVersion: '11.0.2.0',
          application: '月制养济系统',
          loginName: 'Shirley',
          password: 'WkI!^S',
          createTime: '2015-08-27 15:29:01',
          role: 2,
          state: 2,
          host: {
            id: 10002,
            name: 'UfCMzn3hdj',
            hostIp: '77.98.180.43',
            osName: 'Windows',
            loginName: 'Daniel',
            password: 'hWYpgKJBKT',
            hostType: 2,
            databaseType: 1,
            createdTime: '2016-08-28 09:27:57',
          },
        },
        {
          id: 20005,
          instanceName: 'bsro',
          name: '京红型给数据库',
          dbVersion: '11.0.2.0',
          application: '风验造运议系统',
          loginName: 'Joseph',
          password: 'sS*avxV#',
          createTime: '1974-12-02 09:34:53',
          role: 2,
          state: 2,
          host: {
            id: 10002,
            name: 'UfCMzn3hdj',
            hostIp: '77.98.180.43',
            osName: 'Windows',
            loginName: 'Daniel',
            password: 'hWYpgKJBKT',
            hostType: 2,
            databaseType: 1,
            createdTime: '2016-08-28 09:27:57',
          },
        },
        {
          id: 20006,
          instanceName: 'ytlp',
          name: '世起特统都数据库',
          dbVersion: '11.0.2.0',
          application: '管情象规非系统',
          loginName: 'Joseph',
          password: '[zucSr[RA',
          createTime: '1979-10-05 17:18:09',
          role: 1,
          state: 2,
          host: {
            id: 10001,
            name: 'fPewj5CQB4',
            hostIp: '182.17.138.149',
            osName: 'Windows',
            loginName: 'Elizabeth',
            password: 'CQ13ZHzkTN',
            hostType: 1,
            databaseType: 1,
            createdTime: '1991-04-27 00:12:35',
          },
        },
        {
          id: 20007,
          instanceName: 'vqy',
          name: '广五变之易数据库',
          dbVersion: '11.0.2.0',
          application: '算矿今造四系统',
          loginName: 'Ronald',
          password: '!oZr6s',
          createTime: '1989-02-07 11:34:13',
          role: 2,
          state: 1,
          host: {
            id: 10003,
            name: 'fkSNvusHyG',
            hostIp: '49.204.49.104',
            osName: 'Linux',
            loginName: 'Sarah',
            password: 'JDg4y4f7uq',
            hostType: 2,
            databaseType: 1,
            createdTime: '2013-03-15 01:37:33',
          },
        },
        {
          id: 20008,
          instanceName: 'fdqz',
          name: '资共头数据库',
          dbVersion: '11.0.2.0',
          application: '北员系统',
          loginName: 'Nancy',
          password: '#AZYHMw@',
          createTime: '1971-07-17 16:41:21',
          role: 0,
          state: 1,
          host: {
            id: 10004,
            name: 'mbGOFUO2dW',
            hostIp: '128.197.129.69',
            osName: 'Linux',
            loginName: 'Gary',
            password: 'BRgyQh4xaO',
            hostType: 2,
            databaseType: 1,
            createdTime: '1981-08-03 01:09:58',
          },
        },
        {
          id: 20009,
          instanceName: 'tmweh',
          name: '适同了数据库',
          dbVersion: '11.0.2.0',
          application: '会接地往式系统',
          loginName: 'David',
          password: 'sgAFtbgv',
          createTime: '2003-02-14 15:40:34',
          role: 0,
          state: 1,
          host: {
            id: 10005,
            name: 'slw2dO0cVf',
            hostIp: '193.168.69.151',
            osName: 'Linux',
            loginName: 'Elizabeth',
            password: 'JBCuUd922w',
            hostType: 1,
            databaseType: 1,
            createdTime: '1970-03-19 10:02:42',
          },
        },
        {
          id: 20010,
          instanceName: 'evmg',
          name: '何做值数据库',
          dbVersion: '11.0.2.0',
          application: '被处整系统',
          loginName: 'Linda',
          password: 'G3rTEn2n^',
          createTime: '2016-07-07 10:34:41',
          role: 1,
          state: 2,
          host: {
            id: 10006,
            name: '8I6S87u6YD',
            hostIp: '178.129.183.136',
            osName: 'Linux',
            loginName: 'Paul',
            password: 'q4DwcAaiZP',
            hostType: 1,
            databaseType: 1,
            createdTime: '2011-07-14 20:57:54',
          },
        },
        {
          id: 20011,
          instanceName: 'ktv',
          name: '五工阶技数据库',
          dbVersion: '11.0.2.0',
          application: '就四使亲间系统',
          loginName: 'Karen',
          password: ']jYK3RN1',
          createTime: '2017-02-14 19:45:42',
          role: 0,
          state: 1,
          host: {
            id: 10007,
            name: 'YEmpDmExKH',
            hostIp: '76.234.135.106',
            osName: 'Windows',
            loginName: 'Kenneth',
            password: 'xOcsYQadhE',
            hostType: 1,
            databaseType: 1,
            createdTime: '1973-09-22 07:53:29',
          },
        },
      ],
      xlinks: [
        {
          primaryHost: {
            id: 96316,
            name: 'qPLJgZgLa6',
            hostIp: '163.31.223.113',
            osName: 'Linux',
            loginName: 'Christopher',
            password: 'PBI00pnQad',
            hostType: 1,
            databaseType: 1,
            createdTime: '2007-12-17 23:09:50',
          },
          viceHost: {
            id: 96334,
            name: 'EMY3x0dZSU',
            hostIp: '121.28.26.137',
            osName: 'Linux',
            loginName: 'Jason',
            password: 'D2PDFhH9RG',
            hostType: 2,
            databaseType: 1,
            createdTime: '1975-09-26 13:23:45',
          },
          databaseLinks: [
            {
              id: 529,
              primaryDatabase: {
                id: 97160,
                instanceName: 'qyo',
                name: '群识速数据库',
                dbVersion: '11.0.2.0',
                application: '业而常保系统',
                loginName: 'Jose',
                password: '[hTtQe',
                createTime: '1977-10-13 09:22:54',
                role: 2,
                state: 2,
                lsn: 'GIFFpdLjK8',
              },
              viceDatabase: {
                id: 97611,
                instanceName: 'eisq',
                name: '因口基清数据库',
                dbVersion: '2012',
                application: '常战入行系统',
                loginName: 'Gary',
                password: '2cVNP&p',
                createTime: '2017-05-30 00:21:56',
                role: 1,
                state: 1,
                lsn: 'sRBQD7fHp2',
              },
              state: 3,
              errMsg: '五进团工压参常温育划装七业。',
              tempPort: '1771',
            },
          ],
        },
        {
          primaryHost: {
            id: 60000,
            name: 'eRwEBaR0O1',
            hostIp: '182.253.166.3',
            osName: 'Linux',
            loginName: 'Scott',
            password: 'NBIQ4jcnLi',
            hostType: 1,
            databaseType: 1,
            createdTime: '2001-07-14 04:19:49',
          },
          viceHost: {
            id: 60010,
            name: '3Tl1VPIwC6',
            hostIp: '203.135.130.60',
            osName: 'Windows',
            loginName: 'Deborah',
            password: 'jkRymND2vW',
            hostType: 2,
            databaseType: 1,
            createdTime: '1987-12-23 07:03:34',
          },
          databaseLinks: [
            {
              id: 171,
              primaryDatabase: {
                id: 70003,
                instanceName: 'bomd',
                name: '做头分数据库',
                dbVersion: '11.0.2.0',
                application: '自所国系统',
                loginName: 'Christopher',
                password: 'sHZCy##6',
                createTime: '1979-08-06 10:53:18',
                role: 2,
                state: 2,
                lsn: 'rR6LwyRwVX',
              },
              viceDatabase: {
                id: 70013,
                instanceName: 'avyw',
                name: '运准山整数据库',
                dbVersion: '2008',
                application: '林照系统',
                loginName: 'Steven',
                password: 'EsVohxGD2&',
                createTime: '1987-06-16 04:13:40',
                role: 1,
                state: 2,
                lsn: 'wIzb6ibjH1',
              },
              state: 1,
              errMsg: '白毛命料查商该物则般数两场即米。',
              tempPort: '6804',
            },
            {
              id: 900,
              primaryDatabase: {
                id: 70004,
                instanceName: 'ycnrh',
                name: '能空究保达数据库',
                dbVersion: '11.0.2.0',
                application: '南回求料系统',
                loginName: 'Jeffrey',
                password: 'IyShGGvTk',
                createTime: '1985-01-22 06:07:18',
                role: 1,
                state: 2,
                lsn: 'W5C8JGPWKX',
              },
              viceDatabase: {
                id: 70014,
                instanceName: 'edele',
                name: '心机又数据库',
                dbVersion: '2008',
                application: '入安公区系统',
                loginName: 'Jennifer',
                password: '7#j3c3',
                createTime: '1988-04-13 00:43:33',
                role: 2,
                state: 1,
                lsn: 'HjA7jmoVY8',
              },
              state: 2,
              errMsg: '下你党特干何命容斗群改别则。',
              tempPort: '9314',
            },
          ],
        },
        {
          primaryHost: {
            id: 60001,
            name: 'JKo05CGrvc',
            hostIp: '106.225.116.169',
            osName: 'Linux',
            loginName: 'Eric',
            password: '1ZGeJyY3mO',
            hostType: 1,
            databaseType: 1,
            createdTime: '1997-02-27 08:46:58',
          },
          viceHost: {
            id: 60011,
            name: 'mnNm4DQ4fY',
            hostIp: '153.58.175.213',
            osName: 'Windows',
            loginName: 'Jennifer',
            password: 'ZNNt0QK10z',
            hostType: 2,
            databaseType: 1,
            createdTime: '1984-04-30 20:09:55',
          },
          databaseLinks: [
            {
              id: 282,
              primaryDatabase: {
                id: 70000,
                instanceName: 'wjni',
                name: '公战建民取数据库',
                dbVersion: '11.0.2.0',
                application: '石前它造系统',
                loginName: 'Margaret',
                password: 'Ki97I4IDvz',
                createTime: '1974-10-07 04:27:02',
                role: 1,
                state: 1,
                lsn: 'ABOeurbYH7',
              },
              viceDatabase: {
                id: 70010,
                instanceName: 'jolt',
                name: '这办众新数据库',
                dbVersion: '2012',
                application: '京解六小系统',
                loginName: 'Mary',
                password: ')hgJ(b',
                createTime: '1979-12-21 09:23:44',
                role: 2,
                state: 1,
                lsn: 'N1s7EFVyaH',
              },
              state: 2,
              errMsg: '温严基那支业期最成类才种面状。',
              tempPort: '5528',
            },
            {
              id: 804,
              primaryDatabase: {
                id: 70001,
                instanceName: 'orsk',
                name: '必属设进数据库',
                dbVersion: '11.0.2.0',
                application: '确机达系统',
                loginName: 'Nancy',
                password: 'K9Fum*Mi',
                createTime: '1979-01-19 13:13:17',
                role: 2,
                state: 1,
                lsn: 'EI7vAskALJ',
              },
              viceDatabase: {
                id: 70011,
                instanceName: 'shscm',
                name: '利气现号能数据库',
                dbVersion: '2008',
                application: '社料无系统',
                loginName: 'Kimberly',
                password: '(]i7K$',
                createTime: '2001-10-20 09:20:04',
                role: 1,
                state: 2,
                lsn: 'pSLw8tltMd',
              },
              state: 4,
              errMsg: '严由支放六文力第斗关始重回资交阶。',
              tempPort: '3927',
            },
            {
              id: 237,
              primaryDatabase: {
                id: 70002,
                instanceName: 'afvu',
                name: '每反年个数据库',
                dbVersion: '11.0.2.0',
                application: '院作边系统',
                loginName: 'Anthony',
                password: '7PHJY7sCO2',
                createTime: '1972-07-05 10:22:22',
                role: 1,
                state: 1,
                lsn: 'muYPdTg2AT',
              },
              viceDatabase: {
                id: 70012,
                instanceName: 'vnhdi',
                name: '文将非数据库',
                dbVersion: '2012',
                application: '平八音系统',
                loginName: 'Jessica',
                password: 'nzjhv(su',
                createTime: '2008-08-14 22:45:25',
                role: 2,
                state: 2,
                lsn: 'P3YqlstJey',
              },
              state: 4,
              errMsg: '当必内展心史头省说图工保。',
              tempPort: '0151',
            },
          ],
        },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    oracleHosts() {
      return [
        {
          id: 10000,
          name: 'QbhYBBaEQJ',
          hostIp: '7.196.205.236',
          osName: 'Linux',
          loginName: 'Larry',
          password: 'F3dffgzjOk',
          hostType: 1,
          databaseType: 1,
          createdTime: '1991-06-28 03:46:19',
        },
        {
          id: 10001,
          name: 'fPewj5CQB4',
          hostIp: '182.17.138.149',
          osName: 'Windows',
          loginName: 'Elizabeth',
          password: 'CQ13ZHzkTN',
          hostType: 1,
          databaseType: 1,
          createdTime: '1991-04-27 00:12:35',
        },
        {
          id: 10002,
          name: 'UfCMzn3hdj',
          hostIp: '77.98.180.43',
          osName: 'Windows',
          loginName: 'Daniel',
          password: 'hWYpgKJBKT',
          hostType: 2,
          databaseType: 1,
          createdTime: '2016-08-28 09:27:57',
        },
        {
          id: 10003,
          name: 'fkSNvusHyG',
          hostIp: '49.204.49.104',
          osName: 'Linux',
          loginName: 'Sarah',
          password: 'JDg4y4f7uq',
          hostType: 2,
          databaseType: 1,
          createdTime: '2013-03-15 01:37:33',
        },
        {
          id: 10004,
          name: 'mbGOFUO2dW',
          hostIp: '128.197.129.69',
          osName: 'Linux',
          loginName: 'Gary',
          password: 'BRgyQh4xaO',
          hostType: 2,
          databaseType: 1,
          createdTime: '1981-08-03 01:09:58',
        },
        {
          id: 10005,
          name: 'slw2dO0cVf',
          hostIp: '193.168.69.151',
          osName: 'Linux',
          loginName: 'Elizabeth',
          password: 'JBCuUd922w',
          hostType: 1,
          databaseType: 1,
          createdTime: '1970-03-19 10:02:42',
        },
        {
          id: 10006,
          name: '8I6S87u6YD',
          hostIp: '178.129.183.136',
          osName: 'Linux',
          loginName: 'Paul',
          password: 'q4DwcAaiZP',
          hostType: 1,
          databaseType: 1,
          createdTime: '2011-07-14 20:57:54',
        },
        {
          id: 10007,
          name: 'YEmpDmExKH',
          hostIp: '76.234.135.106',
          osName: 'Windows',
          loginName: 'Kenneth',
          password: 'xOcsYQadhE',
          hostType: 1,
          databaseType: 1,
          createdTime: '1973-09-22 07:53:29',
        },
      ];
      // return this.$store.getters.hostsWithOracle;
    },
    productionOracleHosts() {
      return this.oracleHosts.filter(host => host.hostType === 1);
    },
    ebackupOracleHosts() {
      return this.oracleHosts.filter(host => host.hostType === 2);
    },
    /**
     * 拥有数据库的设备
     * [host(..., database), ...]
     */
    usedHosts() {
      const obj = {};
      this.items.forEach(item => {
        const { host, ...database } = item;
        if (!obj[item.host.id]) {
          obj[item.host.id] = item.host;
          obj[item.host.id].databases = Array.of(database);
        } else {
          obj[item.host.id].databases.push(database);
        }
      });
      return Object.keys(obj).map(id => obj[id]);
    },
  },
  methods: {
    fetchData() {
      // fetchAll()
      //   .then(res => {
      //     const { data: oracles } = res.data;
      //     this.items = oracles;
      //   })
      //   .catch(error => {
      //     this.$message.error(error);
      //   });
      // fetchLinks()
      //   .then(res => {
      //     const { data: links } = res.data;
      //     this.links = links;
      //   })
      //   .catch(error => {
      //     this.$message.error(error);
      //   });
    },
    databaseLinkStateStyle(value) {
      switch (value) {
        case 1:
          return 'warning';
        case 2:
          return 'success';
        case 3:
        case 4:
          return 'danger';
        case 5:
          return 'info';
      }
    },
  },
  filters: {
    databaseStateFilter(value) {
      return databaseStateMapping[value];
    },
    databaseRoleFilter(value) {
      return databaseRoleMapping[value].substr(0, 1);
    },
    linkStateFilter(value) {
      return linkStateMapping[value];
    },
  },
  components: {
    IIcon,
  },
};
</script>
<style lang="scss" module>
$primary-color: #409eff;
$vice-color: #6d6d6d;

.envHeader {
  text-align: center;
  h2 {
    margin: 5px 0;
  }
}
.envIcon {
  vertical-align: -0.3em;
}
.hostIcon {
  vertical-align: -0.3em;
}

.hostLinkContainer {
  padding: 5px;
  margin: 10px 0;
  // border: 1px solid #ababab;
  border-radius: 5px;
  background-color: #ffffff;
}
.hostInfo {
  text-align: center;
  margin: 1em 0;
}
.hostSwitch {
  text-align: center;
  margin: 5px 0 0;
}

.primaryDatabaseInfo {
  border: 1px solid $primary-color;
  border-radius: 5px;
  box-shadow: 0px 0px 2px 1px $primary-color;
}
.viceDatabaseInfo {
  border: 1px solid $vice-color;
  border-radius: 5px;
  box-shadow: 0px 0px 2px 1px $vice-color;
}

.primaryDatabaseInfo,
.viceDatabaseInfo {
  padding: 5px 0 5px 10px;
  margin: 8px 0;
  min-height: 100px;
}
.dbInfoCol {
  text-align: center;
  h5 {
    margin: 10px 0;
  }
  p {
    margin: 8px 0;
  }
}
.databaseSwitch {
  text-align: center;
  margin: 20px 0;
}
.primaryRole {
  text-align: center;
  background-color: $primary-color;
  color: #ffffff;
  font-size: 2.8em;
  line-height: 2.3em;
  height: 111px;
  margin: -5px 0;
  border-radius: 0 3px 3px 0;
}
.viceRole {
  text-align: center;
  background-color: $vice-color;
  color: #ffffff;
  font-size: 2.8em;
  line-height: 2.3em;
  height: 111px;
  margin: -5px 0;
  border-radius: 0 3px 3px 0;
}
.hostSwitchIcon {
  width: 3em;
  height: 1.4em;
}
.switchIcon {
  width: 3em;
  height: 3em;
  cursor: pointer;
}
</style>
