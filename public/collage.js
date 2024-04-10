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
    FIVE_MAINTL: Symbol("five_uneven"),
    FIVE_DIAG: Symbol("five_diag"),
    FIVE_SOLO: Symbol("five_solo"),
    FIVE_DUO: Symbol("five_duo"),
    FIVE_TRIO: Symbol("five_trio"),
    FIVE_QUAD: Symbol("five_quad"),
});

export const getTopCovers = tracks => {
    let freqs = new Map();

    tracks.forEach(track => {
        const images = track.track.album.images;
        if (images.length < 2) {
            return;
        }

        const url = images[1].url;

        if (freqs.has(url)) {
            freqs.set(url, freqs.get(url) + 1);
        } else {
            freqs.set(url, 1);
        }
    });

    freqs = new Map([...freqs.entries()].sort((a, b) => b[1] - a[1]));

    const format = getFormat(Array.from(freqs.values()));
    const locations = getLocations(format);

    return {
        urls: Array.from(freqs.keys()).slice(0, locations.length),
        locations: getLocations(format)
    };
}

const getFormat = tracks => {
    let len = tracks.length;
    console.log(tracks.reduce((a, e) => a + e, 0), tracks.reduce((a, e) => a + e, 0) / len)
    console.log(tracks)

    if (len >= 512) {
        return Formats.FIVE_BASIC;
    } else if (len >= 256) {
        if (tracks[2] >= 2 * tracks[3]) {
            return Formats.FOUR_TRIO;
        } else if (tracks[1] >= 2 * tracks[2]) {
            return Formats.FOUR_DUO;
        } else if (tracks[0] >= 2 * tracks[1]) {
            return Formats.FOUR_MAIN;
        } else {
            return Formats.FOUR_BASIC;
        }
    } else if (len >= 16) {
        if (tracks[0] >= 2 * tracks[1]) {
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

    switch (format) {
        case Formats.ONE:
            return [[0, 0, max]];
        case Formats.TWO:
            var s = max / 2;
            return [
                [0, 0, s], [0, s, s],
                [s, 0, s], [s, s, s]
            ];
        case Formats.THREE_BASIC:
            var s = max / 3;
            return [
                [0, 0, s], [0, s, s], [s, 0, s],
                [s, s, s], [0, 2 * s, s], [s, 2 * s, s],
                [2 * s, 2 * s, s], [2 * s, s, s], [2 * s, 0, s]
            ];
        case Formats.THREE_MAINTL:
            var s = max / 3;
            return [
                [0, 0, 2 * s], [2 * s, 0, s],
                [2 * s, s, s],
                [s, 2 * s, s], [0, 2 * s, s], [2 * s, 2 * s, s]
            ];
        case Formats.FOUR_BASIC:
            var s = max / 4;
            return [
                [0, 0, s], [0, s, s], [0, 2 * s, s], [0, 3 * s, s],
                [s, 0, s], [s, s, s], [s, 2 * s, s], [s, 3 * s, s],
                [2 * s, 0, s], [2 * s, s, s], [2 * s, 2 * s, s], [2 * s, 3 * s, s],
                [3 * s, 0, s], [3 * s, s, s], [3 * s, 2 * s, s], [3 * s, 3 * s, s]
            ];
        case Formats.FOUR_MAIN:
            var s = max / 4;
            return [
                [0, 0, s], [0, s, s], [0, 2 * s, s], [0, 3 * s, s],
                [s, 0, s], [s, s, 2 * s], [s, 3 * s, s],
                [2 * s, 0, s], [2 * s, 3 * s, s],
                [3 * s, 0, s], [3 * s, s, s], [3 * s, 2 * s, s], [3 * s, 3 * s, s]
            ];
        case Formats.FOUR_DUO:
            var s = max / 4;
            return [
                [0, 0, 2 * s], [0, 2 * s, s], [0, 3 * s, s],
                [s, 2 * s, s], [s, 3 * s, s],
                [2 * s, 0, s], [2 * s, s, s], [2 * s, 2 * s, 2 * s],
                [3 * s, 0, s], [3 * s, s, s]
            ];
        case Formats.FOUR_TRIO:
            var s = max / 4;
            return [
                [0, 0, 2 * s], [0, 2 * s, 2 * s]
                ,
                [2 * s, 0, s], [2 * s, s, s], [2 * s, 2 * s, 2 * s],
                [3 * s, 0, s], [3 * s, s, s]
            ];
        case Formats.FIVE_BASIC:
            var s = max / 5;
            return [
                [0, 0, s], [0, s, s], [0, 2 * s, s], [0, 3 * s, s], [0, 4 * s, s],
                [s, 0, s], [s, s, s], [s, 2 * s, s], [s, 3 * s, s], [s, 4 * s, s],
                [2 * s, 0, s], [2 * s, s, s], [2 * s, 2 * s, s], [2 * s, 3 * s, s], [2 * s, 4 * s, s],
                [3 * s, 0, s], [3 * s, s, s], [3 * s, 2 * s, s], [3 * s, 3 * s, s], [3 * s, 4 * s, s],
                [4 * s, 0, s], [4 * s, s, s], [4 * s, 2 * s, s], [4 * s, 3 * s, s], [4 * s, 4 * s, s]
            ];
        case Formats.FIVE_MAIN:
            var s = max / 5;
            return [
                [0, 0, s], [0, s, s], [0, 2 * s, s], [0, 3 * s, s], [0, 4 * s, s],
                [s, 0, s], [s, s, s], [s, 2 * s, s], [s, 3 * s, s], [s, 4 * s, s],
                [2 * s, 0, s], [2 * s, s, s], [2 * s, 2 * s, s], [2 * s, 3 * s, s], [2 * s, 4 * s, s],
                [3 * s, 0, s], [3 * s, s, s], [3 * s, 2 * s, s], [3 * s, 3 * s, s], [3 * s, 4 * s, s],
                [4 * s, 0, s], [4 * s, s, s], [4 * s, 2 * s, s], [4 * s, 3 * s, s], [4 * s, 4 * s, s]
            ];
        case Formats.FIVE_MAINTL:
            var s = max / 5;
            return [
                [0, 0, 2 * s], [0, 2 * s, s], [0, 3 * s, s], [0, 4 * s, s],
                [s, 2 * s, s], [s, 3 * s, s], [s, 4 * s, s],
                [2 * s, 0, s], [2 * s, s, s], [2 * s, 2 * s, s], [2 * s, 3 * s, s], [2 * s, 4 * s, s],
                [3 * s, 0, s], [3 * s, s, s], [3 * s, 2 * s, s], [3 * s, 3 * s, s], [3 * s, 4 * s, s],
                [4 * s, 0, s], [4 * s, s, s], [4 * s, 2 * s, s], [4 * s, 3 * s, s], [4 * s, 4 * s, s]
            ];
        case Formats.FIVE_DIAG:
            var s = max / 5;
            return [
                [0, 0, 3 * s], [0, 3 * s, s], [0, 4 * s, s],
                [s, 3 * s, s], [s, 4 * s, s],
                [2 * s, 3 * s, s], [2 * s, 4 * s, s],
                [3 * s, 0, s], [3 * s, s, s], [3 * s, 2 * s, s], [3 * s, 3 * s, 2 * s],
                [4 * s, 0, s], [4 * s, s, s], [4 * s, 2 * s, s],
            ];
        case Formats.FIVE_SOLO:
            var s = max / 5;
            return [
                [0, 0, s], [0, s, s], [0, 2 * s, s], [0, 3 * s, s], [0, 4 * s, s],
                [s, 0, s], [s, s, 3 * s], [s, 4 * s, s],
                [2 * s, 0, s], [2 * s, 4 * s, s],
                [3 * s, 0, s], [3 * s, 4 * s, s],
                [4 * s, 0, s], [4 * s, s, s], [4 * s, 2 * s, s], [4 * s, 3 * s, s], [4 * s, 4 * s, s]
            ];
        case Formats.FIVE_DUO:
            var s = max / 5;
            return [
                [0, 0, 2 * s], [0, 2 * s, s], [0, 3 * s, s], [0, 4 * s, s],
                [s, 2 * s, s], [s, 3 * s, s], [s, 4 * s, s],
                [2 * s, 0, s], [2 * s, s, s], [2 * s, 2 * s, s], [2 * s, 3 * s, s], [2 * s, 4 * s, s],
                [3 * s, 0, s], [3 * s, s, s], [3 * s, 2 * s, s], [3 * s, 3 * s, 2 * s],
                [4 * s, 0, s], [4 * s, s, s], [4 * s, 2 * s, s]
            ];
        case Formats.FIVE_TRIO:
            var s = max / 5;
            return [
                [0, 0, 2 * s], [0, 2 * s, s], [0, 3 * s, 2 * s],
                [s, 2 * s, s],
                [2 * s, 0, s], [2 * s, s, s], [2 * s, 2 * s, s], [2 * s, 3 * s, s], [2 * s, 4 * s, s],
                [3 * s, 0, 2 * s], [3 * s, 2 * s, s], [3 * s, 3 * s, s], [3 * s, 4 * s, s],
                [4 * s, 2 * s, s], [4 * s, 3 * s, s], [4 * s, 4 * s, s]
            ];
        case Formats.FIVE_QUAD:
            var s = max / 5;
            return [
                [0, 0, 2 * s], [0, 2 * s, s], [0, 3 * s, 2 * s],
                [s, 2 * s, s],
                [2 * s, 0, s], [2 * s, s, s], [2 * s, 2 * s, s], [2 * s, 3 * s, s], [2 * s, 4 * s, s],
                [3 * s, 0, 2 * s], [3 * s, 2 * s, s], [3 * s, 3 * s, 2 * s],
                [4 * s, 2 * s, s]
            ];
    }
}