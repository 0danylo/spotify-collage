const Formats = Object.freeze({
    ONE: Symbol("one"),
    TWO: Symbol("two"),
    THREE_BASIC: Symbol("three_basic"),
    THREE_MAINTL: Symbol("three_maintl"),
    FOUR_BASIC: Symbol("four_basic"),
    FOUR_MAIN: Symbol("four_main"),
    FOUR_DUO: Symbol("four_duo"),
    FOUR_TRIO: Symbol("four_trio"),
    FIVE_BASIC: Symbol("five_basic"),
    FIVE_MAIN: Symbol("five_main"),
    FIVE_MAINTL: Symbol("five_maintl"),
    FIVE_DIAG: Symbol("five_diag"),
    FIVE_SOLO: Symbol("five_solo"),
    FIVE_DUO: Symbol("five_duo"),
    FIVE_TRIO: Symbol("five_trio"),
    FIVE_QUAD: Symbol("five_quad"),
});

const SQRT_2 = 1.41421
const SQRT_3 = 1.73205
const SQRT_4 = 2

export const getTopCovers = tracks => {
    let freqs = new Map();
    let lens = new Map();

    tracks.forEach(track => {
        const images = track.track.album.images;
        if (images.length < 2) {
            return;
        }

        const url = images[1].url;
        const length = track.track.duration_ms;

        if (freqs.has(url)) {
            freqs.set(url, freqs.get(url) + 1);
        } else {
            freqs.set(url, 1);
        }

        if (lens.has(url)) {
            lens.set(url, lens.get(url) + length);
        } else {
            lens.set(url, length);
        }
    });

    freqs = new Map([...freqs.entries()].sort((a, b) => {
        const f = b[1] - a[1];
        return f == 0 ? lens.get(b[0]) - lens.get(a[0]) : f;
    }));

    const format = getFormat(Array.from(freqs.values()));
    const locations = getLocations(format);

    return {
        urls: Array.from(freqs.keys()).slice(0, locations.length),
        locations: locations,
    };
}

const getFormat = tracks => {
    let len = tracks.length;

    if (len >= 25) {
        if (tracks[0] > SQRT_4 * tracks[1]) {
            return Formats.FIVE_MAINTL;
        } else if (tracks[0] > SQRT_3 * tracks[2] && tracks[1] >= SQRT_2 * tracks[2]) {
            return Formats.FIVE_DIAG;
        } else if (tracks[0] > SQRT_3 * tracks[2]) {
            return Formats.FIVE_MAIN;
        } else if (tracks[3] > SQRT_2 * tracks[4]) {
            return Formats.FIVE_QUAD;
        } else if (tracks[2] > SQRT_2 * tracks[3]) {
            return Formats.FIVE_TRIO;
        } else if (tracks[1] > SQRT_2 * tracks[2]) {
            return Formats.FIVE_DUO;
        } else if (tracks[0] > SQRT_2 * tracks[1]) {
            return Formats.FIVE_SOLO;
        } else {
            return Formats.FIVE_BASIC;
        }
    } else if (len >= 16) {
        if (tracks[2] > SQRT_2 * tracks[3]) {
            return Formats.FOUR_TRIO;
        } else if (tracks[1] > SQRT_2 * tracks[2]) {
            return Formats.FOUR_DUO;
        } else if (tracks[0] > SQRT_2 * tracks[1]) {
            return Formats.FOUR_MAIN;
        } else {
            return Formats.FOUR_BASIC;
        }
    } else if (len >= 9) {
        if (tracks[0] > 2 * tracks[1]) {
            return Formats.THREE_MAINTL;
        } else {
            return Formats.THREE_BASIC;
        }
    } else if (len >= 4) {
        return Formats.TWO;
    } else {
        return Formats.ONE;
    }
}

