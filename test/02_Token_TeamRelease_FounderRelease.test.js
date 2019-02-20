const TIIMToken = artifacts.require('TIIMToken');

const {
  MILLION,
  UNIT,
  TRANSFER_GAS,
  TOTAL_SUPPLY,
  increaseTime
} = require('../lib/utils');

let TIIM;

let COMMUNITY_WALLET;
let CROWD_FUNDING_WALLET;
let ECO_WALLET;
let COMPANY_WALLET;
let TEAM_WALLET;
let FOUNDER_WALLET;
let TOMO_ALLOCATION_WALLET;
let ANONYMOUS;

contract('TIIMToken', accounts => {
  
  beforeEach('TIIM Token init', async () => {
    
    COMMUNITY_WALLET = accounts[0];
    CROWD_FUNDING_WALLET = accounts[1];
    ECO_WALLET = accounts[2];
    COMPANY_WALLET = accounts[3];
    TEAM_WALLET = accounts[4];
    FOUNDER_WALLET = accounts[5];
    TOMO_ALLOCATION_WALLET = accounts[6];
    ANONYMOUS = accounts[7];

    TIIM = await TIIMToken.new(COMMUNITY_WALLET, CROWD_FUNDING_WALLET, ECO_WALLET, COMPANY_WALLET, TEAM_WALLET, FOUNDER_WALLET, TOMO_ALLOCATION_WALLET);

    // mock: time travel to 10 days later - pass start public ICO time
    await increaseTime(864000);

    // kick start public ICO for transfer token
    await TIIM.startPublicIco();
  });

  it('Anomyous call release team or founder token should get error message', async () => {
    try {
      await TIIM.releaseTeamTokens({from: ANONYMOUS});

      assert(false, 'Should not come here');

    } catch (err) {
      assert.include(err.message, 'revert');
    }

    try {
      await TIIM.releaseFounderTokens({from: ANONYMOUS});

      assert(false, 'Should not come here');

    } catch (err) {
      assert.include(err.message, 'revert');
    }
  });
});