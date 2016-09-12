import tape from 'tape';

import { checktypes } from '../src/index.js';
import { tryCatch } from './utils.js';

const test = tape;

class SpecialEnding {
    [Symbol.toStringTag]() {
        return 'TADADA THAT WAS CRAZY!';
    }
}

class AwesomeEnding {
    [Symbol.toStringTag]() {
        return '... OH MY GOSH!';
    }
}

@checktypes('Number')
class Jukebox {
    constructor(money) {
        this.money = money;
        this.warning = 'Not enough money.';
    }

    @checktypes('String', 'Number')
    onTheRoadAgain(starting, times) {
        const song = `Well I'm so tired of cryin' but I'm out on the road again, I'm on the road again.`;
        if (this.money >= 2) {
            this.money = this.money - 2;
            return `${starting} ${song.repeat(times)}`;
        }
        return this.warning;
    }

    @checktypes(['String', 'undefined'], [AwesomeEnding, SpecialEnding])
    bornInTheUSA(starting, ending) {
        if (this.money >= 3) {
            this.money = this.money - 3;
            return `${starting} Born in the U.S.A., I was born in the U.S.A. ${ending.toString()}`;
        }
        return this.warning;
    }
}

test('checktypes can ', (assert) => {
    assert.equal(
        tryCatch(() => new Jukebox(7)),
        undefined,
        'control class arguments and do nothing is everything is ok.'
    );

    assert.equal(
        tryCatch(() => new Jukebox('yo')).name,
        'TypeError',
        'control class arguments and throw a TypeError is the types are wrong.'
    );

    assert.equal(
        tryCatch(() => new Jukebox('yo')).message,
        'money expected as one of [Number], not as a string | String.',
        'control class arguments and throw a TypeError is the types are wrong with the appropriate message.'
    );

    const letsGoToTheParty = new Jukebox(7);
    assert.equal(
        tryCatch(() => letsGoToTheParty.onTheRoadAgain('LET\'S SWING BABY', 2)),
        undefined,
        'control method arguments and do nothing is everything is ok.'
    );

    assert.equal(
        letsGoToTheParty.money,
        5,
        'control method arguments and do nothing is everything is ok, keeping context (this).'
    );

    assert.equal(
        tryCatch(() => letsGoToTheParty.onTheRoadAgain(NaN, 'SO BAD...')).name,
        'TypeError',
        'control method arguments and throw a TypeError if types are wrong.'
    );

    assert.equal(
        tryCatch(() => letsGoToTheParty.bornInTheUSA('LET\'S SWING BABY', new SpecialEnding())),
        undefined,
        'control arguments in a range of types and do nothing is everything is ok.'
    );

    assert.equal(
        tryCatch(() => letsGoToTheParty.bornInTheUSA('DAMN GUYS !', () => {})).name,
        'TypeError',
        'control arguments in a range of types and throw a TypeError if each type is wrong.'
    );

    assert.equal(
        tryCatch(() => letsGoToTheParty.bornInTheUSA(42, () => {})).message,
        'starting expected as one of [String, undefined], not as a number | Number.',
        'control arguments in a range of types and throw a TypeError if each type is wrong with the appropriate message.'
    );

    assert.end();
});