const getLocations = format => {
    const max = 300;
    let ret, s = max;

    if (format === Formats.ONE) {
        ret = [[0, 0, 1]];
    } else if (format === Formats.TWO) {
        s = max / 2;
        ret = [
            [0, 0, 1], [1, 0, 1],
            [0, 1, 1], [1, 1, 1],
        ];
    } else if (format === Formats.THREE_BASIC) {
        s = max / 3;
        ret = [
            [0, 0, 1], [1, 0, 1], [2, 0, 1],
            [0, 1, 1], [1, 1, 1], [2, 1, 1],
            [0, 2, 1], [1, 2, 1], [2, 2, 1],
        ];
    } else if (format === Formats.THREE_MAINTL) {
        s = max / 3;
        ret = [
            [0, 0, 2],
            [2, 0, 1],
            [2, 1, 1],
            [0, 2, 1], [1, 2, 1], [2, 2, 1],
        ];
    } else if (format === Formats.FOUR_BASIC) {
        s = max / 4;
        ret = [
            [0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1],
            [0, 1, 1], [1, 1, 1], [2, 1, 1], [3, 1, 1],
            [0, 2, 1], [1, 2, 1], [2, 2, 1], [3, 2, 1],
            [0, 3, 1], [1, 3, 1], [2, 3, 1], [3, 3, 1],
        ];
    } else if (format === Formats.FOUR_MAIN) {
        s = max / 4;
        ret = [
            [1, 1, 2],
            [0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1],
            [0, 1, 1], [3, 1, 1],
            [0, 2, 1], [3, 2, 1],
            [0, 3, 1], [1, 3, 1], [2, 3, 1], [3, 3, 1],
        ];
    } else if (format === Formats.FOUR_DUO) {
        s = max / 4;
        ret = [
            [0, 0, 2], [2, 2, 2],
            [2, 0, 1], [3, 0, 1],
            [2, 1, 1], [3, 1, 1],
            [0, 2, 1], [1, 2, 1],
            [0, 3, 1], [1, 3, 1],
        ];
    } else if (format === Formats.FOUR_TRIO) {
        s = max / 4;
        ret = [
            [0, 0, 2], [2, 0, 2],
            [0, 2, 2], [2, 2, 1], [3, 2, 1],
            [2, 3, 1], [3, 3, 1],
        ];
    } else if (format === Formats.FIVE_BASIC) {
        s = max / 5;
        ret = [
            [0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1], [4, 0, 1],
            [0, 1, 1], [1, 1, 1], [2, 1, 1], [3, 1, 1], [4, 1, 1],
            [0, 2, 1], [1, 2, 1], [2, 2, 1], [3, 2, 1], [4, 2, 1],
            [0, 3, 1], [1, 3, 1], [2, 3, 1], [3, 3, 1], [4, 3, 1],
            [0, 4, 1], [1, 4, 1], [2, 4, 1], [3, 4, 1], [4, 4, 1],
        ];
    } else if (format === Formats.FIVE_MAIN) {
        s = max / 5;
        ret = [
            [1, 1, 3],
            [0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1], [4, 0, 1],
            [0, 1, 1], [4, 1, 1],
            [0, 2, 1], [4, 2, 1],
            [0, 3, 1], [4, 3, 1],
            [0, 4, 1], [1, 4, 1], [2, 4, 1], [3, 4, 1], [4, 4, 1],
        ];
    } else if (format === Formats.FIVE_MAINTL) {
        s = max / 5;
        ret = [
            [0, 0, 4],
            [4, 0, 1],
            [4, 1, 1],
            [4, 2, 1],
            [4, 3, 1],
            [0, 4, 1], [1, 4, 1], [2, 4, 1], [3, 4, 1], [4, 4, 1],
        ];
    } else if (format === Formats.FIVE_DIAG) {
        s = max / 5;
        ret = [
            [0, 0, 3], [3, 3, 2],
            [3, 0, 1], [4, 0, 1],
            [3, 1, 1], [4, 1, 1],
            [3, 2, 1], [4, 2, 1],
            [0, 3, 1], [1, 3, 1], [2, 3, 1], 
            [0, 4, 1], [1, 4, 1], [2, 4, 1],
        ];
    } else if (format === Formats.FIVE_SOLO) {
        s = max / 5;
        ret = [
            [1, 1, 2],
            [0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1], [4, 0, 1],
            [0, 1, 1], [3, 1, 1], [4, 1, 1],
            [0, 2, 1], [3, 2, 1], [4, 2, 1],
            [0, 3, 1], [1, 3, 1], [2, 3, 1], [3, 3, 1], [4, 3, 1],
            [0, 4, 1], [1, 4, 1], [2, 4, 1], [3, 4, 1], [4, 4, 1],
        ];
    } else if (format === Formats.FIVE_DUO) {
        s = max / 5;
        ret = [
            [0, 0, 2], [3, 3, 2],
            [2, 0, 1], [3, 0, 1],
            [2, 1, 1], [3, 1, 1],
            [0, 2, 1], [1, 2, 1],
            [0, 3, 1], [1, 3, 1],
        ];
    } else if (format === Formats.FIVE_TRIO) {
        s = max / 5;
        ret = [
            [0, 0, 2], [3, 0, 2], [0, 3, 2],
            [2, 0, 1],
            [2, 1, 1],
            [0, 2, 1], [1, 2, 1], [2, 2, 1], [3, 2, 1], [4, 2, 1],
            [2, 3, 1], [3, 3, 1], [4, 3, 1],
            [2, 4, 1], [3, 4, 1], [4, 4, 1],
        ];
    } else if (format === Formats.FIVE_QUAD) {
        s = max / 5;
        ret = [
            [0, 0, 2], [3, 0, 2], [0, 3, 2], [3, 3, 2],
            [2, 0, 1],
            [2, 1, 1],
            [0, 2, 1], [1, 2, 1], [2, 2, 1], [3, 2, 1], [4, 2, 1],
            [2, 3, 1],
            [2, 4, 1],
        ];
    }

    return ret.map((it) => [it[0] * s, it[1] * s, it[2] * s]);
}