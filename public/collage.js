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
    console.log(tracks)
    console.log(len)

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
            var size = max / 2;
            return [[0, 0, size], [0, size, size], [size, 0, size], [size, size, size]];
        case Formats.THREE_BASIC:
            var size = max / 3;
            return [[0, 0, size], [0, size, size], [size, 0, size], [size, size, size], [0, 2 * size, size], [size, 2 * size, size], [2 * size, 2 * size, size], [2 * size, size, size], [2 * size, 0, size]];
        case Formats.THREE_MAINTL:
            var size = max / 3;
            return [[0, 0, 2 * size], [2 * size, 0, size], [2 * size, size, size], [2 * size, 2 * size, size], [size, 2 * size, size], [0, 2 * size, size]];
        case Formats.FOUR_BASIC:
            var size
            return [];
        case Formats.FOUR_MAIN:
            return [];
        case Formats.FOUR_DUO:
            return [];
        case Formats.FOUR_TRIO:
            return [];
        case Formats.FIVE_BASIC:
            return [];
        case Formats.FIVE_MAIN:
            return [];
        case Formats.FIVE_MAINTL:
            return [];
        case Formats.FIVE_DIAG:
            return [];
        case Formats.FIVE_SOLO:
            return [];
        case Formats.FIVE_DUO:
            return [];
        case Formats.FIVE_TRIO:
            return [];
        case Formats.FIVE_QUAD:
            return [];
    }
}