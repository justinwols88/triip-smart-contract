const Patron = artifacts.require('Patron');
const PatronSetting = artifacts.require('PatronSetting');
const PatronStaking = artifacts.require('PatronStaking');
const TIIMToken = artifacts.require('TIIMToken');

const {
  MILLION,
  UNIT
} = require('../lib/utils');

const FREQUENCE_IN_SECONDS = 3600;
const _WITHDRAWAL_DELAY_IN_SECONDS = 3600 * 48;
const FREQUENCE_REWARD_AMOUNT = 500;
const REWARD_EXPECTED_BALANCE = 25 * MILLION * UNIT;

let OWNER;
let NON_OWNER;
let PATRON;
let PATRON_SETTING;
let PATRON_STAKING;

let TIIM_TOKEN;

let COMMUNITY_WALLET;
let CROWD_FUNDING_WALLET;
let ECO_WALLET;
let COMPANY_WALLET;
let TEAM_WALLET;
let FOUNDER_WALLET;
let ANONYMOUS;

const frequenceInSeconds = 1800;
const frequenceRewardAmount = 1000;
const withdrawalDelayInSeconds = 604800; // 7 days
const minimumStakeAmount = 100;
const minimumUnstakeAmount = 10;

contract('Reward Patron Testing', accounts => {
  beforeEach('Init', async () => {
    
    OWNER = accounts[0];
    NON_OWNER = accounts[1];

    COMMUNITY_WALLET = accounts[0];
    CROWD_FUNDING_WALLET = accounts[1];
    ECO_WALLET = accounts[2];
    COMPANY_WALLET = accounts[3];
    TEAM_WALLET = accounts[4];
    FOUNDER_WALLET = accounts[5];
    ANONYMOUS = accounts[9];

    TIIM_TOKEN = await TIIMToken.new(COMMUNITY_WALLET, CROWD_FUNDING_WALLET, ECO_WALLET, COMPANY_WALLET, TEAM_WALLET, FOUNDER_WALLET);

    PATRON = await Patron.new();

    PATRON_SETTING = await PatronSetting.new(frequenceInSeconds, frequenceRewardAmount, withdrawalDelayInSeconds, minimumStakeAmount, minimumUnstakeAmount);

    PATRON_STAKING = await PatronStaking.new();

    await PATRON_SETTING.setTiimToken(TIIM_TOKEN.address);

    await PATRON_SETTING.setPatron(PATRON.address);

  });

  it('Set TIIM Token is not a contract should throw exception', async () => {
    
    try {
      await PATRON_SETTING.setTiimToken(NON_OWNER);

      assert(false, 'Should not come here');

    } catch (err) {
      assert.include(err.message, 'TIIM Token must be a contract');
    }
  });

  it('Owner staking patron', async () => {
    const patronOwner = await PATRON.owner();

    const PatronSettingOwner = await PATRON_SETTING.owner();

    assert.equal(patronOwner, OWNER, 'Owner should be ' + OWNER);

    assert.equal(PatronSettingOwner, OWNER, 'Owner should be ' + OWNER);
  });

  it('Non owner should not be able to set Patron for Stacking Patron contact', async () => {
    try {
      await PATRON_SETTING.setPatron(PATRON.address, { from: NON_OWNER });

      assert(false, 'Should not come here');
    } catch (err) {
      assert.include(err.message, 'revert');
    }
  });

  it('Only owner should be able to set Frequence in seconds', async () => {
    const txn = await PATRON_SETTING.setFrequenceInSeconds(FREQUENCE_IN_SECONDS);

    // expect fired event should contains these information
    const frequenceInSeconds = txn.logs[0].args.frequence_in_seconds.valueOf();

    assert.equal(frequenceInSeconds, 3600);

    const eventName = txn.logs[0].event;

    assert.equal(eventName, 'ModifiedFrequenceInSeconds');

    // ensure instance variable updated
    const freInSeconds = await PATRON_SETTING.frequence_in_seconds();

    assert.equal(
      freInSeconds,
      FREQUENCE_IN_SECONDS,
      'Frequence in seconds should be 3,600 seconds'
    );
  });

  it('Non owner should not be able to set Frequence in seconds', async () => {
    try {
      await PATRON_SETTING.setFrequenceInSeconds(FREQUENCE_IN_SECONDS, {
        from: NON_OWNER
      });

      assert(false, 'Should not come here');
    } catch (err) {
      assert.include(err.message, 'revert');
    }
  });

  it('Only owner should be able to set  withdrawal delay in seconds', async () => {
    await PATRON_SETTING.setWithdrawalDelayInSeconds(
      _WITHDRAWAL_DELAY_IN_SECONDS
    );

    const WithdrawalDelayInSeconds = await PATRON_SETTING.withdrawal_delay_in_seconds();

    assert.equal(
      WithdrawalDelayInSeconds,
      _WITHDRAWAL_DELAY_IN_SECONDS,
      ' withdrawal delay in seconds should be 172,800 seconds '
    );
  });

  it('Only owner should be able to set frequence reward amount', async () => {
    await PATRON_SETTING.setFrequenceRewardAmount(FREQUENCE_REWARD_AMOUNT);
    const frequenceRewardAmount = await PATRON_SETTING.frequence_reward_amount();

    assert.equal(
      frequenceRewardAmount,
      FREQUENCE_REWARD_AMOUNT,
      'Frequence reward amount should be 500 TIIM Token'
    );
  });

  it('Non owner should not be able to set frequence reward amount', async () => {
    try {
      await PATRON_SETTING.setFrequenceRewardAmount(FREQUENCE_REWARD_AMOUNT, {
        from: NON_OWNER
      });

      assert(false, 'Should not come here');
    } catch (err) {
      assert.include(err.message, 'revert');
    }
  });

  it('Non owner should not be able to set minimum staking amount', async () => {
    try {
      await PATRON_SETTING.setMinimumStakeAmount(50, { from: NON_OWNER });

      assert(false, 'Should not come here');
    } catch (err) {
      assert.include(err.message, 'revert');
    }
  });

  // it('Test reward send token out', async() => {
  //   await TIIM_TOKEN.transfer(PATRON_SETTING.address, REWARD_EXPECTED_BALANCE, {from: OWNER});
    
  //   const rewardBalance = await TIIM_TOKEN.balanceOf(PATRON_SETTING.address);

  //   assert.equal(rewardBalance, REWARD_EXPECTED_BALANCE);
    
  //   // await PATRON_SETTING.claimReward(ANONYMOUS, 100);

  //   // const b = await TIIM_TOKEN.balanceOf(ANONYMOUS);

  //   await PATRON.setPatronSetting(PATRON_SETTING.address);

  //   await PATRON.testClaim(ANONYMOUS, 100);
    
  //   const b = await TIIM_TOKEN.balanceOf(ANONYMOUS);

  // })
});
